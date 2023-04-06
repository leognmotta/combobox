import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ComboBoxItemHighlight, COMPONENT_NAME } from './ComboBoxItemHighlight'
import { ComboBomContext } from '../../context/ComboBoxContext'

describe('ComboBoxItemHighlight', () => {
  it('should render the correct string with no highlight', () => {
    const searchTerm = ''
    const { getByText } = render(
      <ComboBomContext.Provider value={{ searchTerm }}>
        <ComboBoxItemHighlight text="test" />
      </ComboBomContext.Provider>,
    )
    expect(getByText('test')).toBeInTheDocument()
  })

  it('should render the correct string with a highlight', () => {
    const searchTerm = 'es'
    const { getByText } = render(
      <ComboBomContext.Provider value={{ searchTerm }}>
        <ComboBoxItemHighlight text="test" />
      </ComboBomContext.Provider>,
    )
    expect(getByText((text) => text.includes('t'))).toBeInTheDocument()
    expect(getByText((text) => text.includes('es'))).toHaveClass('highlight')
    expect(getByText((text) => text.includes('t'))).toBeInTheDocument()
  })

  it('should have the correct display name', () => {
    expect(ComboBoxItemHighlight.displayName).toBe(COMPONENT_NAME)
  })
})
