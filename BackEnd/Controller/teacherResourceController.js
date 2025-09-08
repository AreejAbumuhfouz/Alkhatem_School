// require('dotenv').config();

// const Resource = require('../models/resources');
// const User = require('../models/User');
// const multer = require('multer');
// const Notification = require('../models/notification');
// const { Op } = require("sequelize");
// const UserResource = require('../models/teacherResource');
// const storage = multer.memoryStorage();
// const upload = multer({ storage })
// const { v2: cloudinary } = require('cloudinary');
// const fs = require('fs');
// const path = require('path');

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_KEY,
//     api_secret: process.env.CLOUD_SECRET
// });


// // Export upload middleware
// exports.upload = upload;

// // Get all resources with their associated users (many-to-many)
// exports.getAllResourcesWithUsers = async (req, res) => {
//   try {
//     const resources = await Resource.findAll({
//       include: {
//         model: User,
//         through: {
//           attributes: ['quantityTaken'], // shows quantityTaken
//         },
//         attributes: ['id', 'name', 'email'], // only needed fields
//       },
//     });

//     res.status(200).json(resources);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to get resources.' });
//   }
// };
// exports.claimResource = async (req, res) => {
//   const userId = req.user.id;
//   const { resourceId, quantityRequested } = req.body;

//   try {
//     // Fetch the resource
//     const resource = await Resource.findByPk(resourceId);
//     if (!resource || resource.isDeleted) {
//       return res.status(404).json({ message: 'Resource not found' });
//     }

//     if (resource.quantity < quantityRequested) {
//       return res.status(400).json({ message: 'Not enough quantity available' });
//     }

//     // Deduct resource quantity
//     resource.quantity -= quantityRequested;
//     await resource.save();

//     // Update or create UserResource
//     const [userResource, created] = await UserResource.findOrCreate({
//       where: { userId, resourceId },
//       defaults: { quantityTaken: quantityRequested },
//     });

//     if (!created) {
//       userResource.quantityTaken += quantityRequested;
//       await userResource.save();
//     }

//     // Notify all admins
//     const user = await User.findByPk(userId); // User info
//     const admins = await User.findAll({ where: { role: 'admin' } });

//     const notifications = admins.map(admin => ({
//       recipient_id: admin.id,
//       actor_id: userId,           
//       resource_id: resourceId,   
//       quantity: quantityRequested,
//       is_read: false,
//       created_at: new Date(),
//     }));

//     const createdNotifications = await Notification.bulkCreate(notifications, { returning: true });

//     // Include names in response (frontend convenience)
//     const notificationsWithNames = createdNotifications.map(n => ({
//       ...n.toJSON(),
//       userName: user.name,
//       resourceName: resource.name,
//     }));

//     res.status(200).json({
//       message: created
//         ? 'Resource claimed successfully'
//         : 'Resource quantity updated successfully',
//       updatedQuantity: resource.quantity,
//       userResource,
//       notifications: notificationsWithNames,
//     });
//   } catch (error) {
//     console.error('Error claiming resource:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.getAllResourcesTeacher = async (req, res) => {
//   try {
//     const resources = await Resource.findAll({
//       where: {
//         quantity: {
//           [Op.gte]: 1
//         }
//       }
//     });

//     const modifiedResources = resources.map(resource => {
//       const imageProxyUrl = `http://localhost:5000/images/${resource.imageUrl}`;
//       return {
//         ...resource.toJSON(),
//         imageUrl: imageProxyUrl,
//       };
//     });

//     res.status(200).json(modifiedResources);
//   } catch (error) {
//     console.error('Error fetching resources:', error);
//     res.status(500).json({ message: 'Failed to fetch resources.' });
//   }
// };

// exports.getTeacherResources = async (req, res) => {
//     const { teacherId } = req.params;
//     try {
//         const teacher = await User.findByPk(teacherId);

//         if (!teacher || teacher.role !== 'teacher') {
//             return res.status(404).json({ message: 'Teacher not found.' });
//         }

//         const teacherResources = await TeacherResource.findAll({
//             where: { teacher_id: teacherId },
//             include: [Resource],
//         });

//         res.status(200).json(teacherResources);
//     } catch (error) {
//         console.error('Error fetching teacher resources:', error);
//         res.status(500).json({ message: 'Failed to fetch teacher resources.' });
//     }
// };


