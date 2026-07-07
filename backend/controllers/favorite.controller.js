const db = require('../models');
const Favorite = db.Favorite;
const Post = db.Post;
const PostImage = db.PostImage;
const Room = db.Room;
const Property = db.Property;

const toggleFavorite = async (req, res) => {
  try {
    const { post_id } = req.body;
    const user_id = req.user.id;

    const existingFavorite = await Favorite.findOne({
      where: { user_id, post_id }
    });

    if (existingFavorite) {
      await existingFavorite.destroy();
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      await Favorite.create({ user_id, post_id });
      return res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Fetch favorites with post details
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [
        {
          model: Post,
          include: [
            { model: PostImage },
            { model: Room, include: [Property, db.Amenity] }
          ]
        }
      ]
    });

    // Extract the posts from favorite entries
    const posts = favorites.map(fav => fav.Post);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites
};
