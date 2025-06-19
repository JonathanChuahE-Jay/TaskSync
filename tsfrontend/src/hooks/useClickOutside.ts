import { useEffect, useRef } from 'react'

export const useClickOutside = <T extends HTMLElement>(
  onOutsideClick: () => void
) => {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onOutsideClick])

  return ref
}
