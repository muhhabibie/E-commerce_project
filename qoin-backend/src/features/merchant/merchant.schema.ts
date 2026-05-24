import z from "zod";

// For multipart we only validate textual fields here; files are handled via multer.
export const addMerchantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1).max(500),
  latitude: z.string().optional(), // will be parsed to float
  longitude: z.string().optional(),
  google_map_url: z.string().url().or(z.literal("")).optional(),
  google_maps_url: z.string().url().or(z.literal("")).optional(),
  iframe_map_url: z.string().optional(),
});

export const addMerchantRatingSchema = z.object({
  rate: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .min(1, "Comment must be at least 1 character long")
    .max(500, "Comment must be at most 500 characters long"),
});
