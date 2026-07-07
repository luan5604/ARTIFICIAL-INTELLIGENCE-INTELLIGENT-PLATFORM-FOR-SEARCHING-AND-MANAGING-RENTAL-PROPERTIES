require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('--- START SEEDING ---');

    // 0. TRUNCATE ALL TABLES (in reverse dependency order)
    console.log('Truncating tables...');
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.Review.destroy({ where: {}, truncate: { cascade: true } });
    await db.Favorite.destroy({ where: {}, truncate: { cascade: true } });
    await db.Message.destroy({ where: {}, truncate: { cascade: true } });
    await db.Conversation.destroy({ where: {}, truncate: { cascade: true } });
    await db.Invoice.destroy({ where: {}, truncate: { cascade: true } });
    await db.Contract.destroy({ where: {}, truncate: { cascade: true } });
    await db.PostImage.destroy({ where: {}, truncate: { cascade: true } });
    await db.Post.destroy({ where: {}, truncate: { cascade: true } });
    await db.RoomAmenity.destroy({ where: {}, truncate: { cascade: true } });
    await db.Room.destroy({ where: {}, truncate: { cascade: true } });
    await db.Property.destroy({ where: {}, truncate: { cascade: true } });
    await db.Amenity.destroy({ where: {}, truncate: { cascade: true } });
    await db.Profile.destroy({ where: {}, truncate: { cascade: true } });
    await db.User.destroy({ where: {}, truncate: { cascade: true } });
    await db.Role.destroy({ where: {}, truncate: { cascade: true } });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tables truncated.');

    // 1. ROLES
    const roles = await Promise.all([
      db.Role.create({ id: 1, role_name: 'ADMIN' }),
      db.Role.create({ id: 2, role_name: 'LANDLORD' }),
      db.Role.create({ id: 3, role_name: 'TENANT' }),
    ]);
    console.log('Roles seeded.');

    // 2. USERS & PROFILES
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Password123!', salt);

    const usersData = [
      { email: 'admin@example.com', phone: '0901234567', roleId: 1, name: 'Nguyễn Văn Admin' },
      { email: 'chu_tro_thanh@example.com', phone: '0912233445', roleId: 2, name: 'Trần Văn Thành' },
      { email: 'chu_tro_lan@example.com', phone: '0913344556', roleId: 2, name: 'Lê Thị Lan' },
      { email: 'chu_tro_hung@example.com', phone: '0914455667', roleId: 2, name: 'Phạm Thế Hùng' },
      { email: 'chu_tro_mai@example.com', phone: '0915566778', roleId: 2, name: 'Hoàng Tuyết Mai' },
      { email: 'khach_thue_dung@example.com', phone: '0981122334', roleId: 3, name: 'Đặng Tiến Dũng' },
      { email: 'khach_thue_hoa@example.com', phone: '0982233445', roleId: 3, name: 'Trịnh Quỳnh Hoa' },
      { email: 'khach_thue_nam@example.com', phone: '0983344556', roleId: 3, name: 'Vũ Hoài Nam' },
      { email: 'khach_thue_linh@example.com', phone: '0984455667', roleId: 3, name: 'Ngô Mỹ Linh' },
      { email: 'khach_thue_quan@example.com', phone: '0985566778', roleId: 3, name: 'Bùi Minh Quân' },
    ];

    const landlords = [];
    const tenants = [];

    for (const u of usersData) {
      const user = await db.User.create({
        email: u.email,
        password: password,
        phone_number: u.phone,
        role_id: u.roleId,
        is_verified: true
      });

      await db.Profile.create({
        user_id: user.id,
        full_name: u.name,
        address_permanent: 'Hà Nội, Việt Nam'
      });

      if (u.roleId === 2) landlords.push(user);
      if (u.roleId === 3) tenants.push(user);
    }
    console.log('Users and Profiles seeded.');

    // 3. AMENITIES
    const amenitiesData = [
      { name: 'Wifi', icon: 'wifi' },
      { name: 'Điều hòa', icon: 'air-conditioner' },
      { name: 'Máy giặt', icon: 'washing-machine' },
      { name: 'Tủ lạnh', icon: 'refrigerator' },
      { name: 'Bãi đỗ xe', icon: 'p-square' },
      { name: 'Bảo vệ 24/7', icon: 'shield-check' },
    ];

    const amenities = [];
    for (const a of amenitiesData) {
      const amenity = await db.Amenity.create({
        name: a.name,
        icon_tag: a.icon
      });
      amenities.push(amenity);
    }
    console.log('Amenities seeded.');

    // 4. PROPERTIES & ROOMS
    const propsData = [
      { name: 'Chung cư mini Xuân Thủy', street: '123 Xuân Thủy', ward: 'Dịch Vọng Hậu', lIdx: 0 },
      { name: 'Nhà trọ cao cấp Trần Thái Tông', street: '45 Trần Thái Tông', ward: 'Dịch Vọng', lIdx: 1 },
      { name: 'Khu trọ sinh viên Hồ Tùng Mậu', street: '99 Hồ Tùng Mậu', ward: 'Mai Dịch', lIdx: 2 },
      { name: 'Căn hộ dịch vụ Duy Tân', street: '88 Duy Tân', ward: 'Dịch Vọng Hậu', lIdx: 3 },
      { name: 'Nhà trọ ngõ 165 Cầu Giấy', street: 'Ngõ 165 Cầu Giấy', ward: 'Quan Hoa', lIdx: 0 },
    ];

    for (const p of propsData) {
      const property = await db.Property.create({
        landlord_id: landlords[p.lIdx].id,
        name: p.name,
        address_street: p.street,
        ward: p.ward,
        district: 'Cầu Giấy',
        city: 'Hà Nội',
        description: `Khu nhà trọ an ninh, sạch sẽ tại khu vực ${p.ward}. Gần các trường đại học và bến xe.`
      });

      // Create rooms for each property
      for (let i = 1; i <= 3; i++) {
        const room = await db.Room.create({
          property_id: property.id,
          room_name: `Phòng ${100 + i}`,
          area: 20 + i * 5,
          max_occupants: 2,
          base_price: 3000000 + i * 500000,
          deposit_amount: 3000000,
          has_mezzanine: i % 2 === 0,
          status: i === 1 ? 'RENTED' : 'AVAILABLE'
        });

        // Add 2-3 random amenities
        const shuffled = [...amenities].sort(() => 0.5 - Math.random());
        await room.addAmenities(shuffled.slice(0, 3));

        // Create a Post for available rooms
        if (room.status === 'AVAILABLE') {
          const post = await db.Post.create({
            room_id: room.id,
            title: `Cho thuê ${room.room_name} - ${property.name}`,
            content: `Cần cho thuê gấp ${room.room_name} tại ${property.address_street}. Diện tích ${room.area}m2, giá ${room.base_price} VNĐ. Full tiện ích.`,
            status: 'ACTIVE'
          });

          await db.PostImage.create({
            post_id: post.id,
            image_url: `https://picsum.photos/seed/${post.id}/800/600`
          });
        }

        // Create a Contract for occupied rooms
        if (room.status === 'RENTED') {
          const tenant = tenants[Math.floor(Math.random() * tenants.length)];
          const contract = await db.Contract.create({
            room_id: room.id,
            tenant_id: tenant.id,
            start_date: '2025-01-01',
            end_date: '2026-01-01',
            signed_price: room.base_price,
            signed_deposit: room.deposit_amount,
            status: 'ACTIVE',
            deposit_status: 'PAID'
          });

          // Create an Invoice
          await db.Invoice.create({
            contract_id: contract.id,
            invoice_date: '2025-03-01',
            total_amount: room.base_price,
            payment_status: 'PAID',
            paid_at: new Date()
          });
          
          await db.Invoice.create({
            contract_id: contract.id,
            invoice_date: '2025-04-01',
            total_amount: room.base_price,
            payment_status: 'UNPAID'
          });
        }
      }
    }
    console.log('Properties, Rooms, Posts, Contracts, Invoices seeded.');

    // 5. CONVERSATIONS & MESSAGES
    for (let i = 0; i < 5; i++) {
        const conv = await db.Conversation.create({
            tenant_id: tenants[i].id,
            landlord_id: landlords[i % landlords.length].id,
            last_message: 'Em chào anh, em muốn xem phòng ạ.'
        });

        await db.Message.create({
            conversation_id: conv.id,
            sender_id: tenants[i].id,
            content: 'Em chào anh, em muốn xem phòng ạ.'
        });
        
        await db.Message.create({
            conversation_id: conv.id,
            sender_id: landlords[i % landlords.length].id,
            content: 'Chào em, phòng vẫn còn em nhé. Khi nào em qua xem được?'
        });
    }
    console.log('Conversations and Messages seeded.');

    // 6. FAVORITES
    for (const tenant of tenants) {
        const posts = await db.Post.findAll({ limit: 2 });
        for (const p of posts) {
            await db.Favorite.create({
                user_id: tenant.id,
                post_id: p.id
            });
        }
    }
    console.log('Favorites seeded.');

    // 7. REVIEWS
    const roomsForReview = await db.Room.findAll({ limit: 5 });
    for (const r of roomsForReview) {
        await db.Review.create({
            room_id: r.id,
            user_id: tenants[Math.floor(Math.random() * tenants.length)].id,
            rating: 4 + Math.floor(Math.random() * 2), // 4 or 5
            comment: 'Phòng rất đẹp, chủ nhà nhiệt tình.'
        });
    }
    console.log('Reviews seeded.');

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('--- SEEDING FAILED ---');
    console.error(error);
    process.exit(1);
  }
}

seed();
