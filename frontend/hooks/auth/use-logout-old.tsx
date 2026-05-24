import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/api/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // Clear React Query cache
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ queryKey: ["user"] });

      // Clear localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("__qoin_user_cache__");
      }

      toast.success("Logout berhasil!");

      // Navigate to home and refresh
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 100);
    },
    onError: (error: unknown) => {
      let message = "Logout gagal!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return {
    handleLogout,
    isPending,
  };
};

export default useLogout;
