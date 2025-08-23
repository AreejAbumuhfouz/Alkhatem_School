const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const userRoutes = require('./Router/userRoutes');
const resourcesRouter = require('./Router/resourcesRouter');
const teacherResource = require('./Router/teacherResourceRoutes');
const notificationRoutes = require('./Router/notifications')
const report = require('./Router/report')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
// app.use(
//   cors({
//     origin: 
//     'http://localhost:5173',
//     'https://alkhatem-school.vercel.app',
//     methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], // لازم تضيف PATCH هنا
//     credentials: true, // Allow cookies or authorization headers
//   })
// );
const allowedOrigins = [
  'http://localhost:5173',
  'https://alkhatem-school.vercel.app',
];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);


app.use(cookieParser()); // ✅ parse cookies
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    app.use('/api', userRoutes);
    app.use('/api', resourcesRouter);
    app.use('/api', teacherResource);
    app.use('/api', notificationRoutes);
    app.use('/api', report);




    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
})();