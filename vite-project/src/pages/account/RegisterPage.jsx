import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser, getUserByEmail } from '../../services/api';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore(s => s.login);
    const addToast = useToastStore(s => s.addToast);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('รหัสผ่านไม่ตรงกัน'); return; }
        if (form.password.length < 6) { setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return; }
        setLoading(true);
        try {
            const existing = await getUserByEmail(form.email);
            if (existing) { setError('อีเมลนี้ถูกใช้แล้ว'); setLoading(false); return; }
            const res = await createUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: 'customer' });
            login(res.data);
            addToast('สมัครสมาชิกสำเร็จ!', 'success');
            navigate('/');
        } catch { setError('เกิดข้อผิดพลาด กรุณาลองใหม่'); }
        setLoading(false);
    };

    const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-dark-card rounded-2xl border border-dark-border p-8">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-accent text-2xl">📝</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">สมัครสมาชิก</h1>
                        <p className="text-gray-500 text-sm mt-1">สร้างบัญชีใหม่เพื่อเริ่มช้อปปิ้ง</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">ชื่อ-นามสกุล</label>
                            <input value={form.name} onChange={e => update('name', e.target.value)} required placeholder="สมชาย ใจดี" className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-accent focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">อีเมล</label>
                            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="you@example.com" className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-accent focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">เบอร์โทรศัพท์</label>
                            <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="081-234-5678" className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-accent focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">รหัสผ่าน</label>
                            <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required placeholder="••••••••" className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-accent focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">ยืนยันรหัสผ่าน</label>
                            <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} required placeholder="••••••••" className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-accent focus:outline-none" />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover disabled:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer">
                            {loading ? '⏳ กำลังสมัคร...' : 'สมัครสมาชิก'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        มีบัญชีอยู่แล้ว?{' '}
                        <Link to="/login" className="text-accent hover:underline">เข้าสู่ระบบ</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
