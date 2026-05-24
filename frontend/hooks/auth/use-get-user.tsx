"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

const useGetUser = () => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Check if logged in from localStorage
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      // Try to get cached user first
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        try {
          setData(JSON.parse(cachedUser));
        } catch {}
      }

      // Fetch fresh data from API
      try {
        const response = await axiosInstance.get("/api/auth/user");
        const userData = response.data;
        setData(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsError(false);
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 401) {
          // Not logged in - clear data
          setData(null);
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
        } else {
          setIsError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    data,
    isLoading,
    isError,
    isLoggedIn: !!data,
  };
};

export default useGetUser;
