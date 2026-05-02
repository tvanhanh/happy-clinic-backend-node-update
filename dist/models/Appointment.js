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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// ================= SCHEMA =================
const appointmentSchema = new mongoose_1.Schema({
    // ===== RELATION =====
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // ===== PATIENT INFO SNAPSHOT =====
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String },
    address: { type: String },
    medicalHistory: { type: String },
    allergies: { type: String },
    // ===== APPOINTMENT INFO =====
    reason: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    // ===== IMAGE =====
    imageUrl: { type: String }, // ảnh bệnh (Cloudinary)
    // ===== STATUS =====
    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "in_progress", // 🔥 thêm cái này
            "cancelled",
            "completed"
        ],
        default: "pending",
    }
}, {
    timestamps: true, // createdAt + updatedAt
});
// ================= MODEL =================
const Appointment = mongoose_1.default.model("Appointment", appointmentSchema);
exports.default = Appointment;
