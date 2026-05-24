"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { Merchant } from "@/types";

export const MERCHANT_TYPE_QUERY_KEY = "merchant-type";

const useGetMerchantByType = (rawType: string | null) => {
  // type di-searching selalu huruf kecil
  const type = rawType ? rawType.toLowerCase() : null;

  const enabled = !!type && type.trim().length > 0 && type !== "semua";

  const { data, isLoading, isError, error } = useQuery<{
    message: string;
    status: string;
    data: Merchant[];
  }>({
    queryKey: [MERCHANT_TYPE_QUERY_KEY, type],
    enabled,
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/api/merchant/type/${encodeURIComponent(type as string)}`
      );
      return response.data;
    },
    // Show fresh loading whenever type changes / page remounts
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  return {
    raw: data,
    merchants: data?.data ?? [],
    isLoading: enabled ? isLoading : false,
    isError: enabled ? isError : false,
    error,
  };
};

export default useGetMerchantByType;
