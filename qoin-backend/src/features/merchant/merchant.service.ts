import prisma from "../../database/prisma";

export const addMerchantService = async (payload: {
  user_id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  profile_photo: string;
  banner_img: string;
  gallery_photo: string;
  latitude?: number | null;
  longitude?: number | null;
  profilePhotoUrl?: string;
  bannerImageUrl?: string;
  galleryImages?: string[];
  iframe_map_url?: string;
  google_map_url?: string;
}) => {
  const newMerchant = await prisma.merchants.create({
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

export const getAllMerchantService = async () => {
  const merchants = await prisma.merchants.findMany({
    include: {
      stocks: true,
      ratings: true,
    },
  });
  return merchants;
};

export const getMerchantByTypeService = async (type: string) => {
  const merchants = await prisma.merchants.findMany({
    where: { type },
    include: {
      stocks: true,
    },
  });

  return merchants;
};

export const getMerchantByIdService = async (merchant_id: string) => {
  const merchant = await prisma.merchants.findUnique({
    where: {
      id: merchant_id,
    },
    include: {
      followers: true,
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
      stocks: true,
    },
  });

  return merchant;
};

export const addMerchantRatingService = async (
  merchant_id: string,
  user_id: string,
  rate: number,
  comment: string
) => {
  const merchant_rating = await prisma.merchant_rating.create({
    data: {
      merchant_id,
      user_id,
      rate,
      comment,
    },
  });

  return merchant_rating;
};

export const getUserMerchantService = async (user_id: string) => {
  const merchant = await prisma.merchants.findMany({
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

export const getMerchantDisplayService = async () => {
  const merchants = await prisma.merchants.findMany({
    take: 4,
    select: {
      id: true,
      name: true,
      profilePhotoUrl: true,
      latitude: true,
      longitude: true,
      stocks: {
        select: {
          price: true,
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

export const getMerchantFollowStatusService = async (
  authenticatedUserId: string,
  merchantId: string
) => {
  const followedMerchant = await prisma.merchant_followers.findFirst({
    where: {
      user_id: authenticatedUserId,
      merchant_id: merchantId,
    },
  });

  return followedMerchant;
};

export const followMerchantService = async (
  authenticatedUserId: string,
  merchantId: string
) => {
  const merchantFollowed = await prisma.merchant_followers.create({
    data: {
      user_id: authenticatedUserId,
      merchant_id: merchantId,
    },
  });

  return merchantFollowed;
};

export const unfollowedMerchantService = async (
  authenticatedUserId: string,
  merchantId: string
) => {
  const merchantUnfollowed = await prisma.merchant_followers.deleteMany({
    where: {
      user_id: authenticatedUserId,
      merchant_id: merchantId,
    },
  });

  return merchantUnfollowed;
};

export const getLikedMerchantService = async (authenticatedUserId: string) => {
  const followed_merchants = await prisma.merchant_followers.findMany({
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

export const deleteMerchantService = async (
  authenticatedUserId: string,
  merchantId: string
) => {
  const merchant = await prisma.merchants.findFirst({
    where: {
      id: merchantId,
      user_id: authenticatedUserId,
    },
  });

  if (!merchant) {
    throw new Error("Merchant not found or not owned by user");
  }

  await prisma.merchants.delete({
    where: { id: merchantId },
  });

  return { id: merchantId };
};
