const multer = require("multer");

// Mendefinisikan gimana cara nyimpen file-nya
const storage = multer.memoryStorage();

// Membuat upload middleware
module.exports = multer({ storage: storage });
