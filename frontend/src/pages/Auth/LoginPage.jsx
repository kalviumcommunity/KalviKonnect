import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ErrorBanner from '../../components/shared/ErrorBanner';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      if (msg.toLowerCase().includes('email')) {
        setFormError('email', { type: 'server', message: msg });
      } else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('credentials')) {
        setFormError('password', { type: 'server', message: msg });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-xl p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center p-1 shadow-lg shadow-slate-200/50 border border-slate-100">
            <img src="/logo.jpeg" alt="Kalvium Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to KalviConnect</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@kalvium.community"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@kalvium\.community$/i, message: 'Must be a valid @kalvium.community email' }
              })}
              className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kalvium/20 focus:border-kalvium text-slate-900 placeholder-slate-400 transition-all ${errors.email ? 'border-rose-500 bg-rose-50' : ''}`}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
              className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kalvium/20 focus:border-kalvium text-slate-900 placeholder-slate-400 transition-all ${errors.password ? 'border-rose-500 bg-rose-50' : ''}`}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 bg-kalvium hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-kalvium/20 transition-all transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-kalvium hover:underline font-bold">
              Join KalviConnect
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
