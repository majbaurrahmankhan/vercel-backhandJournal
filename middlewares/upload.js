
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined in .env file");

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => ({
        bucketName: 'uploads', // collection name
        filename: Date.now() + '' + file.originalname.replace(/\s+/g, '')
    })
});

const upload = multer({ storage });

module.exports = upload;