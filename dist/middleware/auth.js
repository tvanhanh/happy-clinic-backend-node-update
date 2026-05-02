"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// ================= AUTH MIDDLEWARE =================
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Không có token" });
            return;
        }
        const token = authHeader.split(" ")[1];
        // ===== VERIFY TOKEN =====
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 🔥 FIX QUAN TRỌNG: hỗ trợ cả id và _id
        const userId = decoded.id || decoded._id;
        if (!userId) {
            res.status(401).json({ message: "Token sai format" });
            return;
        }
        // ===== FIND USER =====
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(401).json({ message: "Người dùng không tồn tại" });
            return;
        }
        // ===== SET REQUEST USER =====
        const u = user;
        req.user = {
            id: u._id.toString(),
            email: u.email,
            role: u.role,
            status: u.status,
        };
        next();
    }
    catch (error) {
        console.log("AUTH ERROR:", error);
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};
exports.verifyToken = verifyToken;
// ================= ADMIN CHECK =================
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Chỉ admin mới được phép" });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
