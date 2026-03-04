import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ page, pages, onPageChange }) => {
    if (pages <= 1) return null;

    const getPageNumbers = () => {
        const items = [];
        const maxVisible = 5;

        if (pages <= maxVisible) {
            for (let i = 1; i <= pages; i++) items.push(i);
        } else {
            items.push(1);
            if (page > 3) items.push('...');
            for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
                items.push(i);
            }
            if (page < pages - 2) items.push('...');
            items.push(pages);
        }
        return items;
    };

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <HiChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((item, i) =>
                item === '...' ? (
                    <span key={`dots-${i}`} className="px-2 text-dark-500 text-sm">
                        ...
                    </span>
                ) : (
                    <button
                        key={item}
                        onClick={() => onPageChange(item)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
              ${page === item
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                : 'text-dark-400 hover:text-white hover:bg-dark-800'
                            }`}
                    >
                        {item}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === pages}
                className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <HiChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;
