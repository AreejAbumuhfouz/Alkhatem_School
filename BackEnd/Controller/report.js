
const ExcelJS = require('exceljs');
const axios = require('axios');
const Resource = require('../models/resources');

exports.generateResourcesReport = async (req, res) => {
  try {
    const resources = await Resource.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resources Report');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'School Level', key: 'school_level', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Subject', key: 'subject', width: 20 },
      { header: 'Image', key: 'image', width: 20 },
    ];

    for (let i = 0; i < resources.length; i++) {
      const r = resources[i];
      const row = worksheet.addRow({
        id: r.id,
        name: r.name,
        description: r.description,
        location: r.location,
        school_level: r.school_level,
        quantity: r.quantity,
        subject: r.subject,
      });

      if (r.imageUrls && r.imageUrls.length > 0) {
        try {
          const imageUrl = r.imageUrls[0]; // ✅ show first image only

          // Detect file type from URL
          let ext = 'png';
          if (imageUrl.includes('.jpg') || imageUrl.includes('.jpeg')) ext = 'jpeg';

          // Download Cloudinary image as buffer
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data, 'binary');

          const imageId = workbook.addImage({
            buffer,
            extension: ext,
          });

          // Insert into the "Image" column (index 7 = 8th col)
          worksheet.addImage(imageId, {
            tl: { col: 7, row: row.number - 1 },
            ext: { width: 80, height: 80 },
          });

          worksheet.getRow(row.number).height = 60;
        } catch (err) {
          console.error(`❌ Failed to load image for resource ${r.id}`, err.message);
        }
      }
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=resources_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report.' });
  }
};
