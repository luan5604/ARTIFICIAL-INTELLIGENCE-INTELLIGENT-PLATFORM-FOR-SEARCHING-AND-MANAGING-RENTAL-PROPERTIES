const db = require('./models');

async function fixSchema() {
  try {
    await db.sequelize.getQueryInterface().addColumn('rooms', 'images', {
      type: db.Sequelize.TEXT,
      allowNull: true
    });
    console.log('Added images column to rooms table');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixSchema();
