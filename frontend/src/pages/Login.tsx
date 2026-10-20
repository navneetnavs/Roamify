import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { extractErrorMessage } from '../utils/errors';
import { toast } from '../components/ui/toastService';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter both your email address and password.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('You are signed in.');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, 'Unable to sign in. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex">
      {/* Left — Image */}
      <div className="auth-visual hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80"
          alt="Luxury hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/70 to-slate-900/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
          <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-float">
            <span className="text-white font-black text-3xl">R</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Welcome back, explorer!</h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Sign in to access your bookings, manage guests, and discover new adventures.
          </p>
          <div className="flex items-center gap-2 mt-8 text-white/60 text-sm">
            <span>★★★★★</span>
            <span>Trusted by 2M+ travellers</span>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-form-panel flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="text-2xl font-black text-slate-900">Roamify</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Sign in</h1>
            <p className="text-slate-500">Don't have an account?{' '}
              <Link to="/signup" className="brand-gradient-text font-semibold hover:opacity-80">
                Sign up for free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  autoComplete="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  aria-pressed={showPass}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-rose-500" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm brand-gradient-text font-medium hover:opacity-80">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="divider my-6">or continue with</div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Apple'].map(provider => (
              <button
                key={provider}
                type="button"
                className="btn btn-outline border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-slate-600">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
