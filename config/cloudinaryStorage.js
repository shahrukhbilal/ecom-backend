
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinaryFile = require("./cloudinaryFile");

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryFile,
  params: {
    folder: "products",              // folder name in cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = storage;
