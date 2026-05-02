"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictResourcePPO = exports.predictDiabetes = void 0;
const axios_1 = __importDefault(require("axios"));
const ppo_service_1 = require("../services/ppo.service");
const predictDiabetes = async (req, res) => {
    try {
        const userInput = req.body;
        const flaskRes = await axios_1.default.post('http://127.0.0.1:5000/api/predict', userInput);
        res.status(200).json(flaskRes.data);
        return;
    }
    catch (err) {
        console.error("Flask error:", err?.response?.data || err.message);
        res.status(500).json({ error: 'AI prediction failed', details: err?.response?.data || err.message });
        return;
    }
};
exports.predictDiabetes = predictDiabetes;
const predictResourcePPO = async (req, res) => {
    const aiResult = await (0, ppo_service_1.getAIAction)(req.body);
    res.json({
        success: true,
        decision: aiResult.action
    });
};
exports.predictResourcePPO = predictResourcePPO;
