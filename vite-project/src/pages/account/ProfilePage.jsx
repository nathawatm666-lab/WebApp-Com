import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

export default function ProfilePage() {
    const { user, isLoggedIn, updateProfile } = useAuthStore();
    const addToast = useToastStore(s => s.addToast);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');

    if (!isLoggedIn) return <Navigate to="/login" />;

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile({ name, phone });
        addToast('อัพเดทโปรไฟล์สำเร็จ', 'success');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
                <Link to="/" className="hover:text-accent">หน้าแรก</Link>
                <span>/</span>
                <span className="text-text-main">โปรไฟล์</span>
            </nav>

            <h1 className="text-2xl font-bold text-text-main mb-6">👤 โปรไฟล์ของฉัน</h1>

            <div className="bg-card rounded-xl border border-border p-6">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="text-text-muted text-sm mb-1 block">อีเมล</label>
                        <input value={user?.email || ''} disabled className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-muted" />
                    </div>
                    <div>
                        <label className="text-text-muted text-sm mb-1 block">ชื่อ-นามสกุล</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-main focus:border-accent focus:outline-none" />
                    </div>
                    <div>
                        <label className="text-text-muted text-sm mb-1 block">เบอร์โทรศัพท์</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-main focus:border-accent focus:outline-none" />
                    </div>
                    <div>
                        <label className="text-text-muted text-sm mb-1 block">บทบาท</label>
                        <input value={user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ลูกค้า'} disabled className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-muted" />
                    </div>
                    <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer">
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </form>
            </div>
        </div>
    );
}
