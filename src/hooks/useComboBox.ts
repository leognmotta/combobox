import React, { useCallback, useEffect, useMemo, useState } from 'react'

interface UseComboBoxProps {
  listRef: React.RefObject<HTMLDivElement>
  onChange?: (value: string) => void
  onSelect?: (value: string) => void
  options: string[] | null | undefined
  value: string
  label?: string
}

export function useComboBox({
  listRef,
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
  const canIncreaseIndex = activeItemIndex + 1 < childrenCount
  const id = label?.split(' ').join('-').toLocaleLowerCase()
  const hasValue = Boolean(value?.trim())
  const canDecreaseIndex = activeItemIndex > 0

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
        if (canIncreaseIndex) {
          setActiveItemIndex((state) => state + 1)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (canDecreaseIndex) {
          setActiveItemIndex((state) => state - 1)
        }
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

  // This useEffect hook is used to scroll the listRef element when the activeItemIndex changes.
  useEffect(() => {
    // Check if listRef and activeItemIndex are valid
    if (listRef.current && activeItemIndex !== -1) {
      // Get the active item as an HTMLElement
      const activeItem = listRef.current.children[
        activeItemIndex
      ] as HTMLElement
      // Get the boundingClientRect of the listRef element
      const listRect = listRef.current?.getBoundingClientRect()
      // Get the boundingClientRect of the activeItem element
      const itemRect = activeItem?.getBoundingClientRect()

      // If the bottom of the activeItem is greater than the bottom of the listRef, scroll by the height of the activeItem
      if (itemRect.bottom > listRect.bottom) {
        listRef.current.scrollBy(0, itemRect.height)
      }
      // Else if the top of the activeItem is less than the top of the listRef, scroll by the negative height of the activeItem
      else if (itemRect.top < listRect.top) {
        listRef.current.scrollBy(0, -itemRect.height)
      }
    }
  }, [activeItemIndex, listRef])

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
