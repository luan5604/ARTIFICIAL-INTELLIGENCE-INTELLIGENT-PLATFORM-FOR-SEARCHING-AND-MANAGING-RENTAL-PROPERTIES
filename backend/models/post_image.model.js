module.exports = (sequelize, DataTypes) => {
  const PostImage = sequelize.define('PostImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_thumbnail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'post_images',
    timestamps: false
  });

  return PostImage;
};
