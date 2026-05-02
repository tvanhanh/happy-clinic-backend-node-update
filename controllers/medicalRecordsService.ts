import { ethers, } from 'ethers';
const MedicalRecordsABI = require("../blockchain/artifacts/contracts/MedicalRecords.sol/MedicalRecords.json");
// ✅ check ENV trước
const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
  throw new Error("Missing environment variables");
}
const provider = new ethers.providers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL as string
)
// ✅ signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// ✅ contract address
const CONTRACT_ADDRESS = "0xc6B58592A13a32f344DA58a40755F251a0ac605b";

// ✅ contract instance
const medicalRecordsContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  MedicalRecordsABI.abi,
  signer
);

// ================= API =================

export async function addRecord(
  patientId: string,
  ipfsHash: string,
  dob: string,
  data: string
) {
  const tx = await medicalRecordsContract.addRecord(
    patientId,
    ipfsHash,
    dob,
    data
  );
  await tx.wait();
  return tx.hash;
}

export async function getRecordCount(patientId: string) {
  return await medicalRecordsContract.getRecordCount(patientId);
}

export async function getRecord(patientId: string, index: number) {
  return await medicalRecordsContract.getRecord(patientId, index);
}