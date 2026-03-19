import React, { useEffect } from 'react';
import { useNotes } from '../../hooks/useNotes';
import NoteCard from '../../components/notes/NoteCard';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { Plus, Search, Filter } from 'lucide-react';

const NotesPage = () => {
  const { status, data, error, fetchNotes } = useNotes();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

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

    if (status === 'success' && data.length === 0) {
      return (
        <div className="mt-12">
          <EmptyState 
            title="No notes yet" 
            message="Be the first to share your knowledge with the community!"
            onAction={() => console.log('Open Note Modal')}
            actionLabel="Upload First Note"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(note => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-outfit">Learning Resources</h1>
          <p className="text-gray-400 mt-1">Discover notes and resources shared by fellow Kalvians.</p>
        </div>
        <button className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          <Plus className="w-5 h-5 mr-2" />
          Upload Note
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search notes by title, tags..." 
            className="w-full pl-11 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
        <button className="flex items-center justify-center px-4 py-3 bg-neutral-800 border border-neutral-700 text-gray-300 rounded-xl hover:bg-neutral-700 transition-colors">
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default NotesPage;
