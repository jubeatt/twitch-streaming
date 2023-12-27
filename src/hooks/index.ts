import { useEffect } from 'react'
import { favoriteAdded, favoriteRemoved } from '../features/favorite/favoriteSlice'
import { useToast } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'

export const useAutoScrollToTop = <T>(dependency: T) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [dependency])
}

export const useFavoriteAction = (showToastOnFinished: boolean = false) => {
  const toast = useToast()
  const toastMessage = {
    ADDED: 'Add successfully.',
    REMOVED: 'Removed successfully.'
  }
  const dispatch = useDispatch()

  function addToFavorite({ userId, username }: { userId: string; username: string }): void {
    dispatch(favoriteAdded({ userId, username }))
    if (showToastOnFinished && !toast.isActive(toastMessage.ADDED)) {
      toast({
        id: toastMessage.ADDED,
        title: toastMessage.ADDED
      })
    }
  }

  function removeFromFavorite(userId: string): void {
    dispatch(favoriteRemoved({ userId }))
    if (showToastOnFinished && !toast.isActive(toastMessage.REMOVED)) {
      toast({
        id: toastMessage.REMOVED,
        title: toastMessage.REMOVED
      })
    }
  }

  return { addToFavorite, removeFromFavorite }
}
