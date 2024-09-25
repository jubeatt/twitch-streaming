import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PageDirection } from '../../types'
import { EntityState, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

const usersAdapter = createEntityAdapter<User>()
const initialUsers = usersAdapter.getInitialState()

const streamsAdapter = createEntityAdapter<Stream>()
const initialStreams: { data: EntityState<Stream>; pagination: Pagination } = {
  data: streamsAdapter.getInitialState(),
  pagination: { cursor: '' }
}

const streamsByGameAdapter = createEntityAdapter<Stream>()
const initialStreamsByGame: { data: EntityState<Stream>; pagination: Pagination } = {
  data: streamsByGameAdapter.getInitialState(),
  pagination: { cursor: '' }
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.twitch.tv/helix',
    headers: {
      Authorization: 'Bearer ' + process.env.REACT_APP_APP_ACCESS_TOKEN!,
      'Client-ID': process.env.REACT_APP_CLIENT_ID!
    }
  }),
  endpoints: (builder) => ({
    getStreams: builder.query<
      typeof initialStreams,
      { cursor: string; direction: PageDirection; currentPage: number; gameId?: string }
    >({
      query({ cursor, direction, gameId = '' }) {
        let url = '/streams?first=21'
        if (gameId) {
          url += `&game_id=${gameId}`
        }
        if (cursor) {
          url += `&${direction}=${cursor}`
        }
        return url
      },
      serializeQueryArgs(arg) {
        return arg.endpointName + '_' + arg.queryArgs.currentPage + '_' + arg.queryArgs.gameId
      },
      transformResponse(response: Streams) {
        return {
          data: streamsAdapter.setAll(initialStreams.data, response.data),
          pagination: response.pagination
        }
      }
    }),
    getUsers: builder.query<EntityState<User>, string[]>({
      query(usersId) {
        const params = usersId.map((user) => `id=${user}`)
        return '/users?' + params.join('&')
      },
      serializeQueryArgs(arg) {
        return arg.endpointName
      },
      merge(currentCacheData, response) {
        const users = Object.values(response.entities) as User[]
        const newCacheData = usersAdapter.upsertMany(currentCacheData, users)
        currentCacheData = newCacheData
      },
      transformResponse(response: Users) {
        const users = usersAdapter.upsertMany(initialUsers, response.data)
        return users
      },
      forceRefetch(arg) {
        return arg.currentArg?.join('') !== arg.previousArg?.join('')
      }
    }),
    getGames: builder.query<Games, undefined>({
      query() {
        return '/games/top?first=10'
      },
      keepUnusedDataFor: 0
    }),
    getStreamsByGame: builder.query<
      typeof initialStreamsByGame,
      { gameId: string; cursor: string; direction: PageDirection; currentPage: number }
    >({
      query({ gameId, cursor, direction }) {
        let url = `/streams?first=20&game_id=${gameId}`
        return cursor ? url + `&${direction}=${cursor}` : url
      },
      serializeQueryArgs(arg) {
        return arg.endpointName + '_' + arg.queryArgs.gameId + '_' + arg.queryArgs.currentPage
      },
      transformResponse(response: Streams) {
        return {
          data: streamsByGameAdapter.setAll(initialStreamsByGame.data, response.data),
          pagination: response.pagination
        }
      }
    }),
    getChannelByUserName: builder.query<Channels, string>({
      query(username) {
        return `/search/channels?first=100&query=${encodeURIComponent(username)}`
      }
    }),
    searchChannelByUserName: builder.query<Channels, { username: string; cursor?: string; direction?: PageDirection }>({
      query({ username, cursor, direction }) {
        let url = `/search/channels?query=${encodeURIComponent(username)}&first=30`

        if (cursor && direction) {
          url += `&${direction}=${cursor}`
        }

        return url
      }
    }),
    searchGameByName: builder.query<Omit<Games, 'pagination'>, string>({
      query(gameName) {
        return `/games?name=${encodeURIComponent(gameName)}`
      }
    })
  })
})

export const {
  useGetUsersQuery,
  useGetGamesQuery,
  useGetStreamsByGameQuery,
  useGetStreamsQuery,
  useGetChannelByUserNameQuery,
  useLazySearchChannelByUserNameQuery,
  useLazySearchGameByNameQuery
} = apiSlice

// selectors
const { selectById } = usersAdapter.getSelectors()
const selectUsersCacheEntry = apiSlice.endpoints.getUsers.select([])

export const selectUserById = createSelector(
  [(state: RootState) => selectUsersCacheEntry(state).data, (state: RootState, userId: string) => userId],
  (cacheData, userId) => {
    return cacheData ? selectById(cacheData, userId) : undefined
  }
)
