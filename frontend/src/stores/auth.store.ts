import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthRole = 'company' | 'professional';

export type AuthSession = {
  readonly role: AuthRole;
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
};

type AuthState = {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'trilha-50-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
