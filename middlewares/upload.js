const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../configs/cloudinary");
const multer = require("multer");

const storageImage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product-images",
    format: async () => "jpg",
  },
});

const uploadImage = multer({ storage: storageImage });

module.exports = { uploadImage };
