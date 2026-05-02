"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Định nghĩa schema Doctor
const doctorSchema = new mongoose_1.default.Schema({
    doctorName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    departmentName: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Department' },
    specialization: { type: String },
    avatar: { type: String },
});
const Doctor = mongoose_1.default.model('Doctor', doctorSchema);
exports.default = Doctor;
