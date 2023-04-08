import { createContext, PropsWithChildren, RefObject } from 'react'

interface ComboBomContextProps {
  selectedKey: string
  handleSelected: (clickedSelectedKey?: string) => void
  listItemRefs: {
    [key: string]: RefObject<HTMLDivElement>
  }
}

const initialSate = {
  selectedKey: '',
  handleSelected: () => {},
  listItemRefs: {},
}

export const ComboBomContext = createContext<ComboBomContextProps>(initialSate)

export const ComboBomContextProvider = ({
  children,
  ...value
}: PropsWithChildren<ComboBomContextProps>) => {
  return (
    <ComboBomContext.Provider value={value}>
      {children}
    </ComboBomContext.Provider>
  )
}
