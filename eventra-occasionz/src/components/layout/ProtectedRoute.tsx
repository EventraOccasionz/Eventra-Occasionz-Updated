import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { dataService } from '../../lib/dataService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'user')[];
}

export default function ProtectedRoute({ children, allowedRoles = ['admin'] }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const checkAuth = async (user: any) => {
      // Direct offline and unconfigured database route block
      if (!dataService.isConfigured()) {
        if (active) {
          setAuthorized(false);
          setLoading(false);
        }
        return;
      }

      try {
        // Fetch registered_accounts profile to check role
        const profileDoc = await getDoc(doc(db, 'registered_accounts', user.uid));
        const isAdminProfile = profileDoc.exists() && profileDoc.data()?.role === 'admin';

        // Check if admin_users collection contains the user
        let isAdminInCollection = false;
        try {
          const adminDoc = await getDoc(doc(db, 'admin_users', user.uid));
          if (adminDoc.exists()) {
            isAdminInCollection = true;
          }
        } catch (_) {}

        if (isAdminProfile || isAdminInCollection) {
          // Sync safe informational helper local state
          localStorage.setItem('user_email', user.email || '');
          localStorage.setItem('user_role', 'admin');
          localStorage.setItem('user_name', (profileDoc.exists() && profileDoc.data()?.name) || user.displayName || 'Administrator');
          localStorage.setItem('is_admin', 'true');

          if (active) {
            setAuthorized(true);
            setLoading(false);
          }
        } else {
          if (active) {
            setAuthorized(false);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Authentication guard resolution failed:', err);
        if (active) {
          setAuthorized(false);
          setLoading(false);
        }
      }
    };

    // Subscribe to real-time auth changes via Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkAuth(user);
      } else {
        localStorage.removeItem('is_admin');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        if (active) {
          setAuthorized(false);
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex flex-col items-center justify-center bg-dark-4 text-cream">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 p-8 bg-dark-2 border border-gold/20 max-w-sm text-center"
        >
          <Loader2 className="animate-spin text-gold" size={32} />
          <h3 className="font-serif text-lg text-cream tracking-tight">Resolving Security Gate</h3>
          <p className="text-xs text-text-secondary uppercase tracking-widest">Parsing session tokens...</p>
        </motion.div>
      </div>
    );
  }

  if (!authorized) {
    // Redirect unauthorized attempt to the login suite
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
