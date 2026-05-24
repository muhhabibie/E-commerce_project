import { useEffect, useState } from "react";

// State Machine: harus sesuai dengan enum order_status di database backend
export type OrderStatus =
  | "default"       // Halaman checkout awal
  | "payment"       // Sedang menampilkan halaman pembayaran
  | "searching"     // Menunggu konfirmasi (pending → processing)
  | "driver"        // Barang sedang dikirim (on_shipping)
  | "delivered"     // Barang sudah sampai (delivered)
  | "completed"     // Transaksi selesai
  | "cancelled";    // Pesanan dibatalkan

const usePayment = () => {
  const [onPage, setOnPage] = useState<OrderStatus>("default");
  const onPaymentPage = onPage === "payment";
  const onDefaultPage = onPage === "default";
  const onSearchingPage = onPage === "searching";
  const onDriverPage = onPage === "driver";
  const onPickupConfirmationPage = onPage === "delivered";
  const onCompletedPage = onPage === "completed";
  const onCancelledPage = onPage === "cancelled";
  const [isSearching, setIsSearching] = useState(false);

  // Removed localStorage bootstrap to prevent user getting stuck in driver simulation after refresh
  useEffect(() => {
    // Intentionally empty
  }, []);

  // When entering searching page, show searching for 5s then go to driver page
  useEffect(() => {
    if (!onSearchingPage) return;
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
      setOnPage("driver");
    }, 5000);
    return () => clearTimeout(timer);
  }, [onSearchingPage]);

  const handlePage = (page: OrderStatus) => {
    setOnPage(page);
  };
  const handleOffPaymentPage = () => {
    setOnPage("default");
  };

  return {
    onPaymentPage,
    onDefaultPage,
    onSearchingPage,
    onDriverPage,
    onPickupConfirmationPage,
    onCompletedPage,
    onCancelledPage,
    onPage,
    handlePage,
    handleOffPaymentPage,
    isSearching,
  };
};

export default usePayment;
