
require('dotenv').config();
const Resource = require('../models/resources');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx'); // Add this import at the top of your file

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});


// ================= CREATE RESOURCE =================
exports.createResource = async (req, res) => {
    try {
        const { name, description, location, school_level, quantity, subject, condition } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        
        const uploadedImages = [];
for (const file of req.files) {
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'resources' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(file.buffer);
    });
    uploadedImages.push(result.secure_url);
}


        const resource = await Resource.create({
            name,
            description,
            location,
            school_level,
            quantity,
            subject,
            condition,
            imageUrls: uploadedImages
        });

        res.status(201).json(resource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ================= GET ALL RESOURCES =================
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll({ where: { isDeleted: false } });
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ================= GET RESOURCE BY ID =================
exports.getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findByPk(id);
        if (!resource || resource.isDeleted) return res.status(404).json({ error: 'Resource not found' });
        res.json(resource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ================= UPDATE RESOURCE =================
exports.updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findByPk(id);
        if (!resource || resource.isDeleted) return res.status(404).json({ error: 'Resource not found' });

        const { name, description, location, school_level, quantity, subject, condition } = req.body;

        // Upload new images if provided
        let uploadedImages = resource.imageUrls; // Keep old images by default
        if (req.files && req.files.length > 0) {
            uploadedImages = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
    folder: 'resources'
});

                uploadedImages.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        await resource.update({
            name,
            description,
            location,
            school_level,
            quantity,
            subject,
            condition,
            imageUrls: uploadedImages
        });

        res.json(resource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ================= TOGGLE DELETE RESOURCE =================
exports.toggleDeleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findByPk(id);
        if (!resource) return res.status(404).json({ error: 'Resource not found' });

        resource.isDeleted = !resource.isDeleted;
        await resource.save();

        res.json({ message: `Resource ${resource.isDeleted ? 'deleted' : 'restored'} successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ================= DELETE RESOURCE PERMANENTLY =================
exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findByPk(id);
        if (!resource) return res.status(404).json({ error: 'Resource not found' });

        await resource.destroy();
        res.json({ message: 'Resource permanently deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.uploadResourcesFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // قراءة Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const createdResources = [];

    for (const row of data) {
      const { name, description, location, school_level, quantity, subject, condition, image_path } = row;

      // رفع الصورة لكل مورد
      const uploadedImages = [];
      if (image_path) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "resources" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          // هنا نفترض الصور موجودة محليًا في مجلد /images
          const fs = require("fs");
          const path = require("path");
          const imgBuffer = fs.readFileSync(path.join(__dirname, "..", "images", image_path));
          stream.end(imgBuffer);
        });
        uploadedImages.push(result.secure_url);
      }

      // إنشاء Resource
      const resource = await Resource.create({
        name,
        description,
        location,
        school_level,
        quantity: parseInt(quantity || 0),
        subject,
        condition,
        imageUrls: uploadedImages,
      });

      createdResources.push(resource);
    }

    res.status(201).json({
      message: `${createdResources.length} resources created successfully`,
      data: createdResources,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


/*
exports.uploadResourcesFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // قراءة Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const createdResources = [];

    for (const row of data) {
      const { name, description, location, school_level, quantity, subject, condition, image_path } = row;

      let imageUrls = [];

      if (image_path && image_path.startsWith("https://")) {
        // إذا الرابط موجود بالفعل في Excel، استخدمه مباشرة
        imageUrls.push(image_path);
      } else if (image_path) {
        // إذا لم يكن رابط، ارفع الصورة من المجلد المحلي
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "resources" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          const imgBuffer = fs.readFileSync(path.join(__dirname, "..", "images", image_path));
          stream.end(imgBuffer);
        });
        imageUrls.push(result.secure_url);
      }

      // إنشاء Resource في قاعدة البيانات
      const resource = await Resource.create({
        name,
        description,
        location: location || null,
        school_level: school_level || null,
        quantity: parseInt(quantity || 0),
        subject: subject || null,
        condition: condition || null,
        imageUrls,
      });

      createdResources.push(resource);
    }

    res.status(201).json({
      message: `${createdResources.length} resources created successfully`,
      data: createdResources,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
*/