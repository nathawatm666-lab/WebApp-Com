import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
    { path: '/admin', label: '📊 แดชบอร์ด', exact: true },
    { path: '/admin/products', label: '📦 สินค้า' },
    { path: '/admin/orders', label: '🛒 คำสั่งซื้อ' },
    { path: '/admin/categories', label: '📂 หมวดหมู่' },
];

export default function AdminLayout() {
    const { user, isLoggedIn } = useAuthStore();
    const location = useLocation();

    if (!isLoggedIn || user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-dark flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-card border-r border-dark-border hidden lg:flex flex-col shrink-0">
                <div className="p-5 border-b border-dark-border">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">TH</span>
                        </div>
                        <span className="text-white font-bold text-lg">Admin</span>
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
                                        : 'text-gray-400 hover:text-white hover:bg-dark-lighter'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-dark-border">
                    <Link to="/" className="block px-4 py-2 text-sm text-gray-500 hover:text-white rounded-lg hover:bg-dark-lighter transition-colors">
                        ← กลับหน้าร้าน
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-dark-card border-b border-dark-border h-14 flex items-center px-6 gap-4 shrink-0">
                    <div className="lg:hidden">
                        <Link to="/" className="text-accent font-bold">TH Admin</Link>
                    </div>
                    <div className="flex-1" />
                    <span className="text-gray-400 text-sm">👤 {user?.name}</span>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
