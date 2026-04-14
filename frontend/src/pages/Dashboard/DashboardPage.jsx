import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../../components/dashboard/PostCard';
import PostForm from '../../components/dashboard/PostForm';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getPosts } from '../../services/post.service';
import { Users, Calendar, BookOpen } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab] = useState('KALVIUM');

  const [status, setStatus] = useState('idle');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const response = await getPosts(activeTab);
      if (response.success) {
        setPosts(response.data.posts);
        setStatus('success');
      } else {
        throw new Error('API failure');
      }
    } catch (err) {
      setError('Failed to load feed');
      setStatus('error');
    }
  }, [activeTab]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-4">
      
      {/* Header Hero Card */}
      <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-10 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-kalvium/5 transition-all group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-kalvium/5 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-kalvium text-[10px] font-black uppercase tracking-[0.4em] mb-1">Campus Ecosystem</p>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 font-outfit tracking-tighter leading-[1.1]">
                Hey {user?.name ? user.name.split(' ')[0] : 'Kalvian'}! <span className="inline-block hover:animate-wave origin-bottom-right">👋</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-white hover:border-kalvium/20 group/tag">
                <Users className="w-5 h-5 mr-3 text-kalvium group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-slate-600 transition-colors group-hover:text-slate-900 font-outfit">Squad 76</span>
              </div>
              <div className="flex items-center bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-white hover:border-kalvium/20 group/tag">
                <Calendar className="w-5 h-5 mr-3 text-kalvium group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-slate-600 transition-colors group-hover:text-slate-900 font-outfit">Class of 2028</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-400 pl-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] font-outfit">Computer Science Engineering</span>
            </div>
          </div>
          
          <div className="shrink-0 hidden lg:block">
            <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 flex items-center justify-center border border-slate-100 p-6 transform rotate-6 hover:rotate-0 transition-all duration-700 scale-110">
              <img src="/logo.jpeg" alt="Kalvium" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Post Form Area */}
      <div className="space-y-4">
        <PostForm onPostCreated={fetchFeed} />
      </div>

      {/* Feed Section */}
      <div className="space-y-10">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-8 bg-kalvium rounded-full shadow-lg shadow-kalvium/20"></div>
            <h2 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Activity Feed</h2>
          </div>
          <div className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
            Real-time Updates
          </div>
        </div>

        <div className="space-y-8">
          {status === 'loading' ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : status === 'error' ? (
            <div className="py-20">
              <ErrorBanner message={error} onRetry={fetchFeed} />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 py-40 flex items-center justify-center group hover:bg-white hover:border-kalvium/20 transition-all duration-500">
              <EmptyState title="Quiet day" message="The community is resting. Be the first to start a conversation!" />
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map(post => <PostCard key={post.id} post={post} onDelete={fetchFeed} />)}
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
