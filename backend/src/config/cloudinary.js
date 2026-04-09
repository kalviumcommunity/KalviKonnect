const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Explicitly configure Cloudinary using the URL from environment
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kalvi-connect',
    resource_type: 'auto', // Important for PDFs/Docs
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'zip', 'ppt', 'pptx'],
  },
});

module.exports = { cloudinary, storage };
