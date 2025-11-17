// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
// const sequelize = require('./config/database');
// const userRoutes = require('./Router/userRoutes');
// const resourcesRouter = require('./Router/resourcesRouter');
// const teacherResource = require('./Router/teacherResourceRoutes');
// const notificationRoutes = require('./Router/notifications')
// const report = require('./Router/report')
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// app.use(express.urlencoded({ extended: true })); 
// app.use(express.json());

// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://alkhatem-inventory.vercel.app',
//   'https://alkhatem-school.vercel.app', 
//   'http://qowswggk0cs8k8gg04ckc00o.72.61.93.237.sslip.io',
//   'http://nsckock4ccs48o04wwckw8og.72.61.93.237.sslip.io',
//   'https://alkhateminventory.com',
//   'http://alkhateminventory.com'           

// ];
// app.use(
//   cors({
//     origin: function(origin, callback) {
//       if (!origin) return callback(null, true); // allow non-browser requests
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'], // include Authorization for header tokens
//     credentials: true, // important to allow cookies
//   })
// );


// app.use(cookieParser()); 
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected successfully.');

//     await sequelize.sync({ alter: true });
//     console.log('All models were synchronized successfully.');

//     app.use('/api', userRoutes);
//     app.use('/api', resourcesRouter);
//     app.use('/api', teacherResource);
//     app.use('/api', notificationRoutes);
//     app.use('/api', report);




//     // app.listen(PORT, () => {
//     //   console.log(`Server running on http://localhost:${PORT}`);
//     // });
//     app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });

//   } catch (error) {
//     console.error('Unable to connect to the database:', error.message);
//     process.exit(1);
//   }
// })();

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

// Allow all origins temporarily for testing (safe for development, change for production)
// app.use(cors({
//   origin: true,
//   methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));
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
