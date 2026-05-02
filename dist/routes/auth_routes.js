"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user_controller");
const departments_cotroller_1 = require("../controllers/departments_cotroller");
const security_controller_1 = require("../controllers/security_controller");
const medicalRecordInfor_controller_1 = require("../controllers/medicalRecordInfor_controller");
const medicalRecordController_1 = require("../controllers/medicalRecordController");
const upload_1 = __importDefault(require("../middleware/upload"));
const predictController_1 = require("../controllers/predictController");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.put("/change-password", user_controller_1.changePassword);
router.post('/register-by-admin', auth_1.verifyToken, auth_1.isAdmin, auth_controller_1.registerByAdmin);
router.put("/api-changePassWord", auth_1.verifyToken, user_controller_1.changePassWord);
router.post("/verify-otp", auth_controller_1.verifyOtp);
// Routes of get Users
router.get("/api_accountList", auth_1.verifyToken, security_controller_1.getUser);
router.put("/api_changeUserRole/:id", auth_1.verifyToken, security_controller_1.changeUserRole);
router.put("/api_updateStatus/:id", auth_1.verifyToken, security_controller_1.toggleUserActive);
router.put("/api_updateUserInfor/:id", auth_1.verifyToken, user_controller_1.updateUserInfor);
router.get("/api_getUserInfor/:id", auth_1.verifyToken, user_controller_1.getUserInfor);
router.patch('/update_profile', auth_1.verifyToken, user_controller_1.updateProfile);
router.get('/get_profile', auth_1.verifyToken, user_controller_1.getProfile);
// routers of Departments
router.post('/api_addDepartment', auth_1.verifyToken, departments_cotroller_1.addDepartments);
router.get("/api_departmentList", auth_1.verifyToken, departments_cotroller_1.getDepartments);
router.put("/api_updatDepartment/:id", auth_1.verifyToken, departments_cotroller_1.updateDepartment);
router.delete("/api_deleteDepartment/:id", auth_1.verifyToken, departments_cotroller_1.deleteDepartment);
//AI router python
router.post("/api_predict", auth_1.verifyToken, predictController_1.predictDiabetes);
router.post("/ai/predictPPO", auth_1.verifyToken, predictController_1.predictResourcePPO);
// medical record infor
router.post("/api_addMedicalRecord", auth_1.verifyToken, medicalRecordInfor_controller_1.createMedicalRecord);
router.put("/api_updateMedicalRecord/:id", auth_1.verifyToken, medicalRecordInfor_controller_1.updateMedicalRecord);
router.get("/api_getMedicalRecord", auth_1.verifyToken, medicalRecordInfor_controller_1.getMedicalRecord);
// medical record with block chain 
router.post("/api/medicalrecord-blockchain", upload_1.default.array("attachments", 10), medicalRecordController_1.addMedicalRecord);
router.get("/api/medical-records/:id", auth_1.verifyToken, medicalRecordController_1.getMedicalRecordDetail);
router.get("/api/list-medical-records", auth_1.verifyToken, medicalRecordController_1.listMedicalRecords);
router.get("/api/medical-records-search", auth_1.verifyToken, medicalRecordController_1.searchMedicalRecords);
// router.get("/api/medical-records/:id/verify",verifyToken,verifyMedicalRecord);
exports.default = router;
