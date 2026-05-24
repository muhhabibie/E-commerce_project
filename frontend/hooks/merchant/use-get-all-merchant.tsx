"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { Merchant } from "@/types";

const useGetAllMerchant = () => {
  const { data, isLoading, isError, error } = useQuery<{
    message: string;
    status: string;
    data: Merchant[];
  }>({
    queryKey: ["merchant", "all"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/merchant/all-data");
      return response.data;
    },
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  return {
    raw: data,
    merchants: data?.data ?? [],
    isLoading,
    isError,
    error,
  };
};

export default useGetAllMerchant;
