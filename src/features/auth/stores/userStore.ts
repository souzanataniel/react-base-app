import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userService} from '../services';
import {UpdateUserRequest, User} from '@/features/auth/types';

interface UserStoreState {
  user: User | null;
  isLoadingUser: boolean;

  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateUserRequest) => Promise<User>;
  clearUser: () => void;

  isEmailVerified: () => boolean;
  getUserInitials: () => string;
  getUserDisplayName: () => string;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoadingUser: false,

      setUser: (user: User) => {
        set({user});
      },
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {...currentUser, ...userData}
          });
        }
      },
      refreshUser: async () => {
        set({isLoadingUser: true});

        try {
          const user = await userService.getCurrentUser();
          set({user});
        } catch (error) {
          console.error('User refresh error:', error);
        } finally {
          set({isLoadingUser: false});
        }
      },

      updateProfile: async (data: UpdateUserRequest) => {
        set({isLoadingUser: true});

        try {
          const updatedUser = await userService.updateProfile(data);
          set({user: updatedUser});
          return updatedUser;
        } catch (error) {
          set({isLoadingUser: false});
          throw error;
        } finally {
          set({isLoadingUser: false});
        }
      },

      clearUser: () => {
        set({
          user: null,
          isLoadingUser: false
        });
      },

      isEmailVerified: () => {
        const user = get().user;
        return user?.emailVerified ?? false;
      },

      getUserInitials: () => {
        const user = get().user;
        if (!user?.name) return '';

        return user.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('');
      },

      getUserDisplayName: () => {
        const user = get().user;
        return user?.name || 'Usuário';
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        user: state.user,
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoadingUser = false;
        }
      },
    }
  )
);

export const useUser = () => useUserStore((state) => state.user);
export const useUserLoading = () => useUserStore((state) => state.isLoadingUser);

// CORRIGIDO: Usar seletores específicos para cada ação
export const useSetUserAction = () => useUserStore((state) => state.setUser);
export const useUpdateUserAction = () => useUserStore((state) => state.updateUser);
export const useRefreshUserAction = () => useUserStore((state) => state.refreshUser);
export const useUpdateProfileAction = () => useUserStore((state) => state.updateProfile);
export const useClearUserAction = () => useUserStore((state) => state.clearUser);

// MANTIDO para compatibilidade - mas agora memoizado corretamente
export const useUserActions = () => {
  const setUser = useSetUserAction();
  const updateUser = useUpdateUserAction();
  const refreshUser = useRefreshUserAction();
  const updateProfile = useUpdateProfileAction();
  const clearUser = useClearUserAction();

  // Zustand já memoiza estas funções automaticamente
  return { setUser, updateUser, refreshUser, updateProfile, clearUser };
};

export const useUserHelpers = () => useUserStore((state) => ({
  isEmailVerified: state.isEmailVerified,
  getUserInitials: state.getUserInitials,
  getUserDisplayName: state.getUserDisplayName,
}));
