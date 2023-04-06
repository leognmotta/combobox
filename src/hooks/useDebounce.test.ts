import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react-hooks'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('should return the initial value', () => {
    const { result } = renderHook(() => useDebounce('test', 500))
    expect(result.current).toBe('test')
  })

  it('should debounce the value', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: {
          value: 'test',
          delay: 500,
        },
      },
    )

    expect(result.current).toBe('test')

    rerender({ value: 'updated value', delay: 500 })

    expect(result.current).toBe('test')

    vi.advanceTimersByTime(500)

    expect(result.current).toBe('updated value')

    vi.useRealTimers()
  })
})
