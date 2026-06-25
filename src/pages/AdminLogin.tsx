import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dataService } from '../lib/dataService';
import { verifyFirebaseConnection } from '../lib/firebase';
import { ShieldCheck, Loader2, AlertTriangle, RefreshCcw, Database } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  const isConfigured = dataService.isConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailClean = email.toLowerCase().trim();

    try {
      const { user, role } = await dataService.login(emailClean, password);

      if (role !== 'admin') {
        await dataService.logout();
        setError('Authorized access denied. You do not possess administrator level clearance.');
        return;
      }

      navigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryConnection = async () => {
    setRetrying(true);
    try {
      const conn = await verifyFirebaseConnection();
      if (conn.success) {
        window.location.reload();
      } else {
        setError(conn.error || 'Connection attempt failed. Database is still offline.');
      }
    } catch (err) {
      setError('Database integration could not be reached.');
    } finally {
      setRetrying(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6 bg-dark-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 bg-dark-2 border border-gold/40 relative"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-dark-3 border border-gold/40 rounded-full flex items-center justify-center text-gold">
          {isConfigured ? <ShieldCheck size={40} /> : <AlertTriangle className="text-red-400" size={40} />}
        </div>

        <div className="text-center mt-6 mb-10">
          <h2 className="font-serif text-3xl text-cream mb-2 tracking-tight">Admin Portal</h2>
          <div className="w-10 h-[1px] bg-gold mx-auto mb-4" />
          <p className="text-[0.6rem] text-text-secondary uppercase tracking-[0.2em]">
            Authorized personnel only. Eventra Management System.
          </p>
        </div>

        {!isConfigured ? (
          <div className="space-y-6">
            <div className="bg-red-950/20 border border-red-500/20 p-6 rounded-lg text-center space-y-4">
              <Database className="mx-auto text-red-400/80 mb-2" size={32} />
              <h3 className="text-xs uppercase tracking-widest text-red-400 font-bold">Secure Service Unavailable</h3>
              <p className="text-[11px] text-text-secondary leading-relaxed uppercase tracking-wider">
                The database server is currently offline or unconfigured. 
                All administrative interfaces and protected resources are locked securely.
              </p>
              <div className="text-[10px] text-text-secondary/60 text-left bg-black/40 p-4 border border-white/5 space-y-2 uppercase tracking-wide">
                <span className="text-gold font-bold">Troubleshooting guide:</span>
                <p>1. Check if database is active under your Firebase project console.</p>
                <p>2. Verify database configs exist in the firebase-applet-config.json file.</p>
                <p>3. Public read-only preview mode is active for client pages.</p>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-[10px] text-center uppercase tracking-wider bg-red-950/10 p-3 border border-red-500/10">
                {error}
              </p>
            )}

            <button
              onClick={handleRetryConnection}
              disabled={retrying}
              className="w-full py-4 bg-gold text-dark text-[0.74rem] tracking-[0.3em] uppercase font-bold transition-all hover:bg-gold-light disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {retrying ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <RefreshCcw size={14} className="animate-spin-slow" />
                  Retry Server Handshake
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-text-secondary ml-1">Email Identifier</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-gold/20 p-4 text-text-primary outline-none focus:border-gold transition-colors"
                placeholder="admin@eventra.com"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-text-secondary ml-1">Secure Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border border-gold/20 p-4 text-text-primary outline-none focus:border-gold transition-colors"
                placeholder="••••••••"
              />
              {error && <p className="text-red-400 text-[0.65rem] mt-1 uppercase tracking-widest">{error}</p>}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gold text-dark text-[0.74rem] tracking-[0.3em] uppercase font-bold transition-all hover:bg-gold-light disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Authenticate'}
            </button>
          </form>
        )}

        <div className="mt-10 pt-6 border-t border-gold/10 text-center space-y-2">
            <p className="text-[0.55rem] text-text-secondary/50 uppercase tracking-widest">
                Security Protocol Active. All attempts logged.
            </p>
        </div>
      </motion.div>
    </div>
  );
}
