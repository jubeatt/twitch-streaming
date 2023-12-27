import { ChangeEvent, useRef, useState } from 'react'
import { SectionWrapper } from '../../components/SectionWrapper'
import {
  Alert,
  AlertIcon,
  Box,
  GridItem,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid
} from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon, SearchIcon } from '@chakra-ui/icons'
import { useDebouncedCallback } from 'use-debounce'
import { useGetUsersQuery, useLazySearchChannelByUserNameQuery } from '../../features/api/apiSlice'
import { ErrorMessage } from '../../components/ErrorMessage'
import { UserSkeleton } from '../../components/UserSkeleton'
import { UserCard } from '../../components/UserCard'
import { PageDirection } from '../../types'
import { useAutoScrollToTop } from '../../hooks'
import { LoadingMask } from '../../components/LoadingMask'

export const Search = () => {
  const lastTimeCursor = useRef('')
  const currentPage = useRef(0)
  const [value, setValue] = useState('')
  const debounced = useDebouncedCallback((value: string) => {
    value = value.trim()
    if (value) {
      currentPage.current = 0
      searchChannel({ username: value })
    }
  }, 600)

  const [
    searchChannel,
    { data: channels, isSuccess, isFetching: isSearching, isError: isSearchError, error: searchError }
  ] = useLazySearchChannelByUserNameQuery()

  const userIds = channels?.data.map((channel) => channel.id) ?? []

  const {
    isError: isGetUserError,
    error: getUserError,
    isFetching: isFetchingUser
  } = useGetUsersQuery(userIds ?? [], { skip: !isSuccess || userIds.length < 1 })

  useAutoScrollToTop(channels)

  const isFirstPage = currentPage.current === 0
  const hasNextPage = Boolean(channels?.pagination?.cursor)

  function handleInputValue(event: ChangeEvent<HTMLInputElement>): void {
    debounced(event.target.value)
    setValue(event.target.value)
  }

  function handlePageButton(direction: PageDirection): void {
    if (isSearching || isFetchingUser || !channels) {
      return
    }

    if (channels.pagination.cursor) {
      currentPage.current = direction === PageDirection.Next ? currentPage.current + 1 : currentPage.current - 1
      lastTimeCursor.current = channels.pagination.cursor
      searchChannel({
        username: value,
        cursor: channels.pagination.cursor,
        direction
      })
    } else {
      currentPage.current = currentPage.current - 1
      searchChannel({
        username: value,
        cursor: lastTimeCursor.current,
        direction: PageDirection.Previous
      })
    }
  }

  let content

  if (isSearchError && searchError) {
    content = <ErrorMessage error={searchError} />
  } else if (isGetUserError && getUserError) {
    content = <ErrorMessage error={getUserError} />
  } else if (channels && channels.data.length < 1) {
    content = (
      <Alert
        status='info'
        borderRadius='md'
      >
        <AlertIcon />
        No Matched Result.
      </Alert>
    )
  } else if (channels) {
    const renderedUsers = channels.data.map((channel) => (
      <GridItem
        key={channel.id}
        colSpan={{ base: 3, sm: 2, lg: 1 }}
      >
        {isFetchingUser ? (
          <UserSkeleton />
        ) : (
          <UserCard
            isLive={channel.is_live}
            userId={channel.id}
            username={channel.display_name}
            login={channel.broadcaster_login}
          />
        )}
      </GridItem>
    ))

    content = (
      <Box position='relative'>
        <LoadingMask isFetching={isSearching} />
        <SimpleGrid
          py={4}
          columns={6}
          rowGap={16}
          columnGap={8}
        >
          {renderedUsers}
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
              isLoading={isSearching}
              isDisabled={isSearching}
              onClick={() => handlePageButton(PageDirection.Previous)}
            />
          )}
          {hasNextPage && (
            <IconButton
              variant='outline'
              aria-label='to next page button'
              icon={<ArrowForwardIcon />}
              isLoading={isSearching}
              isDisabled={isSearching}
              onClick={() => handlePageButton(PageDirection.Next)}
            />
          )}
        </HStack>
      </Box>
    )
  }

  return (
    <SectionWrapper
      title='Search'
      description='search broadcasters by username.'
    >
      <InputGroup mb={8}>
        <InputLeftElement pointerEvents='none'>
          <SearchIcon color='gray.300' />
        </InputLeftElement>
        <Input
          focusBorderColor='teal.500'
          borderRadius='md'
          type='text'
          placeholder='username'
          value={value}
          onChange={handleInputValue}
        />
      </InputGroup>
      {content}
    </SectionWrapper>
  )
}
