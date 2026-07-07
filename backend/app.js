const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger.js');
const db = require('./models');

dotenv.config();

const app = express();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB Connection
db.sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Routes
const authRoutes = require('./routes/auth.routes.js');
const propertyRoutes = require('./routes/property.routes.js');
const postRoutes = require('./routes/post.routes.js');
const billingRoutes = require('./routes/billing.routes.js');
const chatRoutes = require('./routes/chat.routes.js');
const statsRoutes = require('./routes/stats.routes.js');
const uploadRoutes = require('./routes/upload.routes');
const favoriteRoutes = require('./routes/favorite.routes.js');
const reportRoutes = require('./routes/report.routes.js');
const aiRoutes = require('./routes/ai.routes.js');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Rental Search API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
