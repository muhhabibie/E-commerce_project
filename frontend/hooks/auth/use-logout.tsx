"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

const useLogout = () => {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await axiosInstance.post("/api/auth/logout");

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      }

      toast.success("Logout berhasil!");

      // Redirect to home
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error: unknown) {
      let message = "Logout gagal!";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        message = axiosError.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return {
    handleLogout,
    isPending,
  };
};

export default useLogout;
