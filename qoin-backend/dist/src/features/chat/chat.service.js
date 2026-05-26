"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSenderInfoService = exports.getConversationListService = exports.getUnreadCountService = exports.markMessagesAsReadService = exports.getConversationService = exports.saveMessageService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
/**
 * Buat channel name yang deterministik berdasarkan pasangan user (order-independent)
 */
const getChatChannelName = (userA, userB) => {
    return `chat:${[userA, userB].sort().join("_")}`;
};
/**
 * Broadcast pesan ke Supabase Realtime channel via REST API.
 * Cara ini tidak memerlukan channel subscription di server — cukup HTTP POST ke
 * Supabase Realtime broadcast endpoint dengan service_role key.
 */
const broadcastMessage = async (channelName, event, payload) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey)
        return;
    try {
        const res = await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: serviceRoleKey,
                Authorization: `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        topic: channelName,
                        event,
                        payload,
                    },
                ],
            }),
        });
        if (!res.ok) {
            const body = await res.text();
            console.error("[chat.broadcast] Supabase broadcast error:", res.status, body);
        }
    }
    catch (err) {
        console.error("[chat.broadcast] fetch error:", err);
    }
};
/**
 * Menyimpan pesan baru ke database, lalu broadcast ke Supabase Realtime channel.
 * Frontend menerima pesan via Broadcast — tidak butuh Replication/postgres_changes.
 */
const saveMessageService = async (sender_id, receiver_id, text) => {
    // 1. Simpan ke DB via Prisma
    const message = await prisma_1.default.messages.create({
        data: { sender_id, receiver_id, text },
    });
    // 2. Broadcast ke Supabase Realtime via REST API (fire-and-forget, tidak fatal)
    const channelName = getChatChannelName(sender_id, receiver_id);
    broadcastMessage(channelName, "new_message", {
        id: message.id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        text: message.text,
        is_read: message.is_read,
        created_at: message.created_at,
    });
    return message;
};
exports.saveMessageService = saveMessageService;
/**
 * Mengambil riwayat percakapan antara dua user (berurutan waktu)
 */
const getConversationService = async (userA_id, userB_id) => {
    return await prisma_1.default.messages.findMany({
        where: {
            OR: [
                { sender_id: userA_id, receiver_id: userB_id },
                { sender_id: userB_id, receiver_id: userA_id },
            ],
        },
        orderBy: { created_at: "asc" },
    });
};
exports.getConversationService = getConversationService;
/**
 * Menandai semua pesan dari senderId ke receiverId sebagai sudah dibaca (is_read = true)
 */
const markMessagesAsReadService = async (senderId, receiverId) => {
    return await prisma_1.default.messages.updateMany({
        where: {
            sender_id: senderId,
            receiver_id: receiverId,
            is_read: false,
        },
        data: {
            is_read: true,
        },
    });
};
exports.markMessagesAsReadService = markMessagesAsReadService;
/**
 * Menghitung total pesan yang belum dibaca untuk seorang user
 */
const getUnreadCountService = async (userId) => {
    return await prisma_1.default.messages.count({
        where: {
            receiver_id: userId,
            is_read: false,
        },
    });
};
exports.getUnreadCountService = getUnreadCountService;
/**
 * Mengambil daftar conversation (unique lawan bicara) untuk seorang user,
 * disertai unreadCount per conversation
 */
const getConversationListService = async (userId) => {
    // Ambil semua messages yang melibatkan userId
    const messages = await prisma_1.default.messages.findMany({
        where: {
            OR: [{ sender_id: userId }, { receiver_id: userId }],
        },
        orderBy: { created_at: "desc" },
    });
    // Kumpulkan unique partner IDs
    const partnerMap = new Map();
    for (const msg of messages) {
        const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (!partnerMap.has(partnerId)) {
            partnerMap.set(partnerId, { partnerId, lastMessage: msg });
        }
    }
    // Fetch user/merchant info + unread count per conversation
    const partners = await Promise.all(Array.from(partnerMap.values()).map(async ({ partnerId, lastMessage }) => {
        const user = await prisma_1.default.users.findUnique({
            where: { id: partnerId },
            select: { id: true, email: true },
        });
        // Coba ambil merchant info
        const merchant = await prisma_1.default.merchants.findFirst({
            where: { user_id: partnerId },
            select: { id: true, name: true, profile_photo: true },
        });
        // Hitung pesan belum dibaca dari partnerId ke userId
        const unreadCount = await prisma_1.default.messages.count({
            where: {
                sender_id: partnerId,
                receiver_id: userId,
                is_read: false,
            },
        });
        return {
            partnerId,
            partnerEmail: user?.email,
            partnerName: merchant?.name || user?.email,
            partnerAvatar: merchant?.profile_photo || null,
            merchantId: merchant?.id || null,
            unreadCount,
            lastMessage: {
                text: lastMessage.text,
                created_at: lastMessage.created_at,
                isMine: lastMessage.sender_id === userId,
                is_read: lastMessage.is_read,
            },
        };
    }));
    return partners;
};
exports.getConversationListService = getConversationListService;
/**
 * Mengambil info pengirim berdasarkan user_id mereka.
 * Dipakai oleh hook notifikasi global untuk menampilkan nama + avatar pengirim.
 * Tidak memerlukan auth — hanya data publik (nama & foto profil merchant).
 */
const getSenderInfoService = async (userId) => {
    // Coba ambil info merchant milik userId tersebut
    const merchant = await prisma_1.default.merchants.findFirst({
        where: { user_id: userId },
        select: { id: true, name: true, profile_photo: true },
    });
    if (merchant) {
        return {
            name: merchant.name,
            merchantId: merchant.id,
            avatar: merchant.profile_photo || null,
        };
    }
    // Fallback: ambil email user jika bukan merchant
    const user = await prisma_1.default.users.findUnique({
        where: { id: userId },
        select: { email: true },
    });
    return {
        name: user?.email ?? "Seseorang",
        merchantId: null,
        avatar: null,
    };
};
exports.getSenderInfoService = getSenderInfoService;
