"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageBufferFromGridFS = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const getImageBufferFromGridFS = async (fileId) => {
    const bucket = (0, db_1.getGridFSBucket)();
    return new Promise((resolve, reject) => {
        const chunks = [];
        bucket
            .openDownloadStream(new mongodb_1.ObjectId(fileId))
            .on("data", (chunk) => chunks.push(chunk))
            .on("end", () => resolve(Buffer.concat(chunks)))
            .on("error", reject);
    });
};
exports.getImageBufferFromGridFS = getImageBufferFromGridFS;
