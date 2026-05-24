import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export interface MerchantFormData {
  name: string;
  type: string;
  location: string;
  description: string;
  google_maps_url?: string;
  iframe_map_url?: string;
  profile_photo: File | null;
  profile_photo_preview: string;
  banner_img: File | null;
  banner_img_preview: string;
  gallery_photos: (File | string)[];
  latitude?: number;
  longitude?: number;
}

const getCurrentCoordinates = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Browser tidak mendukung geolocation."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Akses lokasi ditolak oleh pengguna."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Lokasi tidak tersedia."));
            break;
          case error.TIMEOUT:
            reject(new Error("Permintaan lokasi timeout."));
            break;
          default:
            reject(new Error("Gagal mendapatkan lokasi."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};

const convertToFormData = (values: MerchantFormData) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("type", values.type);
  formData.append("location", values.location);
  formData.append("description", values.description);

  if (values.google_maps_url) {
    formData.append("google_maps_url", values.google_maps_url);
  }

  if (values.iframe_map_url) {
    formData.append("iframe_map_url", values.iframe_map_url);
  }

  if (values.latitude !== undefined) {
    formData.append("latitude", values.latitude.toString());
  }

  if (values.longitude !== undefined) {
    formData.append("longitude", String(values.longitude));
  }

  // file utama
  if (values.profile_photo instanceof File) {
    formData.append("profile_photo", values.profile_photo);
  }

  if (values.banner_img instanceof File) {
    formData.append("banner_img", values.banner_img);
  }

  values.gallery_photos.forEach((photo) => {
    if (photo instanceof File) {
      formData.append("gallery_photos", photo);
    }
  });

  return formData;
};

const useRegisterMerchant = () => {
  const router = useRouter()
  const queryClient = useQueryClient();
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (values: MerchantFormData) => {
      const formData = convertToFormData(values);
      const response = await axiosInstance.post(
        "/api/merchant/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onError: (err: any) => {
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Gagal mendaftar merchant.";
      return toast.error(`Gagal mendaftar merchant: ${serverMessage}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      router.push('/user/merchant')
      return toast.success("Berhasil mendaftar merchant.");
    },
  });

  const formik = useFormik<MerchantFormData>({
    initialValues: {
      name: "",
      type: "",
      location: "",
      description: "",
      google_maps_url: "",
      iframe_map_url: "",
      profile_photo: null,
      profile_photo_preview: "",
      banner_img: null,
      banner_img_preview: "",
      gallery_photos: [],
      latitude: undefined,
      longitude: undefined,
    },
    onSubmit: async (values) => {
      mutate(values);
    },
  });
  const fetchCurrentCoordinates = useCallback(async () => {
    setLocationError(null);
    setLocating(true);
    try {
      const { latitude, longitude } = await getCurrentCoordinates();
      formik.setFieldValue("latitude", latitude);
      formik.setFieldValue("longitude", longitude);
      toast.success("Koordinat berhasil diambil");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal ambil lokasi";
      setLocationError(message);
      toast.error(message);
    } finally {
      setLocating(false);
    }
  }, [formik]);
  return {
    formik,
    isPending,
    isError,
    locating,
    locationError,
    fetchCurrentCoordinates,
  };
};

export default useRegisterMerchant;
