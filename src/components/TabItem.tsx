import { Tab, useColorModeValue } from '@chakra-ui/react'
import React, { FC } from 'react'

interface Props {
  gameName: string
}

export const TabItem: FC<Props> = ({ gameName }) => {
  const textColor = useColorModeValue('gray.800', 'white')

  return (
    <Tab
      flexShrink={0}
      textColor={textColor}
    >
      {gameName}
    </Tab>
  )
}
