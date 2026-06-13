"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop100MerchantsService = exports.deleteMerchantService = exports.getLikedMerchantService = exports.unfollowedMerchantService = exports.followMerchantService = exports.getMerchantFollowStatusService = exports.getMerchantDisplayService = exports.getUserMerchantService = exports.getUserStatsService = exports.getAllRatingsService = exports.addMerchantRatingService = exports.getMerchantByIdService = exports.getMerchantByTypeService = exports.getAllMerchantService = exports.addMerchantService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const addMerchantService = async (payload) => {
    const newMerchant = await prisma_1.default.merchants.create({
        data: {
            user_id: payload.user_id,
            name: payload.name,
            type: payload.type,
            location: payload.location,
            description: payload.description,
            profile_photo: payload.profile_photo || "",
            banner_img: payload.banner_img || "",
            gallery_photo: payload.galleryImages?.[0] || payload.gallery_photo || "",
            latitude: payload.latitude ?? null,
            longitude: payload.longitude ?? null,
            profilePhotoUrl: payload.profilePhotoUrl || null,
            bannerImageUrl: payload.bannerImageUrl || null,
            galleryImages: payload.galleryImages ?? [],
            iframe_map_url: payload.iframe_map_url ?? null,
            google_map_url: payload.google_map_url ?? null,
        },
    });
    console.log("New merchant added:", newMerchant);
    return newMerchant;
};
exports.addMerchantService = addMerchantService;
const getAllMerchantService = async () => {
    const merchants = await prisma_1.default.merchants.findMany({
        include: {
            stocks: true,
            ratings: true,
        },
    });
    return merchants;
};
exports.getAllMerchantService = getAllMerchantService;
const getMerchantByTypeService = async (type) => {
    const merchants = await prisma_1.default.merchants.findMany({
        where: { type },
        include: {
            stocks: true,
        },
    });
    return merchants;
};
exports.getMerchantByTypeService = getMerchantByTypeService;
const getMerchantByIdService = async (merchant_id) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(merchant_id);
    const queryCondition = isUuid ? { id: merchant_id } : { name: merchant_id };
    const merchant = await prisma_1.default.merchants.findFirst({
        where: queryCondition,
        include: {
            followers: true,
            merchantFollowers: true,
            ratings: {
                include: {
                    user: {
                        select: {
                            email: true,
                        }
                    }
                }
            },
            selledStocks: true,
            stocks: {
                include: {
                    stockRating: true,
                },
            },
        },
    });
    return merchant;
};
exports.getMerchantByIdService = getMerchantByIdService;
const addMerchantRatingService = async (merchant_id, user_id, rate, comment) => {
    let finalMerchantId = merchant_id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(merchant_id);
    if (!isUuid) {
        const merchant = await prisma_1.default.merchants.findFirst({
            where: { name: merchant_id },
            select: { id: true }
        });
        if (merchant) {
            finalMerchantId = merchant.id;
        }
    }
    const merchant_rating = await prisma_1.default.merchant_rating.create({
        data: {
            merchant_id: finalMerchantId,
            user_id,
            rate,
            comment,
        },
    });
    return merchant_rating;
};
exports.addMerchantRatingService = addMerchantRatingService;
const getAllRatingsService = async (limit = 40) => {
    const ratings = await prisma_1.default.merchant_rating.findMany({
        where: {
            comment: { not: "" },
        },
        orderBy: { created_at: "desc" },
        take: limit,
        select: {
            id: true,
            rate: true,
            comment: true,
            created_at: true,
            photo_url: true,
            user: {
                select: {
                    email: true,
                },
            },
            merchant: {
                select: {
                    name: true,
                    type: true,
                },
            },
        },
    });
    return ratings;
};
exports.getAllRatingsService = getAllRatingsService;
const getUserStatsService = async (user_id) => {
    const [transactionCount, followedCount, ratingCount] = await Promise.all([
        // Jumlah transaksi unik berdasarkan payment_id yang dimiliki user
        prisma_1.default.selled_stocks.groupBy({
            by: ["payment_id"],
            where: { user_id, payment_id: { not: null } },
        }).then((groups) => groups.length),
        // Jumlah UMKM yang diikuti
        prisma_1.default.merchant_followers.count({
            where: { user_id },
        }),
        // Jumlah ulasan yang diberikan
        prisma_1.default.merchant_rating.count({
            where: { user_id },
        }),
    ]);
    return {
        transactionCount,
        followedCount,
        ratingCount,
    };
};
exports.getUserStatsService = getUserStatsService;
const getUserMerchantService = async (user_id) => {
    const merchant = await prisma_1.default.merchants.findMany({
        where: { user_id },
        select: {
            id: true,
            name: true,
            user_id: true,
            profilePhotoUrl: true,
        },
    });
    return merchant;
};
exports.getUserMerchantService = getUserMerchantService;
const getMerchantDisplayService = async () => {
    const merchants = await prisma_1.default.merchants.findMany({
        take: 4,
        select: {
            id: true,
            name: true,
            profilePhotoUrl: true,
            latitude: true,
            longitude: true,
            stocks: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    photo_url: true,
                    quantity: true,
                    description: true,
                    stockRating: true,
                },
            },
            ratings: {
                select: {
                    rate: true,
                },
            },
        },
    });
    return merchants;
};
exports.getMerchantDisplayService = getMerchantDisplayService;
const getMerchantFollowStatusService = async (authenticatedUserId, merchantId) => {
    const followedMerchant = await prisma_1.default.merchant_followers.findFirst({
        where: {
            user_id: authenticatedUserId,
            merchant_id: merchantId,
        },
    });
    return followedMerchant;
};
exports.getMerchantFollowStatusService = getMerchantFollowStatusService;
const followMerchantService = async (authenticatedUserId, merchantId) => {
    const merchantFollowed = await prisma_1.default.merchant_followers.create({
        data: {
            user_id: authenticatedUserId,
            merchant_id: merchantId,
        },
    });
    return merchantFollowed;
};
exports.followMerchantService = followMerchantService;
const unfollowedMerchantService = async (authenticatedUserId, merchantId) => {
    const merchantUnfollowed = await prisma_1.default.merchant_followers.deleteMany({
        where: {
            user_id: authenticatedUserId,
            merchant_id: merchantId,
        },
    });
    return merchantUnfollowed;
};
exports.unfollowedMerchantService = unfollowedMerchantService;
const getLikedMerchantService = async (authenticatedUserId) => {
    const followed_merchants = await prisma_1.default.merchant_followers.findMany({
        where: {
            user_id: authenticatedUserId,
        },
        select: {
            merchant: {
                select: {
                    id: true,
                    name: true,
                    profilePhotoUrl: true,
                },
            },
        },
    });
    return followed_merchants;
};
exports.getLikedMerchantService = getLikedMerchantService;
const deleteMerchantService = async (authenticatedUserId, merchantId) => {
    const merchant = await prisma_1.default.merchants.findFirst({
        where: {
            id: merchantId,
            user_id: authenticatedUserId,
        },
    });
    if (!merchant) {
        throw new Error("Merchant not found or not owned by user");
    }
    await prisma_1.default.merchants.delete({
        where: { id: merchantId },
    });
    return { id: merchantId };
};
exports.deleteMerchantService = deleteMerchantService;
const getTop100MerchantsService = async () => {
    const merchants = await prisma_1.default.merchants.findMany({
        include: {
            ratings: {
                select: {
                    rate: true,
                },
            },
            stocks: {
                select: {
                    price: true,
                },
            },
            selledStocks: {
                select: {
                    total_price: true,
                    created_at: true,
                },
            },
            merchantFollowers: {
                select: {
                    id: true,
                },
            },
        },
    });
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let maxRevenue = 0;
    let maxFollowers = 0;
    const preparedMerchants = merchants.map((m) => {
        const totalTransactions = m.selledStocks.length;
        const revenue = m.selledStocks.reduce((sum, item) => sum + item.total_price, 0);
        const followerCount = m.merchantFollowers.length;
        if (revenue > maxRevenue)
            maxRevenue = revenue;
        if (followerCount > maxFollowers)
            maxFollowers = followerCount;
        const avgRating = m.ratings.length > 0
            ? m.ratings.reduce((sum, r) => sum + r.rate, 0) / m.ratings.length
            : 4.0;
        const salesLastWeek = m.selledStocks
            .filter((s) => s.created_at >= oneWeekAgo)
            .reduce((sum, item) => sum + item.total_price, 0);
        const salesBefore = revenue - salesLastWeek;
        let growth = 0;
        if (salesBefore > 0) {
            growth = Number(((salesLastWeek / salesBefore) * 100).toFixed(1));
        }
        else if (salesLastWeek > 0) {
            growth = 100.0;
        }
        else {
            // Deterministic fallback based on merchant ID so it stays stable
            const charCodeSum = m.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
            growth = Number((5 + (charCodeSum % 25)).toFixed(1));
        }
        return {
            merchant: m,
            totalTransactions,
            revenue,
            followerCount,
            rating: Number(avgRating.toFixed(1)),
            growth,
        };
    });
    const refMaxRevenue = maxRevenue || 1000000;
    const refMaxFollowers = maxFollowers || 10;
    const rankedMerchants = preparedMerchants.map((item) => {
        // 1. Transaction Score (40%)
        const revenueRatio = item.revenue / refMaxRevenue;
        const transactionScore = revenueRatio * 40;
        // 2. Rating Score (30%)
        const ratingScore = (item.rating / 5.0) * 30;
        // 3. Engagement Score (10%)
        const followerRatio = item.followerCount / refMaxFollowers;
        const engagementScore = followerRatio * 10;
        // 4. Growth Score (20%): capped at 20
        const growthScore = Math.min((item.growth / 100) * 20, 20);
        const score = Math.round(transactionScore + ratingScore + engagementScore + growthScore);
        return {
            ...item.merchant, // Sebarkan semua atribut asli (id, name, profilePhotoUrl, ratings, stocks, dll.)
            score: 500 + score * 5, // Scale to 500-1000
            totalTransactions: item.totalTransactions,
            rating: item.rating.toFixed(1),
            growth: item.growth.toFixed(1),
            followers: item.followerCount,
        };
    });
    rankedMerchants.sort((a, b) => b.score - a.score);
    return rankedMerchants.map((m, idx) => ({
        ...m,
        rank: idx + 1,
    })).slice(0, 100);
};
exports.getTop100MerchantsService = getTop100MerchantsService;