// exports.assignResourceToTeacher = async (req, res) => {
//     const { teacherId, resourceId } = req.params;
//     const { quantity } = req.body;

//     try {
//         // Find teacher
//         const teacher = await User.findByPk(teacherId);
//         if (!teacher || teacher.role !== 'teacher') {
//             return res.status(404).json({ message: 'Teacher not found or invalid role.' });
//         }

//         // Find resource
//         const resource = await Resource.findByPk(resourceId);
//         if (!resource || resource.isDeleted) {
//             return res.status(404).json({ message: 'Resource not found.' });
//         }

//         // Check quantity availability
//         if (quantity > resource.quantity) {
//             return res.status(400).json({ message: 'Not enough resources available.' });
//         }

//         // Assign resource to teacher
//         const teacherResource = await TeacherResource.create({
//             teacher_id: teacherId,
//             resource_id: resourceId,
//             quantity,
//         });

//         // Update resource quantity
//         await resource.update({ quantity: resource.quantity - quantity });

//         // Notify all admins
//         const admins = await User.findAll({ where: { role: 'admin' } });

//         const notifications = admins.map(admin => ({
//             recipient_id: admin.id,
//             message: `Teacher ${teacher.name} has been assigned ${quantity} of resource "${resource.name}".`,
//         }));

//         const createdNotifications = await Notification.bulkCreate(notifications, { returning: true });

//         res.status(200).json({
//             message: 'Resource assigned successfully.',
//             assignedResource: teacherResource,
//             notifications: createdNotifications
//         });
//     } catch (error) {
//         console.error('Error assigning resource:', error);
//         res.status(500).json({ message: 'Failed to assign resource.' });
//     }
// };

// exports.getMyResources = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const takenResources = await UserResource.findAll({
//             where: { userId },
//             include: { model: Resource },
//         });

//         // Format response
//         const formatted = takenResources.map(tr => ({
//             resourceId: tr.resourceId,
//             name: tr.Resource.name,
//             quantityTaken: tr.quantityTaken,
//             imageUrls: tr.Resource.imageUrls || [],
//             subject: tr.Resource.subject,
//             condition: tr.Resource.condition,
//         }));

//         res.status(200).json(formatted);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Failed to fetch your resources.' });
//     }
// };

// // ================= RETURN RESOURCE =================
// exports.returnResource = async (req, res) => {
//   try {
//     const { resourceId, description, condition } = req.body;

//     if (!resourceId) {
//       return res.status(400).json({ message: 'Resource ID is required.' });
//     }

//     const resource = await Resource.findByPk(resourceId);
//     if (!resource) {
//       return res.status(404).json({ message: 'Resource not found.' });
//     }

//     // Update description and condition
//     if (description) resource.description = description;
//     if (condition) resource.condition = condition;

//     // Handle image upload if any
//     if (req.files && req.files.length > 0) {
//       const uploadedUrls = [];

//       for (const file of req.files) {
//         const result = await new Promise((resolve, reject) => {
//           const uploadStream = cloudinary.uploader.upload_stream(
//             { folder: 'resources' },
//             (error, result) => {
//               if (error) return reject(error);
//               resolve(result);
//             }
//           );
//           streamifier.createReadStream(file.buffer).pipe(uploadStream);
//         });

//         uploadedUrls.push(result.secure_url);
//       }

//       // Replace existing images
//       resource.imageUrls = uploadedUrls;
//     }

//     await resource.save();
//     res.status(200).json({ message: 'Resource updated successfully.', resource });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to update resource.' });
//   }
// };
require('dotenv').config();

const Resource = require('../models/resources');
const User = require('../models/User');
const multer = require('multer');
const Notification = require('../models/notification');
const { Op } = require("sequelize");
const UserResource = require('../models/teacherResource'); // Consider renaming this model
const TeacherResource = require('../models/teacherResource'); // Add proper import
const streamifier = require('streamifier'); // Add missing import
const storage = multer.memoryStorage();
const upload = multer({ storage })
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

// Export upload middleware
exports.upload = upload;

