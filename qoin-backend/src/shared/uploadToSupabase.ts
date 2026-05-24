import supabaseClient from "../database/supabaseClient";
import { randomUUID } from "crypto";

export const uploadToSupabase = async (
  file: Express.Multer.File,
  prefix: "profiles" | "banners" | "gallery" | "stocks"
) => {
  const bucket = "merchant-media";
  const ext = file.originalname.split(".").pop() || "bin";
  const path = `${prefix}/${randomUUID()}.${ext}`;
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  if (error) throw error;
  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
};