"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicalRecordSchema = new mongoose_1.default.Schema({
    patientId: {
        type: String,
        required: true,
    },
    doctorId: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    visitDate: {
        type: Date,
        required: true,
    },
    symptoms: {
        type: String,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    treatment: {
        type: String,
        required: true,
    },
    attachments: [
        {
            type: String, // URL ảnh/X-ray/PDF upload lên storage
        },
    ],
    pdfUrl: {
        type: String, // PDF tự generate sau khi lưu
    },
    // Hash của file PDF để lưu lên blockchain
    pdfHash: {
        type: String,
    },
    ipfsHash: {
        type: String,
    },
    blockchainTx: {
        type: String,
        default: null,
    },
    blockchainNetwork: {
        type: String,
    },
    blockNumber: {
        type: Number,
    },
    blockchainIndex: {
        type: Number,
        required: false,
    },
    // Lịch sử truy cập (ai xem, lúc nào)
    accessLogs: [
        {
            viewerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            role: String, // bác sĩ / nhân viên / bệnh nhân
            time: Date,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("MedicalRecord", MedicalRecordSchema);
