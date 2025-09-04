import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { api } from '@/utils/api';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  syncWithServer: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (productId: string) => CartItem | undefined;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === product.id);

        if (existingItem) {
          // Update existing item quantity
          const updatedItems = items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            product,
            quantity,
            price: product.price,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId: string) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.productId !== productId);
        set({ items: updatedItems });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const updatedItems = items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      syncWithServer: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        set({ isLoading: true });
        try {
          const response = await api.get('/cart');
          const cartData = response.data.data;
          set({ items: cartData.items || [], isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to sync cart',
            isLoading: false,
          });
        }
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItem: (productId: string) => {
        const { items } = get();
        return items.find(item => item.productId === productId);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
