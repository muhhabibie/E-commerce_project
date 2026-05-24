"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, QrCode } from "lucide-react";
import Image from "next/image";

type BankCode = "bca" | "mandiri" | "bni" | "bri";

const banks: { code: BankCode; name: string; icon: string }[] = [
  { code: "bca", name: "Bank BCA", icon: "/images/bca-image.png" },
  { code: "mandiri", name: "Bank Mandiri", icon: "/images/mandiri-image.png" },
  { code: "bni", name: "Bank BNI", icon: "/images/bca-image.png" },
  { code: "bri", name: "Bank BRI", icon: "/images/bri-image.png" },
];

const CardPayment = () => {
  const [method, setMethod] = useState<"bank" | "qris">("bank");
  const [selectedBank, setSelectedBank] = useState<BankCode | null>(null);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Metode Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                {/* Stretch rows to the same width as QRIS by cancelling wrapper padding */}
                <div className="mt-2 -mx-4 divide-y">
                  {banks.map((b) => {
                    const active = method === "bank" && selectedBank === b.code;
                    return (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => {
                          setMethod("bank");
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

        <button
          type="button"
          onClick={() => setMethod("qris")}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 transition-colors hover:bg-muted/40 ${
            method === "qris" ? "bg-muted" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="grid size-6 place-items-center rounded bg-primary/10 text-primary">
              <QrCode className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-start">QRIS</p>
              <p className="text-sm text-muted-foreground">Scan dan bayar</p>
            </div>
          </div>
          {method === "qris" && <Check className="size-4 text-primary" />}
        </button>
      </CardContent>
    </Card>
  );
};

export default CardPayment;
