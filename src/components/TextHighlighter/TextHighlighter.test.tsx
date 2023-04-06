import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TextHighlighter, COMPONENT_NAME } from '.'

describe('ComboBoxItemHighlight', () => {
  it('should render the correct string with no highlight', () => {
    const substring = ''
    const { getByText } = render(
      <TextHighlighter text="test" substring={substring} />,
    )
    expect(getByText('test')).toBeInTheDocument()
  })

  it('should render the correct string with a highlight', () => {
    const substring = 'es'
    const { getByText } = render(
      <TextHighlighter text="test" substring={substring} />,
    )
    expect(getByText((text) => text.includes('t'))).toBeInTheDocument()
    expect(getByText((text) => text.includes('es'))).toHaveClass('highlight')
    expect(getByText((text) => text.includes('t'))).toBeInTheDocument()
  })

  it('should have the correct display name', () => {
    expect(TextHighlighter.displayName).toBe(COMPONENT_NAME)
  })
})
