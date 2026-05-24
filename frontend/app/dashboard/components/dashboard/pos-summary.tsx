"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface POSSummaryProps {
  subtotal: number
  tax: number
  total: number
  onCheckout: () => void
}

export function POSSummary({ subtotal, tax, total, onCheckout }: POSSummaryProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span className="font-medium">Rp {tax.toLocaleString()}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-lg">Rp {total.toLocaleString()}</span>
        </div>
        <Button onClick={onCheckout} className="w-full mt-4">
          Checkout
        </Button>
      </CardContent>
    </Card>
  )
}
