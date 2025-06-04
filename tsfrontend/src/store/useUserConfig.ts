import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserConfig {
	theme: 'light' | 'dark'
	toggleTheme: () => void
}

export const useUserConfigStore = create<UserConfig>()(
	persist(
		(set, get) => ({
			theme: 'light',
			toggleTheme: () =>
				set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
		}),
		{
			name: 'userConfig',
			storage: createJSONStorage(() => localStorage),
		},
	),
)
