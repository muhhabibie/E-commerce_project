"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, QrCode, Wallet } from "lucide-react";
import Image from "next/image";
import useGetUser from "@/hooks/auth/use-get-user";
import { formatPrice } from "@/lib/format-price";

type BankCode = "bca" | "mandiri" | "bni" | "bri";

const banks: { code: BankCode; name: string; icon: string }[] = [
  { code: "bca", name: "Bank BCA", icon: "/images/bca-image.png" },
  { code: "mandiri", name: "Bank Mandiri", icon: "/images/mandiri-image.png" },
  { code: "bni", name: "Bank BNI", icon: "/images/bca-image.png" },
  { code: "bri", name: "Bank BRI", icon: "/images/bri-image.png" },
];

interface CardPaymentProps {
  selectedMethod: "bank" | "qris" | "saldo";
  onChange: (method: "bank" | "qris" | "saldo") => void;
}

const CardPayment = ({ selectedMethod, onChange }: CardPaymentProps) => {
  const { data } = useGetUser();
  const [selectedBank, setSelectedBank] = useState<BankCode | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUser = (data as any)?.data ?? (data as any) ?? {};
  const balance = rawUser?.balance ?? 0;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Metode Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saldo Wallet Option (PREMIUM) */}
        <button
          type="button"
          onClick={() => onChange("saldo")}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 transition-colors hover:bg-muted/40 text-left ${
            selectedMethod === "saldo" ? "bg-muted" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-green-100 text-green-600">
              <Wallet className="size-5 animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-sm">Saldo Dompet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sisa Saldo: <span className="font-bold text-green-600">Rp {formatPrice(balance)}</span>
              </p>
            </div>
          </div>
          {selectedMethod === "saldo" && <Check className="size-4 text-primary" />}
        </button>

        {/* Bank Transfer */}
        <div className="rounded-xl border p-4">
          <Accordion type="single" collapsible defaultValue="bank">
            <AccordionItem value="bank" className="border-none">
              <AccordionTrigger className="px-0 hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <div className="text-left">
                    <p className="font-semibold">Transfer Bank</p>
                    <p className="text-sm text-muted-foreground">
                      Pilih bank dan bayar
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="mt-2 -mx-4 divide-y">
                  {banks.map((b) => {
                    const active = selectedMethod === "bank" && selectedBank === b.code;
                    return (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => {
                          onChange("bank");
                          setSelectedBank(b.code);
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 ${
                          active ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <Image
                              src={b.icon}
                              alt={b.name}
                              width={24}
                              height={24}
                            />
                          </div>
                          <span className="text-sm font-medium">{b.name}</span>
                        </div>
                        {active ? (
                          <Check className="size-4 text-primary" />
                        ) : (
                          <span className="size-4" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* QRIS */}
        <button
          type="button"
          onClick={() => onChange("qris")}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 transition-colors hover:bg-muted/40 ${
            selectedMethod === "qris" ? "bg-muted" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="grid size-6 place-items-center rounded bg-primary/10 text-primary">
              <QrCode className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-start">QRIS</p>
              <p className="text-sm text-muted-foreground text-start">Scan dan bayar</p>
            </div>
          </div>
          {selectedMethod === "qris" && <Check className="size-4 text-primary" />}
        </button>
      </CardContent>
    </Card>
  );
};

export default CardPayment;
