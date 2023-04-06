import React, {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { ComboBomContextProvider } from '../../context/ComboBoxContext'

interface ComboBoxProps {
  onChange?: (value: string) => void
  onSelect?: (value: string) => void
  value: string
  label?: string
}

const COMPONENT_NAME = 'ComboBox'

export const ComboBox = forwardRef<
  HTMLInputElement,
  PropsWithChildren<ComboBoxProps>
>((props, ref) => {
  const { children, onChange, onSelect, value, label } = props
  const listRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [activeItemIndex, setActiveItemIndex] = useState(-1)
  const options = useMemo(() => {
    return React.Children.map(
      children,
      (child) => (child as React.ReactElement).props.value as string,
    )
  }, [children])
  const focusedOption = useMemo(
    () => (options ? options[activeItemIndex] : null),
    [activeItemIndex, options],
  )
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
  }, [activeItemIndex])

  return (
    <ComboBomContextProvider
      handleSelected={handleSelected}
      selectedKey={focusedOption || ''}
    >
      <div
        data-testid="combobox-container"
        className="combobox-container"
        onKeyDown={(event) => handleItemKeyDown(event)}
      >
        <div
          className={`input-container ${
            isFocused || hasValue ? 'animate-label' : ''
          }`}
        >
          {label && <label htmlFor={id}>{label}</label>}

          <input
            data-testid="combobox-input"
            id={id}
            ref={ref}
            type="text"
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            value={value}
            autoComplete="off"
            required
          />
        </div>

        {isOpen && (
          <div
            data-testid="list-container"
            className="list-container"
            ref={listRef}
          >
            {childrenCount === 0 && (
              <div className="list-item">Ooops! there is no options</div>
            )}
            {children}
          </div>
        )}
      </div>
    </ComboBomContextProvider>
  )
})

ComboBox.displayName = COMPONENT_NAME
