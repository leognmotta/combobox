import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import { ComboBox } from './ComboBox'
import { ComboBoxItem } from './ComboBoxItem'

const arrowDown = { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 }
const arrowUp = { key: 'ArrowUp', code: 'ArrowUp', charCode: 38 }
const enter = { key: 'Enter', code: 'Enter', charCode: 13 }
const escape = { key: 'Escape', code: 'Escape', charCode: 27 }

describe('ComboBox', () => {
  it('should render the component', () => {
    const { getByTestId } = render(<ComboBox value="test" />)
    expect(getByTestId('combobox-container')).toBeInTheDocument()
  })

  it('should open the list when input is focused and we start typing', () => {
    const { getByTestId } = render(<ComboBox value="test" />)
    const input = getByTestId('combobox-input')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'changed' } })
    expect(getByTestId('list-container')).toBeInTheDocument()
  })

  it('should close the list when input is blurred', async () => {
    const { queryByTestId, getByTestId } = render(<ComboBox value="test" />)
    const input = getByTestId('combobox-input')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 't' } })
    fireEvent.blur(input)
    // since we made some hack in the code on blur event, we need to sleep
    // some time before we close the list-container
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 301))
    })
    expect(queryByTestId('list-container')).toBeNull()
  })

  it('should call onChange when input is changed', () => {
    const mockOnChange = vi.fn()
    const { getByTestId } = render(
      <ComboBox value="test" onChange={mockOnChange} />,
    )
    const input = getByTestId('combobox-input')
    fireEvent.change(input, { target: { value: 'changed' } })
    expect(mockOnChange).toHaveBeenCalledWith('changed')
  })

  it('should call onSelect when an item is selected', () => {
    const mockOnSelect = vi.fn()
    const { getByTestId } = render(
      <ComboBox value="test" onSelect={mockOnSelect}>
        <ComboBoxItem key="item1" value="item1">
          Item 1
        </ComboBoxItem>
        <ComboBoxItem key="item2" value="item2">
          Item 2
        </ComboBoxItem>
      </ComboBox>,
    )
    const input = getByTestId('combobox-input')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'i' } })
    const item1 = getByTestId('list-item-item1')
    fireEvent.click(item1)
    expect(mockOnSelect).toHaveBeenCalledWith('item1')
  })

  it('should open the combo box when pressing arrow down', () => {
    const { getByTestId } = render(<ComboBox value="test" />)
    const domNode = getByTestId('combobox-container')
    const input = getByTestId('combobox-input')

    fireEvent.focus(input)
    fireEvent.keyDown(domNode, arrowDown)

    expect(getByTestId('list-container')).toBeInTheDocument()
  })

  it('should close the combobox on pressing escape', () => {
    const { queryByTestId, getByTestId } = render(<ComboBox value="test" />)
    const domNode = getByTestId('combobox-container')
    const input = getByTestId('combobox-input')

    fireEvent.focus(input)
    fireEvent.keyDown(domNode, escape)

    expect(queryByTestId('list-container')).toBeNull()
  })

  it('should call on select by pressing enter', () => {
    const mockOnSelect = vi.fn()
    const { getByTestId } = render(
      <ComboBox value="test" onSelect={mockOnSelect}>
        <ComboBoxItem key="item1" value="item1">
          Item 1
        </ComboBoxItem>
        <ComboBoxItem key="item2" value="item2">
          Item 2
        </ComboBoxItem>
      </ComboBox>,
    )
    const domNode = getByTestId('combobox-container')
    const input = getByTestId('combobox-input')

    fireEvent.focus(input)
    fireEvent.keyDown(domNode, arrowDown)
    fireEvent.keyDown(domNode, arrowDown)
    fireEvent.keyDown(domNode, enter)

    expect(mockOnSelect).toHaveBeenCalledWith('item2')
  })

  it('should navigate with arrows correctly', () => {
    const mockOnSelect = vi.fn()
    const items = [
      'item1',
      'item2',
      'item3',
      'item4',
      'item5',
      'item6',
      'item7',
      'item8',
    ]
    const { getByTestId, getByRole } = render(
      <ComboBox value="" onSelect={mockOnSelect}>
        {items.map((item) => (
          <ComboBoxItem key={item} value={item}>
            {item}
          </ComboBoxItem>
        ))}
      </ComboBox>,
    )
    const domNode = getByTestId('combobox-container')
    const input = getByTestId('combobox-input')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'i' } })
    fireEvent.keyDown(domNode, arrowDown)

    expect(getByRole('option', { selected: true })).toContainHTML('item1')

    fireEvent.keyDown(domNode, arrowUp)
    expect(getByRole('option', { selected: true })).toContainHTML('item8')

    fireEvent.keyDown(domNode, arrowDown)
    expect(getByRole('option', { selected: true })).toContainHTML('item1')

    fireEvent.keyDown(domNode, arrowDown)
    fireEvent.keyDown(domNode, arrowDown)
    expect(getByRole('option', { selected: true })).toContainHTML('item3')
  })
})
