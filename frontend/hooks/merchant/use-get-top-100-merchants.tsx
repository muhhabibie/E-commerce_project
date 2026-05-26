"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const useGetTop100Merchants = () => {
  const { data: top100Data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axiosInstance.get("/api/merchant/top-100");
      return response.data;
    },
    queryKey: ["top100Merchants"],
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  return {
    top100Merchants: top100Data?.data || [],
    isLoading,
  };
};

export default useGetTop100Merchants;
