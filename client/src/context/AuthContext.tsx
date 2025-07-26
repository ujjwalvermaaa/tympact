import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auth, firestore } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  role: string;
  skills: string[];
  trustScore: number;
  timeBalance: number;
  xpPoints: number;
  joinedDate: string;
  avatar: string;
  completedTasks: number;
  rating: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(firestore, 'users', result.user.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
        setIsAuthenticated(true);
        toast({
          title: 'Welcome back!',
          description: 'Logged in successfully.',
        });
        return true;
      } else {
        toast({
          title: 'User profile not found',
          description: 'Please contact support.',
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
      });
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const newUser: User = {
        id: result.user.uid,
        name: userData.name,
        email: userData.email,
        city: userData.city || 'Mumbai',
        role: userData.role || 'New User',
        skills: userData.skills || [],
        trustScore: 75,
        timeBalance: 5, // Welcome bonus of 5 hours
        xpPoints: 50,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        avatar: '/assets/default-avatar.png',
        completedTasks: 0,
        rating: 5.0
      };
      await setDoc(doc(firestore, 'users', result.user.uid), newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      toast({
        title: 'Welcome to Tympact! 🎉',
        description: "Account created! You've received 5 hours welcome bonus.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message,
      });
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      await setDoc(doc(firestore, 'users', user.id), updatedUser, { merge: true });
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};