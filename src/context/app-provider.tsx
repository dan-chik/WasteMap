'use client';

import React, { createContext, useReducer, useEffect, ReactNode, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User, Bin, Report, BinType } from '@/lib/types';
import { initialUsers, initialBins, initialReports } from '@/lib/data';

type AppState = {
  user: User | null;
  users: User[];
  bins: Bin[];
  reports: Report[];
  loading: boolean;
  isOptimizingRoute: boolean;
  optimizedRoute: Bin[];
};

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'UPDATE_BIN'; payload: Bin }
  | { type: 'ADD_BIN'; payload: Bin }
  | { type: 'REMOVE_BIN'; payload: string }
  | { type: 'APPROVE_USER'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'ADD_POINTS'; payload: { userId: string; points: number } }
  | { type: 'START_ROUTE_OPTIMIZATION' }
  | { type: 'SET_OPTIMIZED_ROUTE'; payload: Bin[] }
  | { type: 'THROW_TRASH'; payload: { binId: string, amount: number } };

const initialState: AppState = {
  user: null,
  users: initialUsers,
  bins: initialBins,
  reports: initialReports,
  loading: true,
  isOptimizingRoute: false,
  optimizedRoute: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.payload] };
    case 'UPDATE_BIN':
      return {
        ...state,
        bins: state.bins.map((bin) => (bin.id === action.payload.id ? action.payload : bin)),
      };
    case 'ADD_BIN':
        return { ...state, bins: [...state.bins, action.payload] };
    case 'REMOVE_BIN':
        return { ...state, bins: state.bins.filter(bin => bin.id !== action.payload) };
    case 'APPROVE_USER':
        return {
            ...state,
            users: state.users.map(user => user.id === action.payload ? { ...user, approved: true } : user)
        };
    case 'ADD_USER':
        return { ...state, users: [...state.users, action.payload] };
    case 'ADD_POINTS':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.userId 
          ? { ...user, points: (user.points || 0) + action.payload.points } 
          : user
        )
      };
    case 'START_ROUTE_OPTIMIZATION':
      return { ...state, isOptimizingRoute: true };
    case 'SET_OPTIMIZED_ROUTE':
      return { ...state, isOptimizingRoute: false, optimizedRoute: action.payload };
    case 'THROW_TRASH':
      return {
        ...state,
        bins: state.bins.map(bin => {
          if (bin.id === action.payload.binId) {
            const newFillLevel = Math.min(100, bin.fillLevel + action.payload.amount);
            return { ...bin, fillLevel: newFillLevel, status: newFillLevel >= 90 ? 'full' : 'ok' };
          }
          return bin;
        })
      };
    default:
      return state;
  }
};

