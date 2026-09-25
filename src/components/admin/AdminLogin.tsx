import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, isBackendConnected, backendError, navigate } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      const res = await loginAdmin(email.trim(), password);
      if (res.success) {
        navigate('/admin/campaigns');
      } else {
        setError(res.error || 'Sign-in failed. Check your credentials and try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
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

          <h1 className="text-xl font-extrabold text-[#142326]">Operator Sign In</h1>
          <p className="text-xs text-[#667085]">
            Enter your Supabase credentials to access the administrative dashboard.
            Access is granted only to accounts present in the server-side admin allow-list.
          </p>
        </div>

        {!isBackendConnected && (
          <div className="p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl text-xs text-[#92600a] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {backendError ||
                'Supabase is not configured. Administrator sign-in is disabled until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'}
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
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
            disabled={loading || !isBackendConnected}
            className="w-full py-3 bg-[#2596be] hover:bg-[#1e7ca0] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating…</span>
            ) : (
              <>
                <span>Sign In to Operations Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#E5E7EB] text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#667085] hover:text-[#142326] underline cursor-pointer"
          >
            Return to Public Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};
