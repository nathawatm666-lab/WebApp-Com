import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';
import { formatPrice } from '../utils/formatPrice';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, clearCart, getSubtotal, getTotal, promoCode, promoDiscount, applyPromo, removePromo } = useCartStore();
    const addToast = useToastStore(s => s.addToast);
    const subtotal = getSubtotal();
    const total = getTotal();
    const shippingFee = subtotal >= 2000 ? 0 : 50;
    const grandTotal = total + shippingFee;

    const handlePromo = (e) => {
        e.preventDefault();
        const code = e.target.code.value.trim().toUpperCase();
        if (code === 'WELCOME10') {
            const discount = Math.round(subtotal * 0.1);
            applyPromo(code, discount);
            addToast(`ใช้โค้ด ${code} สำเร็จ ลด ${formatPrice(discount)}`, 'success');
        } else if (code === 'FREESHIP') {
            applyPromo(code, 0);
            addToast('ใช้โค้ด FREESHIP สำเร็จ ส่งฟรี!', 'success');
        } else {
            addToast('โค้ดส่วนลดไม่ถูกต้อง', 'error');
        }
        e.target.reset();
    };

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <p className="text-6xl mb-4">🛒</p>
                <h1 className="text-2xl font-bold text-white mb-2">ตะกร้าสินค้าว่างเปล่า</h1>
                <p className="text-gray-500 mb-6">ยังไม่มีสินค้าในตะกร้า เริ่มช้อปเลย!</p>
                <Link to="/" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                    เลือกซื้อสินค้า
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-accent">หน้าแรก</Link>
                <span>/</span>
                <span className="text-white">ตะกร้าสินค้า</span>
            </nav>

            <h1 className="text-2xl font-bold text-white mb-6">🛒 ตะกร้าสินค้า ({items.length} รายการ)</h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Cart items */}
                <div className="flex-1 space-y-3">
                    {items.map(item => (
                        <div key={item.id} className="bg-dark-card rounded-xl border border-dark-border p-4 flex gap-4">
                            <Link to={`/product/${item.slug}`} className="w-20 h-20 bg-dark rounded-lg overflow-hidden shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link to={`/product/${item.slug}`} className="text-white font-medium text-sm hover:text-accent transition-colors line-clamp-2">
                                    {item.name}
                                </Link>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-accent font-bold">{formatPrice(item.price)}</span>
                                    {item.on_sale && item.originalPrice !== item.price && (
                                        <span className="text-gray-500 text-xs line-through">{formatPrice(item.originalPrice)}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center border border-dark-border rounded-lg">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1 text-gray-400 hover:text-white text-sm cursor-pointer">−</button>
                                        <span className="px-3 py-1 text-white text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-gray-400 hover:text-white text-sm cursor-pointer">+</button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                                        <button onClick={() => { removeFromCart(item.id); addToast('ลบสินค้าออกจากตะกร้าแล้ว'); }} className="text-gray-500 hover:text-red-400 cursor-pointer">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button onClick={() => { clearCart(); addToast('ล้างตะกร้าสินค้าแล้ว'); }} className="text-red-400 text-sm hover:underline cursor-pointer">
                        ลบสินค้าทั้งหมด
                    </button>
                </div>

                {/* Summary */}
                <div className="lg:w-80 shrink-0">
                    <div className="bg-dark-card rounded-xl border border-dark-border p-5 sticky top-24 space-y-4">
                        <h3 className="text-white font-semibold">สรุปคำสั่งซื้อ</h3>

                        {/* Promo code */}
                        <form onSubmit={handlePromo} className="flex gap-2">
                            <input
                                name="code"
                                placeholder="โค้ดส่วนลด"
                                className="flex-1 bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600"
                            />
                            <button type="submit" className="bg-dark-lighter border border-dark-border text-white px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors cursor-pointer">ใช้โค้ด</button>
                        </form>

                        {promoCode && (
                            <div className="flex items-center justify-between bg-green-500/10 rounded-lg px-3 py-2">
                                <span className="text-green-400 text-sm">✅ {promoCode}</span>
                                <button onClick={removePromo} className="text-gray-500 hover:text-red-400 text-xs cursor-pointer">ลบ</button>
                            </div>
                        )}

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-400">
                                <span>ราคาสินค้า</span>
                                <span className="text-white">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>ค่าจัดส่ง</span>
                                <span className={shippingFee === 0 ? 'text-green-400' : 'text-white'}>
                                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                                </span>
                            </div>
                            {promoDiscount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>ส่วนลด</span>
                                    <span>-{formatPrice(promoDiscount)}</span>
                                </div>
                            )}
                            <hr className="border-dark-border" />
                            <div className="flex justify-between text-white font-bold text-lg">
                                <span>รวมทั้งหมด</span>
                                <span className="text-accent">{formatPrice(grandTotal)}</span>
                            </div>
                        </div>

                        {subtotal < 2000 && (
                            <p className="text-xs text-gray-500">🚚 สั่งเพิ่มอีก {formatPrice(2000 - subtotal)} เพื่อรับส่งฟรี</p>
                        )}

                        <Link
                            to="/checkout"
                            className="block w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl text-center transition-colors"
                        >
                            ดำเนินการสั่งซื้อ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
