const db = require('./models');
const { Op } = require('sequelize');

async function simulateGetMyPosts() {
  try {
    // Mock user for testing (assuming landlord with ID 1)
    const mockUser = { id: 1, Role: { role_name: 'ADMIN' } };
    
    const page = 1;
    const limit = 10;
    const search = '';
    const status = '';
    const offset = (page - 1) * limit;

    const isAdmin = mockUser.Role.role_name === 'ADMIN';
    const postWhere = {};

    const roomInclude = {
      model: db.Room,
      required: true,
      include: [{
        model: db.Property,
        required: true,
        attributes: ['id', 'name']
      }]
    };

    if (!isAdmin) {
      roomInclude.include[0].where = { landlord_id: mockUser.id };
    }

    const result = await db.Post.findAndCountAll({
      where: postWhere,
      include: [
        roomInclude,
        { model: db.PostImage }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
      distinct: true
    });

    console.log('Success! Count:', result.count);
    process.exit(0);
  } catch (err) {
    console.error('FAILED with error:');
    console.error(err);
    process.exit(1);
  }
}

simulateGetMyPosts();
