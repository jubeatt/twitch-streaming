import { ExternalLinkIcon } from '@chakra-ui/icons'
import { VStack, HStack, Button, Text, Link, Badge } from '@chakra-ui/react'
import { FC } from 'react'
import { UserAvatar } from './UserAvatar'
import { useFavoriteAction } from '../hooks'
import { useAppSelector } from '../app/hooks'
import { selectFavoriteIds } from '../features/favorite/favoriteSlice'

interface Props {
  userId: string
  username: string
  isLive?: boolean
  login?: string
}

export const UserCard: FC<Props> = ({ userId, username, login = '', isLive = false }) => {
  const { addToFavorite, removeFromFavorite } = useFavoriteAction(true)
  const favoriteIds = useAppSelector(selectFavoriteIds)
  const link = 'https://www.twitch.tv/' + encodeURIComponent(login)
  const isFavoriteUser = favoriteIds.includes(userId)

  const renderedStatus = isLive ? <Badge colorScheme='green'> Live</Badge> : <Badge colorScheme='red'> Off</Badge>

  const buttonText = isFavoriteUser ? 'Remove' : 'Add favorite'
  const buttonColorScheme = isFavoriteUser ? 'red' : 'teal'
  const handleFavoriteButton = () =>
    isFavoriteUser ? removeFromFavorite(userId) : addToFavorite({ userId, username: username })

  return (
    <VStack spacing={1}>
      <VStack spacing={3}>
        <UserAvatar
          userId={userId}
          avatarSize='lg'
          isLive={isLive}
          isShowStatus
        />
        <Link
          href={link}
          target='_blank'
          isExternal
        >
          <HStack>
            <Text
              maxW={100}
              fontWeight={600}
              noOfLines={1}
              title={username}
            >
              {username}
            </Text>
            <ExternalLinkIcon />
          </HStack>
        </Link>
      </VStack>
      <HStack spacing={1}>
        <Text fontSize='sm'>status: </Text>
        {renderedStatus}
      </HStack>
      <Button
        variant='outline'
        size='sm'
        colorScheme={buttonColorScheme}
        onClick={handleFavoriteButton}
      >
        {buttonText}
      </Button>
    </VStack>
  )
}
