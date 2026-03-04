import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlineExternalLink, HiOutlineArrowLeft, HiOutlineRefresh } from 'react-icons/hi';
import api from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchProduct(); }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            if (res.data.success) setProduct(res.data.data);
        } catch { toast.error('Failed to fetch product'); navigate('/products'); }
        finally { setLoading(false); }
    };

    if (loading) return <LoadingSkeleton type="table" rows={8} />;
    if (!product) return null;

    const statusColor = {
        deployed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        deploying: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        failed: 'text-red-400 bg-red-500/10 border-red-500/30',
        pending: 'text-dark-400 bg-dark-500/10 border-dark-500/30',
    };

    const payColor = {
        Paid: 'text-emerald-400 bg-emerald-500/10',
        Pending: 'text-amber-400 bg-amber-500/10',
        Overdue: 'text-red-400 bg-red-500/10',
    };

    const InfoRow = ({ label, value, link, badge, badgeClass }) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-dark-700/20">
            <span className="text-dark-400 text-sm font-medium">{label}</span>
            {link ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 mt-1 sm:mt-0 break-all">
                    {value} <HiOutlineExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
            ) : badge ? (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full mt-1 sm:mt-0 inline-block w-fit ${badgeClass}`}>{value}</span>
            ) : (
                <span className="text-dark-200 text-sm mt-1 sm:mt-0">{value || '—'}</span>
            )}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/products')} className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-xl transition-colors">
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">{product.clientName}</h1>
                    <p className="text-dark-400 text-sm">{product.clientId} • {product.productName}</p>
                </div>
                <button onClick={fetchProduct} className="ml-auto p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-xl transition-colors" title="Refresh">
                    <HiOutlineRefresh className="w-5 h-5" />
                </button>
            </div>

            {/* Status Banner */}
            <div className={`rounded-2xl p-4 mb-6 border ${statusColor[product.deploymentStatus] || statusColor.pending}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${product.deploymentStatus === 'deployed' ? 'bg-emerald-500' : product.deploymentStatus === 'deploying' ? 'bg-amber-500 animate-pulse' : product.deploymentStatus === 'failed' ? 'bg-red-500' : 'bg-dark-500'}`} />
                    <span className="font-medium capitalize">{product.deploymentStatus}</span>
                    {product.deploymentStatus === 'deploying' && <span className="text-xs opacity-70">Please wait...</span>}
                </div>
            </div>

            {/* Details Card */}
            <div className="glass-card rounded-2xl p-6 space-y-0">
                <InfoRow label="Client ID" value={product.clientId} />
                <InfoRow label="Category" value={product.category} badge badgeClass="bg-primary-500/10 text-primary-400" />
                <InfoRow label="Theme" value={product.themeName} />
                <InfoRow label="Version" value={product.version} />
                <InfoRow label="Payment" value={product.paymentStatus} badge badgeClass={payColor[product.paymentStatus]} />
                <InfoRow label="Expiry" value={product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
                <InfoRow label="Created" value={new Date(product.createdAt).toLocaleString()} />
                {product.githubRepoUrl && <InfoRow label="GitHub Repo" value={product.githubRepoUrl} link />}
                {product.vercelDeploymentUrl && <InfoRow label="Vercel URL" value={product.vercelDeploymentUrl} link />}
                {product.notes && <InfoRow label="Notes" value={product.notes} />}
            </div>
        </div>
    );
};

export default ProductDetail;
