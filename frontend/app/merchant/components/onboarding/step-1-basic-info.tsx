"use client";

import { MerchantFormSection } from "./form-section";
import { FormField } from "./form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const merchantTypes = [
  { label: "Salon & Spa", value: "salon" },
  { label: "Toko Fashion", value: "fashion" },
  { label: "Warung Makan", value: "makanan" },
  { label: "Toko Kelontong", value: "kelontong" },
  { label: "Lainnya", value: "lainnya" },
  { label: "Workshop & Jasa", value: "workshop_jasa" },
];

import type { FormikValues } from "formik";
interface Step1BasicInfoProps {
  formik: FormikValues;
}

export function Step1BasicInfo({ formik }: Step1BasicInfoProps) {
  const { values } = formik;
  const setFieldValue = formik.setFieldValue;
  return (
    <div className="space-y-6">
      <MerchantFormSection
        title="Identitas Toko"
        description="Lengkapi informasi dasar toko kamu"
      >
        <FormField
          label="Nama Toko"
          required
          helperText="Nama yang akan ditampilkan ke pelanggan"
        >
          <Input
            placeholder="Cth: Sumber Jaya Abadi"
            value={values.name}
            onChange={(e) => setFieldValue("name", e.target.value)}
          />
        </FormField>

        <FormField
          label="Jenis Usaha"
          required
          helperText="Pilih kategori yang paling sesuai dengan bisnis kamu"
        >
          <Select
            value={values.type}
            onValueChange={(value) => setFieldValue("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih jenis usaha" />
            </SelectTrigger>
            <SelectContent>
              {merchantTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Lokasi Toko"
          required
          helperText="Kecamatan, kelurahan, atau nama area terkenal"
        >
          <Input
            placeholder="Cth: Tanjungsari, Bandung"
            value={values.location}
            onChange={(e) => setFieldValue("location", e.target.value)}
          />
        </FormField>
      </MerchantFormSection>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          💡 <strong>Tip:</strong> Informasi ini akan membantu pelanggan
          menemukan toko mu dengan mudah.
        </p>
      </div>
    </div>
  );
}
