import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-neutral/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl shadow-primary/5">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Admin Access</h1>
          <p className="text-primary/40 text-sm uppercase tracking-widest font-bold">Lumière Beauty Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2 ml-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-14 pr-6 py-4 bg-neutral rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-neutral rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-accent transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-neutral flex items-center justify-center gap-2 text-xs text-primary/40">
          <ShieldCheck size={14} />
          <span>Secure Admin Session</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
