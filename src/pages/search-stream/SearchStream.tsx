import { SectionWrapper } from '../../components/SectionWrapper'
import { useMemo, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useGetStreamsQuery, useGetUsersQuery, useLazySearchGameByNameQuery } from '../../features/api/apiSlice'
import { PageDirection } from '../../types'
import { useAutoScrollToTop } from '../../hooks'
import { SearchBar } from '../../components/SearchBar'
import { Content } from './components/Content'

export const SearchStream = () => {
  const lastTimeCursor = useRef('')

  const [pagination, setPagination] = useState({
    cursor: '',
    direction: PageDirection.Next,
    currentPage: 0
  })

  const [
    searchGameByName,
    {
      data: games,
      isSuccess: isSearchSuccess,
      isFetching: isSearchFetching,
      isError: isSearchError,
      error: searchError
    }
  ] = useLazySearchGameByNameQuery()

  const gameId = games && games.data.length > 0 ? games.data[0].id : ''

  const {
    data: streamsData,
    isSuccess: isGetStreamSuccess,
    isFetching: isGetStreamFetching,
    isLoading: isGetSteamLoading,
    isError: isGetStreamError,
    error: getStreamError
  } = useGetStreamsQuery(
    {
      ...pagination,
      gameId
    },
    { skip: !isSearchSuccess || !gameId }
  )

  const streams = useMemo(() => {
    if (streamsData) {
      return Object.values(streamsData.data.entities) as Stream[]
    }
    return []
  }, [streamsData])

  const userIds = streams.map((stream) => stream.user_id)

  const hasNextPage = Boolean(streamsData?.pagination?.cursor)

  useGetUsersQuery(userIds, { skip: !isGetStreamSuccess || userIds.length < 1 })
  useAutoScrollToTop(streams)

  function handlePageButton(direction: PageDirection): void {
    if (isGetSteamLoading || isGetStreamFetching || !isGetStreamSuccess) {
      return
    }

    if (streamsData.pagination.cursor) {
      lastTimeCursor.current = streamsData.pagination.cursor
      setPagination({
        cursor: streamsData.pagination.cursor ?? '',
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

  const handleInputChange = useDebouncedCallback((value: string) => {
    value = value.trim()
    if (value) {
      lastTimeCursor.current = ''
      setPagination({
        cursor: '',
        currentPage: 0,
        direction: PageDirection.Next
      })
      searchGameByName(value)
    }
  }, 600)

  return (
    <SectionWrapper
      title='Search Stream'
      description='search streams by game name.'
    >
      <SearchBar onInputChange={handleInputChange} />
      <Content
        isLoading={isSearchFetching || isGetSteamLoading || isGetStreamFetching}
        isError={isSearchError || isGetStreamError}
        isEmptyResult={(games && games.data.length < 1) || (isGetStreamSuccess && streams.length < 1)}
        error={searchError || getStreamError}
        streams={streams}
        pagination={pagination}
        hasNextPage={hasNextPage}
        handlePageButton={handlePageButton}
      />
    </SectionWrapper>
  )
}
