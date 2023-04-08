// This function checks if the given element is either document.documentElement, document.body or window
export function isDocumentElement(
  el: HTMLElement | typeof window,
): el is typeof window {
  // Returns true if the given element is present in the array
  return [document.documentElement, document.body, window].indexOf(el) > -1
}

// This function scrolls to a given element or window
export function scrollTo(el: HTMLElement | typeof window, top: number): void {
  // If the element is a document element, scroll to the top of the window
  if (isDocumentElement(el)) {
    window.scrollTo(0, top)
    return
  }

  // Otherwise, set the scrollTop property of the element to the given top value
  el.scrollTop = top
}

// scrollIntoView function scrolls the menuEl element to make sure that focusedEl is visible
export function scrollIntoView(
  menuEl: HTMLElement,
  focusedEl: HTMLElement,
): void {
  // get the bounding client rectangles of both elements
  const menuRect = menuEl.getBoundingClientRect()
  const focusedRect = focusedEl.getBoundingClientRect()
  // calculate the overscroll amount we divide by 3 to make sure we don't scroll too far away
  const overScroll = focusedEl.offsetHeight / 3

  // if the bottom of the focused element is below the bottom of the menu element, scroll the menu element to make the focused element visible
  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(
      menuEl,
      Math.min(
        focusedEl.offsetTop +
          focusedEl.clientHeight -
          menuEl.offsetHeight +
          overScroll,
        menuEl.scrollHeight,
      ),
    )
  }
  // if the top of the focused element is above the top of the menu element, scroll the menu element to make the focused element visible
  else if (focusedRect.top - overScroll < menuRect.top) {
    // scroll the menu element to the offsetTop of the focused element minus the overscroll amount
    scrollTo(menuEl, Math.max(focusedEl.offsetTop - overScroll, 0))
  }
}
