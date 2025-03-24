import { create } from "zustand";
import { Product } from "./use-products";

export interface CartItem {
  product: Product;
  quantity: number;
  deduction: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, deduction: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateDeduction: (productId: number, deduction: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalDeduction: () => number;
  getNetAmount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, quantity, deduction) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity, deduction }
              : item
          ),
        };
      } else {
        return {
          items: [...state.items, { product, quantity, deduction }],
        };
      }
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  updateDeduction: (productId, deduction) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, deduction } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalAmount: () => {
    return get().items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  },

  getTotalDeduction: () => {
    return get().items.reduce((total, item) => {
      return total + item.deduction;
    }, 0);
  },

  getNetAmount: () => {
    return get().getTotalAmount() - get().getTotalDeduction();
  },
}));

export const useCart = () => {
  const cart = useCartStore();

  return {
    items: cart.items,
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    updateDeduction: cart.updateDeduction,
    clearCart: cart.clearCart,
    totalAmount: cart.getTotalAmount(),
    totalDeduction: cart.getTotalDeduction(),
    netAmount: cart.getNetAmount(),
  };
};
