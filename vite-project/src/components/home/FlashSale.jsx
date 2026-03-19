import { useEffect, useState } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from '../ui/ProductCard';
import Skeleton from '../ui/Skeleton';

export default function FlashSale() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

    useEffect(() => {
        getProducts()
            .then(r => setProducts(r.data.filter(p => p.on_sale).slice(0, 6)))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { h, m, s } = prev;
                s--;
                if (s < 0) { s = 59; m--; }
                if (m < 0) { m = 59; h--; }
                if (h < 0) { h = 23; m = 59; s = 59; }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <section className="mt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-bold text-text-main">⚡ Flash Sale</h2>
                    <span className="text-sm text-text-muted">ราคาพิเศษ วันนี้เท่านั้น!</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-text-muted text-sm">สิ้นสุดใน</span>
                    <div className="flex gap-1">
                        {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((t, i) => (
                            <span key={i} className="flex items-center">
                                <span className="bg-red-600 text-white text-sm font-mono font-bold px-2 py-1 rounded-md min-w-[32px] text-center">{t}</span>
                                {i < 2 && <span className="text-red-400 font-bold mx-0.5">:</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {loading ? (
                    <Skeleton count={6} className="min-w-[220px] max-w-[220px] shrink-0" />
                ) : (
                    products.map(p => (
                        <div key={p.id} className="min-w-[220px] max-w-[220px] shrink-0">
                            <ProductCard product={p} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
