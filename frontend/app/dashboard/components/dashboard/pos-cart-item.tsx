"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface POSCartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function POSCartItem({
  name,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}: POSCartItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-md">
      <div className="flex-1">
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">
          Rp {price.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onQuantityChange(quantity + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
