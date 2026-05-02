"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMedicalRecords = exports.getMedicalRecordDetail = exports.listMedicalRecords = exports.addMedicalRecord = exports.uploadPDFToIPFS = void 0;
const medicalRecord_1 = __importDefault(require("../models/medicalRecord"));
const pdf_service_1 = require("../services/pdf.service");
const hash_service_1 = require("../services/hash.service");
const blockchain_service_1 = require("../services/blockchain.service");
const fs_1 = __importDefault(require("fs"));
const sdk_1 = __importDefault(require("@pinata/sdk"));
const db_1 = require("../config/db");
const blockchain_service_2 = require("../services/blockchain.service");
// import { wallet } from "../blockchain/provider";
const pinata = new sdk_1.default({ pinataJWTKey: process.env.PINATA_JWT });
const uploadPDFToIPFS = async (pdfPath) => {
    const fileStream = fs_1.default.createReadStream(pdfPath);
    const options = {
        pinataMetadata: {
            name: "medical-record.pdf",
        },
    };
    const result = await pinata.pinFileToIPFS(fileStream, options);
    console.log("Uploaded to IPFS:", result);
    return result.IpfsHash;
};
exports.uploadPDFToIPFS = uploadPDFToIPFS;
const addMedicalRecord = async (req, res) => {
    try {
        const gridFSBucket = (0, db_1.getGridFSBucket)();
        const files = req.files;
        console.log("req.files:", req.files);
        const { patientId, doctorId, patientName, visitDate, symptoms, diagnosis, treatment, } = req.body ?? {};
        console.log("Dữ liệu nhận từ frontend:", req.body);
        console.log("Số file:", files?.length);
        if (!patientId || !doctorId) {
            res.status(400).json({ error: "Missing patientId or doctorId" });
            return;
        }
        // ------------------------------
        // 1. UPLOAD FILES TO GRIDFS
        // ------------------------------
        const attachmentsId = [];
        for (const file of files || []) {
            const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
                contentType: file.mimetype,
                metadata: {
                    patientId,
                    doctorId,
                },
            });
            uploadStream.end(file.buffer);
            await new Promise((resolve, reject) => {
                uploadStream.on("finish", () => {
                    attachmentsId.push(uploadStream.id.toString());
                    resolve(true);
                });
                uploadStream.on("error", reject);
            });
        }
        // ------------------------------
        // 2. CREATE DATABASE RECORD
        // ------------------------------
        const record = await medicalRecord_1.default.create({
            patientId,
            doctorId,
            patientName,
            visitDate: visitDate ? new Date(visitDate) : new Date(),
            symptoms,
            diagnosis,
            treatment,
            attachments: attachmentsId,
        });
        // ------------------------------
        // 3. GENERATE PDF
        // ------------------------------
        const pdfPath = await (0, pdf_service_1.generateMedicalPDF)(record.toObject());
        // ------------------------------
        // 4. UPLOAD PDF TO IPFS
        // ------------------------------
        const ipfsCID = await (0, exports.uploadPDFToIPFS)(pdfPath);
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsCID}`;
        // ------------------------------
        // 5. HASH + BLOCKCHAIN
        // ------------------------------
        const pdfHash = await (0, hash_service_1.calculateHash)(pdfPath);
        const { txHash, network, blockNumber, blockchainIndex } = await (0, blockchain_service_1.uploadHashToBlockchain)(patientId, ipfsCID, pdfHash);
        console.log("🔥 Blockchain result:", {
            txHash,
            network,
            blockNumber,
        });
        // ------------------------------
        // 6. UPDATE RECORD
        // ------------------------------
        record.pdfUrl = ipfsUrl;
        record.pdfHash = pdfHash;
        record.ipfsHash = ipfsCID;
        record.blockchainTx = txHash;
        record.blockchainNetwork = network;
        record.blockNumber = blockNumber;
        record.blockchainIndex = blockchainIndex;
        await record.save();
        try {
            fs_1.default.unlinkSync(pdfPath);
        }
        catch { }
        res.status(201).json({
            ok: true,
            message: "Medical record created successfully",
            record,
        });
    }
    catch (err) {
        console.error("Error creating medical record:", err);
        res.status(500).json({
            error: err.message || "Internal server error",
        });
    }
};
exports.addMedicalRecord = addMedicalRecord;
const listMedicalRecords = async (req, res) => {
    try {
        const records = await medicalRecord_1.default.find()
            .sort({ createdAt: -1 })
            .limit(100);
        res.json({ records });
    }
    catch (err) {
        console.error("Error fetching medical records:", err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};
exports.listMedicalRecords = listMedicalRecords;
const getMedicalRecordDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await medicalRecord_1.default.findById(id);
        if (!record) {
            res.status(404).json({
                message: "Không tìm thấy bệnh án",
            });
        }
        res.json({
            record,
        });
    }
    catch (err) {
        console.error("Error fetching medical record detail:", err);
        res.status(500).json({
            error: err.message || "Internal server error",
        });
    }
};
exports.getMedicalRecordDetail = getMedicalRecordDetail;
// export const searchMedicalRecords = async (req: Request, res: Response) => {
//   const { patientId } = req.query;
//   console.log(" patientId nhận được:", patientId);
//   if (!patientId) {
//      res.status(400).json({ message: "patientId is required" });
//   }
//   const records = await MedicalRecord.find({ patientId }).sort({
//     createdAt: -1,
//   });
//   res.json({ records });
// };
const searchMedicalRecords = async (req, res) => {
    const { patientId } = req.query;
    console.log(" patientId nhận được:", patientId);
    const records = await medicalRecord_1.default.find({ patientId });
    const result = await Promise.all(records.map(async (r) => {
        let isTampered = false;
        console.log("blockchainIndex:", r.blockchainIndex);
        if (typeof r.blockchainIndex === "number") {
            const onChain = await (0, blockchain_service_2.getRecordFromBlockchain)(r.patientId, r.blockchainIndex);
            console.log("⛓️ ON-CHAIN RECORD:", onChain);
            console.log("patientId:", r.patientId);
            console.log("blockchainIndex:", r.blockchainIndex);
            if (onChain && onChain.data !== r.pdfHash) {
                isTampered = true;
            }
        }
        return {
            ...r.toObject(),
            isTampered, // 👈 frontend chỉ cần cái này
        };
    }));
    res.json({ records: result });
};
exports.searchMedicalRecords = searchMedicalRecords;
