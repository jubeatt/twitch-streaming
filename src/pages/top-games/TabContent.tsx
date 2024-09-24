import React, { useMemo, useRef, useState } from 'react'
import { useGetStreamsByGameQuery, useGetUsersQuery } from '../../features/api/apiSlice'
import { CircularProgress, Flex } from '@chakra-ui/react'
import { ErrorMessage } from '../../components/ErrorMessage'
import { StreamList } from '../../components/StreamList'
import { PageDirection } from '../../types'
import { useAutoScrollToTop } from '../../hooks'

interface Props {
  gameId: string
}

export const TabContent: React.FC<Props> = ({ gameId }) => {
  const [pagination, setPagination] = useState({
    cursor: '',
    direction: PageDirection.Next,
    currentPage: 0
  })
  const { data, isLoading, isFetching, isError, isSuccess, error } = useGetStreamsByGameQuery({
    gameId,
    ...pagination
  })
  const lastTimeCursor = useRef('')

  const streams = useMemo(() => {
    if (data) {
      return Object.values(data.data.entities) as Stream[]
    }
    return []
  }, [data])

  const userIds = streams.map((stream) => stream.user_id)
  const hasNextPage = Boolean(data?.pagination?.cursor)

  useAutoScrollToTop(streams)
  useGetUsersQuery(userIds, { skip: !isSuccess || userIds.length < 1 })

  function handlePageButton(direction: PageDirection): void {
    if (isLoading || isFetching || !isSuccess) {
      return
    }

    if (data.pagination.cursor) {
      lastTimeCursor.current = data.pagination.cursor
      setPagination({
        cursor: data.pagination.cursor,
        currentPage: direction === PageDirection.Next ? pagination.currentPage + 1 : pagination.currentPage - 1,
        direction
      })
    } else {
      setPagination({
        cursor: lastTimeCursor.current,
        currentPage: direction === PageDirection.Next ? pagination.currentPage + 1 : pagination.currentPage - 1,
        direction
      })
    }
  }

  let content: null | JSX.Element = null

  if (isError) {
    content = <ErrorMessage error={error} />
  } else if (isLoading) {
    content = (
      <Flex justifyContent='center'>
        <CircularProgress
          isIndeterminate
          color='teal.300'
        />
      </Flex>
    )
  } else if (isSuccess) {
    content = (
      <StreamList
        isFetching={isFetching}
        streams={streams}
        currentPage={pagination.currentPage}
        hasNextPage={hasNextPage}
        onPageButtonClick={handlePageButton}
      />
    )
  }

  return content
}
