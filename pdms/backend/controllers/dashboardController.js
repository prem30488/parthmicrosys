const Product = require('../models/Product');

// GET /api/dashboard/stats
exports.getStats = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const [
            totalProducts,
            activeProducts,
            expiringSoon,
            paidCount,
            pendingCount,
            overdueCount,
            deployedCount,
            failedCount,
            deployingCount,
            ecommerceCount,
            realEstateCount,
            recentProducts,
            monthlyData,
        ] = await Promise.all([
            Product.countDocuments({ isDeleted: false }),
            Product.countDocuments({ isDeleted: false, deploymentStatus: 'deployed' }),
            Product.countDocuments({
                isDeleted: false,
                expiryDate: { $gte: now, $lte: thirtyDaysFromNow },
            }),
            Product.countDocuments({ isDeleted: false, paymentStatus: 'Paid' }),
            Product.countDocuments({ isDeleted: false, paymentStatus: 'Pending' }),
            Product.countDocuments({ isDeleted: false, paymentStatus: 'Overdue' }),
            Product.countDocuments({ isDeleted: false, deploymentStatus: 'deployed' }),
            Product.countDocuments({ isDeleted: false, deploymentStatus: 'failed' }),
            Product.countDocuments({ isDeleted: false, deploymentStatus: 'deploying' }),
            Product.countDocuments({ isDeleted: false, category: 'Ecommerce' }),
            Product.countDocuments({ isDeleted: false, category: 'RealEstate' }),
            Product.find({ isDeleted: false })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('clientId clientName category deploymentStatus createdAt paymentStatus')
                .lean(),
            // Monthly product creation for last 6 months
            Product.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        createdAt: {
                            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]),
        ]);

        // Format monthly data for chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const found = monthlyData.find(
                (m) => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1
            );
            chartData.push({
                label: `${months[d.getMonth()]} ${d.getFullYear()}`,
                count: found ? found.count : 0,
            });
        }

        res.json({
            success: true,
            data: {
                overview: {
                    totalProducts,
                    activeProducts,
                    expiringSoon,
                    deployingCount,
                },
                payment: {
                    paid: paidCount,
                    pending: pendingCount,
                    overdue: overdueCount,
                },
                deployment: {
                    deployed: deployedCount,
                    failed: failedCount,
                    deploying: deployingCount,
                },
                categories: {
                    ecommerce: ecommerceCount,
                    realEstate: realEstateCount,
                },
                chartData,
                recentProducts,
            },
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};
