"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToSupabase = void 0;
const supabaseClient_1 = __importDefault(require("../database/supabaseClient"));
const crypto_1 = require("crypto");
const uploadToSupabase = async (file, prefix) => {
    const bucket = "merchant-media";
    const ext = file.originalname.split(".").pop() || "bin";
    const path = `${prefix}/${(0, crypto_1.randomUUID)()}.${ext}`;
    const { error } = await supabaseClient_1.default.storage
        .from(bucket)
        .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
    });
    if (error)
        throw error;
    const { data } = supabaseClient_1.default.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl, path };
};
exports.uploadToSupabase = uploadToSupabase;
