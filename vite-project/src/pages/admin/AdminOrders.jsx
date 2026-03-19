import { useEffect, useState } from 'react';
import { getOrders, updateOrder } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUS_MAP } from '../../utils/helpers';
import useToastStore from '../../store/toastStore';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const addToast = useToastStore(s => s.addToast);

    useEffect(() => {
        getOrders()
            .then(r => setOrders(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrder(orderId, { status: newStatus });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            addToast('อัพเดทสถานะสำเร็จ', 'success');
        } catch {
            addToast('เกิดข้อผิดพลาด', 'error');
        }
    };

    const filtered = filterStatus ? orders.filter(o => o.status === filterStatus) : orders;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">🛒 จัดการคำสั่งซื้อ</h1>

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => setFilterStatus('')} className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${!filterStatus ? 'bg-accent text-white' : 'bg-dark-card text-gray-400 border border-dark-border hover:text-white'}`}>
                    ทั้งหมด ({orders.length})
                </button>
                {STATUSES.map(s => {
                    const info = ORDER_STATUS_MAP[s];
                    const count = orders.filter(o => o.status === s).length;
                    return (
                        <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${filterStatus === s ? 'bg-accent text-white' : 'bg-dark-card text-gray-400 border border-dark-border hover:text-white'}`}>
                            {info?.text || s} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border text-left">
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium">ออเดอร์</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium">วันที่</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium">รายการ</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium text-right">ยอดรวม</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium">ชำระเงิน</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">กำลังโหลด...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">ไม่มีคำสั่งซื้อ</td></tr>
                            ) : filtered.map(order => (
                                <tr key={order.id} className="border-b border-dark-border/50 hover:bg-dark-lighter transition-colors">
                                    <td className="px-4 py-3 text-accent font-mono text-sm">{order.order_number}</td>
                                    <td className="px-4 py-3 text-gray-400 text-sm">{order.created_at}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">
                                        {order.items?.map(i => `${i.name} ×${i.qty}`).join(', ')}
                                    </td>
                                    <td className="px-4 py-3 text-white font-semibold text-sm text-right">{formatPrice(order.total)}</td>
                                    <td className="px-4 py-3 text-gray-400 text-sm capitalize">{order.payment_method}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.status}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            className="bg-dark border border-dark-border rounded-lg px-2 py-1 text-xs text-white"
                                        >
                                            {STATUSES.map(s => (
                                                <option key={s} value={s}>{ORDER_STATUS_MAP[s]?.text || s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
