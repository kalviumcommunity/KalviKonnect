import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import ErrorBanner from '../../components/shared/ErrorBanner';

const RegisterPage = () => {
  const { register: registerAuth } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: ROLES.STUDENT,
      universityId: 'univ-default-123'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await registerAuth(data);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      setError(err.response?.data?.message || 'Registration failed. Check if university exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center p-1 shadow-lg shadow-slate-200/50 border border-slate-100">
            <img src="/logo.jpeg" alt="Kalvium" className="w-full h-full object-contain rounded-lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Create Account</h1>
          <p className="text-sm text-slate-500">Join the Kalvium community</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              {...register('name', { required: 'Name is required' })}
              className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kalvium/20 focus:border-kalvium text-slate-900 placeholder-slate-400 transition-all ${errors.name ? 'border-rose-500' : ''}`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              placeholder="email@kalvium.community"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@kalvium\.community$/i, message: 'Must be a valid @kalvium.community email' }
              })}
              className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kalvium/20 focus:border-kalvium text-slate-900 placeholder-slate-400 transition-all ${errors.email ? 'border-rose-500' : ''}`}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">I am a...</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kalvium/20 focus:border-kalvium text-slate-900 transition-all appearance-none"
            >
              <option value={ROLES.STUDENT}>Student</option>
              <option value={ROLES.MENTOR}>Mentor</option>
              <option value={ROLES.MANAGER}>Campus Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kalvium/20 focus:border-kalvium text-slate-900 placeholder-slate-400 transition-all ${errors.password ? 'border-rose-500' : ''}`}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-4 bg-kalvium hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-kalvium/20 transition-all transform active:scale-[0.98] mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-kalvium hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