// Get all resources with their associated users (many-to-many)
// exports.getAllResourcesWithUsers = async (req, res) => {
//   try {
//     const resources = await Resource.findAll({
//       where: {
//         isDeleted: { [Op.ne]: true } // Exclude deleted resources
//       },
//       include: {
//         model: User,
//         through: {
//           attributes: ['quantityTaken'], // shows quantityTaken
//         },
//         attributes: ['id', 'name', 'email'], // only needed fields
//       },
//     });

//     res.status(200).json(resources);
//   } catch (err) {
//     console.error('Error fetching resources with users:', err);
//     res.status(500).json({ message: 'Failed to get resources.' });
//   }
// };

// exports.getAllResourcesWithUsers = async (req, res) => {
//   try {
//     const resources = await Resource.findAll({
//       where: {
//         isDeleted: { [Op.ne]: true } // استثناء المحذوفين
//       },
//       include: {
//         model: User,
//         required: true, // ✅ يخليها INNER JOIN عشان يرجع بس اللي عندها Users
//         through: {
//           attributes: ['quantityTaken'], // الكمية المأخوذة
//         },
//         attributes: ['id', 'name', 'email'], // الحقول المطلوبة من المستخدم
//       },
//     });

//     res.status(200).json(resources);
//   } catch (err) {
//     console.error('Error fetching resources with users:', err);
//     res.status(500).json({ message: 'Failed to get resources.' });
//   }
// };

exports.getAllResourcesWithUsers = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      where: {
        isDeleted: { [Op.ne]: true } // استثناء المحذوفين
      },
      include: {
        model: User,
        required: true, // ✅ يرجع فقط اللي عندها Users
        through: {
          attributes: ['quantityTaken'], // الكمية المأخوذة
        },
        attributes: ['id', 'name', 'email'], // الحقول المطلوبة من المستخدم
      },
    });

    const modifiedResources = resources.map(resource => {
      // معالجة الصور
      let imageProxyUrl = null;
      if (resource.imageUrl) {
        imageProxyUrl = `http://localhost:5000/images/${resource.imageUrl}`;
      } else if (resource.imageUrls && resource.imageUrls.length > 0) {
        imageProxyUrl = resource.imageUrls[0]; // أول صورة من المصفوفة
      }

      return {
        ...resource.toJSON(),
        imageUrl: imageProxyUrl,
      };
    });

    res.status(200).json(modifiedResources);
  } catch (err) {
    console.error('Error fetching resources with users:', err);
    res.status(500).json({ message: 'Failed to get resources.' });
  }
};



exports.claimResource = async (req, res) => {
  const userId = req.user.id;
  const { resourceId, quantityRequested } = req.body;

  // Input validation
  if (!resourceId || !quantityRequested || quantityRequested <= 0) {
    return res.status(400).json({ message: 'Valid resource ID and quantity are required.' });
  }

  try {
    // Fetch the resource
    const resource = await Resource.findByPk(resourceId);
    if (!resource || resource.isDeleted) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.quantity < quantityRequested) {
      return res.status(400).json({ message: 'Not enough quantity available' });
    }

    // Deduct resource quantity
    resource.quantity -= quantityRequested;
    await resource.save();

    // Update or create UserResource
    const [userResource, created] = await UserResource.findOrCreate({
      where: { userId, resourceId },
      defaults: { quantityTaken: quantityRequested },
    });

    if (!created) {
      userResource.quantityTaken += quantityRequested;
      await userResource.save();
    }

    // Notify all admins
    const user = await User.findByPk(userId); // User info
    const admins = await User.findAll({ where: { role: 'admin' } });

    if (admins.length > 0) {
      const notifications = admins.map(admin => ({
        recipient_id: admin.id,
        actor_id: userId,           
        resource_id: resourceId,   
        quantity: quantityRequested,
        message: `${user.name} claimed ${quantityRequested} units of ${resource.name}`,
        type: 'resource_claim', // Add notification type
        is_read: false,
        created_at: new Date(),
      }));

      const createdNotifications = await Notification.bulkCreate(notifications, { returning: true });

      // Include names in response (frontend convenience)
      const notificationsWithNames = createdNotifications.map(n => ({
        ...n.toJSON(),
        userName: user.name,
        resourceName: resource.name,
      }));

      res.status(200).json({
        message: created
          ? 'Resource claimed successfully'
          : 'Resource quantity updated successfully',
        updatedQuantity: resource.quantity,
        userResource,
        notifications: notificationsWithNames,
      });
    } else {
      res.status(200).json({
        message: created
          ? 'Resource claimed successfully'
          : 'Resource quantity updated successfully',
        updatedQuantity: resource.quantity,
        userResource,
        notifications: [],
      });
    }
  } catch (error) {
    console.error('Error claiming resource:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllResourcesTeacher = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      where: {
        quantity: {
          [Op.gte]: 1
        },
        isDeleted: { [Op.ne]: true } // Exclude deleted resources
      }
    });

    const modifiedResources = resources.map(resource => {
      // Handle both single imageUrl and multiple imageUrls
      let imageProxyUrl = null;
      if (resource.imageUrl) {
        imageProxyUrl = `http://localhost:5000/images/${resource.imageUrl}`;
      } else if (resource.imageUrls && resource.imageUrls.length > 0) {
        imageProxyUrl = resource.imageUrls[0]; // Use first image if multiple
      }

      return {
        ...resource.toJSON(),
        imageUrl: imageProxyUrl,
      };
    });

    res.status(200).json(modifiedResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Failed to fetch resources.' });
  }
};

