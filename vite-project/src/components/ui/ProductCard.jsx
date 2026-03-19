import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../../utils/formatPrice';
import { getStockStatus } from '../../utils/helpers';
import useCartStore from '../../store/cartStore';
import useToastStore from '../../store/toastStore';

export default function ProductCard({ product }) {
    const addToCart = useCartStore(s => s.addToCart);
    const addToast = useToastStore(s => s.addToast);
    const stockStatus = getStockStatus(product.stock);
    const discount = calculateDiscount(product.price, product.sale_price);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock <= 0) return;
        addToCart(product);
        addToast(`ACQUIRED: ${product.name}`, 'success');
    };

    return (
        <Link
            to={`/product/${product.slug}`}
            className="group block bg-card transition-all duration-300 relative border border-border hover:border-accent flex flex-col"
        >
            {/* Corner Bracket Decorators */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                {product.on_sale && discount > 0 && (
                    <span className="bg-text-main text-primary text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest border border-text-main">
                        -{discount}%
                    </span>
                )}
                {product.is_featured && (
                    <span className="bg-accent text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest border border-accent">
                        PRIORITY
                    </span>
                )}
            </div>

            {/* Warning Stock Badge */}
            {product.stock < 5 && product.stock > 0 && (
                <span className="absolute top-3 right-3 text-warning font-mono text-[10px] font-bold px-2 py-0.5 border border-warning/50 bg-card z-20 uppercase tracking-widest">
                    LOW.STOCK
                </span>
            )}

            {/* Image Container */}
            <div className="relative aspect-square bg-card border-b border-border overflow-hidden p-6 flex items-center justify-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                />
            </div>

            {/* Info Container */}
            <div className="p-4 flex-1 flex flex-col bg-card">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-text-muted text-[10px] uppercase tracking-widest">{product.brand}</p>
                    <p className="text-text-muted opacity-60 text-[10px] tracking-widest">ID:{product.id}</p>
                </div>

                <h3 className="text-base font-bold text-text-main group-hover:text-accent transition-colors line-clamp-2 mb-3 leading-tight tracking-tight flex-1">
                    {product.name}
                </h3>

                {/* Rating (Minimalist bars instead of stars) */}
                {product.rating && (
                    <div className="flex items-center gap-2 mb-4 h-2">
                        <div className="flex gap-0.5 h-full opacity-70">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className={`w-3 h-full ${star <= Math.round(product.rating) ? 'bg-accent' : 'bg-border'}`}></div>
                            ))}
                        </div>
                        <span className="font-mono text-text-muted text-[10px] leading-none">R.{product.rating}</span>
                    </div>
                )}

                {/* Price and Cart Action */}
                <div className="pt-3 border-t border-border flex items-end justify-between mt-auto">
                    <div>
                        <span className="text-xs font-mono text-text-muted block mb-0.5">NET.VAL</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-text-main font-mono font-bold text-lg tracking-tight">
                                {formatPrice(product.on_sale && product.sale_price ? product.sale_price : product.price)}
                            </span>
                            {product.on_sale && product.sale_price && (
                                <span className="text-text-muted opacity-60 font-mono text-xs line-through decoration-danger">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="group/btn relative overflow-hidden bg-card-hover hover:bg-accent border border-border hover:border-accent disabled:bg-primary disabled:border-border disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center transition-colors cursor-pointer"
                        title="Add to target"
                    >
                        <svg className="w-4 h-4 text-white z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
}
