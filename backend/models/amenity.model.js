module.exports = (sequelize, DataTypes) => {
  const Amenity = sequelize.define('Amenity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    icon_tag: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'amenities',
    timestamps: false
  });

  return Amenity;
};
