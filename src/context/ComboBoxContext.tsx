import { createContext, PropsWithChildren } from 'react'

interface ComboBomContextProps {
  selectedKey: string
  handleSelected: (clickedSelectedKey?: string) => void
}

const initialSate = {
  selectedKey: '',
  handleSelected: () => {},
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
