import { useCallback, useEffect } from 'react'

export const useClickEnter = (callback: () => void) => {
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				callback()
			}
		},
		[callback],
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])
}
