import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface RatingItem {
  id: string;
  rate: number;
  comment: string;
  created_at: string;
  photo_url: string | null;
  user: { email: string };
  merchant: { name: string; type: string };
}

const useGetAllRatings = (limit = 40) => {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<{ data: RatingItem[] }>(`/api/merchant/ratings?limit=${limit}`)
      .then((res) => setRatings(res.data.data || []))
      .catch(() => setRatings([]))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { ratings, isLoading };
};

export default useGetAllRatings;
