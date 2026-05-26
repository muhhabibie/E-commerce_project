"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useFollowMerchant = (merchantId: string, isAuthenticated: boolean) => {
  const queryClient = useQueryClient();

  // 1. Ambil status follow aktif dari backend
  const { data: isFollowed, isLoading } = useQuery({
    queryKey: ["followStatus", merchantId],
    queryFn: async () => {
      if (!isAuthenticated) return false;
      const res = await axiosInstance.get(`/api/merchant/follow-status/${merchantId}`);
      return res.data?.data ?? false;
    },
    enabled: !!merchantId && isAuthenticated,
  });

  // 2. Mutasi untuk Follow
  const followMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/api/merchant/${merchantId}/follow`);
    },
    onSuccess: () => {
      queryClient.setQueryData(["followStatus", merchantId], true);
      // Invalidate merchant query to update total follower count
      queryClient.invalidateQueries({ queryKey: ["merchant", merchantId] });
      toast.success("Berhasil mengikuti merchant!");
    },
    onError: (err) => {
      console.error("[followMerchant] error:", err);
      toast.error("Gagal mengikuti merchant.");
    },
  });

  // 3. Mutasi untuk Unfollow
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/api/merchant/${merchantId}/unfollow`);
    },
    onSuccess: () => {
      queryClient.setQueryData(["followStatus", merchantId], false);
      queryClient.invalidateQueries({ queryKey: ["merchant", merchantId] });
      toast.success("Berhasil berhenti mengikuti merchant.");
    },
    onError: (err) => {
      console.error("[unfollowMerchant] error:", err);
      toast.error("Gagal membatalkan mengikuti merchant.");
    },
  });

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      return false; // Let component handle login modal trigger
    }
    if (isFollowed) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
    return true;
  };

  return {
    isFollowed: !!isFollowed,
    isLoading: isLoading || followMutation.isPending || unfollowMutation.isPending,
    handleFollowToggle,
  };
};

export default useFollowMerchant;
