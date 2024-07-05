import { enableStaticRendering } from "mobx-react-lite"
import React, { useContext } from "react"

import RootStore from "."

enableStaticRendering(typeof window === "undefined")

let clientStore: RootStore

const initStore = () => {
  // check if we already declare store (client Store), otherwise create one
  const store = clientStore ?? new RootStore()
  // hydrate to store if receive initial data
  // if (initData) store.hydrate(initData)

  // Create a store on every server request
  if (typeof window === "undefined") return store
  // Otherwise it's client, remember this store and return
  if (!clientStore) clientStore = store
  return store
}

// Hoook for using store
function useInitStore() {
  return initStore()
}

export const StoreContext = React.createContext<RootStore>(new RootStore())
const StoreProvider = (props: { children: React.ReactNode }) => {
  // const rootStore = new RootStore()

  const rootStore = useInitStore()

  return (
    <StoreContext.Provider value={rootStore}>
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const rootStore = useContext(StoreContext)

  return rootStore
}

export default StoreProvider
