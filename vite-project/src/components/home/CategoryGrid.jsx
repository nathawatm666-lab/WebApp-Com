import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/api';

export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories().then(r => setCategories(r.data)).catch(() => { });
    }, []);

    return (
        <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">🛒 หมวดหมู่สินค้า</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {categories.map(cat => (
                    <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="group bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col items-center gap-2 hover:border-accent/50 hover:bg-dark-lighter transition-all duration-300 hover:scale-105"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <span className="text-xs font-medium text-gray-300 group-hover:text-accent text-center transition-colors">
                            {cat.name.split(' ')[0]}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
