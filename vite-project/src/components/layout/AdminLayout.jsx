import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
    { path: '/admin/orders', label: '🛒 คำสั่งซื้อ' },
    { path: '/admin/products', label: '📦 สินค้า' },
    { path: '/admin/categories', label: '📂 หมวดหมู่' },
];

export default function AdminLayout() {
    const { user, isLoggedIn } = useAuthStore();
    const location = useLocation();

    if (!isLoggedIn || user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-primary flex transition-colors">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col shrink-0 transition-colors">
                <div className="p-5 border-b border-border">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">TH</span>
                        </div>
                        <span className="text-text-main font-bold text-lg">Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-accent/10 text-accent'
                                        : 'text-text-muted hover:text-text-main hover:bg-card-hover'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <Link to="/" className="block px-4 py-2 text-sm text-text-muted hover:text-text-main rounded-lg hover:bg-card-hover transition-colors">
                        ← กลับหน้าร้าน
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-card border-b border-border h-14 flex items-center px-6 gap-4 shrink-0 transition-colors">
                    <div className="lg:hidden">
                        <Link to="/" className="text-accent font-bold">TH Admin</Link>
                    </div>
                    <div className="flex-1" />
                    <span className="text-text-muted text-sm">👤 {user?.name}</span>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
