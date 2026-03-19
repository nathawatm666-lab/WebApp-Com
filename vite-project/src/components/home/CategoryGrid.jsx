import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/api';
import { categoryIcons } from '../../utils/icons';

export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories().then(r => setCategories(r.data)).catch(() => { });
    }, []);

    return (
        <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-text-main">🛒 หมวดหมู่สินค้า</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {categories.map(cat => (
                    <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="group bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:border-accent/50 hover:bg-card-hover transition-all duration-300 hover:scale-105"
                    >
                        <span className="w-10 h-10 flex items-center justify-center text-text-muted group-hover:text-accent group-hover:scale-110 transition-all duration-300">
                            {categoryIcons[cat.slug] || <span className="text-3xl">{cat.icon}</span>}
                        </span>
                        <span className="text-xs font-medium text-text-main group-hover:text-accent text-center transition-colors">
                            {cat.name.split(' ')[0]}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
