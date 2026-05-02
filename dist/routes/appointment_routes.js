"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appointment_controller_1 = require("./../controllers/appointment_controller");
const express_1 = __importDefault(require("express"));
const appointment_controller_2 = require("../controllers/appointment_controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/add", auth_1.verifyToken, appointment_controller_2.addAppointment);
// GET ALL
router.get("/", auth_1.verifyToken, appointment_controller_1.getAllAppointments);
// GET BY DOCTOR
router.get("/doctor", auth_1.verifyToken, appointment_controller_2.getDoctorAppointments);
// GET BY PATIENT
router.get("/patient", auth_1.verifyToken, appointment_controller_2.getMyAppointments);
// UPDATE STATUS
router.patch("/:id/:status", auth_1.verifyToken, appointment_controller_2.updateStatus);
// DELETE
router.patch("/:id", auth_1.verifyToken, appointment_controller_2.cancelAppointment);
exports.default = router;
