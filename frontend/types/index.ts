export interface Stock {
  id: string;
  name: string;
  merchant_id: string;
  user_id: string;
  photo_url: string;
  price: number;
  quantity: number;
  description: string;
  created_at: string; // ISO string (Date.toISOString())
  updated_at: string;
}

export interface Merchant {
  id: string;
  user_id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  profile_photo: string;
  banner_img: string;
  gallery_photo: string;
  profilePhotoUrl: string | null;
  bannerImageUrl: string | null;
  galleryImages: string[]; // JSON array dari Supabase
  restricted: boolean;
  verified: boolean;
  total_follower: number;
  created_at: string;
  updated_at: string;
  latitude: number;
  longitude: number;
  google_map_url: string | null;
  iframe_map_url: string | null;
  // Relations
  stocks: Stock[];
  ratings: { id: string; rate: number; comment: string; user?: { email: string }; created_at: string }[];
  followers: any[];
  selledStocks?: SelledStock[];
}

export interface SelledStock {
  id: string;
  stock_id: string;
  quantity: number;
  total_price: number;
  merchant_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  stock?: Stock;
}

export interface DisplayMerchantType {
  id: string;
  name: string;
  profilePhotoUrl: string | null;
  minPrice?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  ratings?: { rate: number }[];
  type?: string;
  stocks?: { price: number }[];
}

export interface DisplayMerchantResponse {
  message: string;
  status: string;
  data: DisplayMerchantType[];
}
