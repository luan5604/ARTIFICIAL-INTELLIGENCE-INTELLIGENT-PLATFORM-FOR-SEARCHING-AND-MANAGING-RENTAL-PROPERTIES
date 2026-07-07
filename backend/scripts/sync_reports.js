require('dotenv').config();
const db = require('../models');

async function sync() {
  try {
    console.log('--- START SYNCING ---');
    await db.sequelize.sync({ alter: true });
    console.log('--- SYNCING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('--- SYNCING FAILED ---');
    console.error(error);
    process.exit(1);
  }
}

sync();
