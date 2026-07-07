const { Op } = require('sequelize');
const db = require('../models');
const Post = db.Post;
const Room = db.Room;
const PostImage = db.PostImage;
const Property = db.Property;
const Category = db.Category;

const createPost = async (req, res) => {
  try {
    const { room_id, title, content, images } = req.body;

    const room = await Room.findByPk(room_id, {
      include: [{ model: Property }]
    });

    if (!room || room.Property.landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to post for this room' });
    }

    const post = await Post.create({
      room_id,
      title,
      content,
      status: 'PENDING'
    });

    if (images && images.length > 0) {
      const postImages = images.map((url, index) => ({
        post_id: post.id,
        image_url: url,
        is_thumbnail: index === 0
      }));
      await PostImage.bulkCreate(postImages);
    }

    // Fetch the post with images to return
    const createdPost = await Post.findByPk(post.id, {
      include: [{ model: PostImage }]
    });

    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { q, city, district, minPrice, maxPrice, type, categoryId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const where = { status: 'ACTIVE' };
    
    // Text search
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } },
        { '$Room.Property.address_street$': { [Op.like]: `%${q}%` } },
        { '$Room.Property.ward$': { [Op.like]: `%${q}%` } },
        { '$Room.Property.district$': { [Op.like]: `%${q}%` } },
        { '$Room.Property.city$': { [Op.like]: `%${q}%` } }
      ];
    }

    const roomWhere = {};
    if (minPrice || maxPrice) {
      roomWhere.base_price = {};
      if (minPrice) roomWhere.base_price[Op.gte] = minPrice;
      if (maxPrice) roomWhere.base_price[Op.lte] = maxPrice;
    }
    
    if (type) {
      roomWhere.type = type;
    }

    if (categoryId) {
      roomWhere.category_id = categoryId;
    }

    const propertyWhere = {};
    if (city) propertyWhere.city = city;
    if (district) propertyWhere.district = district;

    let order = [['id', 'DESC']];
    if (req.query.sort === 'random') {
      order = db.sequelize.random();
    } else if (req.query.sort === 'view_count') {
      order = [['view_count', 'DESC']];
    }

    const posts = await Post.findAndCountAll({
      where,
      include: [
        { 
          model: Room, 
          where: Object.keys(roomWhere).length ? roomWhere : undefined,
          include: [
            { 
              model: Property,
              where: Object.keys(propertyWhere).length ? propertyWhere : undefined
            },
            { model: db.Amenity },
            { model: db.Category }
          ] 
        },
        { model: PostImage }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      distinct: true,
      subQuery: false
    });

    res.json({
      data: posts.rows,
      pagination: {
        totalItems: posts.count,
        totalPages: Math.ceil(posts.count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { 
          model: Room, 
          include: [
            { 
              model: Property, 
              include: [{ model: db.User, as: 'landlord', include: [db.Profile] }] 
            }, 
            db.Amenity
          ] 
        },
        { model: PostImage },
        { model: db.Review, include: [db.User] }
      ]
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.view_count += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, is_active } = req.body;
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Room, include: [Property] }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.Role.role_name !== 'ADMIN' && post.Room.Property.landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    await post.update({
      title: title || post.title,
      content: content || post.content,
      status: is_active === undefined ? post.status : (is_active ? 'ACTIVE' : 'HIDDEN')
    });

    // Handle images update
    if (req.body.images && Array.isArray(req.body.images)) {
      // Simple strategy: delete old ones and recreate
      // (Or a more complex diff if preferred, but this is reliable)
      await PostImage.destroy({ where: { post_id: post.id } });
      
      const postImages = req.body.images.map((url, index) => ({
        post_id: post.id,
        image_url: url,
        is_thumbnail: index === 0
      }));
      await PostImage.bulkCreate(postImages);
    }

    const updatedPost = await Post.findByPk(post.id, {
      include: [
        { model: Room, include: [Property] },
        { model: PostImage }
      ]
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Room, include: [Property] }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.Role.role_name !== 'ADMIN' && post.Room.Property.landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status 
    } = req.query;
    const offset = (page - 1) * limit;

    const isAdmin = req.user.Role.role_name === 'ADMIN';
    const postWhere = {};

    if (status) {
      postWhere.status = status;
    }

    if (search) {
      postWhere[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const roomInclude = {
      model: Room,
      required: true,
      include: [{
        model: Property,
        required: true,
        attributes: ['id', 'name']
      }]
    };

    if (!isAdmin) {
      roomInclude.include[0].where = { landlord_id: req.user.id };
    }

    const { count, rows } = await Post.findAndCountAll({
      where: postWhere,
      include: [
        roomInclude,
        { model: PostImage }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
      distinct: true
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

const getSimilarPosts = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Room, include: [Property] }]
    });

    if (!post || !post.Room || !post.Room.Property) {
      return res.json([]);
    }

    const district = post.Room.Property.district;

    const similarPosts = await Post.findAll({
      where: {
        id: { [db.Sequelize.Op.ne]: req.params.id }
      },
      include: [
        { 
          model: Room, 
          required: true,
          include: [
            { 
              model: Property, 
              required: true,
              where: { district } 
            }
          ] 
        },
        { model: PostImage }
      ],
      limit: 6,
      order: [['created_at', 'DESC']]
    });

    res.json(similarPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approvePost = async (req, res) => {
  try {
    if (req.user.Role.role_name !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admin can approve posts' });
    }

    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.update({ status: 'ACTIVE' });
    res.json({ message: 'Post approved successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getSimilarPosts,
  getCategories,
  approvePost
};
