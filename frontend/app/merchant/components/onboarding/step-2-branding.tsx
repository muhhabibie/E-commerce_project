"use client";

import { MerchantFormSection } from "./form-section";
import { ImageUploadField } from "./image-upload-field";
import type { MerchantFormData } from "@/hooks/merchant/use-register-merchant";
import type { FormikProps } from "formik";

interface Step2BrandingProps {
  formik: FormikProps<MerchantFormData>;
}

export function Step2Branding({ formik }: Step2BrandingProps) {
  const { values } = formik;
  const setFieldValue = formik.setFieldValue;
  return (
    <div className="space-y-6">
      <MerchantFormSection
        title="Profil & Branding"
        description="Gunakan gambar yang menarik untuk menarik perhatian pelanggan"
      >
        <ImageUploadField
          label="Logo / Foto Profil Toko"
          helperText="Gunakan foto yang jelas dan menarik. Recommended 400x400px"
          onImageSelect={(file, preview) => {
            setFieldValue("profile_photo", file);
            setFieldValue("profile_photo_preview", preview);
          }}
          preview={values.profile_photo_preview}
          aspectRatio="square"
        />

        <ImageUploadField
          label="Banner / Gambar Cover Toko"
          helperText="Foto toko atau produk unggulan mu. Recommended 1200x400px"
          onImageSelect={(file, preview) => {
            setFieldValue("banner_img", file);
            setFieldValue("banner_img_preview", preview);
          }}
          preview={values.banner_img_preview}
          aspectRatio="wide"
        />
      </MerchantFormSection>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          💡 <strong>Tips Branding:</strong> Gunakan gambar berkualitas tinggi
          yang mencerminkan identitas bisnis mu.
        </p>
      </div>
    </div>
  );
}
