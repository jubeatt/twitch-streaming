import { FC, useMemo, useRef } from 'react'
import { Favorite } from '../../features/favorite/favoriteSlice'
import { useGetChannelByUserNameQuery } from '../../features/api/apiSlice'
import { UserSkeleton } from '../../components/UserSkeleton'
import { UserCard } from '../../components/UserCard'
import { Portal, Text, useToast } from '@chakra-ui/react'

interface Props {
  favorite: Favorite
  updateTimeRef?: React.RefObject<HTMLDivElement>
}

export const FavoriteUser: FC<Props> = ({ favorite, updateTimeRef }) => {
  const toast = useToast()
  const toastMessage = 'Failed to get channel information.'
  const errorCount = useRef(0)
  const oneMinute = 60 * 1000

  const {
    data: channel,
    isLoading,
    isFetching,
    isError
  } = useGetChannelByUserNameQuery(favorite.username, {
    skip: errorCount.current > 3,
    pollingInterval: oneMinute,
    selectFromResult(result) {
      const usernameRegex = new RegExp(`^${favorite.username}$`)
      return {
        ...result,
        data: result.data?.data.find((channel) => usernameRegex.test(channel.display_name))
      }
    }
  })

  const updateTime = useMemo(() => {
    if (isFetching) {
      return 'updating...'
    }

    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `update time: ${hours}:${minutes}:${seconds}`
  }, [isFetching])

  if (isError) {
    errorCount.current++
    if (!toast.isActive(toastMessage)) {
      toast({
        id: toastMessage,
        title: toastMessage,
        colorScheme: 'red'
      })
    }

    return (
      <UserCard
        username={favorite.username}
        userId={favorite.userId}
      />
    )
  }

  if (isLoading) {
    return <UserSkeleton />
  }

  if (channel) {
    return (
      <>
        {updateTimeRef && (
          <Portal containerRef={updateTimeRef}>
            <Text
              textAlign='right'
              fontSize='sm'
              fontStyle='italic'
            >
              {updateTime}
            </Text>
          </Portal>
        )}
        <UserCard
          username={favorite.username}
          userId={favorite.userId}
          login={channel.broadcaster_login}
          isLive={channel.is_live}
        />
      </>
    )
  }

  // will only show username if no match result.
  return (
    <UserCard
      username={favorite.username}
      userId={favorite.userId}
    />
  )
}
