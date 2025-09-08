
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



// exports.uploadResourcesCSV = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No CSV file uploaded' });
//         }

//         const resources = [];

//         // قراءة الملف المؤقت الذي رفعتَه عبر multer
//         fs.createReadStream(req.file.path)
//             .pipe(csv())
//             .on('data', (row) => {
//                 // row يحتوي على الأعمدة: name, description, location, school_level, quantity, subject, condition
//                 resources.push({
//                     name: row.name,
//                     description: row.description,
//                     location: row.location,
//                     // school_level: row.school_level,
//                     quantity: Number(row.quantity),
//                     subject: row.subject,
//                     condition: row.condition,
//                     imageUrls: [] // لو CSV لا يحتوي على روابط صور، تترك فارغة
//                 });
//             })
//             .on('end', async () => {
//                 try {
//                     const createdResources = await Resource.bulkCreate(resources);
//                     // حذف الملف المؤقت بعد القراءة
//                     fs.unlinkSync(req.file.path);

//                     res.status(201).json({
//                         message: `${createdResources.length} resources uploaded successfully`,
//                         resources: createdResources
//                     });
//                 } catch (dbError) {
//                     console.error('Database error:', dbError);
//                     res.status(500).json({ error: 'Failed to save resources to database' });
//                 }
//             })
//             .on('error', (err) => {
//                 console.error('CSV parse error:', err);
//                 res.status(500).json({ error: 'Failed to parse CSV file' });
//             });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// exports.uploadResourcesExcel = async (req, res) => { 
//     try { 
//         if (!req.files || req.files.length === 0) { 
//             return res.status(400).json({ error: 'No files uploaded' }); 
//         } 
 
//         // Separate Excel and images 
//         const excelFile = req.files.find(f => 
//             f.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
//             f.mimetype === 'application/vnd.ms-excel'
//         ); 
//         const imageFiles = req.files.filter(f => f.mimetype.startsWith('image/')); 
 
//         if (!excelFile) return res.status(400).json({ error: 'No Excel file uploaded' }); 
 
//         // Map images by resource name (filename without extension) 
//         const imagesMap = {}; 
//         for (const file of imageFiles) { 
//             const result = await new Promise((resolve, reject) => { 
//                 const stream = cloudinary.uploader.upload_stream( 
//                     { folder: 'resources', resource_type: 'auto' }, 
//                     (error, result) => { 
//                         if (error) reject(error); 
//                         else resolve(result); 
//                     } 
//                 ); 
//                 stream.end(file.buffer); 
//             }); 
//             const resourceName = file.originalname.split('.').slice(0, -1).join('.'); // remove extension 
//             imagesMap[resourceName] = result.secure_url; 
//         } 

//         // Read Excel file
//         const workbook = xlsx.read(excelFile.buffer, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0]; // Get first sheet
//         const worksheet = workbook.Sheets[sheetName];
        
//         // Convert to JSON with header mapping
//         const jsonData = xlsx.utils.sheet_to_json(worksheet, {
//             raw: false, // Keep values as strings initially
//             defval: '' // Default value for empty cells
//         });

//         if (jsonData.length === 0) {
//             return res.status(400).json({ error: 'Excel file is empty or has no data' });
//         }

//         const resources = [];
        
//         for (const row of jsonData) {
//             // Map Excel columns to database fields
//             // Adjust these column names based on your Excel headers
//             const itemName = row['Item Name/Title'] || row['Item Name'] || row['Name'] || '';
//             const description = row['Description'] || '';
//             const location = row['Inventory Location/Storage Number'] || row['Location'] || '';
//             const quantity = parseInt(row['Quantity in Stock'] || row['Quantity'] || '0') || 0;
//             const condition = row['Condition'] || '';
            
//             // Skip empty rows
//             if (!itemName.trim()) continue;

//             // Match image URL by resource name 
//             const imgUrl = imagesMap[itemName] ? [imagesMap[itemName]] : []; 
            
//             resources.push({ 
//                 name: itemName.trim(), 
//                 description: description.trim(), 
//                 location: location.trim(), 
//                 school_level: '', // Add default or map from Excel if available
//                 quantity: quantity, 
//                 subject: '', // Add default or map from Excel if available
//                 condition: condition.trim(), 
//                 imageUrls: imgUrl 
//             }); 
//         }

//         if (resources.length === 0) {
//             return res.status(400).json({ error: 'No valid resources found in Excel file' });
//         }

//         try { 
//             const createdResources = await Resource.bulkCreate(resources); 
 
//             res.status(201).json({ 
//                 message: `${createdResources.length} resources uploaded successfully`, 
//                 resources: createdResources 
//             }); 
//         } catch (dbError) { 
//             console.error('Database error:', dbError); 
//             res.status(500).json({ error: 'Failed to save resources to database' }); 
//         } 
 
//     } catch (err) { 
//         console.error('Excel processing error:', err); 
//         res.status(500).json({ error: 'Failed to process Excel file' }); 
//     } 
// };

exports.uploadResourcesExcel = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Separate Excel and image files
        const excelFile = req.files.find(f =>
            f.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            f.mimetype === 'application/vnd.ms-excel'
        );
        const imageFiles = req.files.filter(f => f.mimetype.startsWith('image/'));

        if (!excelFile) return res.status(400).json({ error: 'No Excel file uploaded' });

        // Upload images to Cloudinary and map by filename (without extension)
        const imagesMap = {};
        for (const file of imageFiles) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'resources', resource_type: 'auto' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(file.buffer);
                });

                const resourceName = file.originalname.split('.').slice(0, -1).join('.'); // filename without extension
                imagesMap[resourceName] = result.secure_url;
            } catch (uploadError) {
                console.error(`Failed to upload image ${file.originalname}:`, uploadError);
            }
        }

        // Read Excel file
        const workbook = xlsx.read(excelFile.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { raw: false, defval: '' });

        if (!jsonData.length) return res.status(400).json({ error: 'Excel file has no data' });

        const resources = [];

        for (const row of jsonData) {
            const itemName = (row['Item Name/Title'] || row['Item Name'] || row['Name'] || '').trim();
            if (!itemName) continue;

            const description = (row['Description'] || '').trim();
            const location = (row['Inventory Location/Storage Number'] || row['Location'] || '').trim();
            const quantity = parseInt(row['Quantity in Stock'] || row['Quantity'] || '0') || 0;
            const condition = (row['Condition'] || '').trim();

            const imgUrl = imagesMap[itemName] ? [imagesMap[itemName]] : [];

            resources.push({
                name: itemName,
                description,
                location,
                school_level: '', // adjust if you have Excel column for this
                quantity,
                subject: '', // adjust if you have Excel column for this
                condition,
                imageUrls: imgUrl
            });
        }

        if (!resources.length) return res.status(400).json({ error: 'No valid resources found in Excel file' });

        // Save to database
        try {
            const createdResources = await Resource.bulkCreate(resources);
            res.status(201).json({
                message: `${createdResources.length} resources uploaded successfully`,
                resources: createdResources
            });
        } catch (dbError) {
            console.error('Database error:', dbError);
            res.status(500).json({ error: 'Failed to save resources to database' });
        }

    } catch (err) {
        console.error('Excel processing error:', err);
        res.status(500).json({ error: 'Failed to process Excel file' });
    }
};