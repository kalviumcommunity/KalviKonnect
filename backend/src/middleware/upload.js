const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB Limit
    }
});

module.exports = upload;