type AppContextType = AppState & {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addReport: (binId: string, type: 'full' | 'broken') => void;
  updateBin: (bin: Bin) => void;
  emptyBin: (binId: string) => void;
  addBinNote: (binId: string, note: string) => void;
  addBin: (bin: Omit<Bin, 'id'>) => void;
  removeBin: (binId: string) => void;
  approveUser: (userId: string) => void;
  getBinById: (binId: string) => Bin | undefined;
  getUserById: (userId: string) => User | undefined;
  getOptimizedRoute: () => Promise<void>;
  throwTrash: (binId: string) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('waste-wise-user');
      if (storedUser) {
        dispatch({ type: 'LOGIN', payload: JSON.parse(storedUser) });
      }
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = state.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user && (user.role !== 'collector' || user.approved)) {
      dispatch({ type: 'LOGIN', payload: user });
      sessionStorage.setItem('waste-wise-user', JSON.stringify(user));
      router.push(`/${user.role}`);
      return true;
    }
    if (user && user.role === 'collector' && !user.approved) {
      toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Your collector account has not been approved yet.",
      });
      return false;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    sessionStorage.removeItem('waste-wise-user');
    router.push('/');
  };

  const addReport = (binId: string, type: 'full' | 'broken') => {
    if (!state.user) return;
    const newReport: Report = {
        id: `rep-${Date.now()}`,
        binId,
        userId: state.user.id,
        type,
        status: 'pending',
        date: new Date().toISOString()
    };
    dispatch({ type: 'ADD_REPORT', payload: newReport });
    dispatch({ type: 'ADD_POINTS', payload: { userId: state.user.id, points: 10 } });

    if (type === 'full') {
      const bin = state.bins.find(b => b.id === binId);
      if (bin) {
        dispatch({ type: 'UPDATE_BIN', payload: { ...bin, fillLevel: 100, status: 'full' } });
      }
    }

    toast({
        title: "Report Submitted!",
        description: `You've earned 10 points for reporting bin ${binId}.`,
    });
  };

  const updateBin = (bin: Bin) => {
    dispatch({ type: 'UPDATE_BIN', payload: bin });
  };
  
  const emptyBin = (binId: string) => {
    const bin = state.bins.find(b => b.id === binId);
    if(bin) {
        const updatedBin = { ...bin, fillLevel: 0, status: 'ok' as 'ok' };
        dispatch({type: 'UPDATE_BIN', payload: updatedBin});
        toast({ title: "Bin Emptied", description: `Bin ${binId} has been marked as empty.` });
    }
  };

  const addBinNote = (binId: string, noteText: string) => {
    const bin = state.bins.find(b => b.id === binId);
    if (bin) {
      const newNote = { text: noteText, date: new Date().toISOString() };
      const updatedBin = { ...bin, notes: [...(bin.notes || []), newNote] };
      dispatch({ type: 'UPDATE_BIN', payload: updatedBin });
      toast({ title: "Note Added", description: `A new note has been added to bin ${binId}.` });
    }
  };
  
  const addBin = (bin: Omit<Bin, 'id'>) => {
    const newBin = { ...bin, id: `bin-${Date.now()}` };
    dispatch({ type: 'ADD_BIN', payload: newBin });
    toast({ title: "Bin Added", description: `New ${bin.type} bin added.` });
  };
  
  const removeBin = (binId: string) => {
    dispatch({ type: 'REMOVE_BIN', payload: binId });
    toast({ title: "Bin Removed", description: `Bin ${binId} has been removed.` });
  };

  const approveUser = (userId: string) => {
    dispatch({ type: 'APPROVE_USER', payload: userId });
    toast({ title: "User Approved", description: "Collector account has been approved." });
  };

  const getBinById = (binId: string) => state.bins.find(b => b.id === binId);
  const getUserById = (userId: string) => state.users.find(u => u.id === userId);

  const getOptimizedRoute = async () => {
    dispatch({ type: 'START_ROUTE_OPTIMIZATION' });
    try {
      const { optimizeCollectorRoute } = await import('@/ai/flows/optimize-collector-route');
      const fullBins = state.bins
        .filter(b => b.fillLevel > 80)
        .map(b => ({ id: b.id, latitude: b.location.lat, longitude: b.location.lng, fillLevel: b.fillLevel }));

      if (fullBins.length === 0) {
        toast({ title: "No Full Bins", description: "All bins are currently below 80% capacity." });
        dispatch({ type: 'SET_OPTIMIZED_ROUTE', payload: [] });
        return;
      }

      const result = await optimizeCollectorRoute({
        binLocations: fullBins,
        currentLocation: { latitude: 50, longitude: 50 } // Mocked current location
      });
      
      const orderedBins = result.optimizedRoute.map(optimizedBin => state.bins.find(b => b.id === optimizedBin.id)).filter((b): b is Bin => !!b);
      dispatch({ type: 'SET_OPTIMIZED_ROUTE', payload: orderedBins });

      toast({
        title: "Route Optimized!",
        description: `Found ${orderedBins.length} bins to collect. Estimated time savings: ${result.estimatedTimeSavings.toFixed(1)} mins.`,
      });

    } catch (error) {
      console.error('Route optimization failed', error);
      toast({ variant: 'destructive', title: "Optimization Failed", description: "Could not generate an optimized route." });
      dispatch({ type: 'SET_OPTIMIZED_ROUTE', payload: [] });
    }
  };

  const throwTrash = (binId: string) => {
    const bin = state.bins.find(b => b.id === binId);
    if (!bin || bin.fillLevel >= 100 || !state.user || state.user.role !== 'citizen') return;
    
    const amount = 5; // Simulate throwing trash fills 5%
    const newFillLevel = Math.min(100, bin.fillLevel + amount);
    
    dispatch({ type: 'THROW_TRASH', payload: { binId, amount } });
    dispatch({ type: 'ADD_POINTS', payload: { userId: state.user.id, points: 1 } });
    
    toast({
      title: "Trash Disposed!",
      description: `You earned 1 point. Bin ${binId} is now ${newFillLevel}% full.`,
    });
  };

  // Notification simulation
  useEffect(() => {
    if (state.user?.role === 'collector') {
      const fullBins = state.bins.filter(b => b.fillLevel > 80 && b.fillLevel <= 85);
      if (fullBins.length > 0 && pathname.includes('collector')) {
        fullBins.forEach(bin => {
           toast({
             title: 'High-Capacity Alert',
             description: `Bin ${bin.id} (${bin.type}) is over 80% full.`,
           });
        });
      }
    }
    if (state.user?.role === 'admin') {
      const nearlyFullBins = state.bins.filter(b => b.fillLevel > 70 && b.fillLevel <= 75);
      if (nearlyFullBins.length > 0 && pathname.includes('admin')) {
         nearlyFullBins.forEach(bin => {
           toast({
             title: 'Bin Capacity Alert',
             description: `Bin ${bin.id} (${bin.type}) is over 70% full.`,
           });
        });
      }
    }
  }, [state.bins, state.user, toast, pathname]);
  

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    addReport,
    updateBin,
    emptyBin,
    addBinNote,
    addBin,
    removeBin,
    approveUser,
    getBinById,
    getUserById,
    getOptimizedRoute,
    throwTrash,
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
