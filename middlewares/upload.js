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

// const storageVideo = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "product-videos",
//     allowed_formats: ["mp4", "avi", "flv", "wmv"],
//     resource_type: "video",
//     transformation: [{ width: 640, height: 480, crop: "limit" }],
//   },
// });

const uploadImage = multer({ storage: storageImage });
// const uploadVideo = multer({ storage: storageVideo });

module.exports = { uploadImage };
