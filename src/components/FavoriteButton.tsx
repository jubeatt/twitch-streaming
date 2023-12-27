import { FC } from 'react'
import { HeartIcon } from '../icons/HeartIcon'
import { IconButton, Tooltip } from '@chakra-ui/react'

interface Props {
  isActive: boolean
  onClick: () => void
}

export const FavoriteButton: FC<Props> = ({ isActive, onClick }) => {
  const color = isActive ? 'pink.200' : 'transparent'
  const message = isActive ? 'remove from favorites' : 'add to favorites'

  return (
    <Tooltip
      label={message}
      placement='top'
      borderRadius='base'
    >
      <IconButton
        aria-label='favorite-button'
        variant='ghost'
        colorScheme='pink'
        onClick={onClick}
        icon={
          <HeartIcon
            boxSize={7}
            color={color}
            stroke='pink.200'
            cursor='pointer'
          />
        }
      />
    </Tooltip>
  )
}
