const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  updateUser,
  softDeleteUser,
  getAllUsers,
  currentUser,
  updateSelf,
  createUsers,

  
} = require('../Controller/userController'); 

const authMiddleware = require('../config/authMiddleware'); 
const isAdmin = require('../config/isAdmin');


router.get('/users', getAllUsers);              
router.patch('/users/:id' , updateUser); 
router.patch('/users/:id/delete' , softDeleteUser); 

router.post('/register', createUser);
router.get('/profile',authMiddleware, currentUser);

router.post('/login', loginUser);
router.patch('/currentprofile', authMiddleware, updateSelf);
router.post('/register-many', createUsers); // multiple



module.exports = router;
