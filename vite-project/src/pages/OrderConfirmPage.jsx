import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';
import { formatPrice } from '../utils/formatPrice';

export default function OrderConfirmPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        getOrderById(id).then(r => setOrder(r.data)).catch(() => { });
    }, [id]);

    if (!order) {
        return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">กำลังโหลด...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h1 className="text-2xl font-bold text-white mb-2">สั่งซื้อสำเร็จ!</h1>
            <p className="text-gray-400 mb-6">ขอบคุณสำหรับคำสั่งซื้อ เราจะดำเนินการจัดส่งให้เร็วที่สุด</p>

            <div className="bg-dark-card rounded-xl border border-dark-border p-6 text-left space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">หมายเลขคำสั่งซื้อ</span>
                    <span className="text-accent font-bold">{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">วิธีชำระเงิน</span>
                    <span className="text-white text-sm capitalize">{order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">สถานะ</span>
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-sm">รอดำเนินการ</span>
                </div>

                <hr className="border-dark-border" />

                <div>
                    <p className="text-gray-500 text-xs mb-2">รายการสินค้า</p>
                    {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between py-1">
                            <span className="text-gray-300 text-sm">{item.name} ×{item.qty}</span>
                            <span className="text-white text-sm">{formatPrice(item.subtotal)}</span>
                        </div>
                    ))}
                </div>

                <hr className="border-dark-border" />

                <div className="flex justify-between text-white font-bold text-lg">
                    <span>รวมทั้งหมด</span>
                    <span className="text-accent">{formatPrice(order.total)}</span>
                </div>

                {order.payment_method === 'bank_transfer' && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                        <p className="text-blue-400 font-semibold text-sm mb-2">🏦 ข้อมูลการโอนเงิน</p>
                        <p className="text-gray-300 text-sm">ธนาคารกสิกรไทย</p>
                        <p className="text-white font-mono">123-4-56789-0</p>
                        <p className="text-gray-300 text-sm">ชื่อบัญชี: บจก. เทคฮับ ไทยแลนด์</p>
                        <p className="text-gray-500 text-xs mt-2">กรุณาโอนเงินภายใน 24 ชั่วโมง แล้วแจ้งสลิปที่ LINE: @techhub</p>
                    </div>
                )}

                {order.payment_method === 'promptpay' && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-4">
                        <p className="text-purple-400 font-semibold text-sm mb-2">📱 PromptPay QR Code</p>
                        <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center">
                            <span className="text-gray-800 text-xs text-center p-4">QR Code<br />จะแสดงที่นี่<br />{formatPrice(order.total)}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-2 text-center">สแกนเพื่อชำระเงิน {formatPrice(order.total)}</p>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-6">
                <Link to="/account/orders" className="flex-1 border border-dark-border text-gray-300 py-3 rounded-xl text-center hover:bg-dark-card transition-colors">
                    ดูคำสั่งซื้อ
                </Link>
                <Link to="/" className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl text-center transition-colors">
                    กลับหน้าแรก
                </Link>
            </div>
        </div>
    );
}
