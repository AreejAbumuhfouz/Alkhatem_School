

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const userRoutes = require('./Router/userRoutes');
const resourcesRouter = require('./Router/resourcesRouter');
const teacherResource = require('./Router/teacherResourceRoutes');
const notificationRoutes = require('./Router/notifications');
const report = require('./Router/report');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // يسمح بالطلبات مباشرة من Postman أو curl
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Database connection & sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    // Routes
    app.use('/api', userRoutes);
    app.use('/api', resourcesRouter);
    app.use('/api', teacherResource);
    app.use('/api', notificationRoutes);
    app.use('/api', report);

    // Test route
    app.get('/test', (req, res) => res.json({ message: "Server works!" }));

    // Listen on all interfaces (0.0.0.0) for VPS
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
})();
