import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, ProductWithDetails, ProductColor, ProductSize } from '@/types'

interface CartStore {
  items: CartItem[];
  addItem: (product: ProductWithDetails, color: ProductColor, size: ProductSize, quantity?: number) => void;
  removeItem: (productId: string, colorId: string, sizeId: string) => void;
  updateQuantity: (productId: string, colorId: string, sizeId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getDeliveryFee: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, color, size, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find(
          item => item.product.id === product.id &&
                  item.color.id === color.id &&
                  item.size.id === size.id
        )

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id &&
              item.color.id === color.id &&
              item.size.id === size.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({ items: [...items, { product, color, size, quantity }] })
        }
      },

      removeItem: (productId, colorId, sizeId) => {
        set({
          items: get().items.filter(
            item => !(item.product.id === productId &&
                      item.color.id === colorId &&
                      item.size.id === sizeId)
          )
        })
      },

      updateQuantity: (productId, colorId, sizeId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, colorId, sizeId)
          return
        }
        set({
          items: get().items.map(item =>
            item.product.id === productId &&
            item.color.id === colorId &&
            item.size.id === sizeId
              ? { ...item, quantity }
              : item
          )
        })
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => {
          return sum + (item.product.price * item.quantity)
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getDeliveryFee: () => {
        return 30 // Default delivery fee
      },
    }),
    {
      name: 'batif-cart',
    }
  )
)
