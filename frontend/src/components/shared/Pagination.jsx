import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  page, 
  totalPages, 
  hasNextPage, 
  onPageChange,
  isLoading = false 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isLoading}
        className="flex items-center px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Prev
      </button>

      <div className="flex items-center space-x-2">
        <span className="text-slate-900 font-bold bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm">
          Page {page} of {totalPages}
        </span>
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage || isLoading}
        className="flex items-center px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        Next
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
};

export default React.memo(Pagination);
