import { GridItem } from '@chakra-ui/react'
import { UserCard } from '../../../components/UserCard'
import { UserSkeleton } from '../../../components/UserSkeleton'
import { FC } from 'react'

interface Props {
  isLoading: boolean
  channels: Channels
}

export const UserList: FC<Props> = ({ isLoading, channels }) => {
  return (
    <>
      {channels.data.map((channel) => (
        <GridItem
          key={channel.id}
          colSpan={{ base: 3, sm: 2, lg: 1 }}
        >
          {isLoading ? (
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
      ))}
    </>
  )
}
