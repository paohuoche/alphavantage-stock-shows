import StoreProvider from "@/store/StoreProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

import { ConfigProvider } from "antd"

import type { AppProps } from "next/app"

import "@/styles/globals.css"

const App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
