import { useCallback, useEffect } from 'react'
import { favoriteAdded, favoriteRemoved } from '../features/favorite/favoriteSlice'
import { useToast } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { sendEmail } from '../features/email/emailSlice'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useAppDispatch, useAppSelector } from '../app/hooks'

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

export const useEmailNotify = (error: FetchBaseQueryError | SerializedError | undefined) => {
  const { isNotified } = useAppSelector((state) => state.email)
  const dispatch = useAppDispatch()
  const toast = useToast()

  const emailHandler = useCallback(
    async (error: FetchBaseQueryError | SerializedError) => {
      try {
        await dispatch(sendEmail(error)).unwrap()
        toast({
          title: 'We have send an email notification to the developer, please try again later.',
          colorScheme: 'red',
          duration: null
        })
      } catch (error) {
        console.error(error)
      }
    },
    [dispatch, toast]
  )

  useEffect(() => {
    if (error && !isNotified) {
      emailHandler(error)
    }
  }, [error, emailHandler, isNotified])
}
