import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/api';
import useAuthStore from '../../store/authStore';
import { categoryIcons } from '../../utils/icons';

export default function MobileMenu({ isOpen, onClose }) {
    const [categories, setCategories] = useState([]);
    const { user, isLoggedIn, logout } = useAuthStore();

    useEffect(() => {
        if (isOpen) {
            getCategories().then(r => setCategories(r.data)).catch(() => { });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] lg:hidden">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="fixed left-0 top-0 bottom-0 w-[300px] bg-card border-r border-border overflow-y-auto animate-[slideRight_0.3s_ease]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="text-text-main font-bold text-lg">
                        Tech<span className="text-accent">Hub</span>
                    </span>
                    <button onClick={onClose} className="text-text-muted hover:text-text-main cursor-pointer">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User area */}
                {isLoggedIn ? (
                    <div className="p-4 border-b border-border">
                        <p className="text-text-main font-medium">{user?.name}</p>
                        <p className="text-text-muted text-sm">{user?.email}</p>
                    </div>
                ) : (
                    <div className="p-4 border-b border-border flex gap-2">
                        <Link to="/login" onClick={onClose} className="flex-1 bg-accent text-white rounded-lg py-2 text-center text-sm font-medium">เข้าสู่ระบบ</Link>
                        <Link to="/register" onClick={onClose} className="flex-1 border border-border text-text-main rounded-lg py-2 text-center text-sm font-medium">สมัครสมาชิก</Link>
                    </div>
                )}

                {/* Categories */}
                <div className="p-4">
                    <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">หมวดหมู่สินค้า</h3>
                    <div className="space-y-1">
                        {categories.map(cat => (
                            <Link
                                key={cat.id}
                                to={`/category/${cat.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-3 p-2.5 rounded-lg text-text-muted hover:text-text-main hover:bg-card-hover transition-colors group"
                            >
                                <span className="w-6 h-6 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                                    {React.cloneElement(categoryIcons[cat.slug] || <span className="text-xl">{cat.icon}</span>, { width: 20, height: 20 })}
                                </span>
                                <span className="text-sm">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Links */}
                {isLoggedIn && (
                    <div className="p-4 border-t border-border">
                        <Link to="/account/orders" onClick={onClose} className="block p-2.5 text-sm text-text-muted hover:text-text-main rounded-lg hover:bg-card-hover">📦 ประวัติคำสั่งซื้อ</Link>
                        <Link to="/account/profile" onClick={onClose} className="block p-2.5 text-sm text-text-muted hover:text-text-main rounded-lg hover:bg-card-hover">👤 โปรไฟล์</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" onClick={onClose} className="block p-2.5 text-sm text-accent rounded-lg hover:bg-card-hover">🛠 แอดมิน</Link>
                        )}
                        <button onClick={() => { logout(); onClose(); }} className="block w-full text-left p-2.5 text-sm text-red-400 rounded-lg hover:bg-card-hover mt-2 cursor-pointer">🚪 ออกจากระบบ</button>
                    </div>
                )}
            </div>
        </div>
    );
}
