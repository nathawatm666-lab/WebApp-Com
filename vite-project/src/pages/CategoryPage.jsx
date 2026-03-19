import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts, getCategoryBySlug } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import Skeleton from '../components/ui/Skeleton';

const SORT_OPTIONS = [
    { value: 'default', label: 'เรียงตาม' },
    { value: 'price_asc', label: 'ราคา: ต่ำ → สูง' },
    { value: 'price_desc', label: 'ราคา: สูง → ต่ำ' },
    { value: 'newest', label: 'ใหม่ล่าสุด' },
    { value: 'rating', label: 'คะแนนสูงสุด' },
];

export default function CategoryPage() {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getProducts(),
            getCategoryBySlug(slug),
        ]).then(([prodRes, cat]) => {
            setProducts(prodRes.data.filter(p => p.category === slug));
            setCategory(cat || { name: slug, slug });
        })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [slug]);

    const brands = [...new Set(products.map(p => p.brand))];

    const filteredProducts = products
        .filter(p => {
            const price = p.on_sale && p.sale_price ? p.sale_price : p.price;
            if (price < priceRange[0] || price > priceRange[1]) return false;
            if (inStockOnly && p.stock <= 0) return false;
            if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
            return true;
        })
        .sort((a, b) => {
            const priceA = a.on_sale && a.sale_price ? a.sale_price : a.price;
            const priceB = b.on_sale && b.sale_price ? b.sale_price : b.price;
            switch (sortBy) {
                case 'price_asc': return priceA - priceB;
                case 'price_desc': return priceB - priceA;
                case 'newest': return new Date(b.created_at) - new Date(a.created_at);
                case 'rating': return (b.rating || 0) - (a.rating || 0);
                default: return 0;
            }
        });

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
                <Link to="/" className="hover:text-accent">หน้าแรก</Link>
                <span>/</span>
                <span className="text-text-main">{category?.name || slug}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar filters */}
                <aside className="lg:w-64 shrink-0">
                    <div className="bg-card rounded-xl border border-border p-4 sticky top-24 space-y-5">
                        <h3 className="text-text-main font-semibold text-sm">ตัวกรอง</h3>

                        {/* Price Range */}
                        <div>
                            <label className="text-text-muted text-xs font-medium block mb-2">ช่วงราคา</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                                    className="w-full bg-primary border border-border rounded-lg px-2 py-1.5 text-xs text-text-main"
                                    placeholder="ต่ำสุด"
                                />
                                <span className="text-text-muted">-</span>
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                                    className="w-full bg-primary border border-border rounded-lg px-2 py-1.5 text-xs text-text-main"
                                    placeholder="สูงสุด"
                                />
                            </div>
                        </div>

                        {/* Brand filter */}
                        {brands.length > 0 && (
                            <div>
                                <label className="text-text-muted text-xs font-medium block mb-2">แบรนด์</label>
                                <div className="space-y-1.5">
                                    {brands.map(brand => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrand(brand)}
                                                className="accent-accent w-3.5 h-3.5"
                                            />
                                            <span className="text-text-main text-sm">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* In stock */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                className="accent-accent w-3.5 h-3.5"
                            />
                            <span className="text-text-main text-sm">มีสินค้าเท่านั้น</span>
                        </label>
                    </div>
                </aside>

                {/* Products */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-text-main">
                            {category?.name || slug}
                            <span className="text-text-muted text-sm font-normal ml-2">({filteredProducts.length} สินค้า)</span>
                        </h1>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-main"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {loading ? (
                            <Skeleton count={6} />
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-text-muted text-lg">ไม่พบสินค้าในหมวดหมู่นี้</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
