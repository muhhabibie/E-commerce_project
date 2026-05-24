"use client";

import { useState } from "react";
import { POSCartItem } from "@/app/dashboard/components/dashboard/pos-cart-item";
import { POSSummary } from "@/app/dashboard/components/dashboard/pos-summary";
import { FilterBar } from "@/app/dashboard/components/dashboard/filter-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

const mockProducts = [
  { id: "1", name: "Laptop", price: 15000000, category: "Electronics" },
  { id: "2", name: "Mouse", price: 500000, category: "Electronics" },
  { id: "3", name: "Keyboard", price: 1500000, category: "Electronics" },
  { id: "4", name: "Monitor", price: 3000000, category: "Electronics" },
  { id: "5", name: "Headphones", price: 2000000, category: "Electronics" },
  { id: "6", name: "USB Cable", price: 100000, category: "Electronics" },
];

export function POSPage() {
  const [cart, setCart] = useState<
    Array<{ id: string; name: string; price: number; quantity: number }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: (typeof mockProducts)[0]) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    alert(`Order completed! Total: Rp ${total.toLocaleString()}`);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Point of Sale
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Manage your sales transactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Products */}
        <div className="lg:col-span-2 space-y-4">
          <FilterBar
            onSearch={setSearchQuery}
            searchPlaceholder="Search products..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="font-bold text-sm md:text-lg">
                      Rp {product.price.toLocaleString()}
                    </p>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="hidden lg:block space-y-4">
          <div className="bg-card border border-border rounded-md p-4">
            <h2 className="font-bold text-foreground mb-4">Shopping Cart</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-sm">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <POSCartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))
              )}
            </div>
          </div>
          <POSSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
          />
        </div>

        <div className="lg:hidden">
          <Button
            onClick={() => setShowCart(!showCart)}
            className="w-full"
            variant={cart.length > 0 ? "default" : "outline"}
          >
            View Cart ({cart.length})
          </Button>

          {showCart && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCart(false)}
            />
          )}

          {showCart && (
            <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-lg p-4 z-50 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Cart is empty</p>
                ) : (
                  cart.map((item) => (
                    <POSCartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <POSSummary
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
