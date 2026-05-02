"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateUserInfor = exports.getUserInfor = exports.changePassWord = exports.getProfile = exports.updateProfile = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const profileChecker_1 = require("./utils/profileChecker");
// 🔥 UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, {
            $set: {
                profile: req.body.profile, // ghi đè profile
            },
        }, { new: true });
        res.json({
            message: "Cập nhật thành công",
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateProfile = updateProfile;
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await User_1.default.findById(req.user.id).select("-password");
        // 👇 ĐẶT Ở ĐÂY
        console.log("REQ USER:", req.user);
        console.log("DB USER:", user);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // xác định loại check
        let type = "basic";
        if (user.role === "doctor")
            type = "medical";
        // check profile 1 lần thôi
        const profileStatus = (0, profileChecker_1.checkProfile)(user, type);
        res.json({
            ...user.toObject(),
            profileStatus,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProfile = getProfile;
const changePassWord = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        console.log("Dữ liệu nhận từ frontend:", req.body);
        if (!email || !newPassword) {
            res.status(400).json({ message: 'Thiếu email hoặc mật khẩu mới' });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'Người dùng không tồn tại' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
exports.changePassWord = changePassWord;
const getUserInfor = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            res.status(401).json({ message: 'Người dùng chưa đăng nhập' });
            return;
        }
        const email = req.user.email;
        const medicalRecords = await User_1.default.find({ email }); // 👈 lọc theo email người dùng
        res.status(200).json(medicalRecords);
    }
    catch (error) {
        console.error("Lỗi khi lấy dữ liệu ", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
exports.getUserInfor = getUserInfor;
const updateUserInfor = async (req, res) => {
    try {
        // ✅ check login
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Người dùng chưa đăng nhập" });
            return;
        }
        // ✅ ép id về string
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const { name, phone, address, gender, healthInsurance, avatar } = req.body;
        // ✅ validate ObjectId
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "ID không hợp lệ" });
            return;
        }
        const updated = await User_1.default.findByIdAndUpdate(id, { name, phone, address, gender, healthInsurance, avatar }, { new: true });
        if (!updated) {
            res.status(404).json({ message: "Không tìm thấy user" });
            return;
        }
        res.status(200).json({
            message: "Cập nhật thành công",
            user: updated, // 👈 sửa chữ hoa cho chuẩn API
        });
    }
    catch (error) {
        console.error("Lỗi khi cập nhật user", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
exports.updateUserInfor = updateUserInfor;
const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
        // Kiểm tra mật khẩu mới
        if (newPassword !== confirmNewPassword) {
            res.status(400).json({ message: "Mật khẩu mới không khớp." });
            return;
        }
        // Tìm người dùng
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Không tìm thấy người dùng." });
            return;
        }
        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Mật khẩu cũ không đúng." });
            return;
        }
        // Hash mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Đổi mật khẩu thành công." });
    }
    catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
exports.changePassword = changePassword;
