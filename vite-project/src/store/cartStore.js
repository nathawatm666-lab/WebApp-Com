import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            promoCode: null,
            promoDiscount: 0,

            addToCart: (product, qty = 1) => {
                set((state) => {
                    const existing = state.items.find(i => i.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map(i =>
                                i.id === product.id
                                    ? { ...i, quantity: Math.min(i.quantity + qty, product.stock || 99) }
                                    : i
                            )
                        };
                    }
                    return {
                        items: [...state.items, {
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            image: product.image,
                            price: product.on_sale && product.sale_price ? product.sale_price : product.price,
                            originalPrice: product.price,
                            on_sale: product.on_sale,
                            stock: product.stock,
                            quantity: qty
                        }]
                    };
                });
            },

            removeFromCart: (productId) => {
                set((state) => ({
                    items: state.items.filter(i => i.id !== productId)
                }));
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map(i =>
                        i.id === productId ? { ...i, quantity: Math.min(quantity, i.stock || 99) } : i
                    )
                }));
            },

            clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

            applyPromo: (code, discount) => set({ promoCode: code, promoDiscount: discount }),
            removePromo: () => set({ promoCode: null, promoDiscount: 0 }),

            get itemCount() {
                return get().items.reduce((sum, i) => sum + i.quantity, 0);
            },

            get subtotal() {
                return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
            },

            get total() {
                const sub = get().subtotal;
                return Math.max(0, sub - get().promoDiscount);
            },

            getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
            getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            getTotal: () => {
                const sub = get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
                return Math.max(0, sub - get().promoDiscount);
            }
        }),
        { name: 'techhub-cart' }
    )
);

export default useCartStore;
