"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRecord = addRecord;
exports.getRecordCount = getRecordCount;
exports.getRecord = getRecord;
const ethers_1 = require("ethers");
const MedicalRecordsABI = require("../blockchain/artifacts/contracts/MedicalRecords.sol/MedicalRecords.json");
// ✅ check ENV trước
const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
if (!RPC_URL || !PRIVATE_KEY) {
    throw new Error("Missing environment variables");
}
const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
// ✅ signer
const signer = new ethers_1.ethers.Wallet(PRIVATE_KEY, provider);
// ✅ contract address
const CONTRACT_ADDRESS = "0xc6B58592A13a32f344DA58a40755F251a0ac605b";
// ✅ contract instance
const medicalRecordsContract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, MedicalRecordsABI.abi, signer);
// ================= API =================
async function addRecord(patientId, ipfsHash, dob, data) {
    const tx = await medicalRecordsContract.addRecord(patientId, ipfsHash, dob, data);
    await tx.wait();
    return tx.hash;
}
async function getRecordCount(patientId) {
    return await medicalRecordsContract.getRecordCount(patientId);
}
async function getRecord(patientId, index) {
    return await medicalRecordsContract.getRecord(patientId, index);
}
