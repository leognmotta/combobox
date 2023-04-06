import React, { useContext } from 'react'
import { ComboBomContext } from '../../context/ComboBoxContext'

export const COMPONENT_NAME = 'ComboBoxItemHighlight'

/**
 * Finds the start, match, and end of a substring in a string.
 *
 * @param str The string to search for the substring.
 * @param substr The substring to find in the string.
 * @returns An array containing the start, match, and end of the substring. If the substring is not found, returns the original string with empty strings for the match and end.
 *
 * @example
 * const [start, match, end] = getMatchedSubstring('Hello World', 'World')
 * // start = 'Hello '
 * // match = 'World'
 * // end = ''
 */
const getMatchedSubstring = (str: string, substr: string) => {
  // Find the index of the substring in the string
  const index = str.indexOf(substr)
  if (index !== -1) {
    // Get the start of the string up to the index of the substring
    const start = str.substring(0, index)
    // Get the matched substring
    const match = str.substring(index, index + substr.length)
    // Get the end of the string after the substring
    const end = str.substring(index + substr.length)
    // Return the start, match, and end in an array
    return [start, match, end]
  } else {
    // If the substring is not found, return the original string
    // with empty strings for the match and end
    return [str, '', '']
  }
}

interface ComboBoxItemHighlightProps {
  text: string
}

export const ComboBoxItemHighlight = ({ text }: ComboBoxItemHighlightProps) => {
  const { searchTerm } = useContext(ComboBomContext)
  const [start, highlighted, end] = getMatchedSubstring(
    text.toLowerCase(),
    searchTerm.toLowerCase(),
  )

  return (
    <>
      {start}
      <span className="highlight">{highlighted}</span>
      {end}
    </>
  )
}

ComboBoxItemHighlight.displayName = COMPONENT_NAME
