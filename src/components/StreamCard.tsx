import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Text,
  Image,
  VStack,
  Flex,
  HStack,
  Divider,
  Badge,
  Box,
  Link
} from '@chakra-ui/react'
import { nanoid } from '@reduxjs/toolkit'
import { UserAvatar } from './UserAvatar'
import { FavoriteButton } from './FavoriteButton'
import { selectFavoriteIds } from '../features/favorite/favoriteSlice'
import { useAppSelector } from '../app/hooks'
import { useFavoriteAction } from '../hooks'

interface Props {
  stream: Stream
}

export const StreamCard: React.FC<Props> = ({ stream }) => {
  const { addToFavorite, removeFromFavorite } = useFavoriteAction()
  const favoriteIds = useAppSelector(selectFavoriteIds)

  const link = 'https://www.twitch.tv/' + encodeURIComponent(stream.user_login)
  const thumbnailUrl = stream.thumbnail_url.replace('{width}x{height}', '500x300')
  const renderedTags =
    stream.tags &&
    stream.tags.map((tag) => (
      <Badge
        key={nanoid()}
        colorScheme='green'
        variant='outline'
      >
        {tag}
      </Badge>
    ))

  const isFavoriteUser = favoriteIds.includes(stream.user_id)

  const handleFavoriteButton = () =>
    isFavoriteUser
      ? removeFromFavorite(stream.user_id)
      : addToFavorite({ userId: stream.user_id, username: stream.user_name })

  return (
    <Card h='full'>
      <CardHeader
        p={0}
        position='relative'
      >
        <Box
          width='full'
          height={0}
          paddingTop={'50%'}
          position='relative'
        >
          <Image
            boxSize='100%'
            position='absolute'
            top={0}
            left={0}
            objectPosition='center'
            objectFit='cover'
            src={thumbnailUrl}
            alt='thumbnail'
            borderTopLeftRadius='base'
            borderTopRightRadius='base'
          />
        </Box>
        <Text
          fontSize='lg'
          fontWeight={600}
          color='white'
          bgColor='teal.500'
          py={2}
          textAlign='center'
        >
          {stream.game_name || 'unknown'}
        </Text>
        <Box
          position='absolute'
          right={1}
          top={1}
          p={1}
          bgColor='blackAlpha.700'
          fontSize='xs'
          borderRadius='base'
        >
          <HStack
            alignItems='center'
            spacing={1}
          >
            <Box
              w={2}
              h={2}
              borderRadius='full'
              bgColor='teal.500'
            ></Box>
            <Text color='white'>{stream.viewer_count}</Text>
          </HStack>
        </Box>
      </CardHeader>

      <CardBody p={2}>
        <VStack
          alignItems='flex-start'
          spacing={3}
        >
          <Flex
            alignItems='center'
            justifyContent='space-between'
            w='full'
          >
            <HStack spacing={2}>
              <UserAvatar userId={stream.user_id} />
              <Text>{stream.user_name}</Text>
            </HStack>
            <FavoriteButton
              isActive={isFavoriteUser}
              onClick={handleFavoriteButton}
            />
          </Flex>
          <Divider />
          <Text wordBreak='break-word' noOfLines={2}>{stream.title || 'No title.'}</Text>
          <HStack wrap='wrap'>{renderedTags}</HStack>
        </VStack>
      </CardBody>

      <CardFooter px={2}>
        <Button p={0}>
          <Link
            _hover={{ textDecoration: 'none' }}
            p={4}
            href={link}
            target='_blank'
          >
            Watch here
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
