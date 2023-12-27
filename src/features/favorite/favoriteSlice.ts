import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export type Favorite = {
  username: string
  userId: string
}

const favoriteAdapter = createEntityAdapter<Favorite>({
  selectId: (user) => user.userId
})

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: favoriteAdapter.getInitialState(),
  reducers: {
    favoriteAdded(state, action: PayloadAction<Favorite>) {
      favoriteAdapter.addOne(state, action.payload)
    },
    favoriteRemoved(state, action: PayloadAction<Omit<Favorite, 'username'>>) {
      favoriteAdapter.removeOne(state, action.payload.userId)
    }
  }
})

export const { favoriteAdded, favoriteRemoved } = favoriteSlice.actions

export default favoriteSlice.reducer

// selector
export const { selectIds: selectFavoriteIds, selectAll: selectAllFavorites } = favoriteAdapter.getSelectors(
  (state: RootState) => state.favorite
)
