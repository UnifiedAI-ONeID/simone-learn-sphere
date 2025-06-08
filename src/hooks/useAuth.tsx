
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  try {
    return useAuthContext();
  } catch (error) {
    console.warn('useAuth called outside AuthProvider, returning default values');
    return {
      user: null,
      session: null,
      loading: false,
      signOut: async () => {},
      refreshProfile: async () => {},
    };
  }
};
