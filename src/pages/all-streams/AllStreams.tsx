import { Flex, CircularProgress } from '@chakra-ui/react'
import { FC, useMemo, useRef, useState } from 'react'
import { StreamList } from '../../components/StreamList'
import { ErrorMessage } from '../../components/ErrorMessage'
import { useGetStreamsQuery, useGetUsersQuery } from '../../features/api/apiSlice'
import { SectionWrapper } from '../../components/SectionWrapper'
import { PageDirection } from '../../types'
import { useAutoScrollToTop, useEmailNotify } from '../../hooks'

export const AllStreams: FC = () => {
  const [pagination, setPagination] = useState({ cursor: '', direction: PageDirection.Next, currentPage: 0 })
  const { data, isError, isSuccess, isFetching, isLoading, error } = useGetStreamsQuery(pagination)
  const lastTimeCursor = useRef('')

  const streams = useMemo(() => {
    if (data) {
      return Object.values(data.data.entities) as Stream[]
    }
    return []
  }, [data])

  const userIds = streams.map((stream) => stream.user_id)
  const hasNextPage = Boolean(data?.pagination?.cursor)

  useGetUsersQuery(userIds, { skip: !isSuccess || userIds.length < 1 })
  useAutoScrollToTop(streams)
  useEmailNotify(error)

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
        currentPage: pagination.currentPage - 1,
        direction: PageDirection.Previous
      })
    }
  }

  let content

  if (isError && error) {
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
  } else {
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

  return (
    <SectionWrapper
      title='All Streams'
      description='Current all live streams ordered by viewers'
    >
      {content}
    </SectionWrapper>
  )
}
