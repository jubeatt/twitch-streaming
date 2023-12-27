import { Alert, AlertIcon, Box, CircularProgress, Flex, GridItem, SimpleGrid } from '@chakra-ui/react'
import { SectionWrapper } from '../../components/SectionWrapper'
import { useAppSelector } from '../../app/hooks'
import { selectAllFavorites } from '../../features/favorite/favoriteSlice'
import { FavoriteUser } from './FavoriteUser'
import { useGetUsersQuery } from '../../features/api/apiSlice'
import { ErrorMessage } from '../../components/ErrorMessage'
import { useRef } from 'react'

export const Favorite = () => {
  const updateTimeRef = useRef<HTMLDivElement>(null)
  const favorites = useAppSelector(selectAllFavorites)
  const initialFavoritesCount = useRef(favorites.length)
  const { isLoading, isError, error, isSuccess } = useGetUsersQuery(
    favorites.map((favorite) => favorite.userId),
    { skip: initialFavoritesCount.current > favorites.length || favorites.length === 0 }
  )

  let content

  if (isLoading) {
    content = (
      <Flex justifyContent='center'>
        <CircularProgress
          isIndeterminate
          color='teal.300'
        />
      </Flex>
    )
  } else if (isError) {
    content = <ErrorMessage error={error} />
  } else if (favorites.length === 0) {
    content = (
      <Alert
        status='info'
        borderRadius='md'
      >
        <AlertIcon />
        You don't have any favorite yet.
      </Alert>
    )
  } else if (isSuccess || favorites) {
    content = (
      <>
        <Box
          mb={4}
          ref={updateTimeRef}
        />
        <SimpleGrid
          columns={6}
          rowGap={16}
          columnGap={8}
        >
          {favorites.map((favorite, index) => (
            <GridItem
              key={favorite.userId}
              colSpan={{ base: 3, sm: 2, lg: 1 }}
            >
              <FavoriteUser
                favorite={favorite}
                updateTimeRef={index === 0 ? updateTimeRef : undefined}
              />
            </GridItem>
          ))}
        </SimpleGrid>
      </>
    )
  }

  return (
    <SectionWrapper
      title='Favorite'
      description='All my favorite broadcasters'
    >
      {content}
    </SectionWrapper>
  )
}
