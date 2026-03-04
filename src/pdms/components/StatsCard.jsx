"use client";

const StatsCard = ({ title, value, subtitle, icon: Icon, color = "primary", trend }) => {
    const colorMap = {
        primary: {
            bg: "bg-primary-500/10",
            text: "text-primary-400",
            icon: "text-primary-500",
            shadow: "shadow-primary-500/5",
        },
        green: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-400",
            icon: "text-emerald-500",
            shadow: "shadow-emerald-500/5",
        },
        yellow: {
            bg: "bg-amber-500/10",
            text: "text-amber-400",
            icon: "text-amber-500",
            shadow: "shadow-amber-500/5",
        },
        red: {
            bg: "bg-red-500/10",
            text: "text-red-400",
            icon: "text-red-500",
            shadow: "shadow-red-500/5",
        },
        blue: {
            bg: "bg-blue-500/10",
            text: "text-blue-400",
            icon: "text-blue-500",
            shadow: "shadow-blue-500/5",
        },
    };

    const c = colorMap[color] || colorMap.primary;

    return (
        <div className={`glass-card rounded-2xl p-5 hover-glow transition-all duration-300 hover:scale-[1.02] ${c.shadow}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-dark-400 text-xs font-medium uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {subtitle && (
                        <p className={`text-xs mt-1.5 ${c.text}`}>{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${c.icon}`} />
                    </div>
                )}
            </div>
            {trend !== undefined && (
                <div className="mt-3 pt-3 border-t border-dark-700/30">
                    <span className={`text-xs font-medium ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
                    </span>
                    <span className="text-dark-500 text-xs ml-1.5">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
