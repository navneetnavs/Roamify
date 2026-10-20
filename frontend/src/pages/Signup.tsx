import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { extractErrorMessage } from '../utils/errors';
import { toast } from '../components/ui/toastService';

const FEATURES = [
  'Free account, no credit card required',
  'Access to 10,000+ verified hotels',
  'Instant booking confirmation',
  'Best price guarantee',
];

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in your name, email address, and password.');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Your account has been created.');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, 'Unable to create your account. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex">
      {/* Left — Image */}
      <div className="auth-visual hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=80"
          alt="Hotel pool"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/70 to-rose-900/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
          <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-float">
            <span className="text-white font-black text-3xl">R</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-6">Start your journey today</h2>
          <div className="space-y-4 text-left w-full max-w-xs">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-white/85 text-sm">{f}</span>
              </div>
            ))}
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
            <h1 className="text-3xl font-black text-slate-900 mb-2">Create account</h1>
            <p className="text-slate-500">Already have an account?{' '}
              <Link to="/login" className="brand-gradient-text font-semibold hover:opacity-80">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  autoComplete="name"
                  className="input-field pl-10"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  className="input-field pl-10 pr-10"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  aria-pressed={showPass}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength ? strengthColor : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{strengthLabel} password</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-10 ${form.confirm && form.confirm !== form.password ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]' : ''}`}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                />
                {form.confirm && form.confirm === form.password && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check size={11} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" required className="w-4 h-4 mt-0.5 accent-rose-500" />
              <p className="text-sm text-slate-600">
                <label htmlFor="terms">I agree to the</label>{' '}
                <a href="#" className="brand-gradient-text font-medium hover:opacity-80">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="brand-gradient-text font-medium hover:opacity-80">Privacy Policy</a>
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
