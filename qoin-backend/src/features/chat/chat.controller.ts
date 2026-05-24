import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middleware/verifyToken";
import { APIResponse } from "../../models/response";
import {
  getConversationService,
  getConversationListService,
  saveMessageService,
  markMessagesAsReadService,
  getUnreadCountService,
  getSenderInfoService,
} from "./chat.service";
import { uploadToSupabase } from "../../shared/uploadToSupabase";

/**
 * GET /api/chat/history/:receiverId
 * Ambil riwayat pesan antara user yang login dan receiver
 */
export const getChatHistory = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const { receiverId } = req.params;

    const messages = await getConversationService(user_id, receiverId);

    return res.status(200).json({
      status: "success",
      message: "Chat history retrieved successfully",
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/chat/conversations
 * Ambil daftar semua percakapan (inbox) user yang login,
 * disertai unreadCount per conversation
 */
export const getConversationList = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };

    const conversations = await getConversationListService(user_id);

    return res.status(200).json({
      status: "success",
      message: "Conversations retrieved successfully",
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/chat/messages
 * Kirim pesan baru — simpan ke DB, Supabase Realtime akan
 * otomatis broadcast ke semua subscriber tanpa Socket.IO
 */
export const sendMessage = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const { receiver_id, text } = req.body as {
      receiver_id: string;
      text: string;
    };

    if (!receiver_id || !text?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "receiver_id and text are required",
      });
    }

    const message = await saveMessageService(user_id, receiver_id, text.trim());

    return res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/chat/read/:senderId
 * Tandai semua pesan dari senderId ke user yang login sebagai sudah dibaca
 */
export const markMessagesAsRead = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const { senderId } = req.params;

    if (!senderId) {
      return res.status(400).json({
        status: "error",
        message: "senderId is required",
      });
    }

    const result = await markMessagesAsReadService(senderId, user_id);

    return res.status(200).json({
      status: "success",
      message: `Marked ${result.count} messages as read`,
      data: { count: result.count },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/chat/unread-count
 * Hitung total pesan belum dibaca untuk user yang login
 */
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };

    const count = await getUnreadCountService(user_id);

    return res.status(200).json({
      status: "success",
      message: "Unread count retrieved",
      data: { count },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/chat/sender-info/:userId
 * Ambil info pengirim (nama, avatar, merchantId) berdasarkan user_id mereka.
 * PUBLIC — tidak butuh auth, hanya data nama & foto profil merchant/user.
 */
export const getSenderInfo = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "userId is required",
      });
    }

    const info = await getSenderInfoService(userId);

    return res.status(200).json({
      status: "success",
      message: "Sender info retrieved",
      data: info,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/chat/upload
 * Unggah gambar ke Supabase Storage via Multer dan return URL publik
 */
export const uploadChatImage = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        status: "error",
        message: "No image file provided",
      });
    }

    const uploaded = await uploadToSupabase(file, "gallery");

    return res.status(200).json({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        url: uploaded.url,
      },
    });
  } catch (err) {
    console.error("[chat.upload] upload error:", err);
    next(err);
  }
};
