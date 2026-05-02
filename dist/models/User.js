"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["patient", "admin", "staff", "doctor"],
        default: "patient",
    },
    status: {
        type: String,
        enum: ["activity", "inactive"],
        default: "activity",
    },
    specialization: String,
    profile: {
        phone: String,
        gender: String,
        address: String,
        avatar: { type: String, default: "" },
        healthInsurance: String,
        medicalHistory: String,
        allergies: String,
        chronicDiseases: String,
        skinType: String,
        skinCondition: String,
        skincareRoutine: String,
        specialty: String,
        experience: String,
        degree: String,
        description: String,
        workShift: String,
        price: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
