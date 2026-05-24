"use client";

import { DataTable } from "@/app/dashboard/components/dashboard/data-table";
import { FilterBar } from "@/app/dashboard/components/dashboard/filter-bar";
import { ProductFormModal } from "../dashboard/product-form-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useAddProduct from "@/hooks/dashboard/use-add-product";
import { Merchant } from "@/types";

interface InventoryPageProps {
  merchant?: Merchant | null;
  isLoading?: boolean;
}

export function InventoryPage({ merchant }: InventoryPageProps) {
  const { formik, handleCloseModal, handleOpenModal, openModal } =
    useAddProduct();

  const merchantStocks = Array.isArray(merchant?.stocks)
    ? merchant?.stocks
    : [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <FilterBar
        // onSearch={setSearchQuery}
        searchPlaceholder="Search products..."
      />

      <DataTable
        title="Products"
        columns={[
          { key: "name", label: "Product Name" },
          { key: "quantity", label: "Quantity" },
          { key: "price", label: "Price" },
        ]}
        data={merchantStocks}
      />

      <ProductFormModal
        isOpen={openModal}
        onClose={handleCloseModal}
        formik={formik}
      />
    </div>
  );
}
