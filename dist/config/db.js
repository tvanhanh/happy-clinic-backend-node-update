"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridFSBucket = void 0;
// config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let gridFSBucket = null;
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
        const db = conn.connection.db;
        if (!db) {
            throw new Error("MongoDB Db instance is undefined");
        }
        // Khởi tạo GridFSBucket
        gridFSBucket = new mongoose_1.default.mongo.GridFSBucket(db, {
            bucketName: "medical_files",
        });
    }
    catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
};
// Lấy GridFSBucket để dùng trong controller
const getGridFSBucket = () => {
    if (!gridFSBucket) {
        throw new Error("GridFSBucket chưa được khởi tạo. Hãy gọi connectDB() trước.");
    }
    return gridFSBucket;
};
exports.getGridFSBucket = getGridFSBucket;
exports.default = connectDB;
// emulator -avd Pixel_7_API_31
// Accout login 
// admin@gmail.com , pass: 123456
// doctor@gmail.com, pass: 123456 
