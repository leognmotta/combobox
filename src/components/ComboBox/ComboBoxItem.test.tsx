import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ComboBoxItem, COMPONENT_NAME } from './ComboBoxItem'

describe('ComboBoxItem', () => {
  it('should render the children', () => {
    const { getByText } = render(
      <ComboBoxItem value="item1">Test</ComboBoxItem>,
    )
    expect(getByText('Test')).toBeInTheDocument()
  })

  it('should have the correct display name', () => {
    expect(ComboBoxItem.displayName).toBe(COMPONENT_NAME)
  })
})
