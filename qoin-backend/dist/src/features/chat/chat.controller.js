"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadChatImage = exports.getSenderInfo = exports.getUnreadCount = exports.markMessagesAsRead = exports.sendMessage = exports.getConversationList = exports.getChatHistory = void 0;
const chat_service_1 = require("./chat.service");
const uploadToSupabase_1 = require("../../shared/uploadToSupabase");
/**
 * GET /api/chat/history/:receiverId
 * Ambil riwayat pesan antara user yang login dan receiver
 */
const getChatHistory = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { receiverId } = req.params;
        const messages = await (0, chat_service_1.getConversationService)(user_id, receiverId);
        return res.status(200).json({
            status: "success",
            message: "Chat history retrieved successfully",
            data: messages,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getChatHistory = getChatHistory;
/**
 * GET /api/chat/conversations
 * Ambil daftar semua percakapan (inbox) user yang login,
 * disertai unreadCount per conversation
 */
const getConversationList = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const conversations = await (0, chat_service_1.getConversationListService)(user_id);
        return res.status(200).json({
            status: "success",
            message: "Conversations retrieved successfully",
            data: conversations,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getConversationList = getConversationList;
/**
 * POST /api/chat/messages
 * Kirim pesan baru — simpan ke DB, Supabase Realtime akan
 * otomatis broadcast ke semua subscriber tanpa Socket.IO
 */
const sendMessage = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { receiver_id, text } = req.body;
        if (!receiver_id || !text?.trim()) {
            return res.status(400).json({
                status: "error",
                message: "receiver_id and text are required",
            });
        }
        const message = await (0, chat_service_1.saveMessageService)(user_id, receiver_id, text.trim());
        return res.status(201).json({
            status: "success",
            message: "Message sent successfully",
            data: message,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.sendMessage = sendMessage;
/**
 * PATCH /api/chat/read/:senderId
 * Tandai semua pesan dari senderId ke user yang login sebagai sudah dibaca
 */
const markMessagesAsRead = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { senderId } = req.params;
        if (!senderId) {
            return res.status(400).json({
                status: "error",
                message: "senderId is required",
            });
        }
        const result = await (0, chat_service_1.markMessagesAsReadService)(senderId, user_id);
        return res.status(200).json({
            status: "success",
            message: `Marked ${result.count} messages as read`,
            data: { count: result.count },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.markMessagesAsRead = markMessagesAsRead;
/**
 * GET /api/chat/unread-count
 * Hitung total pesan belum dibaca untuk user yang login
 */
const getUnreadCount = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const count = await (0, chat_service_1.getUnreadCountService)(user_id);
        return res.status(200).json({
            status: "success",
            message: "Unread count retrieved",
            data: { count },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getUnreadCount = getUnreadCount;
/**
 * GET /api/chat/sender-info/:userId
 * Ambil info pengirim (nama, avatar, merchantId) berdasarkan user_id mereka.
 * PUBLIC — tidak butuh auth, hanya data nama & foto profil merchant/user.
 */
const getSenderInfo = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "userId is required",
            });
        }
        const info = await (0, chat_service_1.getSenderInfoService)(userId);
        return res.status(200).json({
            status: "success",
            message: "Sender info retrieved",
            data: info,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getSenderInfo = getSenderInfo;
/**
 * POST /api/chat/upload
 * Unggah gambar ke Supabase Storage via Multer dan return URL publik
 */
const uploadChatImage = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                status: "error",
                message: "No image file provided",
            });
        }
        const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(file, "gallery");
        return res.status(200).json({
            status: "success",
            message: "Image uploaded successfully",
            data: {
                url: uploaded.url,
            },
        });
    }
    catch (err) {
        console.error("[chat.upload] upload error:", err);
        next(err);
    }
};
exports.uploadChatImage = uploadChatImage;
