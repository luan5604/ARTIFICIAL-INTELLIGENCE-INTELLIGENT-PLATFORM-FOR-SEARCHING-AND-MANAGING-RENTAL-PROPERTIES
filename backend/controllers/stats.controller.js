const db = require('../models');
const Property = db.Property;
const Room = db.Room;
const Contract = db.Contract;
const Invoice = db.Invoice;
const Post = db.Post;
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user.Role.role_name === 'ADMIN';
    const landlord_id = req.user.id;
    const timeframe = parseInt(req.query.timeframe) || 6;

    let properties, rooms, roomIds;

    if (isAdmin) {
      properties = await Property.findAll({ attributes: ['id'] });
      rooms = await Room.findAll({ attributes: ['id', 'status', 'property_id'] });
      roomIds = rooms.map(r => r.id);
    } else {
      properties = await Property.findAll({ where: { landlord_id }, attributes: ['id'] });
      const propertyIds = properties.map(p => p.id);
      rooms = await Room.findAll({ where: { property_id: { [Op.in]: propertyIds } }, attributes: ['id', 'status', 'property_id'] });
      roomIds = rooms.map(r => r.id);
    }

    // 1. Current Stats
    const totalProperties = properties.length;
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'RENTED').length;
    const totalRoomsEmpty = rooms.filter(r => r.status === 'AVAILABLE').length;

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const contractIds = await Contract.findAll({
      where: { room_id: { [Op.in]: roomIds } },
      attributes: ['id']
    }).then(c => c.map(i => i.id));

    // Monthly Revenue (Current)
    const monthlyRevenue = await Invoice.sum('total_amount', {
      where: {
        payment_status: 'PAID',
        paid_at: { [Op.gte]: startOfCurrentMonth },
        contract_id: { [Op.in]: contractIds }
      }
    }) || 0;

    // Monthly Revenue (Previous)
    const prevMonthlyRevenue = await Invoice.sum('total_amount', {
      where: {
        payment_status: 'PAID',
        paid_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] },
        contract_id: { [Op.in]: contractIds }
      }
    }) || 0;

    // Active Posts
    const totalPostsActive = await Post.count({
      where: isAdmin ? { status: 'ACTIVE' } : { 
        status: 'ACTIVE',
        room_id: { [Op.in]: roomIds }
      }
    });

    // 2. Trend Calculations (Growth %)
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const revenueGrowth = calculateGrowth(monthlyRevenue, prevMonthlyRevenue);
    
    // For rooms and properties, since they don't have createdAt, we can't calculate monthly growth easily.
    // We'll set them to a static value or 0 for now to avoid errors.
    const roomsGrowth = 0;
    const propertiesGrowth = 0;

    // 3. Revenue Trend (Chart)
    const revenueTrend = [];
    for (let i = timeframe - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      
      const monthlyTotal = await Invoice.sum('total_amount', {
        where: {
          payment_status: 'PAID',
          paid_at: { [Op.between]: [start, end] },
          contract_id: { [Op.in]: contractIds }
        }
      }) || 0;

      revenueTrend.push({
        name: `Tháng ${d.getMonth() + 1}`,
        revenue: monthlyTotal
      });
    }

    // 4. Enhanced Recent Activity
    const recentContracts = await Contract.findAll({
      where: { room_id: { [Op.in]: roomIds } },
      limit: 5,
      order: [['id', 'DESC']], // Use ID as proxy for latest
      include: [{ model: Room }]
    });

    const recentInvoices = await Invoice.findAll({
      where: { 
        payment_status: 'PAID',
        contract_id: { [Op.in]: contractIds }
      },
      limit: 5,
      order: [['paid_at', 'DESC']],
      include: [{ model: Contract, include: [Room] }]
    });

    const recentPosts = await Post.findAll({
      where: isAdmin ? {} : { room_id: { [Op.in]: roomIds } },
      limit: 5,
      order: [['created_at', 'DESC']]
    });

    const recentActivity = [
      ...recentContracts.map(c => ({
        type: 'CONTRACT',
        text: `Hợp đồng mới: ${c.Room?.room_name || 'Phòng'}`,
        time: c.start_date // Use start_date since createdAt is missing
      })),
      ...recentInvoices.map(inv => ({
        type: 'INVOICE',
        text: `Thanh toán: ${inv.Contract?.Room?.room_name || 'Phòng'}`,
        time: inv.paid_at
      })),
      ...recentPosts.map(p => ({
        type: 'POST',
        text: `Tin đăng mới: ${p.title}`,
        time: p.created_at
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.json({
      totalProperties,
      totalRooms,
      occupiedRooms,
      totalRoomsEmpty,
      totalPostsActive,
      monthlyRevenue,
      statsTrends: {
        revenue: { value: Math.abs(revenueGrowth), isUp: revenueGrowth >= 0 },
        rooms: { value: Math.abs(roomsGrowth), isUp: roomsGrowth >= 0 },
        properties: { value: Math.abs(propertiesGrowth), isUp: propertiesGrowth >= 0 },
        occupancy: { value: 0, isUp: true }
      },
      revenueTrend,
      recentActivity
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
