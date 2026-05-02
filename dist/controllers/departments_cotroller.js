"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.getDepartments = exports.addDepartments = void 0;
const Departments_1 = __importDefault(require("../models/Departments"));
const mongoose_1 = __importDefault(require("mongoose"));
// Thêm phòng ban
const addDepartments = async (req, res) => {
    try {
        const { departmentName, description } = req.body;
        console.log("Dữ liệu nhận từ frontend:", req.body);
        const newDepartment = new Departments_1.default({
            departmentName,
            description,
        });
        await newDepartment.save();
        res.status(201).json({ message: "Thêm thành công", department: newDepartment });
    }
    catch (error) {
        console.error("Lỗi khi tạo phòng ban", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
exports.addDepartments = addDepartments;
// Lấy danh sách tất cả phòng ban
const getDepartments = async (req, res) => {
    try {
        const departments = await Departments_1.default.find();
        res.status(200).json(departments);
    }
    catch (error) {
        console.error("Lỗi khi lấy phòng ban", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
exports.getDepartments = getDepartments;
/// Cập nhật phòng ban
const updateDepartment = async (req, res) => {
    try {
        // ✅ ép id về string
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const { departmentName, description } = req.body;
        // ✅ validate ObjectId
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "ID không hợp lệ" });
            return;
        }
        const updated = await Departments_1.default.findByIdAndUpdate(id, { departmentName, description }, { new: true });
        if (!updated) {
            res.status(404).json({ message: "Không tìm thấy phòng ban" });
            return;
        }
        res.status(200).json({
            message: "Cập nhật thành công",
            department: updated,
        });
    }
    catch (error) {
        console.error("Lỗi khi cập nhật phòng ban", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
exports.updateDepartment = updateDepartment;
// Xoá phòng ban
const deleteDepartment = async (req, res) => {
    try {
        // ✅ ép id về string
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        // ✅ validate ObjectId
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "ID không hợp lệ" });
            return;
        }
        const deleted = await Departments_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: "Không tìm thấy phòng ban" });
            return;
        }
        res.status(200).json({ message: "Xoá thành công" });
    }
    catch (error) {
        console.error("Lỗi khi xoá phòng ban", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
exports.deleteDepartment = deleteDepartment;
