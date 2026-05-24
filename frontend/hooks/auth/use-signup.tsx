"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as yup from "yup";

export interface SignupValues {
  email: string;
  password: string;
}

export const schema = yup.object({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .required("Password wajib diisi"),
});

interface UseSignupProps {
  onSuccessCallback?: () => void;
}

const useSignup = ({ onSuccessCallback }: UseSignupProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (values: SignupValues) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/api/auth/signup", values);
      toast.success("Signup berhasil! Silahkan login.");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } catch (error: unknown) {
      let message = "Gagal melakukan signup";
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

  const formik = useFormik<SignupValues>({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: handleSignup,
  });

  return { formik, isSubmitting };
};

export default useSignup;
