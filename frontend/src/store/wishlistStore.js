import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const items = get().items;
        const exists = items.find((item) => item._id === product._id);
        
        if (!exists) {
          set({ items: [...items, product] });
        }
      },
      
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),
      
      isInWishlist: (productId) => {
        const items = get().items;
        return items.some((item) => item._id === productId);
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
