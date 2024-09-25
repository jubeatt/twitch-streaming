import { Alert, AlertIcon, CircularProgress, Flex } from '@chakra-ui/react'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { PageDirection } from '../../../types'
import { StreamList } from '../../../components/StreamList'
import { FC } from 'react'

interface Props {
  isLoading: boolean
  isError: boolean
  isEmptyResult: boolean
  error: FetchBaseQueryError | SerializedError | undefined
  streams: Stream[]
  pagination: {
    cursor: string
    direction: PageDirection
    currentPage: number
  }
  hasNextPage: boolean
  handlePageButton: (direction: PageDirection) => void
}

export const Content: FC<Props> = ({
  isLoading,
  isError,
  isEmptyResult,
  error,
  streams,
  pagination,
  hasNextPage,
  handlePageButton
}) => {
  if (isLoading) {
    return (
      <Flex justifyContent='center'>
        <CircularProgress
          isIndeterminate
          color='teal.300'
        />
      </Flex>
    )
  }

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

  return (
    <StreamList
      isFetching={isLoading}
      streams={streams}
      currentPage={pagination.currentPage}
      hasNextPage={hasNextPage}
      onPageButtonClick={handlePageButton}
    />
  )
}
