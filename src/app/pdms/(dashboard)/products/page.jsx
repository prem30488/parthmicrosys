"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineDownload,
    HiOutlinePlus,
    HiOutlineExternalLink,
    HiOutlineTrash,
    HiOutlineEye,
} from "react-icons/hi";
import api from "@/pdms/services/api";
import Pagination from "@/pdms/components/Pagination";
import LoadingSkeleton from "@/pdms/components/LoadingSkeleton";
import toast from "react-hot-toast";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [paymentFilter, setPaymentFilter] = useState("");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page,
                limit: 10,
                sortBy,
                sortOrder,
            });
            if (search) params.set("search", search);
            if (category) params.set("category", category);
            if (paymentFilter) params.set("paymentStatus", paymentFilter);

            const response = await api.get(`/products?${params}`);
            if (response.data.success) {
                setProducts(response.data.data.products);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, search, category, sortBy, sortOrder, paymentFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted");
            fetchProducts();
        } catch {
            toast.error("Failed to delete product");
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await api.get("/products/export/csv", { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "products_export.csv";
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("CSV exported successfully");
        } catch {
            toast.error("Failed to export CSV");
        }
    };

    const statusBadge = (status) => {
        const map = {
            deployed: { class: "status-deployed", label: "Deployed" },
            deploying: { class: "status-deploying", label: "Deploying" },
            failed: { class: "status-failed", label: "Failed" },
            pending: { class: "status-pending", label: "Pending" },
        };
        return map[status] || map.pending;
    };

    const paymentBadge = (status) => {
        const map = {
            Paid: "text-emerald-400 bg-emerald-500/10",
            Pending: "text-amber-400 bg-amber-500/10",
            Overdue: "text-red-400 bg-red-500/10",
        };
        return map[status] || map.Pending;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    <p className="text-dark-400 text-sm mt-1">{pagination.total} total products</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white rounded-xl text-sm transition-colors border border-dark-700"
                        id="export-csv-btn"
                    >
                        <HiOutlineDownload className="w-4 h-4" />
                        Export CSV
                    </button>
                    <Link
                        href="/pdms/products/new"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary-500/20"
                        id="add-product-btn"
                    >
                        <HiOutlinePlus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card rounded-2xl p-4">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPagination((p) => ({ ...p, page: 1 }));
                            }}
                            placeholder="Search by client name, product, or ID..."
                            className="w-full pl-10 pr-4 py-2.5 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                            id="search-input"
                        />
                    </div>

                    {/* Category filter */}
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPagination((p) => ({ ...p, page: 1 }));
                        }}
                        className="px-3 py-2.5 bg-dark-800/50 border border-dark-700 rounded-xl text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer"
                        id="category-filter"
                    >
                        <option value="">All Categories</option>
                        <option value="Ecommerce">Ecommerce</option>
                        <option value="RealEstate">Real Estate</option>
                    </select>

                    {/* Payment filter */}
                    <select
                        value={paymentFilter}
                        onChange={(e) => {
                            setPaymentFilter(e.target.value);
                            setPagination((p) => ({ ...p, page: 1 }));
                        }}
                        className="px-3 py-2.5 bg-dark-800/50 border border-dark-700 rounded-xl text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer"
                        id="payment-filter"
                    >
                        <option value="">All Payments</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [sb, so] = e.target.value.split("-");
                            setSortBy(sb);
                            setSortOrder(so);
                        }}
                        className="px-3 py-2.5 bg-dark-800/50 border border-dark-700 rounded-xl text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer"
                        id="sort-select"
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="expiryDate-asc">Expiry: Soonest</option>
                        <option value="expiryDate-desc">Expiry: Latest</option>
                        <option value="clientName-asc">Name: A–Z</option>
                        <option value="clientName-desc">Name: Z–A</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <LoadingSkeleton type="table" rows={5} />
            ) : products.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <HiOutlineFilter className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <p className="text-dark-400 text-lg font-medium">No products found</p>
                    <p className="text-dark-500 text-sm mt-1">Try adjusting your search or filters</p>
                    <Link
                        href="/pdms/products/new"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                        <HiOutlinePlus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700/50">
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-4 py-3">Client</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-4 py-3">Category</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-4 py-3">Theme</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-4 py-3">Status</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-4 py-3">Payment</th>
                                    <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-4 py-3">Expiry</th>
                                    <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700/20">
                                {products.map((product) => {
                                    const badge = statusBadge(product.deploymentStatus);
                                    const isExpiringSoon =
                                        product.expiryDate &&
                                        new Date(product.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                                    return (
                                        <tr
                                            key={product._id}
                                            className="hover:bg-dark-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-dark-200">{product.clientName}</p>
                                                    <p className="text-xs text-dark-500">{product.clientId} • {product.productName}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-400">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-dark-300">{product.themeName}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.class}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${paymentBadge(product.paymentStatus)}`}>
                                                    {product.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm text-dark-300">
                                                        {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "—"}
                                                    </span>
                                                    {isExpiringSoon && (
                                                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" title="Expiring soon" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/pdms/products/${product._id}`}
                                                        className="p-1.5 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                                                        title="View details"
                                                    >
                                                        <HiOutlineEye className="w-4 h-4" />
                                                    </Link>
                                                    {product.vercelDeploymentUrl && (
                                                        <a
                                                            href={product.vercelDeploymentUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-dark-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                            title="Visit deployment"
                                                        >
                                                            <HiOutlineExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <HiOutlineTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-dark-700/50 px-4 py-3">
                        <Pagination
                            page={pagination.page}
                            pages={pagination.pages}
                            onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
