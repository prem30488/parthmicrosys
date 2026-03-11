const { Op } = require('sequelize');
const sequelize = require('../config/database');
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
            Product.count({ where: { isDeleted: false } }),
            Product.count({ where: { isDeleted: false, deploymentStatus: 'deployed' } }),
            Product.count({
                where: {
                    isDeleted: false,
                    expiryDate: { [Op.between]: [now, thirtyDaysFromNow] },
                },
            }),
            Product.count({ where: { isDeleted: false, paymentStatus: 'Paid' } }),
            Product.count({ where: { isDeleted: false, paymentStatus: 'Pending' } }),
            Product.count({ where: { isDeleted: false, paymentStatus: 'Overdue' } }),
            Product.count({ where: { isDeleted: false, deploymentStatus: 'deployed' } }),
            Product.count({ where: { isDeleted: false, deploymentStatus: 'failed' } }),
            Product.count({ where: { isDeleted: false, deploymentStatus: 'deploying' } }),
            Product.count({ where: { isDeleted: false, category: 'Ecommerce' } }),
            Product.count({ where: { isDeleted: false, category: 'RealEstate' } }),
            Product.findAll({
                where: { isDeleted: false },
                order: [['createdAt', 'DESC']],
                limit: 5,
                attributes: ['clientId', 'clientName', 'category', 'deploymentStatus', 'createdAt', 'paymentStatus'],
            }),
            // Monthly product creation for last 6 months using raw query for PostgreSQL
            sequelize.query(`
                SELECT 
                    EXTRACT(YEAR FROM "createdAt") as year,
                    EXTRACT(MONTH FROM "createdAt") as month,
                    COUNT(*) as count
                FROM "Products"
                WHERE "isDeleted" = false
                AND "createdAt" >= :startDate
                GROUP BY year, month
                ORDER BY year ASC, month ASC
            `, {
                replacements: { startDate: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
                type: sequelize.QueryTypes.SELECT
            }),
        ]);

        // Format monthly data for chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const found = monthlyData.find(
                (m) => parseInt(m.year) === d.getFullYear() && parseInt(m.month) === d.getMonth() + 1
            );
            chartData.push({
                label: `${months[d.getMonth()]} ${d.getFullYear()}`,
                count: found ? parseInt(found.count) : 0,
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
