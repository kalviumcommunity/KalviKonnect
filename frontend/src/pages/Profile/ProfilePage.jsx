import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ProfileStats from '../../components/profile/ProfileStats';
import EditProfileModal from '../../components/profile/EditProfileModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ProfilePage = () => {
  const { user, token, dispatch, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [contributions, setContributions] = useState([]);
  const [isContribLoading, setIsContribLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData) {
      fetchContributions();
    }
  }, [activeTab, profileData]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProfileData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContributions = async () => {
    setIsContribLoading(true);
    try {
      const endpoint = activeTab === 'notes' ? 'notes' : 'placements';
      const response = await axios.get(`${API_URL}/users/me/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setContributions(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching contributions:', err);
    } finally {
      setIsContribLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await axios.patch(`${API_URL}/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const updatedUser = { ...user, ...response.data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'SET_USER', payload: updatedUser });
        setProfileData(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  const initials = profileData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Profile Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        
        <div className="h-24 w-24 sm:h-32 sm:w-32 bg-brand-orange flex items-center justify-center text-white text-3xl sm:text-4xl font-black rounded-3xl shadow-xl shadow-brand-orange/20 relative z-10 border-4 border-white">
          {initials}
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{profileData?.name}</h1>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              profileData?.role === 'CAMPUS_MANAGER' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
              profileData?.role === 'MENTOR' ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' :
              'bg-emerald-100 text-emerald-600 border border-emerald-200'
            }`}>
              {profileData?.role?.replace('_', ' ')}
            </span>
          </div>
          <p className="text-slate-400 font-medium mb-1 flex items-center justify-center md:justify-start gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {profileData?.email}
          </p>
          <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            {profileData?.university?.name} {profileData?.batchYear ? `• Class of ${profileData.batchYear}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-3 relative z-10 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 shadow-sm transition-all text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Profile
          </button>
          <button 
            onClick={logout}
            className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 hover:bg-red-100 transition-all text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </div>

      <ProfileStats stats={profileData?.stats} />

      {/* Contributions Section */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-50">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-5 text-sm font-bold tracking-tight transition-all relative ${
              activeTab === 'notes' ? 'text-brand-orange' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            My Notes
            {activeTab === 'notes' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('placements')}
            className={`flex-1 py-5 text-sm font-bold tracking-tight transition-all relative ${
              activeTab === 'placements' ? 'text-brand-orange' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Placement Stories
            {activeTab === 'placements' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange rounded-full"></div>}
          </button>
        </div>

        <div className="p-2 sm:p-6">
          {isContribLoading ? (
            <div className="py-20 text-center text-slate-400">Loading your content...</div>
          ) : contributions.length > 0 ? (
            <div className="space-y-4">
              {contributions.map((item) => (
                <div key={item.id} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-brand-orange transition-colors">
                        {activeTab === 'notes' ? item.title : `${item.company} — ${item.role}`}
                      </h3>
                      <p className="text-slate-400 text-xs font-medium flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {activeTab === 'notes' && <span>• {item.university?.name}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-black px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600">
                      <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" /></svg>
                      {item.upvoteCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4 opacity-20">📂</div>
              <p className="text-slate-400 font-medium tracking-tight">You haven't contributed any {activeTab} yet.</p>
              <button className="mt-4 text-brand-orange font-bold text-sm hover:underline">Start writing now →</button>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleUpdateProfile}
        initialData={profileData}
      />
    </div>
  );
};

export default ProfilePage;
