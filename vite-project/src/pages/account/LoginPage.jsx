import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByEmail } from '../../services/api';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore(s => s.login);
    const addToast = useToastStore(s => s.addToast);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await getUserByEmail(email);
            if (!user || user.password !== password) {
                setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
                setLoading(false);
                return;
            }
            login(user);
            addToast(`ยินดีต้อนรับ ${user.name}!`, 'success');
            navigate(user.role === 'admin' ? '/admin' : '/');
        } catch {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl border border-border p-8">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-accent text-2xl">👤</span>
                        </div>
                        <h1 className="text-2xl font-bold text-text-main">เข้าสู่ระบบ</h1>
                        <p className="text-text-muted text-sm mt-1">ยินดีต้อนรับกลับมา!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-text-muted text-sm mb-1 block">อีเมล</label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                placeholder="you@example.com"
                                className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-main placeholder-text-muted/60 focus:border-accent focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-text-muted text-sm mb-1 block">รหัสผ่าน</label>
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                placeholder="••••••••"
                                className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-main placeholder-text-muted/60 focus:border-accent focus:outline-none"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-accent hover:bg-accent-hover disabled:bg-card-hover disabled:text-text-muted text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                        >
                            {loading ? '⏳ กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    <p className="text-center text-text-muted text-sm mt-6">
                        ยังไม่มีบัญชี?{' '}
                        <Link to="/register" className="text-accent hover:underline">สมัครสมาชิก</Link>
                    </p>

                    <div className="mt-4 p-3 bg-primary rounded-lg text-xs text-text-muted">
                        <p className="font-medium text-text-main mb-1">🔑 ทดสอบ:</p>
                        <p>Customer: test@customer.com / test1234</p>
                        <p>Admin: admin@store.com / admin1234</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
