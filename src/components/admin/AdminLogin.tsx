import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLogin: React.FC = () => {
  const {
    loginAdmin,
    loginWithSupabase,
    signUpWithSupabase,
    isBackendConnected,
    navigate,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('admin@gkapartmentcare.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isBackendConnected) {
        if (mode === 'signin') {
          const res = await loginWithSupabase(email, password);
          if (res.success) {
            navigate('/admin/campaigns');
          } else {
            setError(res.error || 'Failed to sign in via Supabase.');
          }
        } else {
          const res = await signUpWithSupabase(email, password);
          if (res.success) {
            setSuccessMsg('Account created successfully in Supabase! Signing you in...');
            setTimeout(() => {
              navigate('/admin/campaigns');
            }, 1000);
          } else {
            setError(res.error || 'Failed to create account.');
          }
        }
      } else {
        // Fallback operator login if Supabase is not configured yet
        const success = loginAdmin(password);
        if (success) {
          navigate('/admin/campaigns');
        } else {
          setError('Invalid operator access credentials.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin123');
    navigate('/admin/campaigns');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 antialiased text-[#142326]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm max-w-md w-full p-6 sm:p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2596be]/10 text-[#2596be] rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private Operations Portal</span>
            </div>
            {isBackendConnected && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#2E8B57]"></span>
                <span>Supabase Auth</span>
              </div>
            )}
          </div>

          <h1 className="text-xl font-extrabold text-[#142326]">
            {mode === 'signin' ? 'Operator Sign In' : 'Create Operator Account'}
          </h1>
          <p className="text-xs text-[#667085]">
            {mode === 'signin'
              ? 'Enter your credentials to access the administrative dashboard'
              : 'Register a new administrator account in Supabase Authentication'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F8F9FA] p-1 rounded-2xl border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#142326] shadow-xs'
                : 'text-[#667085] hover:text-[#142326]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#142326] shadow-xs'
                : 'text-[#667085] hover:text-[#142326]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#2E8B57]/10 border border-[#2E8B57]/20 rounded-xl text-xs text-[#2E8B57] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#142326] mb-1">
              Operator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@gkapartmentcare.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#142326] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#2596be] text-[#142326]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating with Supabase...</span>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In to Operations Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Register Supabase Operator</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 bg-[#F8F9FA] hover:bg-[#E5E7EB] border border-[#E5E7EB] text-[#142326] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            ⚡ Direct Operator Access
          </button>
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#667085] hover:text-[#142326] underline cursor-pointer"
            >
              Return to Public Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
