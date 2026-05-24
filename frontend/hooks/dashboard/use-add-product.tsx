import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export type AddProductsForm = {
  name: string;
  quantity: number;
  price: number;
  product_photo: File | null;
  product_photo_preview: string;
  description: string;
};

const useAddProduct = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const merchantId = (params.id as string) || "";

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const convertToFormData = (values: AddProductsForm) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("quantity", values.quantity.toString());
    formData.append("price", values.price.toString());
    formData.append("description", values.description);
    if (values.product_photo) {
      formData.append("product_photo", values.product_photo);
    }

    return formData;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: AddProductsForm) => {
      const formData = convertToFormData(values);
      const response = await axiosInstance.post(
        `/api/stocks/add/${merchantId}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      formik.resetForm();
      return toast.success("Produk berhasil ditambahkan.");
    },
    onError: (err) => {
      console.error(err);
      return toast.error("Gagal menambahkan produk.");
    },
  });

  const formik = useFormik<AddProductsForm>({
    initialValues: {
      name: "",
      quantity: 0,
      price: 0,
      product_photo: null,
      product_photo_preview: "",
      description: "",
    },
    onSubmit: (values: AddProductsForm) => {
      mutate(values);
    },
  });

  return {
    openModal,
    handleOpenModal,
    handleCloseModal,
    mutate,
    isPending,
    formik,
  };
};

export default useAddProduct;
