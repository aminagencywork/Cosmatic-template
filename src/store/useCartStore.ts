import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  shade?: string;
  quantity: number;
};

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, shade?: string) => void;
  updateQuantity: (id: string, shade: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) => item.id === newItem.id && item.shade === newItem.shade
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (id, shade) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.shade === shade)),
        });
      },
      updateQuantity: (id, shade, quantity) => {
        const items = get().items;
        const itemIndex = items.findIndex(
          (item) => item.id === id && item.shade === shade
        );
        if (itemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[itemIndex].quantity = Math.max(1, quantity);
          set({ items: updatedItems });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'lumiere-cart',
    }
  )
);
