import { useRef } from 'react'
import { SectionWrapper } from '../../components/SectionWrapper'
import { useDebouncedCallback } from 'use-debounce'
import { useGetUsersQuery, useLazySearchChannelByUserNameQuery } from '../../features/api/apiSlice'
import { PageDirection } from '../../types'
import { useAutoScrollToTop } from '../../hooks'
import { SearchBar } from '../../components/SearchBar'
import { Content } from './components/Content'

export const SearchChannel = () => {
  const lastTimeCursor = useRef('')
  const currentPage = useRef(0)

  const [
    searchChannel,
    { data: channels, isSuccess, isFetching: isSearching, isError: isSearchError, error: searchError }
  ] = useLazySearchChannelByUserNameQuery()

  const userIds = channels?.data.map((channel) => channel.id) ?? []

  const {
    isFetching: isGetUserFetching,
    isError: isGetUserError,
    error: getUserError
  } = useGetUsersQuery(userIds ?? [], { skip: !isSuccess || userIds.length < 1 })

  useAutoScrollToTop(channels)

  const hasNextPage = Boolean(channels?.pagination?.cursor)

  const handleSearch = useDebouncedCallback((value: string) => {
    value = value.trim()
    if (value) {
      currentPage.current = 0
      searchChannel({ username: value })
    }
  }, 600)

  function handlePageButton(direction: PageDirection): void {
    const username = (document.getElementById('search-input') as HTMLInputElement)?.value

    if (isSearching || isGetUserFetching || !channels) {
      return
    }

    if (channels.pagination.cursor) {
      currentPage.current = direction === PageDirection.Next ? currentPage.current + 1 : currentPage.current - 1
      lastTimeCursor.current = channels.pagination.cursor
      searchChannel({
        cursor: channels.pagination.cursor,
        username,
        direction
      })
    } else {
      currentPage.current = currentPage.current - 1
      searchChannel({
        cursor: lastTimeCursor.current,
        direction: PageDirection.Previous,
        username
      })
    }
  }

  return (
    <SectionWrapper
      title='Search Channel'
      description='search channel by username.'
    >
      <SearchBar onInputChange={handleSearch} />
      <Content
        isSearchLoading={isSearching}
        isUserLoading={isGetUserFetching}
        isError={isSearchError || isGetUserError}
        isEmptyResult={Boolean(channels && channels.data.length < 1)}
        isFirstPage={currentPage.current === 0}
        error={searchError || getUserError}
        channels={channels}
        hasNextPage={hasNextPage}
        onPageButton={handlePageButton}
      />
    </SectionWrapper>
  )
}
