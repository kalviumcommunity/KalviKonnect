const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Explicitly configure Cloudinary using the URL from environment
cloudinary.config({
  secure: true
});

if (cloudinary.config().cloud_name) {
  console.log(`[CLOUDINARY] Connected to cloud: ${cloudinary.config().cloud_name}`);
} else {
  console.error('[CLOUDINARY ERROR] Could not detect Cloud Name from environment!');
}


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');
    const extension = file.originalname.split('.').pop().toLowerCase();
    
    return {
      folder: 'kalvi-connect',
      resource_type: isImage ? 'image' : 'raw',
      type: 'upload', // Crucial for public access
      public_id: `${file.originalname.split('.')[0].replace(/\s+/g, '-')}-${Date.now()}${isImage ? '' : '.' + extension}`,
      format: isImage ? undefined : extension,
    };

  },
});




module.exports = { cloudinary, storage };

