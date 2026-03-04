"use client";

const LoadingSkeleton = ({ rows = 5, type = "table" }) => {
    if (type === "cards") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5">
                        <div className="skeleton h-4 w-20 mb-3" />
                        <div className="skeleton h-8 w-16 mb-2" />
                        <div className="skeleton h-3 w-28" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === "chart") {
        return (
            <div className="glass-card rounded-2xl p-6">
                <div className="skeleton h-5 w-40 mb-6" />
                <div className="skeleton h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-dark-700/50">
                <div className="skeleton h-5 w-32" />
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-dark-700/20">
                    <div className="skeleton h-4 w-20" />
                    <div className="skeleton h-4 w-32 flex-1" />
                    <div className="skeleton h-4 w-24" />
                    <div className="skeleton h-4 w-16" />
                    <div className="skeleton h-6 w-20 rounded-full" />
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
