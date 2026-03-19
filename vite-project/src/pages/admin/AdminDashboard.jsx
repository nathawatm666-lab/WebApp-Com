import { useEffect, useState } from 'react';
import { getOrders, getProducts } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUS_MAP } from '../../utils/helpers';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getOrders(), getProducts()])
            .then(([ordRes, prodRes]) => {
                setOrders(ordRes.data);
                setProducts(prodRes.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const lowStock = products.filter(p => p.stock <= 5).length;
    const totalProducts = products.length;

    const stats = [
        { label: 'รายได้ทั้งหมด', value: formatPrice(totalRevenue), icon: '💰', color: 'from-green-500/20 to-emerald-500/10 border-green-500/30' },
        { label: 'ออเดอร์ที่รอดำเนินการ', value: pendingOrders, icon: '📦', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30' },
        { label: 'สินค้าใกล้หมด', value: lowStock, icon: '⚠️', color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30' },
        { label: 'สินค้าทั้งหมด', value: totalProducts, icon: '📋', color: 'from-purple-500/20 to-violet-500/10 border-purple-500/30' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">📊 แดชบอร์ด</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.color} border rounded-xl p-5`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">{s.label}</span>
                            <span className="text-2xl">{s.icon}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue chart placeholder */}
            <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">📈 ยอดขาย (30 วัน)</h2>
                <div className="flex items-end gap-1 h-40">
                    {Array.from({ length: 30 }, (_, i) => {
                        const height = Math.random() * 80 + 20;
                        return (
                            <div key={i} className="flex-1 bg-accent/30 hover:bg-accent/60 rounded-t transition-colors cursor-pointer" style={{ height: `${height}%` }} title={`วันที่ ${i + 1}`} />
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>1 วันก่อน</span><span>15 วันก่อน</span><span>30 วันก่อน</span>
                </div>
            </div>

            {/* Recent orders */}
            <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
                <div className="p-5 border-b border-dark-border">
                    <h2 className="text-lg font-semibold text-white">🛒 คำสั่งซื้อล่าสุด</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border text-left">
                                <th className="px-5 py-3 text-xs text-gray-500 font-medium">ออเดอร์</th>
                                <th className="px-5 py-3 text-xs text-gray-500 font-medium">วันที่</th>
                                <th className="px-5 py-3 text-xs text-gray-500 font-medium">สถานะ</th>
                                <th className="px-5 py-3 text-xs text-gray-500 font-medium">การชำระ</th>
                                <th className="px-5 py-3 text-xs text-gray-500 font-medium text-right">ยอดรวม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">กำลังโหลด...</td></tr>
                            ) : orders.slice(0, 10).map(order => {
                                const status = ORDER_STATUS_MAP[order.status] || { text: order.status, color: 'bg-gray-500/20 text-gray-400' };
                                return (
                                    <tr key={order.id} className="border-b border-dark-border/50 hover:bg-dark-lighter transition-colors">
                                        <td className="px-5 py-3 text-sm text-accent font-mono">{order.order_number}</td>
                                        <td className="px-5 py-3 text-sm text-gray-400">{order.created_at}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-lg font-medium ${status.color}`}>{status.text}</span>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-400 capitalize">{order.payment_method}</td>
                                        <td className="px-5 py-3 text-sm text-white font-semibold text-right">{formatPrice(order.total)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
