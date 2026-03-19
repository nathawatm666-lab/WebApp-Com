import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobile, setShowMobile] = useState(false);
    const [showMega, setShowMega] = useState(false);
    const navigate = useNavigate();
    const items = useCartStore(s => s.items);
    const { user, isLoggedIn, logout } = useAuthStore();
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border transition-colors">
                {/* Top announcement bar */}
                <div className="bg-accent text-white text-center text-xs py-1.5 font-medium">
                    🔥 ส่งฟรีทั่วไทย เมื่อสั่งซื้อครบ ฿2,000 | โค้ด WELCOME10 ลด 10%
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-4 h-16">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setShowMobile(true)}
                            className="lg:hidden text-text-muted hover:text-text-main cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-sm">TH</span>
                            </div>
                            <span className="text-white font-bold text-xl hidden sm:block">
                                Tech<span className="text-accent">Hub</span>
                            </span>
                        </Link>

                        {/* Categories button - desktop */}
                        <div className="relative hidden lg:block">
                            <button
                                onMouseEnter={() => setShowMega(true)}
                                onClick={() => setShowMega(!showMega)}
                                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                หมวดหมู่สินค้า
                            </button>
                            {showMega && (
                                <div onMouseLeave={() => setShowMega(false)}>
                                    <MegaMenu onClose={() => setShowMega(false)} />
                                </div>
                            )}
                        </div>

                        {/* Search bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ค้นหาสินค้า... เช่น RTX 4090, Ryzen 7"
                                    className="w-full bg-primary border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent cursor-pointer">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Right actions */}
                        <div className="flex items-center gap-1 sm:gap-3">
                            <ThemeToggle />

                            {/* Account */}
                            {isLoggedIn ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 text-text-muted hover:text-text-main px-2 py-2 rounded-lg transition-colors cursor-pointer">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="hidden md:block text-sm">{user?.name?.split(' ')[0]}</span>
                                    </button>
                                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <Link to="/account/profile" className="block px-4 py-2 text-sm text-text-muted hover:text-text-main hover:bg-card-hover">โปรไฟล์</Link>
                                        <Link to="/account/orders" className="block px-4 py-2 text-sm text-text-muted hover:text-text-main hover:bg-card-hover">ประวัติคำสั่งซื้อ</Link>
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="block px-4 py-2 text-sm text-accent hover:bg-card-hover">🛠 แอดมิน</Link>
                                        )}
                                        <hr className="border-border my-1" />
                                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-card-hover cursor-pointer">ออกจากระบบ</button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 text-text-muted hover:text-text-main px-2 py-2 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="hidden md:block text-sm">เข้าสู่ระบบ</span>
                                </Link>
                            )}

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative flex items-center gap-2 text-text-muted hover:text-text-main px-2 py-2 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            <MobileMenu isOpen={showMobile} onClose={() => setShowMobile(false)} />
        </>
    );
}
