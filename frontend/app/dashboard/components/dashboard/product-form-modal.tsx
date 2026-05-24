"use client";

import type React from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormikProps } from "formik";
import { AddProductsForm } from "@/hooks/dashboard/use-add-product";
import { ImageUploadField } from "@/app/merchant/components/onboarding/image-upload-field";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;

  formik: FormikProps<AddProductsForm>;
}

export function ProductFormModal({
  isOpen,
  onClose,
  formik,
}: ProductFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-full max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Product Name
            </label>
            <input
              type="text"
              value={formik.values.name}
              name="name"
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <input
              type="text"
              value={formik.values.description}
              name="description"
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Price</label>
            <input
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              name="price"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Stock</label>
            <input
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              name="quantity"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-1"
              required
            />
          </div>
          <ImageUploadField
            label="Foto Produk"
            helperText="Gunakan foto yang jelas dan menarik. Recommended 400x400px"
            onImageSelect={(file, preview) => {
              formik.setFieldValue("product_photo", file);
              formik.setFieldValue("product_photo_preview", preview);
            }}
            preview={formik.values.product_photo_preview}
            aspectRatio="square"
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
