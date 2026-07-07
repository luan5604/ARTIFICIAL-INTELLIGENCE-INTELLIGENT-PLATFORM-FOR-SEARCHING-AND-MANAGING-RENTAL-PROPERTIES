const db = require('./models');

async function checkSchema() {
  try {
    const roomDesc = await db.sequelize.getQueryInterface().describeTable('rooms');
    console.log('Rooms columns:', Object.keys(roomDesc));
    
    const postDesc = await db.sequelize.getQueryInterface().describeTable('posts');
    console.log('Posts columns:', Object.keys(postDesc));
    
    const postImageDesc = await db.sequelize.getQueryInterface().describeTable('post_images');
    console.log('PostImages columns:', Object.keys(postImageDesc));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
