const db = require('../models');
const { Op } = require('sequelize');

// Cấu hình OpenRouter API Key và Model trực tiếp trong code theo yêu cầu
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'openai/gpt-4o-mini';

const askAI = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Vui lòng nhập câu hỏi' });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'Chưa cấu hình API Key cho AI' });
    }

    const user = req.user; 
    const profile = await db.Profile.findOne({ where: { user_id: user.id } });
    const userName = profile?.full_name || user.email || 'Khách hàng';
    const roleName = user.Role?.role_name || 'KHACH_THUE';
    const roleLabel = roleName === 'ADMIN' ? 'Quản trị viên' : (roleName === 'CHU_TRO' ? 'Chủ trọ' : 'Khách thuê');

    //  Khởi tạo prompt 
    let context = "Bạn là trợ lý ảo của BoardingHub. Trả lời ngắn gọn, thân thiện, súc tích.\n";
    context += `Thời cư hiện tại: ${new Date().toLocaleString('vi-VN')}.\n`;
    context += `Người đang hỏi: ${userName} (Vai trò: ${roleLabel}).\n\n`;

    //  Thông tin chung cho tất cả (Phòng trống & Dịch vụ)
    const availableRooms = await db.Room.findAll({
      where: { status: 'AVAILABLE' },
      include: [{ model: db.Property }]
    });

    if (availableRooms.length > 0) {
      context += "Danh sách phòng trống hiện tại:\n";
      availableRooms.forEach(r => {
        const prop = r.Property;
        const propName = prop ? prop.name : 'Chưa rõ khu trọ';
        const price = Number(r.base_price || 0).toLocaleString('vi-VN');
        // Địa chỉ đầy đủ để AI biết phòng ở thành phố nào
        const addressParts = [];
        if (prop?.address_street) addressParts.push(prop.address_street);
        if (prop?.ward) addressParts.push(prop.ward);
        if (prop?.district) addressParts.push(prop.district);
        if (prop?.city) addressParts.push(prop.city);
        const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Chưa rõ địa chỉ';
        context += `- Phòng ${r.room_name} | Khu trọ: ${propName} | Địa chỉ: ${fullAddress} | Giá: ${price}đ/tháng | Diện tích: ${r.area}m2\n`;
      });
      context += "\n";
    } else {
      context += "Hiện tại hệ thống không còn phòng trống.\n";
    }

    const amenities = await db.Amenity.findAll();
    context += "Thông tin tiện ích phòng: ";
    amenities.forEach(a => {
      context += `${a.name}; `;
    });
    context += "\nBảng giá dịch vụ tham khảo chung: Điện (3.500đ/kWh), Nước (20.000đ/m3 hoặc 100.000đ/người), Internet (100.000đ/phòng/tháng), Rác (30.000đ/phòng/tháng).\n\n";

    //  Thông tin riêng theo vai trò
    if (roleName === 'ADMIN') {
      const totalRooms = await db.Room.count();
      const rentedRooms = await db.Room.count({ where: { status: 'RENTED' } });
      const currentMonth = new Date().toISOString().slice(0, 7);
      const totalInvoices = await db.Invoice.count({
        where: { invoice_date: { [Op.like]: `${currentMonth}%` } }
      });
      const unpaidInvoices = await db.Invoice.count({
        where: { payment_status: 'UNPAID' }
      });

      context += "--- DÀNH CHO ADMIN ---\n";
      context += `Tổng số phòng: ${totalRooms}, Đã thuê: ${rentedRooms}, Đang trống: ${totalRooms - rentedRooms}.\n`;
      context += `Hóa đơn tháng này (${currentMonth}): ${totalInvoices}. Số hóa đơn chưa thanh toán: ${unpaidInvoices}.\n`;
    } else if (roleName === 'CHU_TRO') {
      const properties = await db.Property.findAll({ where: { landlord_id: user.id } });
      const propIds = properties.map(p => p.id);
      let totalMyRooms = 0;
      let rentedMyRooms = 0;
      if (propIds.length > 0) {
        totalMyRooms = await db.Room.count({ where: { property_id: propIds } });
        rentedMyRooms = await db.Room.count({ where: { property_id: propIds, status: 'RENTED' } });
      }

      context += "--- DÀNH CHO CHỦ TRỌ ---\n";
      context += `Bạn đang quản lý ${properties.length} khu trọ với tổng số ${totalMyRooms} phòng (Đã thuê: ${rentedMyRooms}, Đang trống: ${totalMyRooms - rentedMyRooms}).\n`;
    } else {
      // Khách thuê
      const activeContract = await db.Contract.findOne({
        where: { tenant_id: user.id, status: 'ACTIVE' },
        include: [{ model: db.Room, include: [db.Property] }]
      });

      context += "--- DÀNH CHO KHÁCH THUÊ ---\n";
      if (activeContract) {
        const room = activeContract.Room;
        const propName = room?.Property ? room.Property.name : '';
        const price = Number(activeContract.signed_price || 0).toLocaleString('vi-VN');
        context += `Bạn đang thuê: Phòng ${room?.room_name} tại ${propName}.\n`;
        context += `Hợp đồng: Bắt đầu từ ${activeContract.start_date}, Hết hạn: ${activeContract.end_date || 'Chưa xác định'}. Giá thuê: ${price}đ/tháng.\n`;

        const recentInvoices = await db.Invoice.findAll({
          where: { contract_id: activeContract.id },
          order: [['invoice_date', 'DESC']],
          limit: 3
        });

        if (recentInvoices.length > 0) {
          context += "Lịch sử hóa đơn gần đây: ";
          recentInvoices.forEach(inv => {
            const statusStr = inv.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán';
            const amt = Number(inv.total_amount || 0).toLocaleString('vi-VN');
            context += `Ngày ${inv.invoice_date} (${amt}đ, ${statusStr}); `;
          });
          context += "\n";
        }
      } else {
        context += "Bạn hiện chưa có hợp đồng thuê phòng nào đang hoạt động.\n";
      }
    }

    const prompt = `${context}\nCâu hỏi của người dùng: ${question}`;

    // Gọi OpenRouter API
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers.origin || 'http://localhost:3000',
        'X-Title': 'BoardingHub AI Chatbot'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({
        error: 'Không thể kết nối tới AI service',
        detail: errText
      });
    }

    const data = await response.json();
    let answer = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.';

    // Clean up DeepSeek reasoning tags <think>...</think>
    answer = answer.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    return res.json({ answer });
  } catch (error) {
    console.error('AI Chatbot Error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi kết nối AI',
      detail: error.message
    });
  }
};

module.exports = { askAI };
