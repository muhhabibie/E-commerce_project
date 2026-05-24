import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { saveMessageService } from "../features/chat/chat.service";

// Map untuk menyimpan: userId -> socketId (untuk private messaging)
const onlineUsers = new Map<string, string>();

/**
 * Inisialisasi Socket.IO di atas HTTP server
 * dan meng-handle semua event chat secara real-time
 */
export const initSocketIO = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://qoin-frontend.vercel.app",
        "https://qoin-frontend-main.vercel.app",
        "https://qoin-in-main.vercel.app",
      ],
      credentials: true,
    },
  });

  // ─── Middleware: Autentikasi via JWT token yang dikirim di handshake ───
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;

    if (!token) {
      return next(new Error("Authentication error: no token"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as jwt.JwtPayload;

      // Simpan user_id di socket agar mudah diakses dalam event handler
      (socket as any).user_id = decoded.user_id;
      next();
    } catch {
      return next(new Error("Authentication error: invalid token"));
    }
  });

  // ─── Connection Handler ───────────────────────────────────────────────
  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).user_id as string;
    console.log(`[Socket.IO] User connected: ${userId} (socket: ${socket.id})`);

    // Daftarkan user sebagai online
    onlineUsers.set(userId, socket.id);

    // Join ke room pribadi user (agar bisa di-target langsung)
    socket.join(`user:${userId}`);

    // ─── Event: Kirim pesan ─────────────────────────────────────────────
    socket.on(
      "send_message",
      async (payload: { receiver_id: string; text: string }) => {
        const { receiver_id, text } = payload;

        if (!receiver_id || !text?.trim()) return;

        try {
          // 1. Simpan pesan ke database (persistence)
          const savedMessage = await saveMessageService(
            userId,
            receiver_id,
            text.trim()
          );

          // 2. Bentuk data pesan yang akan dikirim ke client
          const messageData = {
            id: savedMessage.id,
            sender_id: userId,
            receiver_id,
            text: savedMessage.text,
            created_at: savedMessage.created_at,
          };

          // 3. Kirim ke pengirim (konfirmasi terkirim)
          socket.emit("message_received", messageData);

          // 4. Kirim ke penerima secara real-time (jika online)
          io.to(`user:${receiver_id}`).emit("message_received", messageData);

          console.log(
            `[Socket.IO] Message from ${userId} to ${receiver_id}: "${text}"`
          );
        } catch (err) {
          console.error("[Socket.IO] Error saving message:", err);
          socket.emit("message_error", { error: "Failed to send message" });
        }
      }
    );

    // ─── Event: Menandai user sedang mengetik ───────────────────────────
    socket.on("typing", (payload: { receiver_id: string }) => {
      io.to(`user:${payload.receiver_id}`).emit("user_typing", {
        sender_id: userId,
      });
    });

    // ─── Event: Berhenti mengetik ───────────────────────────────────────
    socket.on("stop_typing", (payload: { receiver_id: string }) => {
      io.to(`user:${payload.receiver_id}`).emit("user_stop_typing", {
        sender_id: userId,
      });
    });

    // ─── Event: Disconnect ──────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(
        `[Socket.IO] User disconnected: ${userId} (socket: ${socket.id})`
      );
      onlineUsers.delete(userId);
    });
  });

  return io;
};
