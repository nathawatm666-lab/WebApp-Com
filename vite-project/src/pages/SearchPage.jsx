import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import Skeleton from '../components/ui/Skeleton';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) { setProducts([]); setLoading(false); return; }
        setLoading(true);
        getProducts()
            .then(r => {
                const results = r.data.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.brand.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase()) ||
                    (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
                );
                setProducts(results);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
                <Link to="/" className="hover:text-accent">หน้าแรก</Link>
                <span>/</span>
                <span className="text-text-main">ผลการค้นหา</span>
            </nav>

            <h1 className="text-xl font-bold text-text-main mb-6">
                {query ? (
                    <>ผลการค้นหา "<span className="text-accent">{query}</span>" <span className="text-text-muted text-sm font-normal">({products.length} รายการ)</span></>
                ) : (
                    'กรุณาพิมพ์คำค้นหา'
                )}
            </h1>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Skeleton count={8} />
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            ) : query ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-text-muted text-lg">ไม่พบสินค้าที่ตรงกับ "{query}"</p>
                    <p className="text-text-muted opacity-60 text-sm mt-2">ลองใช้คำค้นหาอื่น เช่น RTX, Ryzen, DDR5</p>
                </div>
            ) : null}
        </div>
    );
}
