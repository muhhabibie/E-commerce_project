"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format-price";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface PickupConfirmationProps {
  merchantName: string;
  total: number;
}

const PickupConfirmation = ({
  merchantName,
  total,
}: PickupConfirmationProps) => {
  const [pickupCode, setPickupCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const router = useRouter();
  const { paymentId } = useParams();

  useEffect(() => {
    // Generate unique pickup code
    const code = `PU${Date.now().toString().slice(-8)}`;
    setPickupCode(code);

    // Generate QR code URL (using QR code API)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      JSON.stringify({
        type: "pickup",
        code: code,
        merchant: merchantName,
        amount: total,
        timestamp: Date.now(),
      })
    )}`;
    setQrCodeUrl(qrUrl);
  }, [merchantName, total]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pickupCode);
    setCopied(true);
    toast.success("Kode pickup berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Pembayaran Berhasil!
              </h2>
              <p className="text-gray-600">
                Pesanan Anda siap untuk diambil di toko
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Card */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-center">Kode Pickup Anda</h3>
          <p className="text-sm text-gray-600 text-center">
            Tunjukkan kode ini ke kasir saat mengambil pesanan
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-2xl">
              {qrCodeUrl ? (
                <Image
                  src={qrCodeUrl}
                  alt="QR Code Pickup"
                  width={192}
                  height={192}
                  className="w-48 h-48"
                  unoptimized
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-xl" />
              )}
            </div>
          </div>

          {/* Pickup Code */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Atau gunakan kode unik ini:
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-bold tracking-wider text-primary">
                  {pickupCode}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className="h-12 w-12"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Detail Pesanan</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{merchantName}</p>
              <p className="text-sm text-gray-600">Lokasi Pengambilan</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Siap dalam 15-30 menit</p>
              <p className="text-sm text-gray-600">Estimasi Waktu Persiapan</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Pembayaran</span>
              <span className="text-2xl font-bold text-primary">
                Rp {formatPrice(total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50/50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-bold mb-3 text-blue-900">
            📋 Cara Mengambil Pesanan:
          </h4>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Datang ke lokasi toko dalam 15-30 menit</li>
            <li>2. Tunjukkan QR code atau kode unik ke kasir</li>
            <li>3. Kasir akan memverifikasi pesanan Anda</li>
            <li>4. Terima pesanan dan nikmati! 😊</li>
          </ol>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={() => (window.location.href = "/")}
        >
          Kembali ke Beranda
        </Button>
        <Button
          className="flex-1 h-12"
          onClick={() => router.push(`/merchant/${paymentId}`)}
        >
          Pesan Lagi
        </Button>
      </div>
    </div>
  );
};

export default PickupConfirmation;
