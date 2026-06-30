import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { RegisteredAccount } from '../types';

export const authService = {
  isConfigured(): boolean {
    return !!auth;
  },

  async signUp(email: string, password: string, name: string, role: 'user' | 'admin' = 'user', slug = ''): Promise<any> {
    const cleanEmail = email.trim().toLowerCase();
    
    if (!this.isConfigured()) {
      throw new Error('Database service is currently offline or unavailable. Security registration cannot be completed at this time.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      if (user) {
        // Profile creation mapped explicitly with auth auth.uid
        const profilePath = `registered_accounts/${user.uid}`;
        try {
          await setDoc(doc(db, 'registered_accounts', user.uid), {
            id: user.uid,
            name,
            email: cleanEmail,
            role,
            slug,
            created_at: new Date().toISOString()
          });
        } catch (profileError) {
          console.warn('Profile sync insertion skipped or failed:', profileError);
          handleFirestoreError(profileError, OperationType.WRITE, profilePath);
        }
      }
      
      return user;
    } catch (error: any) {
      console.error('Sign up error occurred:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<{ user: any; role: 'user' | 'admin' }> {
    const emailLower = email.trim().toLowerCase();
    
    if (!this.isConfigured()) {
      throw new Error('Database service is currently offline or unavailable. Secure administrator or guest login is disabled.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailLower, password);
      const user = userCredential.user;
      
      let role: 'user' | 'admin' = 'user';
      let name = 'User';
      
      if (emailLower === 'ddg27874@gmail.com') {
        role = 'admin';
        name = 'Administrator';
      }

      // 1. Verify against admin_users whitelist directly (source of truth)
      const adminPath = `admin_users/${user.uid}`;
      try {
        const adminDoc = await getDoc(doc(db, 'admin_users', user.uid));
        if (adminDoc.exists()) {
          role = 'admin';
          name = 'Administrator';
        }
      } catch (adminErr) {
        console.warn('Admin verification list lookup skipped or failed, falling back...');
      }

      // 2. Fall back to checking registered_accounts
      if (role !== 'admin') {
        const profilePath = `registered_accounts/${user.uid}`;
        try {
          const profileDoc = await getDoc(doc(db, 'registered_accounts', user.uid));
          if (profileDoc.exists()) {
            const profile = profileDoc.data();
            role = profile.role === 'admin' ? 'admin' : 'user';
            name = profile.name || 'Visitor';
          }
        } catch (profileErr) {
          handleFirestoreError(profileErr, OperationType.GET, profilePath);
        }
      }
      
      // Informational local states (strictly for non-security UI hints)
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_email', emailLower);
      localStorage.setItem('user_name', name);
      if (role === 'admin') {
        localStorage.setItem('is_admin', 'true');
      } else {
        localStorage.removeItem('is_admin');
      }
      
      return { user, role };
    } catch (error: any) {
      console.error('Database authenticating identity errored:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    if (this.isConfigured()) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Sign out operation errored: ', e);
      }
    }
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('is_admin');
  },

  getCurrentUser() {
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');
    const role = localStorage.getItem('user_role') as 'user' | 'admin' | null;
    if (!email) return null;
    return { email, name, role };
  },

  async forgotPassword(email: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Password reset rejected: Secure database integration with Firebase is not configured.');
    }
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    } catch (error: any) {
      console.error('Password reset email dispatch failed:', error);
      throw error;
    }
  },

  async signInWithGoogle(): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Database service is currently offline or unavailable. Google authentication is disabled.');
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      throw error;
    }
  }
};
