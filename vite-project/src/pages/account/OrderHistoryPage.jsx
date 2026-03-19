import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { getOrders } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUS_MAP } from '../../utils/helpers';

export default function OrderHistoryPage() {
    const { user, isLoggedIn } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getOrders({ user_id: user.id })
                .then(r => setOrders(r.data))
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!isLoggedIn) return <Navigate to="/login" />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
                <Link to="/" className="hover:text-accent">หน้าแรก</Link>
                <span>/</span>
                <span className="text-text-main">ประวัติคำสั่งซื้อ</span>
            </nav>

            <h1 className="text-2xl font-bold text-text-main mb-6">📦 ประวัติคำสั่งซื้อ</h1>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card rounded-xl animate-pulse" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">📭</p>
                    <p className="text-text-muted">ยังไม่มีคำสั่งซื้อ</p>
                    <Link to="/" className="text-accent mt-4 inline-block">เริ่มช้อปเลย →</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => {
                        const status = ORDER_STATUS_MAP[order.status] || { text: order.status, color: 'bg-card-hover text-text-muted' };
                        return (
                            <div key={order.id} className="bg-card rounded-xl border border-border p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                    <div>
                                        <span className="text-accent font-mono font-bold">{order.order_number}</span>
                                        <span className="text-text-muted text-sm ml-3">{order.created_at}</span>
                                    </div>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                                        {status.text}
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-text-muted">{item.name} ×{item.qty}</span>
                                            <span className="text-text-main">{formatPrice(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <span className="text-text-muted text-sm">
                                        {order.tracking_number && <>📦 {order.tracking_number}</>}
                                    </span>
                                    <span className="text-text-main font-bold">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
