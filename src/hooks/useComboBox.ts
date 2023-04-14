import React, { RefObject, useCallback, useMemo, useState } from 'react'
import { scrollIntoView } from '../utils/scrollUtils'

interface UseComboBoxProps {
  listRef: React.RefObject<HTMLDivElement>
  onChange?: (value: string) => void
  onSelect?: (value: string) => void
  options: string[] | null | undefined
  value: string
  label?: string
  listItemRefs: {
    [key: string]: RefObject<HTMLDivElement>
  }
}

export function useComboBox({
  listRef,
  listItemRefs,
  onChange,
  onSelect,
  options,
  value,
  label,
}: UseComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [activeItemIndex, setActiveItemIndex] = useState(-1)
  const focusedOption = useMemo(() => {
    if (options && activeItemIndex !== -1) {
      return options[activeItemIndex]
    }
    return null
  }, [activeItemIndex, options])
  const childrenCount = options?.length || 0
  const id = label?.split(' ').join('-').toLocaleLowerCase()
  const hasValue = Boolean(value?.trim())

  const handleSelected = useCallback(
    (clickedSelectedKey?: string) => {
      const value = clickedSelectedKey ?? focusedOption
      if (onChange && value) {
        onChange(value)
      }
      if (onSelect && value) {
        onSelect(value)
      }
      setIsOpen(false)
    },
    [focusedOption, onChange, onSelect],
  )

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    if (!isOpen) {
      setIsOpen(true)
    }
    if (onChange) {
      onChange(value)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleArrowNavigation = (nextActiveIndex: number) => {
    const nextFocusedOption = (options || [])[nextActiveIndex] as string
    if (nextFocusedOption && listRef.current) {
      const itemRef = listItemRefs[nextFocusedOption]

      if (itemRef.current) {
        scrollIntoView(listRef.current, itemRef.current)
      }
    }
  }

  const handleBlur = () => {
    // For time reasons, this is just a hack
    // to prevent the blur event before clicking on the element
    // so we delay the blur action until click action is confirmed
    setTimeout(() => {
      setIsOpen(false)
      setIsFocused(false)
      setActiveItemIndex(-1)
    }, 300)
  }

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        }
        // to properly match the correct calculation we need to have access to the next state, instead of
        // using focusedOption we check for the next state after we update activeIndex
        setActiveItemIndex((state) => {
          const nextState = state + 1 > childrenCount - 1 ? 0 : state + 1
          handleArrowNavigation(nextState)
          return nextState
        })

        break
      case 'ArrowUp':
        event.preventDefault()
        // to properly match the correct calculation we need to have access to the next state, instead of
        // using focusedOption we check for the next state after we update activeIndex
        setActiveItemIndex((state) => {
          const nextState =
            state - 1 < 0 ? (options || []).length - 1 : state - 1
          handleArrowNavigation(nextState)
          return nextState
        })

        break
      case 'Enter':
        event.preventDefault()
        handleSelected()
        break
      case 'Escape':
        setIsOpen(false)
        setActiveItemIndex(-1)
        if (onChange) {
          onChange('')
        }
        break
      default:
        break
    }
  }

  return {
    id,
    isOpen,
    isFocused,
    hasValue,
    childrenCount,
    focusedOption,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleItemKeyDown,
    handleSelected,
  }
}
