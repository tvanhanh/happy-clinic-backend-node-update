"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedDoctors = exports.getDoctorById = exports.updateDoctorProfile = exports.getDoctors = exports.addDoctors = void 0;
const Doctor_1 = __importDefault(require("../models/Doctor"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
// Thêm phòng ban
const addDoctors = async (req, res) => {
    try {
        const { doctorName, email, phone, address, departmentName, specialization, avatar } = req.body;
        console.log("Dữ liệu nhận từ frontend:", req.body);
        const newDoctors = new Doctor_1.default({
            doctorName,
            email,
            phone,
            address,
            departmentName,
            specialization,
            avatar,
        });
        await newDoctors.save();
        res.status(201).json({ message: "Thêm thành công", dotors: newDoctors });
    }
    catch (error) {
        console.error("Lỗi khi thêm bác sĩ", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
exports.addDoctors = addDoctors;
const getDoctors = async (req, res) => {
    try {
        const doctors = await User_1.default.find({ role: "doctor" }).select("-password");
        res.status(200).json({
            message: "Get doctors success",
            data: doctors,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getDoctors = getDoctors;
const updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const doctor = await User_1.default.findById(doctorId);
        if (!doctor) {
            res.status(404).json({ message: "Doctor not found" });
            return;
        }
        doctor.profile = {
            ...(doctor.profile || {}),
            ...req.body,
        };
        await doctor.save();
        res.status(200).json({
            message: "Update success",
            doctor,
        });
        return;
    }
    catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({
            message: "Server error",
            error: String(error),
        });
        return;
    }
};
exports.updateDoctorProfile = updateDoctorProfile;
const getDoctorById = async (req, res) => {
    try {
        const rawId = req.params.id;
        // ✅ ép về string
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        // ✅ validate ObjectId
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "ID không hợp lệ" });
            return;
        }
        const doctor = await User_1.default.findOne({
            _id: id,
            role: "doctor",
        });
        if (!doctor) {
            res.status(404).json({ message: "Không tìm thấy bác sĩ" });
            return;
        }
        res.status(200).json({
            message: "Lấy thông tin bác sĩ thành công",
            data: doctor,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getDoctorById = getDoctorById;
const getFeaturedDoctors = async (req, res) => {
    try {
        const doctors = await User_1.default.find({
            role: "doctor",
            isDeleted: false,
        })
            .sort({ "profile.experience": -1 }) // 🔥 nhiều năm nhất lên đầu
            .limit(4)
            .lean();
        const result = doctors.map((d) => ({
            _id: d._id,
            name: d.name,
            avatar: d.profile?.avatar,
            specialty: d.profile?.specialty,
            experience: d.profile?.experience,
            price: d.profile?.price, // ⚠️ bạn đang đặt tên sai
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getFeaturedDoctors = getFeaturedDoctors;
