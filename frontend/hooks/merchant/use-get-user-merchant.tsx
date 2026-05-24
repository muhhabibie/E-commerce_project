"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const useGetUserMerchant = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axiosInstance.get("/api/merchant/user");
      return response.data;
    },
    queryKey: ["merchant"],
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  return {
    merchant: data,
    isLoading,
  };
};

export default useGetUserMerchant;
