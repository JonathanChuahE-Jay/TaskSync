import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user: string) => set({ user }),
  logout: () => set({ user: null }),
}))

export default useAuthStore
