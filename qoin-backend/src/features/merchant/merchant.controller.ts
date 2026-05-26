import { NextFunction, Response } from "express";
import { APIResponse } from "../../models/response";
import {
  addMerchantService,
  getMerchantByIdService,
  addMerchantRatingService,
  getAllRatingsService,
  getUserStatsService,
  getAllMerchantService,
  getUserMerchantService,
  getMerchantDisplayService,
  getMerchantByTypeService,
  getMerchantFollowStatusService,
  followMerchantService,
  unfollowedMerchantService,
  getLikedMerchantService,
  deleteMerchantService,
  getTop100MerchantsService,
} from "./merchant.service";
import { AuthRequest } from "../../middleware/verifyToken";
import z from "zod";
import { addMerchantRatingSchema, addMerchantSchema } from "./merchant.schema";
import { uploadToSupabase } from "../../shared/uploadToSupabase";

export const addMerchant = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.user_id as string;

    const {
      name,
      type,
      location,
      description,
      latitude,
      longitude,
      google_map_url,
      google_maps_url,
      iframe_map_url,
    } = req.body as any;

    const files = req.files as {
      [field: string]: Express.Multer.File[];
    } | null;

    let profileUrl = "";
    let bannerUrl = "";
    const galleryUrls: string[] = [];

    if (files?.profile_photo?.[0]) {
      // console.log("[merchant.register] uploading profile");
      const uploaded = await uploadToSupabase(
        files.profile_photo[0],
        "profiles"
      );
      profileUrl = uploaded.url;
    }
    if (files?.banner_img?.[0]) {
      // console.log("[merchant.register] uploading banner");
      const uploaded = await uploadToSupabase(files.banner_img[0], "banners");
      bannerUrl = uploaded.url;
    }
    if (files?.gallery_photos && files.gallery_photos.length > 0) {
      // console.log(
      // "[merchant.register] uploading gallery count:",
      // files.gallery_photos.length
      // );
      for (const file of files.gallery_photos) {
        const uploaded = await uploadToSupabase(file, "gallery");
        galleryUrls.push(uploaded.url);
      }
    }

    const latNum = latitude ? parseFloat(latitude) : undefined;
    const lngNum = longitude ? parseFloat(longitude) : undefined;
    const resolvedGoogleMapUrl = google_map_url || google_maps_url || "";

    const merchant = await addMerchantService({
      user_id,
      name,
      type:
        type.toLowerCase() === "workshop_jasa" ? "jasa" : type.toLowerCase(),
      location,
      description,
      profile_photo: profileUrl,
      banner_img: bannerUrl,
      gallery_photo: galleryUrls[0] || "",
      latitude: latNum,
      longitude: lngNum,
      profilePhotoUrl: profileUrl,
      bannerImageUrl: bannerUrl,
      galleryImages: galleryUrls,
      iframe_map_url,
      google_map_url: resolvedGoogleMapUrl,
    });

    return res.status(201).json({
      message: "Merchant added successfully",
      status: "success",
      data: merchant,
    });
  } catch (err) {
    console.error("[merchant.register] error:", err);
    next(err);
  }
};
export const getAllMerchant = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    console.log("getting merchant...");

    const dataMerchant = await getAllMerchantService();

    return res.status(200).json({
      message: "Merchant get successfully",
      status: "success",
      data: dataMerchant,
    });
  } catch (err) {
    console.log("Error:", err);
    return next(err); // <= tambahkan return agar request berhenti
  }
};

export const getMerchantByType = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { type } = req.params;
    const normalizedType =
      type.toLowerCase() === "workshop_jasa" ? "jasa" : type.toLowerCase();

    const merchants = await getMerchantByTypeService(normalizedType);

    return res.status(200).json({
      message: "Merchant fetched successfully",
      status: "success",
      data: merchants,
    });
  } catch (err) {
    console.error("[merchant.getByType] error:", err);
    return next(err);
  }
};

export const getMerchantById = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { merchant_id } = req.params;
    const merchant = await getMerchantByIdService(merchant_id);

    // console.log(merchant);
    return res.status(200).json({
      message: "Merchant fetched successfully",
      status: "success",
      data: merchant,
    });
  } catch (err) {
    next(err);
  }
};

export const addMerchantRating = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { merchant_id } = req.params;
    const { user_id } = req.user as { user_id: string };
    const { rate, comment } = req.body as z.infer<
      typeof addMerchantRatingSchema
    >;

    console.log("[addMerchantRating] merchant_id:", merchant_id, "user_id:", user_id, "rate:", rate);

    const rating = await addMerchantRatingService(
      merchant_id,
      user_id,
      rate,
      comment || ""
    );

    return res.status(201).json({
      status: "success",
      message: "Merchant rating added successfully",
      data: rating,
    });
  } catch (err) {
    console.error("[addMerchantRating] error:", err);
    next(err);
  }
};

export const getAllRatings = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 40;
    const ratings = await getAllRatingsService(limit);
    return res.status(200).json({
      status: "success",
      message: "All ratings fetched successfully",
      data: ratings,
    });
  } catch (err) {
    console.error("[getAllRatings] error:", err);
    next(err);
  }
};

export const getUserStats = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const stats = await getUserStatsService(user_id);
    return res.status(200).json({
      status: "success",
      message: "User stats fetched successfully",
      data: stats,
    });
  } catch (err) {
    console.error("[getUserStats] error:", err);
    next(err);
  }
};

export const getUserMerchant = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    console.log(user_id);
    const merchant = await getUserMerchantService(user_id);
    return res.status(200).json({
      status: "success",
      message: "User merchant fetched successfully",
      data: merchant,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getDisplayMerchant = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const display_merchant = await getMerchantDisplayService();
    return res.status(200).json({
      status: "success",
      message: "Display merchant fetched successfully",
      data: display_merchant,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getMerchantFollowStatus = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { merchant_id } = req.params;
    const { user_id } = req.user as { user_id: string };

    const followed_merchant = await getMerchantFollowStatusService(
      user_id,
      merchant_id
    );

    const isFollowed = Boolean(followed_merchant);
    return res.status(200).json({
      status: "success",
      message: `Merchant is merchant following status is ${isFollowed}`,
      data: isFollowed,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const followMerchant = (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user as { user_id: string };

    const followed_merchant = followMerchantService(user_id, id);

    return res.status(201).json({
      status: "success",
      message: "Merchant followed successfully",
      data: followed_merchant,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const unfollowMerchant = (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user as { user_id: string };

    const unfollowed_merchant = unfollowedMerchantService(user_id, id);

    return res.status(200).json({
      status: "success",
      message: "Merchant unfollowed successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getLikedMerchant = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.user as { user_id: string };
    const liked_merchants = await getLikedMerchantService(user_id);

    return res.status(200).json({
      status: "success",
      message: "Liked merchants fetched successfully",
      data: liked_merchants,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteMerchant = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user as { user_id: string };
    console.log(`Deleting merchant with id: ${id} for user: ${user_id}`);

    await deleteMerchantService(user_id, id);
    return res.status(200).json({
      status: "success",
      message: "Merchant deleted successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getTop100Merchants = async (
  req: AuthRequest,
  res: Response<APIResponse>,
  next: NextFunction
) => {
  try {
    const topMerchants = await getTop100MerchantsService();
    return res.status(200).json({
      status: "success",
      message: "Top 100 merchants retrieved successfully",
      data: topMerchants,
    });
  } catch (err) {
    console.error("[merchant.getTop100] error:", err);
    next(err);
  }
};
