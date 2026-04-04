import { applyToHackathon } from '../../services/hackathons.service';
import { useAuth } from '../../hooks/useAuth';

const HackathonsPage = () => {
  const { user } = useAuth();
  const { status, data, error, fetchHackathons } = useHackathons();

  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  const handleApply = async (id) => {
    const portfolioLink = prompt("Please enter your portfolio/github link:");
    if (!portfolioLink) return;
    try {
      const res = await applyToHackathon(id, portfolioLink);
      if (res.success) {
        alert("Application submitted successfully!");
        fetchHackathons();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-[2.5rem] p-8 h-80 shadow-sm"></div>
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="max-w-2xl mx-auto mt-12">
          <ErrorBanner message={error} onRetry={() => fetchHackathons()} />
        </div>
      );
    }

    if (status === 'success' && (!data || data.length === 0)) {
      return (
        <div className="mt-12 bg-white rounded-[2.5rem] p-16 border border-dashed border-slate-300 text-center">
          <EmptyState 
            title="No Hackathons found" 
            message="There are no active hackathons available right now. Stay tuned for future events!"
            onAction={() => window.open('https://kalvium.com/events', '_blank')}
            actionLabel="View All Events"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(item => (
          <HackathonCard 
            key={item.id} 
            hackathon={item} 
            onApply={handleApply}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-top duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-kalvium rounded-3xl shadow-xl shadow-kalvium/20 group">
            <Trophy className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 font-outfit tracking-tight">Exclusive <span className="text-kalvium">Hackathons</span></h1>
            <p className="text-slate-500 text-lg">Compete, collaborate, and win prizes in Kalvium-only challenges.</p>
          </div>
        </div>
        
        {user?.role === 'CAMPUS_MANAGER' && (
          <button className="flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-95 group">
             Manage Participants
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search active hackathons..." 
            className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default HackathonsPage;