exports.getTeacherResources = async (req, res) => {
    const { teacherId } = req.params;
    
    if (!teacherId) {
        return res.status(400).json({ message: 'Teacher ID is required.' });
    }

    try {
        const teacher = await User.findByPk(teacherId);

        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        const teacherResources = await TeacherResource.findAll({
            where: { teacher_id: teacherId },
            include: [{
                model: Resource,
                where: { isDeleted: { [Op.ne]: true } } // Exclude deleted resources
            }],
        });

        res.status(200).json(teacherResources);
    } catch (error) {
        console.error('Error fetching teacher resources:', error);
        res.status(500).json({ message: 'Failed to fetch teacher resources.' });
    }
};

exports.assignResourceToTeacher = async (req, res) => {
    const { teacherId, resourceId } = req.params;
    const { quantity } = req.body;

    // Input validation
    if (!teacherId || !resourceId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Valid teacher ID, resource ID, and quantity are required.' });
    }

    try {
        // Find teacher
        const teacher = await User.findByPk(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher not found or invalid role.' });
        }

        // Find resource
        const resource = await Resource.findByPk(resourceId);
        if (!resource || resource.isDeleted) {
            return res.status(404).json({ message: 'Resource not found.' });
        }

        // Check quantity availability
        if (quantity > resource.quantity) {
            return res.status(400).json({ message: 'Not enough resources available.' });
        }

        // Check if assignment already exists
        const existingAssignment = await TeacherResource.findOne({
            where: { 
                teacher_id: teacherId, 
                resource_id: resourceId 
            }
        });

        if (existingAssignment) {
            // Update existing assignment
            existingAssignment.quantity += quantity;
            await existingAssignment.save();
        } else {
            // Create new assignment
            await TeacherResource.create({
                teacher_id: teacherId,
                resource_id: resourceId,
                quantity,
            });
        }

        // Update resource quantity
        await resource.update({ quantity: resource.quantity - quantity });

        // Notify all admins
        const admins = await User.findAll({ where: { role: 'admin' } });

        if (admins.length > 0) {
            const notifications = admins.map(admin => ({
                recipient_id: admin.id,
                actor_id: req.user ? req.user.id : null, // Current user who made the assignment
                resource_id: resourceId,
                quantity: quantity,
                type: 'resource_assignment',
                message: `Teacher ${teacher.name} has been assigned ${quantity} units of resource "${resource.name}".`,
                is_read: false,
                created_at: new Date(),
            }));

            const createdNotifications = await Notification.bulkCreate(notifications, { returning: true });

            res.status(200).json({
                message: 'Resource assigned successfully.',
                assignedResource: existingAssignment || { teacher_id: teacherId, resource_id: resourceId, quantity },
                notifications: createdNotifications
            });
        } else {
            res.status(200).json({
                message: 'Resource assigned successfully.',
                assignedResource: existingAssignment || { teacher_id: teacherId, resource_id: resourceId, quantity },
                notifications: []
            });
        }
    } catch (error) {
        console.error('Error assigning resource:', error);
        res.status(500).json({ message: 'Failed to assign resource.' });
    }
};

