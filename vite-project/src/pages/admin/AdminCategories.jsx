import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, getProducts } from '../../services/api';

const initialForm = {
    name: '',
    slug: '',
    icon: '',
    count: 0
};

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [formData, setFormData] = useState(initialForm);

    const load = () => {
        setLoading(true);
        Promise.all([getCategories(), getProducts()])
            .then(([resCat, resProd]) => {
                const cats = resCat.data.map(c => ({
                    ...c,
                    count: resProd.data.filter(p => p.category === c.slug).length
                }));
                setCategories(cats);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDelete = async (id) => {
        if (!confirm('ต้องการลบหมวดหมู่นี้หรือไม่?')) return;
        try {
            await deleteCategory(id);
            setCategories(c => c.filter(x => x.id !== id));
        } catch { }
    };

    const handleAdd = () => {
        setFormData(initialForm);
        setEditingCat(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cat) => {
        setFormData({
            name: cat.name || '',
            slug: cat.slug || '',
            icon: cat.icon || '',
            count: cat.count || 0
        });
        setEditingCat(cat);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let dataToSave = { ...formData };
            if (!dataToSave.slug) {
                dataToSave.slug = dataToSave.name.toLowerCase().replace(/\s+/g, '-');
            }

            if (editingCat) {
                const res = await updateCategory(editingCat.id, dataToSave);
                setCategories(categories.map(c => c.id === editingCat.id ? res.data : c));
            } else {
                const res = await createCategory(dataToSave);
                setCategories([...categories, res.data]);
            }
            setIsModalOpen(false);
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">📂 จัดการหมวดหมู่</h1>
                <button onClick={handleAdd} className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-accent/20 transition-colors">
                    + เพิ่มหมวดหมู่
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-dark-card rounded-xl border border-dark-border p-5 animate-pulse">
                            <div className="h-8 w-8 bg-gray-800 rounded mb-3" />
                            <div className="h-4 bg-gray-800 rounded w-2/3 mb-2" />
                            <div className="h-3 bg-gray-800 rounded w-1/3" />
                        </div>
                    ))
                ) : (
                    categories.map(cat => (
                        <div key={cat.id} className="bg-dark-card rounded-xl border border-dark-border p-5 hover:border-accent/40 transition-colors relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(cat)} className="text-blue-400 hover:text-blue-300 bg-dark p-1.5 rounded-lg border border-dark-border" title="แก้ไข">✏️</button>
                                <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 bg-dark p-1.5 rounded-lg border border-dark-border" title="ลบ">🗑️</button>
                            </div>
                            <div className="flex items-center justify-between mb-3 pr-16">
                                <span className="text-3xl">{cat.icon}</span>
                                <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-lg">
                                    {cat.count} สินค้า
                                </span>
                            </div>
                            <h3 className="text-white font-semibold">{cat.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">/{cat.slug}</p>
                        </div>
                    ))
                )}
                {!loading && categories.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500 bg-dark-card rounded-xl border border-dark-border">
                        ไม่พบหมวดหมู่
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-dark-card rounded-xl border border-dark-border p-6 w-full max-w-md my-8">
                        <h2 className="text-xl font-bold text-white mb-6">{editingCat ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">ชื่อหมวดหมู่ *</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" placeholder="เช่น ขายชุดคอมประกอบ" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">URL Slug</label>
                                <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" placeholder="เว้นว่างไว้เพื่อสร้างอัตโนมัติ" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">ไอคอน (Emoji หรือ ข้อความ)</label>
                                <input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" placeholder="เช่น 💻, 🖱️, ⌨️" />
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-dark-border text-gray-400 rounded-lg hover:bg-dark-lighter transition-colors">ยกเลิก</button>
                                <button type="submit" className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg shadow-lg shadow-accent/20 transition-colors">บันทึก</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
