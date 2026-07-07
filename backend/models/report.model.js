module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reporter_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reported_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'RESOLVED', 'REJECTED'),
      defaultValue: 'PENDING'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reports',
    timestamps: false
  });

  return Report;
};
