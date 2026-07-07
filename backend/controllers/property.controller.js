const { Op } = require('sequelize');
const db = require('../models');
const Property = db.Property;
const Room = db.Room;
const User = db.User;

const createProperty = async (req, res) => {
  try {
    const { name, address_street, ward, district, city, latitude, longitude, description, general_rules } = req.body;
    
    const property = await Property.create({
      landlord_id: req.user.id,
      name,
      address_street,
      ward,
      district,
      city,
      latitude,
      longitude,
      description,
      general_rules,
      status: 'PENDING'
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', city, district, ward } = req.query;
    const offset = (page - 1) * limit;

    const where = req.user.Role.role_name === 'ADMIN' ? {} : { landlord_id: req.user.id };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address_street: { [Op.like]: `%${search}%` } }
      ];
    }

    if (city) {
      where.city = city;
    }

    if (district) {
      where.district = district;
    }

    if (ward) {
      where.ward = ward;
    }

    const { count, rows } = await Property.findAndCountAll({
      where,
      include: [{ model: Room }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
      order: [['id', 'DESC']]
    });

    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (req.user.Role.role_name !== 'ADMIN' && property.landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    await property.update(req.body);
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (req.user.Role.role_name !== 'ADMIN' && property.landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    await property.destroy();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { property_id, room_name, area, max_occupants, base_price, deposit_amount, has_mezzanine } = req.body;
    
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (req.user.Role.role_name !== 'ADMIN' && property.landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add room to this property' });
    }

    const room = await Room.create({
      property_id,
      room_name,
      area,
      max_occupants,
      base_price,
      deposit_amount,
      has_mezzanine,
      images: req.body.images || [],
      status: 'PENDING'
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id, { include: [Property] });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (req.user.Role.role_name !== 'ADMIN' && (!room.Property || room.Property.landlord_id !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this room' });
    }
    await room.update({
      ...req.body,
      images: req.body.images || room.images
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id, { include: [Property] });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (req.user.Role.role_name !== 'ADMIN' && (!room.Property || room.Property.landlord_id !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }
    await room.destroy();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      property_id, 
      status, 
      min_price, 
      max_price 
    } = req.query;
    const offset = (page - 1) * limit;

    let propertyWhere = req.user.Role.role_name === 'ADMIN' ? {} : { landlord_id: req.user.id };
    
    // Find accessible property IDs
    const properties = await Property.findAll({ 
      where: propertyWhere, 
      attributes: ['id'] 
    });
    const propertyIds = properties.map(p => p.id);

    const where = {
      property_id: { [Op.in]: propertyIds }
    };

    if (property_id) {
      where.property_id = property_id;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.room_name = { [Op.like]: `%${search}%` };
    }

    if (min_price || max_price) {
      where.base_price = {};
      if (min_price) where.base_price[Op.gte] = min_price;
      if (max_price) where.base_price[Op.lte] = max_price;
    }

    const { count, rows } = await Room.findAndCountAll({
      where,
      include: [{ model: Property, attributes: ['id', 'name'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']]
    });

    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomsByProperty = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { property_id: req.params.propertyId }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveProperty = async (req, res) => {
  try {
    if (req.user.Role.role_name !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admin can approve properties' });
    }
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    await property.update({ status: 'ACTIVE' });
    res.json({ message: 'Property approved successfully', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveRoom = async (req, res) => {
  try {
    if (req.user.Role.role_name !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admin can approve rooms' });
    }
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    await room.update({ status: 'AVAILABLE' });
    res.json({ message: 'Room approved successfully', room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getMyRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByProperty,
  approveProperty,
  approveRoom
};
