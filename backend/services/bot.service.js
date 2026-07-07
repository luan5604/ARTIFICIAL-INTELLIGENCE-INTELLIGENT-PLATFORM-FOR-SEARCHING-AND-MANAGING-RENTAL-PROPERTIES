const db = require('../models');
const Room = db.Room;
const Property = db.Property;
const Amenity = db.Amenity;

const handleBotQuery = async (query, roomId) => {
  const room = await Room.findByPk(roomId, {
    include: [
      { model: Property },
      { model: Amenity }
    ]
  });

  if (!room) return "Xin lỗi, tôi không tìm thấy thông tin phòng này.";

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('giá') || lowerQuery.includes('bao nhiêu')) {
    return `Giá phòng ${room.room_name} là ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.base_price)}/tháng. Tiền cọc là ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.deposit_amount)}.`;
  }

  if (lowerQuery.includes('diện tích') || lowerQuery.includes('rộng')) {
    return `Phòng có diện tích ${room.area}m2.`;
  }

  if (lowerQuery.includes('tiện ích') || lowerQuery.includes('có gì')) {
    const amenities = room.Amenities.map(a => a.name).join(', ');
    return `Phòng có các tiện ích: ${amenities || 'Không có thông tin tiện ích cụ thể'}.`;
  }

  if (lowerQuery.includes('địa chỉ') || lowerQuery.includes('ở đâu')) {
    return `Địa chỉ: ${room.Property.address_street}, ${room.Property.ward}, ${room.Property.district}, ${room.Property.city}.`;
  }

  if (lowerQuery.includes('còn phòng') || lowerQuery.includes('trống')) {
    return room.status === 'AVAILABLE' ? "Phòng hiện vẫn còn trống, bạn có thể đặt lịch xem nhé!" : "Tiếc quá, phòng này hiện đã có người thuê hoặc đặt cọc rồi.";
  }

  return null; // Return null to indicate complex query that needs landlord
};

module.exports = { handleBotQuery };
