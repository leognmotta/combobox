import { useState, useEffect } from 'react'

/**
 * useDebounce is a hook that returns a debounced version of the value passed in.
 * That is another way we can avoid reaching out to the github API with too many requests
 * while still delivering good user experience
 *
 * @param value The value to be debounced
 * @param delay The amount of time to wait before setting the debounced value
 * @returns The debounced value
 *
 * @example
 * const [name, setName] = useState('');
 * const debouncedName = useDebounce(name, 500);
 */

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}
