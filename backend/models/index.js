const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Dynamically load models
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-9) === '.model.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Manual Associations (if not defined in models)
// Role - User
db.Role.hasMany(db.User, { foreignKey: 'role_id' });
db.User.belongsTo(db.Role, { foreignKey: 'role_id' });

// User - Profile
db.User.hasOne(db.Profile, { foreignKey: 'user_id' });
db.Profile.belongsTo(db.User, { foreignKey: 'user_id' });

// User (Landlord) - Property
db.User.hasMany(db.Property, { foreignKey: 'landlord_id' });
db.Property.belongsTo(db.User, { foreignKey: 'landlord_id', as: 'landlord' });

// Property - Room
db.Property.hasMany(db.Room, { foreignKey: 'property_id' });
db.Room.belongsTo(db.Property, { foreignKey: 'property_id' });

// Category - Room
db.Category.hasMany(db.Room, { foreignKey: 'category_id' });
db.Room.belongsTo(db.Category, { foreignKey: 'category_id' });

// Room - Amenity (Many-to-Many)
db.Room.belongsToMany(db.Amenity, { 
  through: db.RoomAmenity,
  foreignKey: 'room_id',
  otherKey: 'amenity_id'
});
db.Amenity.belongsToMany(db.Room, { 
  through: db.RoomAmenity,
  foreignKey: 'amenity_id',
  otherKey: 'room_id'
});

// Room - Post
db.Room.hasMany(db.Post, { foreignKey: 'room_id', as: 'Posts' });
db.Post.belongsTo(db.Room, { foreignKey: 'room_id' });

// Post - PostImage
db.Post.hasMany(db.PostImage, { foreignKey: 'post_id' });
db.PostImage.belongsTo(db.Post, { foreignKey: 'post_id' });

// Room - Contract
db.Room.hasMany(db.Contract, { foreignKey: 'room_id' });
db.Contract.belongsTo(db.Room, { foreignKey: 'room_id' });
db.User.hasMany(db.Contract, { foreignKey: 'tenant_id' });
db.Contract.belongsTo(db.User, { foreignKey: 'tenant_id', as: 'tenant' });

// Contract - Invoice
db.Contract.hasMany(db.Invoice, { foreignKey: 'contract_id' });
db.Invoice.belongsTo(db.Contract, { foreignKey: 'contract_id' });

// Conversation - User
db.User.hasMany(db.Conversation, { foreignKey: 'tenant_id', as: 'tenantConversations' });
db.User.hasMany(db.Conversation, { foreignKey: 'landlord_id', as: 'landlordConversations' });
db.Conversation.belongsTo(db.User, { foreignKey: 'tenant_id', as: 'tenant' });
db.Conversation.belongsTo(db.User, { foreignKey: 'landlord_id', as: 'landlord' });

// User - Message
db.Conversation.hasMany(db.Message, { foreignKey: 'conversation_id' });
db.Message.belongsTo(db.Conversation, { foreignKey: 'conversation_id' });
db.User.hasMany(db.Message, { foreignKey: 'sender_id' });
db.Message.belongsTo(db.User, { foreignKey: 'sender_id', as: 'sender' });

// User - UserSession
db.User.hasMany(db.UserSession, { foreignKey: 'user_id' });
db.UserSession.belongsTo(db.User, { foreignKey: 'user_id' });

// Favorites
db.User.belongsToMany(db.Post, { through: db.Favorite, foreignKey: 'user_id' });
db.Post.belongsToMany(db.User, { through: db.Favorite, foreignKey: 'post_id' });
db.User.hasMany(db.Favorite, { foreignKey: 'user_id' });
db.Favorite.belongsTo(db.User, { foreignKey: 'user_id' });
db.Post.hasMany(db.Favorite, { foreignKey: 'post_id' });
db.Favorite.belongsTo(db.Post, { foreignKey: 'post_id' });

// Reports
db.Report.belongsTo(db.User, { as: 'reporter', foreignKey: 'reporter_id' });
db.Report.belongsTo(db.User, { as: 'reportedUser', foreignKey: 'reported_user_id' });
db.Report.belongsTo(db.Conversation, { foreignKey: 'conversation_id' });
db.Report.belongsTo(db.Post, { foreignKey: 'post_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
