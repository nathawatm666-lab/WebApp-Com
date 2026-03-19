import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isLoggedIn: false,

            login: (userData) => {
                set({ user: userData, isLoggedIn: true });
            },

            logout: () => {
                set({ user: null, isLoggedIn: false });
            },

            updateProfile: (updates) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null
                }));
            }
        }),
        { name: 'techhub-auth' }
    )
);

export default useAuthStore;
