module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contract_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    service_fees: {
      type: DataTypes.JSON,
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM('UNPAID', 'PAID', 'OVERDUE'),
      defaultValue: 'UNPAID'
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'invoices',
    timestamps: false
  });

  return Invoice;
};
