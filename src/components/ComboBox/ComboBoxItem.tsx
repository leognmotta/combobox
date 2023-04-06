import { PropsWithChildren, useContext } from 'react'
import { ComboBomContext } from '../../context/ComboBoxContext'

export const COMPONENT_NAME = 'ComboBoxItem'

interface ComboBoxItemProps {
  value: string
}

export const ComboBoxItem = ({
  children,
  value,
}: PropsWithChildren<ComboBoxItemProps>) => {
  const { handleSelected, selectedKey } = useContext(ComboBomContext)

  return (
    <div
      key={value}
      role="option"
      data-testid={`list-item-${value}`}
      className="list-item"
      onClick={() => handleSelected(value)}
      aria-selected={selectedKey === value}
    >
      {children}
    </div>
  )
}

ComboBoxItem.displayName = COMPONENT_NAME
