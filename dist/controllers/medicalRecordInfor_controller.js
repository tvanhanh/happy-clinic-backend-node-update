"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicalRecord = exports.getMedicalRecord = exports.createMedicalRecord = void 0;
const medicl_record_infor_1 = __importDefault(require("../models/medicl_record_infor"));
;
// Thêm mới bệnh án
const createMedicalRecord = async (req, res) => {
    try {
        const { patientName, email, examinationDate, examinationTime, doctorName, departmentName, gender, age, urea, creatinine, hba1c, cholesterol, triglycerides, hdl, ldl, vldl, bmi, status } = req.body;
        console.log("Dữ liệu nhận từ frontend:", req.body);
        const newRecord = new medicl_record_infor_1.default({
            patientName,
            email,
            examinationDate,
            examinationTime,
            doctorName,
            departmentName,
            gender,
            age,
            urea,
            creatinine,
            hba1c,
            cholesterol,
            triglycerides,
            hdl,
            ldl,
            vldl,
            bmi,
            status,
        });
        await newRecord.save();
        res.status(201).json({ message: "Thêm thành công", DiabetesRecord: newRecord });
    }
    catch (error) {
        console.error("Lỗi khi tạo bệnh án:", error);
        res.status(500).json({ message: 'Lỗi khi tạo bệnh án', error });
    }
};
exports.createMedicalRecord = createMedicalRecord;
const getMedicalRecord = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            res.status(401).json({ message: 'Người dùng chưa đăng nhập' });
            return;
        }
        const email = req.user.email;
        const medicalRecords = await medicl_record_infor_1.default.find({ email }); // 👈 lọc theo email người dùng
        res.status(200).json(medicalRecords);
    }
    catch (error) {
        console.error("Lỗi khi lấy dữ liệu bệnh án", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
exports.getMedicalRecord = getMedicalRecord;
// Cập nhật bệnh án theo ID
const updateMedicalRecord = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRecord = await medicl_record_infor_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRecord) {
            res.status(404).json({ message: 'Không tìm thấy bệnh án' });
            return;
        }
        res.status(200).json(updatedRecord);
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật bệnh án', error });
    }
};
exports.updateMedicalRecord = updateMedicalRecord;
