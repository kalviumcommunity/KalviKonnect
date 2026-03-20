import React, { useState, useEffect, useCallback } from 'react';
import FeedTabs from '../../components/dashboard/FeedTabs';
import PostCard from '../../components/dashboard/PostCard';
import PostForm from '../../components/dashboard/PostForm';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { Search, TrendingUp, Users, Calendar, BookOpen, Trophy, Megaphone, MessageSquare, LayoutDashboard } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('college');
  const [status, setStatus] = useState('idle');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockPosts = [
        {
          _id: '1',
          author: { name: 'Aryan Sharma' },
          content: 'Just finished the Milestone 4 backend! The JWT authentication was tricky but satisfying to implement. #KalviKonnect #Learning',
          createdAt: new Date().toISOString(),
          likes: 12,
          comments: [1, 2]
        },
        {
          _id: '2',
          author: { name: 'Sneha Reddy' },
          content: 'Does anyone have tips for the upcoming Hackathon? Specifically looking for UI/UX best practices.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          likes: 8,
          comments: [1]
        }
      ];
      setPosts(mockPosts);
      setStatus('success');
    } catch (err) {
      setError('Failed to load feed');
      setStatus('error');
    }
  }, [activeTab]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Header Hero Card */}
        <div className="relative bg-white border border-slate-200 rounded-3xl p-8 overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-slate-900 font-outfit mb-4">
              Hi {user?.name ? user.name.split(' ')[0] : 'Kalvian'} <span className="animate-bounce inline-block">👋</span>
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center bg-sky-50/50 px-3 py-1.5 rounded-full border border-sky-100">
                <Users className="w-4 h-4 mr-2 text-sky-600" />
                <span>Squad 76</span>
              </div>
              <div className="flex items-center bg-sky-50/50 px-3 py-1.5 rounded-full border border-sky-100">
                <Calendar className="w-4 h-4 mr-2 text-sky-600" />
                <span>Class of 2028</span>
              </div>
            </div>
            <div className="mt-6 flex items-center space-x-2 text-slate-500">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Computer Science Engineering</span>
            </div>
          </div>
          
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 p-2 transform rotate-6">
              <img src="/logo.jpeg" alt="Kalvium" className="w-full h-full object-contain rounded-lg" />
            </div>
          </div>
        </div>

        {/* Feed Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Activity Feed</h2>
            <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          <PostForm />

          <div className="space-y-4">
            {status === 'loading' ? (
              [1, 2].map(i => <SkeletonCard key={i} />)
            ) : status === 'error' ? (
              <ErrorBanner message={error} onRetry={fetchFeed} />
            ) : posts.length === 0 ? (
              <EmptyState title="Quiet day" message="Nothing to show yet." />
            ) : (
              posts.map(post => <PostCard key={post._id} post={post} />)
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Apps Grid */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            My Kalvium Apps
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Livebooks', icon: BookOpen, color: 'text-purple-500', bgColor: 'bg-purple-50' },
              { name: 'Dojo', icon: Trophy, color: 'text-red-500', bgColor: 'bg-red-50' },
              { name: 'Mail', icon: Megaphone, color: 'text-blue-500', bgColor: 'bg-blue-50' },
              { name: 'Chat', icon: MessageSquare, color: 'text-orange-500', bgColor: 'bg-orange-50' },
              { name: 'Calendar', icon: Calendar, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
              { name: 'Support', icon: Users, color: 'text-rose-500', bgColor: 'bg-rose-50' },
            ].map(app => (
              <button key={app.name} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:border-kalvium/30 hover:bg-slate-50 transition-all group">
                <div className={`p-2.5 rounded-xl ${app.bgColor} group-hover:scale-110 transition-transform mb-2 ${app.color}`}>
                  <app.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-900 font-bold mb-2">Grow with Kalvium</h3>
          <p className="text-sm text-slate-600 mb-4">Complete your internship application today.</p>
          <button className="w-full py-2.5 bg-kalvium text-white font-bold rounded-xl shadow-lg shadow-kalvium/20 hover:bg-red-600 transition-all">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
