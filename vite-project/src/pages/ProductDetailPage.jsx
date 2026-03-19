import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, getProducts, getReviews } from '../services/api';
import { formatPrice, calculateDiscount } from '../utils/formatPrice';
import { getStockStatus } from '../utils/helpers';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [loading, setLoading] = useState(true);
    const addToCart = useCartStore(s => s.addToCart);
    const addToast = useToastStore(s => s.addToast);

    useEffect(() => {
        setLoading(true);
        setSelectedImage(0);
        setQuantity(1);
        getProductBySlug(slug)
            .then(p => {
                setProduct(p);
                return Promise.all([
                    getProducts(),
                    getReviews()
                ]);
            })
            .then(([relRes, revRes]) => {
                setRelated(relRes.data.filter(r => r.slug !== slug).slice(0, 4));
                setReviews(revRes.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="aspect-square bg-dark-card rounded-xl" />
                    <div className="space-y-4">
                        <div className="h-4 bg-dark-card rounded w-1/4" />
                        <div className="h-8 bg-dark-card rounded w-3/4" />
                        <div className="h-6 bg-dark-card rounded w-1/3" />
                        <div className="h-12 bg-dark-card rounded w-1/2 mt-6" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <p className="text-gray-500 text-lg">ไม่พบสินค้า</p>
                <Link to="/" className="text-accent mt-4 inline-block">กลับหน้าแรก</Link>
            </div>
        );
    }

    const images = product.images || [product.image];
    const stockStatus = getStockStatus(product.stock);
    const discount = calculateDiscount(product.price, product.sale_price);
    const currentPrice = product.on_sale && product.sale_price ? product.sale_price : product.price;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        addToast(`เพิ่ม ${product.name} x${quantity} ลงตะกร้าแล้ว`, 'success');
    };

    const specs = product.specs || {};

    const tabs = [
        { key: 'description', label: 'รายละเอียด' },
        { key: 'specs', label: 'สเปค' },
        { key: 'reviews', label: `รีวิว (${reviews.length})` },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
                <Link to="/" className="hover:text-accent">หน้าแรก</Link>
                <span>/</span>
                <Link to={`/category/${product.category}`} className="hover:text-accent capitalize">{product.category}</Link>
                <span>/</span>
                <span className="text-gray-300 truncate">{product.name}</span>
            </nav>

            {/* Product main section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden aspect-square flex items-center justify-center p-4 relative">
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="max-h-full object-contain"
                        />
                        {product.on_sale && discount > 0 && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                                -{discount}%
                            </span>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 mt-3">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-16 h-16 rounded-lg border overflow-hidden cursor-pointer ${i === selectedImage ? 'border-accent' : 'border-dark-border'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <p className="text-accent text-sm font-medium mb-1">{product.brand}</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{product.name}</h1>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex text-yellow-400 text-sm">
                            {'★'.repeat(Math.floor(product.rating || 0))}
                            {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                        </div>
                        <span className="text-gray-500 text-sm">{product.rating} ({product.review_count} รีวิว)</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-500 text-sm">SKU: {product.sku}</span>
                    </div>

                    {/* Price */}
                    <div className="bg-dark rounded-xl p-4 mb-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-accent font-bold text-3xl">
                                {formatPrice(currentPrice)}
                            </span>
                            {product.on_sale && product.sale_price && (
                                <>
                                    <span className="text-gray-500 text-lg line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2 py-0.5 rounded">
                                        ประหยัด {formatPrice(product.price - product.sale_price)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${stockStatus.badge}`}>
                            {stockStatus.text}
                        </span>
                        {product.stock > 0 && product.stock < 10 && (
                            <span className="text-gray-500 text-sm">เหลือ {product.stock} ชิ้น</span>
                        )}
                    </div>

                    {/* Quantity + Add to cart */}
                    {product.stock > 0 && (
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center border border-dark-border rounded-lg">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-3 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >−</button>
                                <span className="px-4 py-2 text-white font-medium min-w-[40px] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                    className="px-3 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                🛒 เพิ่มในตะกร้า
                            </button>
                        </div>
                    )}

                    <Link
                        to="/cart"
                        onClick={handleAddToCart}
                        className="block w-full text-center border border-accent text-accent hover:bg-accent hover:text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        ⚡ ซื้อเลย
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-10">
                <div className="flex border-b border-dark-border gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${activeTab === tab.key
                                ? 'text-accent border-accent'
                                : 'text-gray-500 border-transparent hover:text-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="py-6">
                    {activeTab === 'description' && (
                        <p className="text-gray-300 leading-relaxed">{product.description}</p>
                    )}

                    {activeTab === 'specs' && (
                        <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
                            <table className="w-full">
                                <tbody>
                                    {Object.entries(specs).map(([key, value], i) => (
                                        <tr key={key} className={i % 2 === 0 ? 'bg-dark-card' : 'bg-dark'}>
                                            <td className="px-4 py-3 text-gray-400 text-sm font-medium w-1/3 capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </td>
                                            <td className="px-4 py-3 text-white text-sm">{String(value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            {reviews.length > 0 ? reviews.map(r => (
                                <div key={r.id} className="bg-dark-card rounded-xl border border-dark-border p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                        <span className="text-white font-medium text-sm">{r.title}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{r.body}</p>
                                    <p className="text-gray-600 text-xs mt-2">{r.created_at}</p>
                                </div>
                            )) : (
                                <p className="text-gray-500 text-center py-8">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Related products */}
            {related.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-xl font-bold text-white mb-4">🔗 สินค้าที่เกี่ยวข้อง</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {related.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </section>
            )}
        </div>
    );
}
