"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { schema } from "./use-signup";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

interface LoginValues {
  email: string;
  password: string;
}

const useLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (values: LoginValues) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/auth/signin", values);
      const userData = response.data;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
      }

      toast.success("Login berhasil!");

      // Redirect to home
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error: unknown) {
      let message = "Gagal melakukan login";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        message = axiosError.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleLogin,
    validationSchema: schema,
  });

  return { formik, isSubmitting };
};

export default useLogin;
