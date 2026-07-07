module.exports = (sequelize, DataTypes) => {
  const RoomAmenity = sequelize.define('RoomAmenity', {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'rooms',
        key: 'id'
      }
    },
    amenity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'amenities',
        key: 'id'
      }
    }
  }, {
    tableName: 'room_amenities',
    timestamps: false
  });

  return RoomAmenity;
};
