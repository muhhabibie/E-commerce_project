import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { schema } from "./use-signup";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LoginValues {
  email: string;
  password: string;
}

const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogin = async (values: LoginValues) => {
    const response = await axiosInstance.post("/api/auth/signin", values);
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleLogin,
    onSuccess: (data) => {
      // Set user data to React Query cache
      queryClient.setQueryData(["user"], data);

      // Sync to localStorage for hydration
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "__qoin_user_cache__",
          JSON.stringify({ data, updatedAt: Date.now() })
        );
      }

      toast.success("Login berhasil!");

      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 100);
    },
    onError: (error: unknown) => {
      let message = "Gagal melakukan login";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values: LoginValues) => {
      mutate(values);
    },
    validationSchema: schema,
  });

  return { formik, isSubmitting: isPending };
};

export default useLogin;
