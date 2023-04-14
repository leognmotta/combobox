import React from 'react'
import { act, renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useComboBox } from './useComboBox'

describe('useComboBox', () => {
  const listRef = { current: null }
  const options = ['option1', 'option2', 'option3', 'option4', 'option5']
  const emptyValue = ''
  const filledValue = 'opt'
  const label = 'label for testing'
  const pressArrowUp = (preventDefault: () => void) => {
    return {
      key: 'ArrowUp',
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLDivElement>
  }
  const pressArrowDown = (preventDefault: () => void) => {
    return {
      key: 'ArrowDown',
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLDivElement>
  }
  const pressEnter = (preventDefault: () => void) => {
    return {
      key: 'Enter',
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLDivElement>
  }
  const pressEscape = (preventDefault: () => void) => {
    return {
      key: 'Escape',
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLDivElement>
  }

  it('should return the correct initial values', () => {
    const { result } = renderHook(() =>
      useComboBox({
        listRef,
        options,
        value: emptyValue,
        label,
        listItemRefs: {},
      }),
    )
    expect(result.current).toEqual({
      id: 'label-for-testing',
      isOpen: false,
      isFocused: false,
      hasValue: false,
      childrenCount: 5,
      focusedOption: null,
      handleInputChange: expect.any(Function),
      handleFocus: expect.any(Function),
      handleBlur: expect.any(Function),
      handleItemKeyDown: expect.any(Function),
      handleSelected: expect.any(Function),
    })
  })

  it('should update isFocused to true when handleFocus is called', () => {
    const { result } = renderHook(() =>
      useComboBox({
        listRef,
        options,
        value: emptyValue,
        label,
        listItemRefs: {},
      }),
    )
    act(() => {
      result.current.handleFocus()
    })
    expect(result.current.isFocused).toBe(true)
  })

  it('should update isOpen to false when handleBlur is called', () => {
    const { result } = renderHook(() =>
      useComboBox({
        listRef,
        options,
        value: emptyValue,
        label,
        listItemRefs: {},
      }),
    )
    act(() => {
      result.current.handleBlur()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('should update states using arrow keys navigation', () => {
    const preventDefault = vi.fn()
    const { result } = renderHook(() =>
      useComboBox({
        listRef,
        options,
        value: emptyValue,
        label,
        listItemRefs: {},
      }),
    )

    act(() => result.current.handleItemKeyDown(pressArrowDown(preventDefault)))
    expect(result.current.focusedOption).toBe('option1')
    expect(result.current.isOpen).toBeTruthy()

    act(() => {
      result.current.handleItemKeyDown(pressArrowDown(preventDefault))
      result.current.handleItemKeyDown(pressArrowDown(preventDefault))
      result.current.handleItemKeyDown(pressArrowDown(preventDefault))
    })
    expect(result.current.focusedOption).toBe('option4')

    act(() => {
      result.current.handleItemKeyDown(pressArrowUp(preventDefault))
    })
    expect(result.current.focusedOption).toBe('option3')
    expect(preventDefault).toHaveBeenCalledTimes(5)
  })

  it('should call onChange and onSelect when pressing Enter', () => {
    const preventDefault = vi.fn()
    const onChange = vi.fn()
    const onSelect = vi.fn()
    const { result } = renderHook(() =>
      useComboBox({
        listRef,
        options,
        value: filledValue,
        label,
        onChange,
        onSelect,
        listItemRefs: {},
      }),
    )

    act(() => {
      result.current.handleItemKeyDown(pressArrowDown(preventDefault))
      result.current.handleItemKeyDown(pressArrowDown(preventDefault))
    })

    expect(result.current.focusedOption).toBe('option2')

    act(() => result.current.handleItemKeyDown(pressEnter(preventDefault)))

    expect(onSelect).toHaveBeenCalledWith(result.current.focusedOption)
    expect(onChange).toHaveBeenCalledWith(result.current.focusedOption)
    expect(preventDefault).toHaveBeenCalledTimes(3)
  })

  it('should update isOpen when pressing Escape', () => {
    const preventDefault = vi.fn()
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useComboBox({
        listRef,
        options,
        value: filledValue,
        label,
        onChange,
        listItemRefs: {},
      }),
    )

    act(() => {
      result.current.handleItemKeyDown(pressArrowDown(preventDefault))
      result.current.handleItemKeyDown(pressArrowDown(preventDefault))
    })

    expect(result.current.focusedOption).toBe('option2')

    act(() => result.current.handleItemKeyDown(pressEscape(preventDefault)))

    expect(preventDefault).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith('')
    expect(result.current.isOpen).toBeFalsy()
  })
})
