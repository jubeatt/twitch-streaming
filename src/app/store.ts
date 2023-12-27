import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { apiSlice } from '../features/api/apiSlice'
import favoriteReducer from '../features/favorite/favoriteSlice'
import { LocalStorageService } from './localStorage'

export const store = configureStore({
  reducer: {
    favorite: favoriteReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(apiSlice.middleware)
  },
  preloadedState: {
    favorite: LocalStorageService.loadState()
  }
})

store.subscribe(() => {
  LocalStorageService.saveState(store.getState().favorite)
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
