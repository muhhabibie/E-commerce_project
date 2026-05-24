"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { Merchant } from "@/types";

const useGetMerchantById = (overrideId?: string) => {
  const params = useParams();
  let merchantId =
    overrideId ?? (params?.merchantId as string | string[] | undefined);
  if (Array.isArray(merchantId)) merchantId = merchantId[0];
  const enabled = !!merchantId && typeof merchantId === "string";

  const { data, isLoading, isError } = useQuery<{
    message: string;
    status: string;
    data: Merchant | null;
  }>({
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/api/merchant/${merchantId}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    // Include merchantId in the key so each merchant has its own cache
    queryKey: ["merchant", merchantId],
    enabled,
    // Always refetch when a different merchant page mounts
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
  const merchant: Merchant | null = data?.data ?? null;

  return {
    raw: data,
    merchant,
    isLoading: enabled ? isLoading : true,
    isError: enabled ? isError : false,
    merchantId,
  };
};

export default useGetMerchantById;
