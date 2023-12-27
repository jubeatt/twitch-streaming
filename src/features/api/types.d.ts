// common
type ListResponse<T> = {
  data: T[]
  pagination: Pagination
}

type Pagination = {
  cursor?: string
}

// api types
type Streams = ListResponse<Stream>
type Games = ListResponse<Game>
type Channels = ListResponse<Channel>
type Users = {
  data: User[]
}

type Stream = {
  id: string
  user_id: string
  user_login: string
  user_name: string
  game_id: string
  game_name: string
  type: 'live' | ''
  title: string
  viewer_count: number
  started_at: string
  language: string
  thumbnail_url: string
  tag_ids: string[]
  tags: string[] | null
  is_mature: boolean
}

type User = {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  created_at: string
}
type Game = {
  id: string
  name: string
  box_art_url: string
  igdb_id: string
}

type Channel = {
  broadcaster_language: string
  broadcaster_login: string
  display_name: string
  game_id: string
  game_name: string
  id: string
  is_live: boolean
  tag_ids: string[]
  tags: string[]
  thumbnail_url: string
  title: string
  started_at: string
}
