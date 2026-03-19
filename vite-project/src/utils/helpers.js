export function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export function getStockStatus(stock) {
    if (stock <= 0) return { text: 'สินค้าหมด', color: 'text-red-500', badge: 'bg-red-500/20 text-red-400' };
    if (stock < 5) return { text: 'ใกล้หมด', color: 'text-yellow-500', badge: 'bg-yellow-500/20 text-yellow-400' };
    return { text: 'มีสินค้า', color: 'text-green-500', badge: 'bg-green-500/20 text-green-400' };
}

export function truncate(str, len = 60) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
}

export function generateOrderNumber() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${y}${m}${d}-${rand}`;
}

export const ORDER_STATUS_MAP = {
    pending: { text: 'รอดำเนินการ', color: 'bg-yellow-500/20 text-yellow-400' },
    confirmed: { text: 'ยืนยันแล้ว', color: 'bg-blue-500/20 text-blue-400' },
    processing: { text: 'กำลังจัดส่ง', color: 'bg-purple-500/20 text-purple-400' },
    shipped: { text: 'จัดส่งแล้ว', color: 'bg-cyan-500/20 text-cyan-400' },
    delivered: { text: 'ส่งสำเร็จ', color: 'bg-green-500/20 text-green-400' },
    cancelled: { text: 'ยกเลิก', color: 'bg-red-500/20 text-red-400' },
};

export const PAYMENT_STATUS_MAP = {
    unpaid: { text: 'ยังไม่ชำระ', color: 'text-yellow-400' },
    paid: { text: 'ชำระแล้ว', color: 'text-green-400' },
    refunded: { text: 'คืนเงินแล้ว', color: 'text-red-400' },
};
