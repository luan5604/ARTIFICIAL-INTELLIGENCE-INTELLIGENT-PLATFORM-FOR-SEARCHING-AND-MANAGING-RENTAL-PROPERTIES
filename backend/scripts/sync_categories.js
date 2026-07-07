const db = require('../models');

async function syncCategories() {
  try {
    console.log('Starting category synchronization...');
    
    // Sync Category model
    await db.Category.sync({ alter: true });
    // Sync Room model to add category_id
    await db.Room.sync({ alter: true });

    const initialCategories = [
      { name: 'Phòng trọ', icon_name: 'Home', color: '#3b82f6' },
      { name: 'Căn hộ', icon_name: 'Building2', color: '#8b5cf6' },
      { name: 'Ký túc xá', icon_name: 'Users', color: '#ec4899' },
      { name: 'Nhà nguyên căn', icon_name: 'LayoutGrid', color: '#f59e0b' }
    ];

    for (const catData of initialCategories) {
      const [category] = await db.Category.findOrCreate({
        where: { name: catData.name },
        defaults: catData
      });
      
      console.log(`Ensured category: ${catData.name}`);

      // Update rooms that have this type string but no category_id
      await db.Room.update(
        { category_id: category.id },
        { 
          where: { 
            type: catData.name,
            category_id: null
          } 
        }
      );
    }

    console.log('Category synchronization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing categories:', error);
    process.exit(1);
  }
}

syncCategories();
