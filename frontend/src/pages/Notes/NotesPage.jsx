import React, { useEffect, useState, useCallback } from 'react';
import { useNotes } from '../../hooks/useNotes';
import NoteCard from '../../components/notes/NoteCard';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import Pagination from '../../components/shared/Pagination';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';

const NotesPage = () => {
  const { status, data, error, pagination, fetchNotes } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [semester, setSemester] = useState('');

  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes({ 
        page: 1, 
        tag: searchTerm, 
        semester: semester 
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, semester, fetchNotes]);

  const handlePageChange = (newPage) => {
    fetchNotes({ 
      page: newPage, 
      tag: searchTerm, 
      semester: semester 
    });
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="max-w-2xl mx-auto mt-12">
          <ErrorBanner message={error} onRetry={() => fetchNotes()} />
        </div>
      );
    }

    if (status === 'success' && (!data || data.length === 0)) {
      return (
        <div className="mt-12">
          <EmptyState 
            title="No notes found" 
            message={searchTerm || semester ? "Try adjusting your filters or search term." : "Be the first to share your knowledge with the community!"}
            onAction={() => {}}
            actionLabel="Upload First Note"
          />
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
        
        <Pagination 
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          onPageChange={handlePageChange}
          isLoading={status === 'loading'}
        />
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-outfit">Learning Resources</h1>
          <p className="text-slate-500 mt-1">Discover notes and resources shared by fellow Kalvians.</p>
        </div>
        <button className="flex items-center justify-center px-6 py-3 bg-kalvium hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-kalvium/20 active:scale-95">
          <Plus className="w-5 h-5 mr-2" />
          Upload Note
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by topic or tag..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium text-slate-900 placeholder-slate-400 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-400 hidden sm:block" />
          <select 
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium transition-all font-semibold appearance-none pr-10 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default NotesPage;
