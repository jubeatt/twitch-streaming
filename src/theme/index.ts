import { ToastProviderProps, extendTheme, withDefaultColorScheme } from '@chakra-ui/react'

export const toastOptions: ToastProviderProps = {
  defaultOptions: {
    colorScheme: 'green',
    isClosable: true,
    variant: 'subtle',
    position: 'bottom-left',
    duration: 3000
  }
}

const theme = extendTheme(
  {},
  withDefaultColorScheme({
    colorScheme: 'teal',
    components: ['Button']
  })
)

export default theme
