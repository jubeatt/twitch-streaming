import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { Alert, AlertIcon, Box, SimpleGrid, HStack, IconButton } from '@chakra-ui/react'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { LoadingMask } from '../../../components/LoadingMask'
import { PageDirection } from '../../../types'
import { UserList } from './UsetList'
import { FC } from 'react'

interface Props {
  isSearchLoading: boolean
  isUserLoading: boolean
  isError: boolean
  isEmptyResult: boolean
  isFirstPage: boolean
  error: FetchBaseQueryError | SerializedError | undefined
  channels: Channels | undefined
  hasNextPage: boolean
  onPageButton: (direction: PageDirection) => void
}

export const Content: FC<Props> = ({
  isSearchLoading,
  isUserLoading,
  isError,
  isEmptyResult,
  isFirstPage,
  error,
  channels,
  hasNextPage,
  onPageButton
}) => {
  if (isError) {
    return <ErrorMessage error={error || new Error('Unexpected Error.')} />
  }

  if (isEmptyResult) {
    return (
      <Alert
        status='info'
        borderRadius='md'
      >
        <AlertIcon />
        No Matched Result.
      </Alert>
    )
  }

  if (channels) {
    return (
      <Box position='relative'>
        <LoadingMask isFetching={isSearchLoading} />
        <SimpleGrid
          py={4}
          columns={6}
          rowGap={16}
          columnGap={8}
        >
          <UserList
            isLoading={isUserLoading}
            channels={channels}
          />
        </SimpleGrid>
        <HStack
          spacing={5}
          mt={5}
          justifyContent='center'
        >
          {!isFirstPage && (
            <IconButton
              variant='outline'
              aria-label='to previous page button'
              icon={<ArrowBackIcon />}
              isLoading={isSearchLoading}
              isDisabled={isSearchLoading}
              onClick={() => onPageButton(PageDirection.Previous)}
            />
          )}
          {hasNextPage && (
            <IconButton
              variant='outline'
              aria-label='to next page button'
              icon={<ArrowForwardIcon />}
              isLoading={isSearchLoading}
              isDisabled={isSearchLoading}
              onClick={() => onPageButton(PageDirection.Next)}
            />
          )}
        </HStack>
      </Box>
    )
  }

  return null
}
