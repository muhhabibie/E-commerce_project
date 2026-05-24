import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getChatHistory,
  getConversationList,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  getSenderInfo,
  uploadChatImage,
} from "./chat.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST: kirim pesan baru (simpan ke DB → Supabase Realtime broadcast otomatis)
router.post("/messages", verifyToken, sendMessage);

// GET: riwayat pesan dengan user/merchant tertentu
router.get("/history/:receiverId", verifyToken, getChatHistory);

// GET: daftar semua percakapan (inbox) disertai unreadCount
router.get("/conversations", verifyToken, getConversationList);

// PATCH: tandai semua pesan dari senderId sebagai sudah dibaca
router.patch("/read/:senderId", verifyToken, markMessagesAsRead);

// GET: total pesan belum dibaca untuk user yang login
router.get("/unread-count", verifyToken, getUnreadCount);

// GET: info pengirim (nama, avatar, merchantId) berdasarkan userId — PUBLIC
router.get("/sender-info/:userId", getSenderInfo);

// POST: upload gambar chat
router.post("/upload", verifyToken, upload.single("image"), uploadChatImage);

export default router;
