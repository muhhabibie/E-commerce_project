"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const verifyToken_1 = require("../../middleware/verifyToken");
const chat_controller_1 = require("./chat.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// POST: kirim pesan baru (simpan ke DB → Supabase Realtime broadcast otomatis)
router.post("/messages", verifyToken_1.verifyToken, chat_controller_1.sendMessage);
// GET: riwayat pesan dengan user/merchant tertentu
router.get("/history/:receiverId", verifyToken_1.verifyToken, chat_controller_1.getChatHistory);
// GET: daftar semua percakapan (inbox) disertai unreadCount
router.get("/conversations", verifyToken_1.verifyToken, chat_controller_1.getConversationList);
// PATCH: tandai semua pesan dari senderId sebagai sudah dibaca
router.patch("/read/:senderId", verifyToken_1.verifyToken, chat_controller_1.markMessagesAsRead);
// GET: total pesan belum dibaca untuk user yang login
router.get("/unread-count", verifyToken_1.verifyToken, chat_controller_1.getUnreadCount);
// GET: info pengirim (nama, avatar, merchantId) berdasarkan userId — PUBLIC
router.get("/sender-info/:userId", chat_controller_1.getSenderInfo);
// POST: upload gambar chat
router.post("/upload", verifyToken_1.verifyToken, upload.single("image"), chat_controller_1.uploadChatImage);
exports.default = router;
