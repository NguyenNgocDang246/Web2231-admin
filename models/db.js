require('dotenv').config();  // Đảm bảo bạn đã tải môi trường từ .env
const mongoose = require('mongoose');  // Import mongoose

// Lấy URI từ biến môi trường
const mongoURI = process.env.DB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Atlas via Mongoose');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        process.exit(1);  // Dừng ứng dụng nếu kết nối thất bại
    }
};

// Export mongoose và connectDB
module.exports = { mongoose, connectDB };
