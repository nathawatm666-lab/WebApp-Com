import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/api';
import ProductCard from '../ui/ProductCard';
import Skeleton from '../ui/Skeleton';

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts()
            .then(r => setProducts(r.data.filter(p => p.is_featured).slice(0, 8)))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">🌟 สินค้าแนะนำ</h2>
                <Link to="/search" className="text-accent text-sm hover:underline">ดูทั้งหมด →</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading
                    ? <Skeleton count={8} />
                    : products.map(p => <ProductCard key={p.id} product={p} />)
                }
            </div>
        </section>
    );
}
