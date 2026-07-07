const db = require('../models');
const User = db.User;
const Role = db.Role;
const Profile = db.Profile;
const UserSession = db.UserSession;
const { generateToken, generateRefreshToken, hashPassword, comparePassword } = require('../utils/auth.utils');

const register = async (req, res) => {
  const { email, password, phone_number, phone, role_name, role, full_name, name } = req.body;

  const final_phone = phone_number || phone;
  const final_role = role_name || role;
  const final_full_name = full_name || name;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const roleFound = await Role.findOne({ where: { role_name: final_role } });
    if (!roleFound) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      phone_number: final_phone,
      role_id: roleFound.id
    });

    await Profile.create({
      user_id: user.id,
      full_name: final_full_name
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: roleFound.role_name,
      token: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        role: roleFound.role_name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Role }]
    });

    if (user && (await comparePassword(password, user.password))) {
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      user.refresh_token = refreshToken;
      user.last_login = new Date();
      await user.save();

      // Record session
      await UserSession.create({
        user_id: user.id,
        device_name: req.headers['user-agent'] || 'Unknown Device',
        ip_address: req.ip || req.connection.remoteAddress,
        platform: req.headers['sec-ch-ua-platform'] || 'Unknown Platform'
      });

      res.json({
        id: user.id,
        email: user.email,
        role: user.Role.role_name,
        token,
        refreshToken
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Role },
        { model: Profile }
      ]
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { full_name, phone_number, id_card_number } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (phone_number) {
      user.phone_number = phone_number;
      await user.save();
    }

    const profile = await Profile.findOne({ where: { user_id: req.user.id } });
    if (profile) {
      profile.full_name = full_name || profile.full_name;
      profile.id_card_number = id_card_number || profile.id_card_number;
      await profile.save();
    } else {
      await Profile.create({ user_id: req.user.id, full_name, id_card_number });
    }

    const updatedUser = await User.findByPk(req.user.id, {
      include: [{ model: Role }, { model: Profile }]
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await UserSession.findAll({
      where: { user_id: req.user.id },
      order: [['last_active', 'DESC']]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    await UserSession.destroy({
      where: { id, user_id: req.user.id }
    });
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, getSessions, deleteSession };
