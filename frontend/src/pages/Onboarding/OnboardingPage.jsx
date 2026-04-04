import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import * as universityService from '../../services/university.service';

const OnboardingPage = () => {
  const { user, token, dispatch } = useContext(AuthContext);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await universityService.getUniversities();
        if (response.success) {
          setUniversities(response.data);
        }
      } catch (err) {
        setError('Failed to load universities. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUniversity) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await universityService.updateOnboarding(token, selectedUniversity);
      if (response.success) {
        // Update local state and storage
        const updatedUser = { ...user, universityId: selectedUniversity, university: response.data.university };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'SET_USER', payload: updatedUser });
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to save selection. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🔥</span>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to KalviKonnect</h1>
          <p className="text-slate-500">Pick your campus to get started with your community!</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="university" className="block text-sm font-semibold text-slate-700 mb-2">
              Select Your University
            </label>
            <select
              id="university"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all appearance-none cursor-pointer"
              required
            >
              <option value="" disabled>Choose a university...</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name} ({uni.location})
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-slate-400 italic">
              Can't find your university? Contact your Campus Manager.
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedUniversity || isSubmitting}
            className="w-full py-3.5 bg-brand-orange text-white font-bold rounded-xl shadow-md hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? 'Saving...' : 'Finish Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
