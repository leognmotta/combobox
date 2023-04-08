import { expect, describe, it } from 'vitest'
import { isDocumentElement, scrollTo } from './scrollUtils'

describe('isDocumentElement', () => {
  it('should return true if the given element is document.documentElement', () => {
    const result = isDocumentElement(document.documentElement)
    expect(result).toBe(true)
  })

  it('should return true if the given element is document.body', () => {
    const result = isDocumentElement(document.body)
    expect(result).toBe(true)
  })

  it('should return true if the given element is window', () => {
    const result = isDocumentElement(window)
    expect(result).toBe(true)
  })
})

describe('scrollTo', () => {
  it('should scroll to the top of the window if the given element is a document element', () => {
    const top = 10
    scrollTo(document.documentElement, top)
    expect(window.scrollY).toBe(top)
  })

  it('should set the scrollTop property of the element to the given top value if the given element is not a document element', () => {
    const el = document.createElement('div')
    const top = 10
    scrollTo(el, top)
    expect(el.scrollTop).toBe(top)
  })
})
