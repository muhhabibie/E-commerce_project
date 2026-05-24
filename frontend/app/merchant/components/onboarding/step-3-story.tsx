"use client";

import { useRef } from "react";
import type { MerchantFormData } from "@/hooks/merchant/use-register-merchant";
import type { FormikProps } from "formik";
import { MerchantFormSection } from "./form-section";
import { FormField } from "./form-field";
import { Textarea } from "@/components/ui/textarea";
import { GalleryGrid } from "./gallery-grid";
interface Step3StoryProps {
  formik: FormikProps<MerchantFormData>;
}

export function Step3Story({ formik }: Step3StoryProps) {
  const { values } = formik;
  const setFieldValue = formik.setFieldValue;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddGalleryImage = (file: File) => {
    setFieldValue("gallery_photos", [...values.gallery_photos, file]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFieldValue(
      "gallery_photos",
      values.gallery_photos.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <MerchantFormSection
        title="Cerita & Galeri"
        description="Ceritakan kisah toko mu dan tunjukkan produk terbaik"
      >
        <FormField
          label="Deskripsi Toko"
          required
          helperText="Ceritakan jenis produk, target pelanggan, dan keunikan toko mu (min. 20 karakter)"
        >
          <Textarea
            placeholder="Cth: Kami menjual masakan tradisional Indonesia dengan bahan-bahan pilihan dan resep turun-temurun selama 20 tahun..."
            value={values.description}
            onChange={(e) => setFieldValue("description", e.target.value)}
            className="min-h-32"
          />
        </FormField>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            Galeri Produk
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            Upload hingga 6 foto untuk menunjukkan produk dan suasana toko mu
          </p>

          {values.gallery_photos.length > 0 && (
            <div className="mb-4">
              <GalleryGrid
                photos={values.gallery_photos}
                onRemove={handleRemoveGalleryImage}
              />
            </div>
          )}

          {values.gallery_photos.length < 6 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  + Tambah Foto ({values.gallery_photos.length}/6)
                </p>
                <p className="text-xs text-text-secondary">
                  Klik untuk memilih gambar
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      handleAddGalleryImage(file);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </div>
          )}
        </div>
      </MerchantFormSection>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          💡 <strong>Tips Galeri:</strong> Foto berkualitas tinggi akan
          meningkatkan kepercayaan pelanggan terhadap produk mu.
        </p>
      </div>
    </div>
  );
}
