module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      }
    }
  }, {
    tableName: 'favorites',
    timestamps: false
  });

  return Favorite;
};
