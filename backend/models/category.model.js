module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
    icon_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Home'
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#3b82f6'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'categories',
    timestamps: false
  });

  Category.associate = (models) => {
    Category.hasMany(models.Room, { foreignKey: 'category_id' });
  };

  return Category;
};
