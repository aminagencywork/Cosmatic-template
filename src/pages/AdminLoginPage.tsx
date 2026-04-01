import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { config } from '../config';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin_authenticated', 'true');
        toast.success('Login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error(data.message || 'Invalid password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
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
              Enter Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-neutral rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none transition-all"
              required
            />
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
