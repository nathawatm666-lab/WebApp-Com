import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/api';
import ProductCard from '../ui/ProductCard';
import Skeleton from '../ui/Skeleton';

export default function PrebuiltPCsSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts()
            .then(r => setProducts(r.data.filter(p => p.category === 'prebuilt-pc').slice(0, 4)))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="mt-10 mb-8 border border-blue-500/20 bg-gradient-to-b from-blue-900/10 to-transparent p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">🖥️ คอมพิวเตอร์ประกอบ (Pre-built PC)</h2>
                    <span className="hidden sm:inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">ยอดฮิต</span>
                </div>
                <Link to="/category/prebuilt-pc" className="text-accent text-sm hover:underline">ดูทั้งหมด →</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
                {loading
                    ? <Skeleton count={4} />
                    : products.map(p => <ProductCard key={p.id} product={p} />)
                }
                {!loading && products.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-400">
                        ยังไม่มีสินค้าหมวดหมู่นี้
                    </div>
                )}
            </div>
        </section>
    );
}
