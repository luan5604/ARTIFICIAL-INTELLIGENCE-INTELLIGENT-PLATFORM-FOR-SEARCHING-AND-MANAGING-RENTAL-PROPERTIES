module.exports = (sequelize, DataTypes) => {
  const Contract = sequelize.define('Contract', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    signed_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    signed_deposit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    billing_cycle: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'TERMINATED'),
      defaultValue: 'ACTIVE'
    },
    pdf_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'contracts',
    timestamps: false
  });

  return Contract;
};
