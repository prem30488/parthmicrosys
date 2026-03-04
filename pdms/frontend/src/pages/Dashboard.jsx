import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { HiOutlineCube, HiOutlineClock, HiOutlineCheck, HiOutlineExclamation } from 'react-icons/hi';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <LoadingSkeleton type="cards" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LoadingSkeleton type="chart" />
                    <LoadingSkeleton type="chart" />
                </div>
            </div>
        );
    }

    // Chart data - Product creation trend
    const lineChartData = {
        labels: stats?.chartData?.map((d) => d.label) || [],
        datasets: [
            {
                label: 'Products Created',
                data: stats?.chartData?.map((d) => d.count) || [],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#1e293b',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#e2e8f0',
                bodyColor: '#94a3b8',
                borderColor: '#334155',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                ticks: { color: '#64748b', font: { size: 11 } },
            },
            y: {
                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 },
                beginAtZero: true,
            },
        },
    };

    // Doughnut chart - Categories
    const doughnutData = {
        labels: ['Ecommerce', 'Real Estate'],
        datasets: [
            {
                data: [stats?.categories?.ecommerce || 0, stats?.categories?.realEstate || 0],
                backgroundColor: ['#6366f1', '#8b5cf6'],
                borderColor: ['#4f46e5', '#7c3aed'],
                borderWidth: 2,
                hoverOffset: 6,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#94a3b8', padding: 16, usePointStyle: true, font: { size: 12 } },
            },
        },
        cutout: '65%',
    };

    // Status badge
    const statusBadge = (status) => {
        const map = {
            deployed: 'status-deployed',
            deploying: 'status-deploying',
            failed: 'status-failed',
            pending: 'status-pending',
        };
        return map[status] || map.pending;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-dark-400 text-sm mt-1">Overview of your deployment management</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Products"
                    value={stats?.overview?.totalProducts || 0}
                    subtitle="All active products"
                    icon={HiOutlineCube}
                    color="primary"
                />
                <StatsCard
                    title="Active Deployments"
                    value={stats?.overview?.activeProducts || 0}
                    subtitle="Successfully deployed"
                    icon={HiOutlineCheck}
                    color="green"
                />
                <StatsCard
                    title="Expiring Soon"
                    value={stats?.overview?.expiringSoon || 0}
                    subtitle="Within 30 days"
                    icon={HiOutlineClock}
                    color="yellow"
                />
                <StatsCard
                    title="Failed"
                    value={stats?.deployment?.failed || 0}
                    subtitle="Requires attention"
                    icon={HiOutlineExclamation}
                    color="red"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Product Creation Trend</h2>
                    <div className="h-72">
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
                    <div className="h-72 flex items-center justify-center">
                        {(stats?.categories?.ecommerce || 0) + (stats?.categories?.realEstate || 0) > 0 ? (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        ) : (
                            <p className="text-dark-500 text-sm">No data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Status */}
                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Payment Overview</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/30">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-dark-300 text-sm">Paid</span>
                            </div>
                            <span className="text-white font-semibold">{stats?.payment?.paid || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/30">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-dark-300 text-sm">Pending</span>
                            </div>
                            <span className="text-white font-semibold">{stats?.payment?.pending || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/30">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-dark-300 text-sm">Overdue</span>
                            </div>
                            <span className="text-white font-semibold">{stats?.payment?.overdue || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                    {stats?.recentProducts?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition-colors"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-dark-200 truncate">{product.clientName}</p>
                                        <p className="text-xs text-dark-500">{product.clientId} • {product.category}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(product.deploymentStatus)}`}>
                                        {product.deploymentStatus}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-dark-500 text-sm text-center py-8">No products yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
