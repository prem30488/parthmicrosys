import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCloudUpload, HiOutlineCheck } from 'react-icons/hi';
import api from '../services/api';
import toast from 'react-hot-toast';

const themes = ['Dark', 'Light', 'Blue', 'Green', 'Purple', 'Sunset'];
const themeColors = {
    Dark: 'from-gray-800 to-gray-900',
    Light: 'from-gray-100 to-white',
    Blue: 'from-blue-800 to-blue-950',
    Green: 'from-emerald-800 to-emerald-950',
    Purple: 'from-purple-800 to-purple-950',
    Sunset: 'from-orange-700 to-red-900',
};

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        clientName: '', productName: '', category: 'Ecommerce',
        themeName: 'Dark', expiryDate: '', paymentStatus: 'Pending', notes: '',
    });

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/products', form);
            if (res.data.success) { toast.success('Product created! Deployment in progress...'); navigate('/products'); }
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to create product'); }
        finally { setLoading(false); }
    };

    const inputCls = "w-full px-4 py-2.5 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm";

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Add New Product</h1>
                <p className="text-dark-400 text-sm mt-1">Auto-creates GitHub repo, applies theme, and deploys to Vercel</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Client Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="clientName" className="block text-sm font-medium text-dark-300 mb-1.5">Client Name *</label>
                            <input id="clientName" name="clientName" value={form.clientName} onChange={handleChange} required placeholder="e.g., ABC Pvt Ltd" className={inputCls} />
                        </div>
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-dark-300 mb-1.5">Product Name *</label>
                            <input id="productName" name="productName" value={form.productName} onChange={handleChange} required placeholder="e.g., Online Store" className={inputCls} />
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Ecommerce', 'RealEstate'].map((cat) => (
                            <button key={cat} type="button" onClick={() => setForm((p) => ({ ...p, category: cat }))}
                                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${form.category === cat ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10' : 'border-dark-700 hover:border-dark-600 hover:bg-dark-800/30'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">{cat === 'RealEstate' ? 'Real Estate' : cat}</p>
                                        <p className="text-dark-400 text-xs mt-1">{cat === 'Ecommerce' ? 'Online store with products, cart & checkout' : 'Property listings with search & contact'}</p>
                                    </div>
                                    {form.category === cat && <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"><HiOutlineCheck className="w-4 h-4 text-white" /></div>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Theme</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {themes.map((t) => (
                            <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, themeName: t }))}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${form.themeName === t ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-dark-700 hover:border-dark-600'}`}>
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${themeColors[t]} shadow-inner ${t === 'Light' ? 'border border-dark-600' : ''}`} />
                                <span className="text-xs font-medium text-dark-300">{t}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Additional Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-dark-300 mb-1.5">Expiry Date *</label>
                            <input id="expiryDate" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required className={`${inputCls} [color-scheme:dark]`} />
                        </div>
                        <div>
                            <label htmlFor="paymentStatus" className="block text-sm font-medium text-dark-300 mb-1.5">Payment Status</label>
                            <select id="paymentStatus" name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className={`${inputCls} cursor-pointer`}>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-dark-300 mb-1.5">Notes</label>
                        <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Optional notes..." className={`${inputCls} resize-none`} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button type="button" onClick={() => navigate('/products')} className="px-5 py-2.5 text-dark-300 hover:text-white hover:bg-dark-800 rounded-xl text-sm font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} id="create-product-btn"
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 text-sm">
                        {loading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deploying...</>) : (<><HiOutlineCloudUpload className="w-4 h-4" />Create & Deploy</>)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
