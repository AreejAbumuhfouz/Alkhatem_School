
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Your User model path
const SECRET_KEY = process.env.SECRET_KEY;


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

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user who is not soft deleted
    const user = await User.findOne({ where: { email, isDeleted: false } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    // Set token as httpOnly cookie
    res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'none', // allow cross-site cookies
  maxAge: 60 * 60 * 1000,
});

    // Send success response (no need to send token in JSON if stored in cookie)
    res.status(200).json({ message: 'Login successful',name: user.name,
      token,  });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
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

module.exports = {
  createUser,
  loginUser,
  updateUser,
  softDeleteUser,
  getAllUsers,
  currentUser
};
