import React from 'react';

type CustomPaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center mt-4">
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={(event) => onPageChange(event, page)}
                    className={`mx-1 px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default CustomPagination;
