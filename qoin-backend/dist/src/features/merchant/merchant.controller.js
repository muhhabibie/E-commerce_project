"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop100Merchants = exports.deleteMerchant = exports.getLikedMerchant = exports.unfollowMerchant = exports.followMerchant = exports.getMerchantFollowStatus = exports.getDisplayMerchant = exports.getUserMerchant = exports.getUserStats = exports.getAllRatings = exports.addMerchantRating = exports.getMerchantById = exports.getMerchantByType = exports.getAllMerchant = exports.addMerchant = void 0;
const merchant_service_1 = require("./merchant.service");
const uploadToSupabase_1 = require("../../shared/uploadToSupabase");
const addMerchant = async (req, res, next) => {
    try {
        const user_id = req.user?.user_id;
        const { name, type, location, description, latitude, longitude, google_map_url, google_maps_url, iframe_map_url, } = req.body;
        const files = req.files;
        let profileUrl = "";
        let bannerUrl = "";
        const galleryUrls = [];
        if (files?.profile_photo?.[0]) {
            // console.log("[merchant.register] uploading profile");
            const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(files.profile_photo[0], "profiles");
            profileUrl = uploaded.url;
        }
        if (files?.banner_img?.[0]) {
            // console.log("[merchant.register] uploading banner");
            const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(files.banner_img[0], "banners");
            bannerUrl = uploaded.url;
        }
        if (files?.gallery_photos && files.gallery_photos.length > 0) {
            // console.log(
            // "[merchant.register] uploading gallery count:",
            // files.gallery_photos.length
            // );
            for (const file of files.gallery_photos) {
                const uploaded = await (0, uploadToSupabase_1.uploadToSupabase)(file, "gallery");
                galleryUrls.push(uploaded.url);
            }
        }
        const latNum = latitude ? parseFloat(latitude) : undefined;
        const lngNum = longitude ? parseFloat(longitude) : undefined;
        const resolvedGoogleMapUrl = google_map_url || google_maps_url || "";
        const merchant = await (0, merchant_service_1.addMerchantService)({
            user_id,
            name,
            type: type.toLowerCase() === "workshop_jasa" ? "jasa" : type.toLowerCase(),
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
    }
    catch (err) {
        console.error("[merchant.register] error:", err);
        next(err);
    }
};
exports.addMerchant = addMerchant;
const getAllMerchant = async (req, res, next) => {
    try {
        console.log("getting merchant...");
        const dataMerchant = await (0, merchant_service_1.getAllMerchantService)();
        return res.status(200).json({
            message: "Merchant get successfully",
            status: "success",
            data: dataMerchant,
        });
    }
    catch (err) {
        console.log("Error:", err);
        return next(err); // <= tambahkan return agar request berhenti
    }
};
exports.getAllMerchant = getAllMerchant;
const getMerchantByType = async (req, res, next) => {
    try {
        const { type } = req.params;
        const normalizedType = type.toLowerCase() === "workshop_jasa" ? "jasa" : type.toLowerCase();
        const merchants = await (0, merchant_service_1.getMerchantByTypeService)(normalizedType);
        return res.status(200).json({
            message: "Merchant fetched successfully",
            status: "success",
            data: merchants,
        });
    }
    catch (err) {
        console.error("[merchant.getByType] error:", err);
        return next(err);
    }
};
exports.getMerchantByType = getMerchantByType;
const getMerchantById = async (req, res, next) => {
    try {
        const { merchant_id } = req.params;
        const merchant = await (0, merchant_service_1.getMerchantByIdService)(merchant_id);
        // console.log(merchant);
        return res.status(200).json({
            message: "Merchant fetched successfully",
            status: "success",
            data: merchant,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getMerchantById = getMerchantById;
const addMerchantRating = async (req, res, next) => {
    try {
        const { merchant_id } = req.params;
        const { user_id } = req.user;
        const { rate, comment } = req.body;
        console.log("[addMerchantRating] merchant_id:", merchant_id, "user_id:", user_id, "rate:", rate);
        const rating = await (0, merchant_service_1.addMerchantRatingService)(merchant_id, user_id, rate, comment || "");
        return res.status(201).json({
            status: "success",
            message: "Merchant rating added successfully",
            data: rating,
        });
    }
    catch (err) {
        console.error("[addMerchantRating] error:", err);
        next(err);
    }
};
exports.addMerchantRating = addMerchantRating;
const getAllRatings = async (req, res, next) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 40;
        const ratings = await (0, merchant_service_1.getAllRatingsService)(limit);
        return res.status(200).json({
            status: "success",
            message: "All ratings fetched successfully",
            data: ratings,
        });
    }
    catch (err) {
        console.error("[getAllRatings] error:", err);
        next(err);
    }
};
exports.getAllRatings = getAllRatings;
const getUserStats = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const stats = await (0, merchant_service_1.getUserStatsService)(user_id);
        return res.status(200).json({
            status: "success",
            message: "User stats fetched successfully",
            data: stats,
        });
    }
    catch (err) {
        console.error("[getUserStats] error:", err);
        next(err);
    }
};
exports.getUserStats = getUserStats;
const getUserMerchant = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        console.log(user_id);
        const merchant = await (0, merchant_service_1.getUserMerchantService)(user_id);
        return res.status(200).json({
            status: "success",
            message: "User merchant fetched successfully",
            data: merchant,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.getUserMerchant = getUserMerchant;
const getDisplayMerchant = async (req, res, next) => {
    try {
        const display_merchant = await (0, merchant_service_1.getMerchantDisplayService)();
        return res.status(200).json({
            status: "success",
            message: "Display merchant fetched successfully",
            data: display_merchant,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.getDisplayMerchant = getDisplayMerchant;
const getMerchantFollowStatus = async (req, res, next) => {
    try {
        const { merchant_id } = req.params;
        const { user_id } = req.user;
        const followed_merchant = await (0, merchant_service_1.getMerchantFollowStatusService)(user_id, merchant_id);
        const isFollowed = Boolean(followed_merchant);
        return res.status(200).json({
            status: "success",
            message: `Merchant is merchant following status is ${isFollowed}`,
            data: isFollowed,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.getMerchantFollowStatus = getMerchantFollowStatus;
const followMerchant = (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_id } = req.user;
        const followed_merchant = (0, merchant_service_1.followMerchantService)(user_id, id);
        return res.status(201).json({
            status: "success",
            message: "Merchant followed successfully",
            data: followed_merchant,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.followMerchant = followMerchant;
const unfollowMerchant = (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_id } = req.user;
        const unfollowed_merchant = (0, merchant_service_1.unfollowedMerchantService)(user_id, id);
        return res.status(200).json({
            status: "success",
            message: "Merchant unfollowed successfully",
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
exports.unfollowMerchant = unfollowMerchant;
const getLikedMerchant = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const liked_merchants = await (0, merchant_service_1.getLikedMerchantService)(user_id);
        return res.status(200).json({
            status: "success",
            message: "Liked merchants fetched successfully",
            data: liked_merchants,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
exports.getLikedMerchant = getLikedMerchant;
const deleteMerchant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_id } = req.user;
        console.log(`Deleting merchant with id: ${id} for user: ${user_id}`);
        await (0, merchant_service_1.deleteMerchantService)(user_id, id);
        return res.status(200).json({
            status: "success",
            message: "Merchant deleted successfully",
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
exports.deleteMerchant = deleteMerchant;
const getTop100Merchants = async (req, res, next) => {
    try {
        const topMerchants = await (0, merchant_service_1.getTop100MerchantsService)();
        return res.status(200).json({
            status: "success",
            message: "Top 100 merchants retrieved successfully",
            data: topMerchants,
        });
    }
    catch (err) {
        console.error("[merchant.getTop100] error:", err);
        next(err);
    }
};
exports.getTop100Merchants = getTop100Merchants;
