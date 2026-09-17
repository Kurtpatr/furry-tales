import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_KEY = "furry-tales-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("furry-tales-cart-updated"));
}

export function addCartItem(item: Omit<CartItem, "quantity">) {
  const current = readCart();
  const existing = current.find((entry) => entry.id === item.id);
  writeCart(existing ? current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { ...item, quantity: 1 }]);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCart());
  useEffect(() => {
    const sync = () => setItems(readCart());
    window.addEventListener("storage", sync);
    window.addEventListener("furry-tales-cart-updated", sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("furry-tales-cart-updated", sync); };
  }, []);
  return {
    items,
    count: cartCount(items),
    subtotal: cartSubtotal(items),
    add: addCartItem,
    update: (id: string, quantity: number) => writeCart(quantity > 0 ? items.map((item) => item.id === id ? { ...item, quantity } : item) : items.filter((item) => item.id !== id)),
    remove: (id: string) => writeCart(items.filter((item) => item.id !== id)),
    clear: () => writeCart([]),
  };
}
