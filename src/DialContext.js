import { createContext, useContext } from 'react'

const DialContext = createContext(null)

function useStackDial(version) {
  const value = useContext(DialContext)

  if (!value) {
    throw new Error('useStackDial must be used inside DialProvider')
  }

  return value[version]
}

export { DialContext, useStackDial }
