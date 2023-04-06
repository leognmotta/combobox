import React, { PropsWithChildren, forwardRef, useRef, useMemo } from 'react'
import { ComboBomContextProvider } from '../../context/ComboBoxContext'
import { useComboBox } from '../../hooks/useComboBox'

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
  const options = useMemo(() => {
    return React.Children.map(
      children,
      (child) => (child as React.ReactElement).props.value as string,
    )
  }, [children])
  const {
    id,
    isOpen,
    hasValue,
    isFocused,
    focusedOption,
    childrenCount,
    handleBlur,
    handleFocus,
    handleInputChange,
    handleItemKeyDown,
    handleSelected,
  } = useComboBox({ listRef, options, onChange, onSelect, value, label })

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
