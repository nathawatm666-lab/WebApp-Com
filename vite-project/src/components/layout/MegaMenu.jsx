import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../../services/api';

export default function MegaMenu({ onClose }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        Promise.all([getCategories(), getProducts()])
            .then(([resCat, resProd]) => {
                const cats = resCat.data.map(c => ({
                    ...c,
                    count: resProd.data.filter(p => p.category === c.slug).length
                }));
                setCategories(cats);
            })
            .catch(() => { });
    }, []);

    return (
        <div className="absolute left-0 top-full mt-2 bg-dark-card border border-dark-border rounded-xl shadow-2xl p-4 w-[480px] grid grid-cols-2 gap-2 z-50">
            {categories.map(cat => (
                <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-lighter transition-colors group"
                >
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                        <div className="text-sm font-medium text-white group-hover:text-accent transition-colors">{cat.name}</div>
                        <div className="text-xs text-gray-500">{cat.count} สินค้า</div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
