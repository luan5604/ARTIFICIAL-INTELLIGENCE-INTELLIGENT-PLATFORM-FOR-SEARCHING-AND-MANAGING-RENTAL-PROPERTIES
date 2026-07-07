module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    room_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Phòng trọ'
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    area: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    max_occupants: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    base_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    deposit_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'AVAILABLE', 'RENTED', 'DEPOSITED', 'MAINTENANCE'),
      defaultValue: 'PENDING'
    },
    has_mezzanine: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('images');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value));
      }
    }
  }, {
    tableName: 'rooms',
    timestamps: false
  });

  return Room;
};
