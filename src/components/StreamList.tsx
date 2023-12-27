import { SimpleGrid, GridItem, Box, HStack, IconButton } from '@chakra-ui/react'
import { nanoid } from '@reduxjs/toolkit'
import React from 'react'
import { StreamCard } from './StreamCard'
import { PageDirection } from '../types'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { LoadingMask } from './LoadingMask'

interface Props {
  isFetching: boolean
  streams: Stream[]
  currentPage: number
  hasNextPage: boolean
  onPageButtonClick: (direction: PageDirection) => void
}

export const StreamList: React.FC<Props> = ({ isFetching, streams, currentPage, hasNextPage, onPageButtonClick }) => {
  return (
    <>
      <Box position='relative'>
        <LoadingMask isFetching={isFetching} />
        <SimpleGrid
          columns={6}
          gap={5}
        >
          {streams.map((stream) => (
            <GridItem
              key={nanoid()}
              colSpan={{ base: 6, sm: 3, lg: 2 }}
            >
              <StreamCard stream={stream} />
            </GridItem>
          ))}
        </SimpleGrid>
      </Box>
      <HStack
        spacing={5}
        mt={5}
        justifyContent='center'
      >
        {currentPage > 0 && (
          <IconButton
            variant='outline'
            aria-label='to previous page button'
            icon={<ArrowBackIcon />}
            isLoading={isFetching}
            isDisabled={isFetching}
            onClick={() => onPageButtonClick(PageDirection.Previous)}
          />
        )}
        {hasNextPage && (
          <IconButton
            variant='outline'
            aria-label='to next page button'
            icon={<ArrowForwardIcon />}
            isLoading={isFetching}
            isDisabled={isFetching}
            onClick={() => onPageButtonClick(PageDirection.Next)}
          />
        )}
      </HStack>
    </>
  )
}
