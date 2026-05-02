"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointment = exports.updateStatus = exports.getMyAppointments = exports.getAllAppointments = exports.getDoctorAppointments = exports.addAppointment = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * ================= CREATE APPOINTMENT =================
 * patient lấy từ JWT
 * doctor lấy từ body
 */
const addAppointment = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { doctor, patientName, phone, gender, address, medicalHistory, allergies, reason, date, time, imageUrl, } = req.body;
        // ================= VALIDATION =================
        if (!doctor || !reason || !date || !time) {
            res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu bắt buộc",
            });
            return;
        }
        // ================= CREATE =================
        const appointment = await Appointment_1.default.create({
            patient: patientId,
            doctor,
            patientName,
            phone,
            gender,
            address,
            medicalHistory,
            allergies,
            reason,
            date,
            time,
            imageUrl: imageUrl || "",
            status: "pending",
        });
        res.status(201).json({
            success: true,
            message: "Tạo lịch hẹn thành công",
            data: appointment,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi tạo lịch hẹn",
            error: err,
        });
    }
};
exports.addAppointment = addAppointment;
/**
 * ================= GET DOCTOR APPOINTMENTS =================
 */
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = new mongoose_1.default.Types.ObjectId(req.user.id);
        console.log("req.user.id =", req.user.id);
        console.log("type =", typeof req.user.id);
        const appointments = await Appointment_1.default.find({
            doctor: doctorId,
        })
            .populate("doctor", "name profile")
            .populate("patient", "name profile")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: appointments,
        });
        console.log("APPOINTMENTS:", JSON.stringify(appointments, null, 2));
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi lấy lịch bệnh nhân",
            error: err,
        });
    }
};
exports.getDoctorAppointments = getDoctorAppointments;
/**
 * ================= GET ALL (ADMIN) =================
 */
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment_1.default.find()
            .populate("doctor", "name profile")
            .populate("patient", "name profile")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: appointments,
        });
        console.log("APPOINTMENTS:", JSON.stringify(appointments, null, 2));
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi lấy lịch bệnh nhân",
            error: err,
        });
    }
};
exports.getAllAppointments = getAllAppointments;
const getMyAppointments = async (req, res) => {
    try {
        const patientId = new mongoose_1.default.Types.ObjectId(req.user.id);
        console.log("req.user.id =", req.user.id);
        console.log("type =", typeof req.user.id);
        const appointments = await Appointment_1.default.find({
            patient: patientId,
        })
            .populate("doctor", "name profile")
            .populate("patient", "name profile")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: appointments,
        });
        console.log("APPOINTMENTS:", JSON.stringify(appointments, null, 2));
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi lấy lịch bệnh nhân",
            error: err,
        });
    }
};
exports.getMyAppointments = getMyAppointments;
/**
 * ================= UPDATE STATUS =================
 */
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await Appointment_1.default.findByIdAndUpdate(id, { status }, { new: true });
        res.json({
            success: true,
            message: "Update status success",
            data: updated,
        });
        console.log("UPDATE STATUS HIT");
        console.log(req.params);
        console.log(req.body);
    }
    catch (err) {
        res.status(500).json({ message: "Error" });
    }
};
exports.updateStatus = updateStatus;
/**
 * ================= DELETE APPOINTMENT =================
 */
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment_1.default.findByIdAndUpdate(req.params.id, { status: "cancelled" }, { new: true });
        res.json({
            success: true,
            data: appointment,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Huỷ lịch thất bại",
        });
    }
};
exports.cancelAppointment = cancelAppointment;
