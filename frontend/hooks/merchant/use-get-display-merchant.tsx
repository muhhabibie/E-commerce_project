"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const useGetDisplayMerchant = () => {
  const { data: displayMerchant, isLoading } = useQuery({
    queryFn: async () => {
      const response = await axiosInstance.get("/api/merchant/display");
      return response.data;
    },
    queryKey: ["displayMerchant"],
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  return {
    displayMerchant,
    isLoading,
  };
};

export default useGetDisplayMerchant;
