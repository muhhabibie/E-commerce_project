import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface UserStats {
  transactionCount: number;
  followedCount: number;
  ratingCount: number;
}

const useGetUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    transactionCount: 0,
    followedCount: 0,
    ratingCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<{ data: UserStats }>("/api/merchant/user-stats")
      .then((res) => {
        if (res.data?.data) setStats(res.data.data);
      })
      .catch(() => {
        // keep zeros if error (user not logged in, etc.)
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading };
};

export default useGetUserStats;
