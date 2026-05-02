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
exports.logout = exports.verifyOtp = exports.login = exports.registerByAdmin = exports.register = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Otp_1 = __importDefault(require("../models/Otp"));
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role, status } = req.body;
        console.log("Dữ liệu nhận từ frontend:", req.body);
        if (password !== confirmPassword) {
            res.status(400).json({ message: "Mật khẩu không khớp." });
            return;
        }
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email đã tồn tại." });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo user mới (không lưu rePassword)
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role: role || "patient",
            status: status || "activity",
            profile: {}
        });
        await newUser.save();
        res.status(201).json({ message: "Tạo tài khoản thành công!" });
    }
    catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
exports.register = register;
const registerByAdmin = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role, status } = req.body;
        console.log("Dữ liệu nhận từ frontend:", req.body);
        if (password !== confirmPassword) {
            res.status(400).json({ message: "Mật khẩu không khớp." });
            return;
        }
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email đã tồn tại." });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo user mới (không lưu rePassword)
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role,
            status: status || "activity",
            profile: {}
        });
        await newUser.save();
        res.status(201).json({ message: "Tạo tài khoản thành công!" });
    }
    catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
exports.registerByAdmin = registerByAdmin;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Dữ liệu nhận từ frontend:", req.body);
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Email không tồn tại" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Mật khẩu không đúng" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            _id: user._id.toString(),
            role: user.role,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            token,
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.login = login;
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const record = await Otp_1.default.findOne({ email, otp });
        if (!record) {
            res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn." });
            return;
        }
        // Nếu đúng, xóa OTP để không dùng lại
        await Otp_1.default.deleteOne({ _id: record._id });
        // Có thể gửi token hoặc redirect qua FE để đổi mật khẩu
        res.status(200).json({ message: "OTP hợp lệ. Cho phép đổi mật khẩu." });
    }
    catch (err) {
        console.error("Lỗi xác minh OTP:", err);
        res.status(500).json({ message: "Lỗi server khi xác minh OTP." });
    }
};
exports.verifyOtp = verifyOtp;
const logout = (req, res) => {
    // Xóa token phía client (nếu lưu ở cookie)
    res.clearCookie('token'); // nếu có lưu token ở cookie
    res.status(200).json({ message: "Đăng xuất thành công" });
};
exports.logout = logout;
