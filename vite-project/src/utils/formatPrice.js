export function formatPrice(price) {
    if (price == null) return '';
    return `฿${price.toLocaleString('th-TH')}`;
}

export function formatNumber(num) {
    if (num == null) return '0';
    return num.toLocaleString('th-TH');
}

export function calculateDiscount(price, salePrice) {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
}
