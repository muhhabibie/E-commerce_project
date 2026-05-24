import z from "zod";

// For multipart/form-data, numeric fields arrive as strings. Use z.coerce.number.
// Photo can be provided either as an uploaded file (product_photo) OR an existing URL (photo_url).
// Make photo_url optional so validation doesn't fail when a file is uploaded instead.
export const addStocksSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
});

export const updateStocksSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").optional(),
  price: z.coerce.number().min(1, "Price is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  is_displayed: z.boolean().optional(),
});

export const deleteStocksSchema = z.object({
  stock_id: z.string().min(1, "Stock id is required"),
});

export const deleteManyStocksSchema = z.object({
  stock_ids: z.array(z.string().min(1, "Stock id is required")),
});
