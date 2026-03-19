import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { formatPrice } from '../utils/formatPrice';
import { generateOrderNumber } from '../utils/helpers';
import { createOrder } from '../services/api';

const STEPS = ['ที่อยู่จัดส่ง', 'ชำระเงิน', 'ยืนยันคำสั่งซื้อ'];

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, getSubtotal, promoDiscount, clearCart } = useCartStore();
    const { user, isLoggedIn } = useAuthStore();
    const addToast = useToastStore(s => s.addToast);
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const [shipping, setShipping] = useState({
        name: user?.name || '', phone: user?.phone || '',
        address: '', district: '', province: '', postalCode: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('promptpay');

    const subtotal = getSubtotal();
    const shippingFee = subtotal >= 2000 ? 0 : 50;
    const total = Math.max(0, subtotal - promoDiscount) + shippingFee;

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <p className="text-text-muted">ตะกร้าว่าง กรุณาเลือกสินค้าก่อน</p>
                <Link to="/" className="text-accent mt-4 inline-block">กลับหน้าแรก</Link>
            </div>
        );
    }

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const order = {
                order_number: generateOrderNumber(),
                user_id: user?.id || 0,
                status: 'pending',
                payment_status: 'unpaid',
                payment_method: paymentMethod,
                subtotal,
                shipping_fee: shippingFee,
                discount: promoDiscount,
                total,
                items: items.map(i => ({
                    product_id: i.id, name: i.name, qty: i.quantity, price: i.price, subtotal: i.price * i.quantity
                })),
                shipping_address: shipping,
                tracking_number: null,
                created_at: new Date().toISOString().split('T')[0]
            };

            const res = await createOrder(order);
            clearCart();
            addToast('สั่งซื้อสำเร็จ!', 'success');
            navigate(`/order-confirm/${res.data.id}`);
        } catch {
            addToast('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
        }
        setSubmitting(false);
    };

    const paymentMethods = [
        { value: 'promptpay', label: '📱 พร้อมเพย์ (PromptPay)', desc: 'สแกน QR Code ชำระเงินทันที' },
        { value: 'bank_transfer', label: '🏦 โอนเงินผ่านธนาคาร', desc: 'โอนเงินแล้วแจ้งสลิป' },
        { value: 'cod', label: '💵 เก็บเงินปลายทาง (COD)', desc: 'ชำระเงินเมื่อรับสินค้า +฿20' },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-text-main mb-6">📋 ชำระเงิน</h1>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-8">
                {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i <= step ? 'bg-accent text-white' : 'bg-card text-text-muted border border-border'
                            }`}>{i + 1}</div>
                        <span className={`text-xs hidden sm:block ${i <= step ? 'text-text-main' : 'text-text-muted opacity-60'}`}>{s}</span>
                        {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-accent' : 'bg-border'}`} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Shipping */}
            {step === 0 && (
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-text-main">📍 ที่อยู่จัดส่ง</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { name: 'name', label: 'ชื่อ-นามสกุล', placeholder: 'สมชาย ใจดี' },
                            { name: 'phone', label: 'เบอร์โทรศัพท์', placeholder: '081-234-5678' },
                        ].map(f => (
                            <div key={f.name}>
                                <label className="text-text-muted text-sm mb-1 block">{f.label}</label>
                                <input
                                    value={shipping[f.name]}
                                    onChange={e => setShipping(p => ({ ...p, [f.name]: e.target.value }))}
                                    placeholder={f.placeholder}
                                    className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-text-main placeholder-text-muted/60 focus:border-accent focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="text-text-muted text-sm mb-1 block">ที่อยู่</label>
                        <textarea
                            value={shipping.address}
                            onChange={e => setShipping(p => ({ ...p, address: e.target.value }))}
                            placeholder="บ้านเลขที่ ซอย ถนน"
                            rows={2}
                            className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-text-main placeholder-text-muted/60 focus:border-accent focus:outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { name: 'district', label: 'เขต/อำเภอ' },
                            { name: 'province', label: 'จังหวัด' },
                            { name: 'postalCode', label: 'รหัสไปรษณีย์' },
                        ].map(f => (
                            <div key={f.name}>
                                <label className="text-text-muted text-sm mb-1 block">{f.label}</label>
                                <input
                                    value={shipping[f.name]}
                                    onChange={e => setShipping(p => ({ ...p, [f.name]: e.target.value }))}
                                    className="w-full bg-primary border border-border rounded-lg px-3 py-2.5 text-sm text-text-main placeholder-text-muted/60 focus:border-accent focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setStep(1)}
                        disabled={!shipping.name || !shipping.phone || !shipping.address}
                        className="w-full bg-accent hover:bg-accent-hover disabled:bg-card-hover disabled:text-text-muted text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                    >
                        ถัดไป →
                    </button>
                </div>
            )}

            {/* Step 2: Payment */}
            {step === 1 && (
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-text-main">💳 วิธีชำระเงิน</h2>
                    <div className="space-y-2">
                        {paymentMethods.map(pm => (
                            <label
                                key={pm.value}
                                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === pm.value ? 'border-accent bg-accent/5' : 'border-border hover:border-accent'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value={pm.value}
                                    checked={paymentMethod === pm.value}
                                    onChange={() => setPaymentMethod(pm.value)}
                                    className="accent-accent mt-1"
                                />
                                <div>
                                    <div className="text-text-main font-medium text-sm">{pm.label}</div>
                                    <div className="text-text-muted text-xs">{pm.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setStep(0)} className="flex-1 border border-border text-text-muted py-3 rounded-xl cursor-pointer hover:bg-card-hover hover:text-text-main transition-colors">← ย้อนกลับ</button>
                        <button onClick={() => setStep(2)} className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl cursor-pointer transition-colors">ถัดไป →</button>
                    </div>
                </div>
            )}

            {/* Step 3: Confirm */}
            {step === 2 && (
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-text-main">✅ ยืนยันคำสั่งซื้อ</h2>

                    <div className="bg-primary rounded-lg p-4">
                        <p className="text-text-muted text-xs mb-1">จัดส่งถึง</p>
                        <p className="text-text-main text-sm font-medium">{shipping.name} | {shipping.phone}</p>
                        <p className="text-text-muted text-sm">{shipping.address} {shipping.district} {shipping.province} {shipping.postalCode}</p>
                    </div>

                    <div className="bg-primary rounded-lg p-4">
                        <p className="text-text-muted text-xs mb-2">สินค้า ({items.length} รายการ)</p>
                        {items.map(i => (
                            <div key={i.id} className="flex justify-between py-1">
                                <span className="text-text-muted text-sm">{i.name} ×{i.quantity}</span>
                                <span className="text-text-main text-sm">{formatPrice(i.price * i.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-text-muted">
                            <span>ราคาสินค้า</span><span className="text-text-main">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-text-muted">
                            <span>ค่าจัดส่ง</span><span className={shippingFee === 0 ? 'text-green-400' : 'text-text-main'}>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                        </div>
                        {promoDiscount > 0 && (
                            <div className="flex justify-between text-green-400"><span>ส่วนลด</span><span>-{formatPrice(promoDiscount)}</span></div>
                        )}
                        <hr className="border-border" />
                        <div className="flex justify-between text-text-main font-bold text-lg">
                            <span>รวมทั้งหมด</span><span className="text-accent">{formatPrice(total)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="flex-1 border border-border text-text-muted py-3 rounded-xl cursor-pointer hover:bg-card-hover hover:text-text-main transition-colors">← ย้อนกลับ</button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 bg-accent hover:bg-accent-hover disabled:bg-card-hover disabled:text-text-muted text-white font-semibold py-3 rounded-xl cursor-pointer transition-colors"
                        >
                            {submitting ? '⏳ กำลังสั่งซื้อ...' : '✅ ยืนยันสั่งซื้อ'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