exports.getMyResources = async (req, res) => {
    try {
        const userId = req.user.id;

        const takenResources = await UserResource.findAll({
            where: { userId },
            include: { 
                model: Resource,
                where: { isDeleted: { [Op.ne]: true } } // Exclude deleted resources
            },
        });

        // Format response
        const formatted = takenResources.map(tr => ({
            resourceId: tr.resourceId,
            name: tr.Resource.name,
            quantityTaken: tr.quantityTaken,
            imageUrls: tr.Resource.imageUrls || [],
            imageUrl: tr.Resource.imageUrl || null, // Include single imageUrl as well
            subject: tr.Resource.subject,
            condition: tr.Resource.condition,
            description: tr.Resource.description,
        }));

        res.status(200).json(formatted);
    } catch (err) {
        console.error('Error fetching user resources:', err);
        res.status(500).json({ message: 'Failed to fetch your resources.' });
    }
};

// ================= RETURN RESOURCE =================
exports.returnResource = async (req, res) => {
  try {
    const { resourceId, description, condition, quantityReturned } = req.body;

    // Input validation
    if (!resourceId) {
      return res.status(400).json({ message: 'Resource ID is required.' });
    }

    const resource = await Resource.findByPk(resourceId);
    if (!resource || resource.isDeleted) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    // Update description and condition if provided
    if (description) resource.description = description;
    if (condition) resource.condition = condition;

    // Handle quantity return if specified
    if (quantityReturned && quantityReturned > 0) {
      // Find user's resource record
      const userResource = await UserResource.findOne({
        where: { 
          userId: req.user.id, 
          resourceId: resourceId 
        }
      });

      if (userResource && userResource.quantityTaken >= quantityReturned) {
        // Update quantities
        resource.quantity += quantityReturned;
        userResource.quantityTaken -= quantityReturned;
        
        // Remove user resource record if fully returned
        if (userResource.quantityTaken === 0) {
          await userResource.destroy();
        } else {
          await userResource.save();
        }
      }
    }

    // Handle image upload if any
    // if (req.files && req.files.length > 0) {
    //   const uploadedUrls = [];

    //   for (const file of req.files) {
    //     try {
    //       const result = await new Promise((resolve, reject) => {
    //         const uploadStream = cloudinary.uploader.upload_stream(
    //           { 
    //             folder: 'resources',
    //             resource_type: 'auto' // Auto-detect file type
    //           },
    //           (error, result) => {
    //             if (error) return reject(error);
    //             resolve(result);
    //           }
    //         );
    //         streamifier.createReadStream(file.buffer).pipe(uploadStream);
    //       });

    //       uploadedUrls.push(result.secure_url);
    //     } catch (uploadError) {
    //       console.error('Error uploading image:', uploadError);
    //       // Continue with other uploads even if one fails
    //     }
    //   }

    //   // Update images (replace existing or add to imageUrls array)
    //   if (uploadedUrls.length > 0) {
    //     resource.imageUrls = uploadedUrls;
    //   }
    // }
    // Handle image upload if any
if (req.files && req.files.length > 0) {
  const uploadedUrls = [];

  for (const file of req.files) {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'resources',
            resource_type: 'auto' // Auto-detect file type
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      uploadedUrls.push(result.secure_url);
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      // Continue with other uploads even if one fails
    }
  }

  // Add new images to existing array instead of replacing
  if (uploadedUrls.length > 0) {
    resource.imageUrls = [...(resource.imageUrls || []), ...uploadedUrls];
  }
}


    await resource.save();

    // Notify admins about return
    const user = await User.findByPk(req.user.id);
    const admins = await User.findAll({ where: { role: 'admin' } });

    if (admins.length > 0 && quantityReturned) {
      const notifications = admins.map(admin => ({
        recipient_id: admin.id,
        actor_id: req.user.id,
        resource_id: resourceId,
        quantity: quantityReturned,
        type: 'resource_return',
        message: `${user.name} returned ${quantityReturned} units of ${resource.name}`,
        is_read: false,
        created_at: new Date(),
      }));

      await Notification.bulkCreate(notifications);
    }

    res.status(200).json({ 
      message: 'Resource updated successfully.', 
      resource: {
        id: resource.id,
        name: resource.name,
        quantity: resource.quantity,
        description: resource.description,
        condition: resource.condition,
        imageUrls: resource.imageUrls
      }
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ message: 'Failed to update resource.' });
  }
};