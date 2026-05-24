"use client";

import type { MerchantFormData } from "@/hooks/merchant/use-register-merchant";
import type { FormikProps } from "formik";
import { MerchantFormSection } from "./form-section";
import { FormField } from "./form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface Step4LocationProps {
  formik: FormikProps<MerchantFormData>;
  fetchCurrentCoordinates?: () => Promise<void>;
  locating?: boolean;
  locationError?: string | null;
}

export function Step4Location({
  formik,
  fetchCurrentCoordinates,
  locating,
  locationError,
}: Step4LocationProps) {
  const { values } = formik;
  const setFieldValue = formik.setFieldValue;
  return (
    <div className="space-y-6">
      <MerchantFormSection
        title="Lokasi Toko di Peta"
        description="Bantu pelanggan menemukan toko mu dengan lebih mudah (opsional)"
      >
        <div className="mb-4">
          <FormField
            label="Masukkan link Google Maps"
            helperText="Tempelkan URL lokasi toko dari Google Maps"
          >
            <Input
              type="url"
              placeholder="https://maps.google.com/..."
              value={values.google_maps_url ?? ""}
              onChange={(e) => setFieldValue("google_maps_url", e.target.value)}
            />
          </FormField>
        </div>

        <div className="mb-4">
          <FormField
            label="Iframe Google Maps (opsional)"
            helperText="Tempelkan kode iframe dari Google Maps (hanya src atau full iframe)"
          >
            <Input
              type="text"
              placeholder='&lt;iframe src=\"https://www.google.com/maps/embed?...\" ... /&gt; atau hanya URL embed'
              value={values.iframe_map_url ?? ""}
              onChange={(e) => setFieldValue("iframe_map_url", e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Latitude" helperText="Cth: -6.9271">
            <Input
              type="number"
              placeholder="-6.9271"
              step="0.0001"
              value={values.latitude ?? ""}
              onChange={(e) =>
                setFieldValue(
                  "latitude",
                  e.target.value ? Number.parseFloat(e.target.value) : undefined
                )
              }
            />
          </FormField>

          <FormField label="Longitude" helperText="Cth: 107.6411">
            <Input
              type="number"
              placeholder="107.6411"
              step="0.0001"
              value={values.longitude ?? ""}
              onChange={(e) =>
                setFieldValue(
                  "longitude",
                  e.target.value ? Number.parseFloat(e.target.value) : undefined
                )
              }
            />
          </FormField>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={fetchCurrentCoordinates}
            disabled={locating}
            className="text-white"
          >
            {locating ? "Mengambil lokasi..." : "Gunakan lokasi saya"}
          </Button>
          {locationError ? (
            <p className="text-sm text-red-500">{locationError}</p>
          ) : null}
        </div>
      </MerchantFormSection>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          💡 <strong>Tips Lokasi:</strong> Pastikan koordinat akurat agar
          pelanggan mudah menemukan toko mu di peta.
        </p>
      </div>
    </div>
  );
}
