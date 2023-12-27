import { Container, VStack, Heading, Box, Text } from '@chakra-ui/react'
import { FC } from 'react'

interface Props {
  title: string
  description: string
  children: React.ReactNode
}

export const SectionWrapper: FC<Props> = ({ children, title, description }) => {
  return (
    <Box
      as='section'
      py={10}
    >
      <Container
        maxW='container.xl'
        px={5}
      >
        <Box mb={10}>
          <VStack spacing={2}>
            <Heading size='lg'>{title}</Heading>
            <Text>{description}</Text>
          </VStack>
        </Box>
        {children}
      </Container>
    </Box>
  )
}
