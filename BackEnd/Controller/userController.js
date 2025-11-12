
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Your User model path
const SECRET_KEY = process.env.SECRET_KEY;
const isProduction = process.env.NODE_ENV === 'production';


// Create a new user
const createUser = async (req, res) => {
  const { name, email, password, role, subject_taught } = req.body;

  try {
    // Exclude soft deleted users when checking existence
    const existingUser = await User.findOne({ where: { email, isDeleted: false } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      subject_taught,
      isDeleted: false,
    });

    const userSafe = { ...newUser.get() };
    delete userSafe.password;

    res.status(201).json({ message: 'User created successfully', user: userSafe });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({attributes: { exclude: ['password'] } });
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { email, isDeleted: false } });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, {
//       expiresIn: '12h',
//     });

    
// console.log('Token generated:', token);
// console.log('SECRET_KEY:', SECRET_KEY);
// res.cookie('token', token, {
//   httpOnly: true,
//   secure: isProduction,
//   sameSite: isProduction ? 'None' : 'Lax',
//   path: '/',
//   maxAge: 12 * 60 * 60 * 1000,
// });

// res.status(200).json({
//   message: 'Login successful',
//   token, // send token explicitly
//   user: { id: user.id, role: user.role }
// });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // 🔹 1. Validate request
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     // 🔹 2. Find user
//     const user = await User.findOne({ where: { email, isDeleted: false } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 🔹 3. Compare password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // 🔹 4. Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.SECRET_KEY,
//       { expiresIn: "12h" }
//     );

//     console.log("✅ Token generated:", token);

//     // 🔹 5. Set cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: isProduction, // true in production for HTTPS
//       sameSite: isProduction ? "None" : "Lax",
//       path: "/",
//       maxAge: 12 * 60 * 60 * 1000, // 12 hours
//     });

//     // 🔹 6. Send success response (optional token for frontend if needed)
//     return res.status(200).json({
//       message: "Login successful",
//       user: { id: user.id, role: user.role, email: user.email },
//     });

//   } catch (error) {
//     console.error(" Login error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email, isDeleted: false } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '12h' }
    );

    console.log('Token generated:', token);
    console.log('SECRET_KEY:', process.env.SECRET_KEY); // ✅ fixed

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
      maxAge: 12 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',
      token, // ✅ only one token
      user: { id: user.id, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = { ...req.body };

  try {
    const user = await User.findOne({ where: { id: userId, isDeleted: false } });
    if (!user) {
      return res.status(404).json({ message: 'User not found or deleted' });
    }

    // Prevent email and password from being updated
    delete updates.email;
    delete updates.password;

    await user.update(updates);

    const userSafe = { ...user.get() };
    delete userSafe.password;

    res.status(200).json({ message: 'User updated successfully', user: userSafe });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};
// Soft delete user (set isDeleted = true)
const softDeleteUser = async (req, res) => {
 const userId = req.params.id;
  const { isDeleted } = req.body; // expect boolean true or false

  if (typeof isDeleted !== 'boolean') {
    return res.status(400).json({ message: 'isDeleted must be a boolean (true or false)' });
  }

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = isDeleted;
    await user.save();

    res.status(200).json({ message: `User ${isDeleted ? 'soft deleted' : 'restored'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

const currentUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.userId, isDeleted: false } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const updateSelf = async (req, res) => {
  const userId = req.userId; // Assume auth middleware sets req.userId
  const { name, password } = req.body;

  if (!name && !password) {
    return res.status(400).json({ message: 'Nothing to update. Provide name or password.' });
  }

  try {
    const user = await User.findOne({ where: { id: userId, isDeleted: false } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (password) updates.password = await bcrypt.hash(password, 10);

    await user.update(updates);

    const userSafe = { ...user.get() };
    delete userSafe.password;

    res.status(200).json({ message: 'Profile updated successfully', user: userSafe });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const createUsers = async (req, res) => {
  try {
    const usersData = req.body; // expecting an array of users

    if (!Array.isArray(usersData) || usersData.length === 0) {
      return res.status(400).json({ message: 'Request body must be a non-empty array of users.' });
    }

    const usersToCreate = [];

    for (const user of usersData) {
      const { name, email, password, role, subject_taught } = user;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields for one or more users.' });
      }

      const existingUser = await User.findOne({
        where: { email, isDeleted: false },
      });

      if (existingUser) {
        console.log(`Skipping existing user with email: ${email}`);
        continue; // skip duplicates
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      usersToCreate.push({
        name,
        email,
        password: hashedPassword,
        role,
        subject_taught: subject_taught || null,
        isDeleted: false,
      });
    }

    if (usersToCreate.length === 0) {
      return res.status(400).json({ message: 'No new users to create.' });
    }

    const createdUsers = await User.bulkCreate(usersToCreate);

    // remove password from response
    const safeUsers = createdUsers.map((user) => {
      const u = user.get();
      delete u.password;
      return u;
    });

    res.status(201).json({
      message: `${safeUsers.length} users created successfully.`,
      users: safeUsers,
    });
  } catch (error) {
    console.error('Error creating users:', error);
    res.status(500).json({ message: 'Error creating users', error: error.message });
  }
};
module.exports = {
  createUser,
  createUsers,
  loginUser,
  updateUser,
  softDeleteUser,
  getAllUsers,
  currentUser,
  updateSelf
};
