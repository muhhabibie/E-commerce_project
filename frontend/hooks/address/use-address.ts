"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export interface Address {
  id: string;
  name: string;
  recipient: string;
  phone: string;
  address: string;
  is_primary: boolean;
}

export const useAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [primaryAddress, setPrimaryAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/api/addresses");
      const list = res.data.data;
      setAddresses(list);
      
      const primary = list.find((a: Address) => a.is_primary) || list[0] || null;
      setPrimaryAddress(primary);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const saveAddress = async (data: Omit<Address, "id" | "is_primary"> & { is_primary?: boolean }) => {
    try {
      await axiosInstance.post("/api/addresses", data);
      await fetchAddresses(); // Refresh list after saving
      return true;
    } catch (error) {
      console.error("Failed to save address:", error);
      return false;
    }
  };

  return {
    addresses,
    primaryAddress,
    isLoading,
    saveAddress,
    refresh: fetchAddresses,
  };
};
