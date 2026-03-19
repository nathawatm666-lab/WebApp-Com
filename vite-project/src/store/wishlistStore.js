import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            addToWishlist: (product) => {
                set((state) => {
                    if (state.items.find(i => i.id === product.id)) return state;
                    return {
                        items: [...state.items, {
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            image: product.image,
                            price: product.price,
                            sale_price: product.sale_price
                        }]
                    };
                });
            },

            removeFromWishlist: (productId) => {
                set((state) => ({
                    items: state.items.filter(i => i.id !== productId)
                }));
            },

            isInWishlist: (productId) => get().items.some(i => i.id === productId),

            clearWishlist: () => set({ items: [] })
        }),
        { name: 'techhub-wishlist' }
    )
);

export default useWishlistStore;
