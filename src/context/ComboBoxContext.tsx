import { createContext, PropsWithChildren } from 'react'

interface ComboBomContextProps {
  searchTerm?: string
}

const initialSate = {
  searchTerm: '',
}

export const ComboBomContext = createContext(initialSate)

export const ComboBomContextProvider = ({
  children,
  searchTerm = '',
}: PropsWithChildren<ComboBomContextProps>) => {
  return (
    <ComboBomContext.Provider value={{ searchTerm }}>
      {children}
    </ComboBomContext.Provider>
  )
}
