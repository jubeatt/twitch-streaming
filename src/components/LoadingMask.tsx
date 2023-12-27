import { Box, useColorModeValue } from '@chakra-ui/react'
import React, { FC } from 'react'

interface Props {
  isFetching: boolean
}

export const LoadingMask: FC<Props> = ({ isFetching }) => {
  const overlayBgColor = useColorModeValue('whiteAlpha.500', 'blackAlpha.500')

  return (
    <Box
      visibility={isFetching ? 'visible' : 'hidden'}
      bgColor={overlayBgColor}
      position='absolute'
      width='full'
      height='full'
      zIndex={99}
    />
  )
}
