import { PropsWithChildren } from 'react'

export const COMPONENT_NAME = 'ComboBoxItem'

/**
 * ComboBoxItem component
 *
 * @param {PropsWithChildren} props - Props of the component
 *
 * @returns {React.ReactElement} A React element
 *
 * @example
 * <ComboBoxItem>
 *   Content
 * </ComboBoxItem>
 */
export const ComboBoxItem = ({ children }: PropsWithChildren) => {
  return <>{children}</>
}

ComboBoxItem.displayName = COMPONENT_NAME
