import { Popover, PopoverTrigger, Avatar, PopoverContent, PopoverBody, VStack, Text, Box } from '@chakra-ui/react'
import { FC } from 'react'
import { selectUserById } from '../features/api/apiSlice'
import { useAppSelector } from '../app/hooks'

type Size = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

interface Props {
  userId: string
  avatarSize?: Size
  popoverAvatarSize?: Size
  isShowStatus?: boolean
  isLive?: boolean
}

export const UserAvatar: FC<Props> = ({
  userId,
  avatarSize = 'md',
  popoverAvatarSize = 'xl',
  isShowStatus = false,
  isLive = false
}) => {
  const user = useAppSelector((state) => selectUserById(state, userId))

  let statusDot = (
    <Box
      position='absolute'
      right={0}
      bottom={0}
      w={4}
      h={4}
      bgColor={isLive ? 'green.400' : 'red.400'}
      borderColor={isLive ? 'green.100' : 'red.100'}
      borderWidth={1.5}
      borderRadius='full'
    />
  )

  return (
    <Popover
      trigger='hover'
      placement='auto'
    >
      <PopoverTrigger>
        <Box position='relative'>
          <Avatar
            size={avatarSize}
            src={user?.profile_image_url}
            cursor='pointer'
          />
          {isShowStatus && statusDot}
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <VStack spacing={4}>
            <Avatar
              size={popoverAvatarSize}
              src={user?.profile_image_url}
            />
            <Text fontWeight={600}>{user?.display_name || 'unknown'}</Text>
            <Text wordBreak='break-word'>{user?.description || 'No description.'}</Text>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
