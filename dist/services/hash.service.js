"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHash = calculateHash;
// services/hash.service.ts
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * calculateHash(path): returns '0x' + hex digest
 */
async function calculateHash(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const hash = crypto_1.default.createHash("sha256");
            const stream = fs_1.default.createReadStream(filePath);
            stream.on("data", (chunk) => hash.update(chunk));
            stream.on("end", () => resolve("0x" + hash.digest("hex")));
            stream.on("error", (err) => reject(err));
        }
        catch (err) {
            reject(err);
        }
    });
}
