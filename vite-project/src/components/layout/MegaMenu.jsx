import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../../services/api';
import { categoryIcons } from '../../utils/icons';

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
        <div className="absolute left-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl p-4 w-[480px] grid grid-cols-2 gap-2 z-50 transition-colors">
            {categories.map(cat => (
                <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-card-hover transition-colors group"
                >
                    <span className="w-10 h-10 flex items-center justify-center shrink-0 text-text-muted group-hover:text-accent transition-colors">
                        {categoryIcons[cat.slug] || <span className="text-2xl">{cat.icon}</span>}
                    </span>
                    <div>
                        <div className="text-sm font-medium text-text-main group-hover:text-accent transition-colors">{cat.name}</div>
                        <div className="text-xs text-text-muted">{cat.count} สินค้า</div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
