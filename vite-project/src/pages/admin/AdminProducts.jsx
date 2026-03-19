import { useEffect, useState } from 'react';
import { getProducts, deleteProduct, getCategories, createProduct, updateProduct } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { getStockStatus } from '../../utils/helpers';

const initialForm = {
    name: '',
    brand: '',
    category: '',
    price: 0,
    sale_price: 0,
    on_sale: false,
    stock: 0,
    sku: '',
    image: '',
    description: ''
};

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(initialForm);

    const load = () => {
        setLoading(true);
        Promise.all([getProducts(), getCategories()])
            .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDelete = async (id) => {
        if (!confirm('ต้องการลบสินค้านี้หรือไม่?')) return;
        try {
            await deleteProduct(id);
            setProducts(p => p.filter(x => x.id !== id));
        } catch { }
    };

    const handleAdd = () => {
        setFormData(initialForm);
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (p) => {
        setFormData({
            name: p.name || '',
            brand: p.brand || '',
            category: p.category || '',
            price: p.price || 0,
            sale_price: p.sale_price || 0,
            on_sale: p.on_sale || false,
            stock: p.stock || 0,
            sku: p.sku || '',
            image: p.image || '',
            description: p.description || ''
        });
        setEditingProduct(p);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                const res = await updateProduct(editingProduct.id, formData);
                setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
            } else {
                const newProduct = { ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, '-') };
                const res = await createProduct(newProduct);
                setProducts([...products, res.data]);
            }
            setIsModalOpen(false);
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const filtered = products.filter(p => {
        if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterCat && p.category !== filterCat) return false;
        return true;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">📦 จัดการสินค้า</h1>
                <button onClick={handleAdd} className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-accent/20 transition-colors">
                    + เพิ่มสินค้าใหม่
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="ค้นหาชื่อหรือ SKU..."
                    className="bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 w-64 focus:border-accent focus:outline-none"
                />
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:border-accent outline-none">
                    <option value="">ทุกหมวดหมู่</option>
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
                <span className="text-gray-500 text-sm self-center">{filtered.length} สินค้า</span>
            </div>

            {/* Table */}
            <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-dark-border text-left">
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium w-[40%]">สินค้า</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium w-[15%]">SKU</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium w-[15%]">หมวดหมู่</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium text-right w-[10%]">ราคา</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium text-center w-[10%]">สต็อก</th>
                                <th className="px-4 py-3 text-xs text-gray-500 font-medium text-center w-[10%]">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">กำลังโหลด...</td></tr>
                            ) : filtered.map(p => {
                                const stock = getStockStatus(p.stock);
                                return (
                                    <tr key={p.id} className="border-b border-dark-border/50 hover:bg-dark-lighter transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={p.image} alt="" className="w-10 h-10 rounded-lg bg-dark object-contain" />
                                                <div>
                                                    <p className="text-white text-sm font-medium line-clamp-1">{p.name}</p>
                                                    <p className="text-gray-500 text-xs">{p.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-sm font-mono">{p.sku}</td>
                                        <td className="px-4 py-3 text-gray-400 text-sm capitalize">{p.category}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-accent font-semibold text-sm">{formatPrice(p.on_sale && p.sale_price ? p.sale_price : p.price)}</span>
                                            {p.on_sale && p.sale_price > 0 && (
                                                <p className="text-gray-600 text-xs line-through">{formatPrice(p.price)}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs px-2 py-1 rounded-lg font-medium ${stock.badge}`}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer mr-3" title="แก้ไข">✏️</button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 text-sm cursor-pointer" title="ลบ">🗑️</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">ไม่พบสินค้า</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-dark-card rounded-xl border border-dark-border p-6 w-full max-w-2xl my-8">
                        <h2 className="text-xl font-bold text-white mb-6">{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 text-sm mb-1">ชื่อสินค้า *</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">หมวดหมู่ *</label>
                                <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors">
                                    <option value="">เลือกหมวดหมู่</option>
                                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">แบรนด์</label>
                                <input value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">ราคาปกติ *</label>
                                <input required type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">ราคา Sale</label>
                                <input type="number" min="0" value={formData.sale_price} onChange={e => setFormData({ ...formData, sale_price: Number(e.target.value) })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input type="checkbox" checked={formData.on_sale} onChange={e => setFormData({ ...formData, on_sale: e.target.checked })} className="w-4 h-4 bg-dark border-dark-border rounded focus:ring-accent accent-accent cursor-pointer" id="on_sale_chk" />
                                <label htmlFor="on_sale_chk" className="text-gray-400 text-sm cursor-pointer select-none">สินค้านี้จัดโปรโมชั่น Sale</label>
                            </div>
                            <div className="md:col-start-2"></div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">สต็อก *</label>
                                <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">SKU *</label>
                                <input required value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 text-sm mb-1">ลิงก์รูปภาพ *</label>
                                <input required value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent transition-colors" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 text-sm mb-1">รายละเอียดสินค้า</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white h-24 outline-none focus:border-accent transition-colors"></textarea>
                            </div>
                            
                            <div className="md:col-span-2 flex justify-end gap-3 mt-6">
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
