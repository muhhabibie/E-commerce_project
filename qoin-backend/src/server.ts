import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

// Server Express biasa — real-time ditangani oleh Supabase Realtime,
// tidak perlu WebSocket server sendiri
app.listen(PORT, () => {
  console.log(`[Server] HTTP server running on port ${PORT}`);
});
