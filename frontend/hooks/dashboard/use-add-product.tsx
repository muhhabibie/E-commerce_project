import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Stock } from "@/types";

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
  const [editingProduct, setEditingProduct] = useState<Stock | null>(null);

  const handleOpenModal = () => {
    setEditingProduct(null);
    formik.resetForm();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Stock) => {
    setEditingProduct(product);
    formik.setValues({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      product_photo: null,
      product_photo_preview: product.photo_url || "",
      description: product.description || "",
    });
    setOpenModal(true);
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

  // Add Product Mutation
  const { mutate: mutateAdd, isPending: addPending } = useMutation({
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
      setOpenModal(false);
      formik.resetForm();
      return toast.success("Produk berhasil ditambahkan.");
    },
    onError: (err) => {
      console.error(err);
      return toast.error("Gagal menambahkan produk.");
    },
  });

  // Edit Product Mutation
  const { mutate: mutateEdit, isPending: editPending } = useMutation({
    mutationFn: async (values: AddProductsForm) => {
      if (!editingProduct) return;
      const response = await axiosInstance.patch(
        `/api/stocks/${editingProduct.id}`,
        {
          name: values.name,
          quantity: values.quantity,
          price: values.price,
          description: values.description,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      setOpenModal(false);
      setEditingProduct(null);
      formik.resetForm();
      return toast.success("Produk berhasil diperbarui.");
    },
    onError: (err) => {
      console.error(err);
      return toast.error("Gagal memperbarui produk.");
    },
  });

  // Delete Product Mutation
  const { mutate: mutateDelete, isPending: deletePending } = useMutation({
    mutationFn: async (stockId: string) => {
      const response = await axiosInstance.delete(`/api/stocks/${stockId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      return toast.success("Produk berhasil dihapus.");
    },
    onError: (err) => {
      console.error(err);
      return toast.error("Gagal menghapus produk.");
    },
  });

  const handleDeleteProduct = (product: Stock) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
      mutateDelete(product.id);
    }
  };

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
      if (editingProduct) {
        mutateEdit(values);
      } else {
        mutateAdd(values);
      }
    },
  });

  return {
    openModal,
    editingProduct,
    handleOpenModal,
    handleCloseModal,
    handleEditProduct,
    handleDeleteProduct,
    isPending: addPending || editPending || deletePending,
    formik,
  };
};

export default useAddProduct;
