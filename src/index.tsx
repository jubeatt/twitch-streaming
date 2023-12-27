import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { ChakraProvider } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import theme, { toastOptions } from './theme'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider
        theme={theme}
        toastOptions={toastOptions}
      >
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
)
