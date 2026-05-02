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
const DiabetesRecordSchema = new mongoose_1.Schema({
    patientName: { type: String, required: true },
    email: { type: String, required: true },
    examinationDate: { type: String, required: true },
    examinationTime: { type: String, require: true },
    doctorName: { type: String },
    departmentName: { type: String },
    gender: { type: String },
    age: { type: String },
    urea: { type: String },
    creatinine: { type: String },
    hba1c: { type: String },
    cholesterol: { type: String },
    triglycerides: { type: String },
    hdl: { type: String },
    ldl: { type: String },
    vldl: { type: String },
    bmi: { type: String },
    status: { type: String, required: true }
});
const DiabetesRecord = mongoose_1.default.model('DiabetesRecord', DiabetesRecordSchema);
exports.default = DiabetesRecord;
