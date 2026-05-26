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

interface UsePaymentProps {
  isPickup?: boolean;
}

const usePayment = ({ isPickup = false }: UsePaymentProps = {}) => {
  const [onPage, setOnPage] = useState<OrderStatus>("default");
  const onPaymentPage = onPage === "payment";
  const onDefaultPage = onPage === "default";
  const onSearchingPage = onPage === "searching";
  const onDriverPage = onPage === "driver";
  const onPickupConfirmationPage = onPage === "delivered";
  const onCompletedPage = onPage === "completed";
  const onCancelledPage = onPage === "cancelled";
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Initialize and check localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pid = localStorage.getItem("qoin.currentPaymentId");
      if (pid) {
        setPaymentId(pid);
        setOnPage("searching");
      }
    }
  }, []);

  // Sync paymentId state from localStorage when page transitions to searching
  useEffect(() => {
    if (onSearchingPage && typeof window !== "undefined") {
      const pid = localStorage.getItem("qoin.currentPaymentId");
      if (pid) {
        setPaymentId(pid);
      }
    }
  }, [onSearchingPage]);

  // Connect to SSE stream
  useEffect(() => {
    if (!paymentId) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const eventSource = new EventSource(`${backendUrl}/api/stocks/order-stream/${paymentId}`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.status) {
          const status = data.status; // pending, processing, on_shipping, delivered, completed, cancelled
          setOrderStatus(status);

          if (status === "processing" || status === "on_shipping") {
            setIsSearching(false);
            setOnPage("driver");
          } else if (status === "delivered") {
            setIsSearching(false);
            if (isPickup) {
              setOnPage("delivered");
            } else {
              setOnPage("driver");
            }
          } else if (status === "completed") {
            setOnPage("completed");
          } else if (status === "cancelled") {
            setOnPage("cancelled");
          } else if (status === "pending") {
            setOnPage("searching");
            setIsSearching(true);
          }
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
    };

    return () => {
      eventSource.close();
    };
  }, [paymentId, isPickup]);

  const handlePage = (page: OrderStatus) => {
    setOnPage(page);
  };
  const handleOffPaymentPage = () => {
    setOnPage("default");
    setPaymentId(null);
    setOrderStatus("pending");
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
    orderStatus,
  };
};

export default usePayment;
