import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product._id === product._id);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { product, quantity }],
          });
        }
      },
      
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        })),
      
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      
      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
