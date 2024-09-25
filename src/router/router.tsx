import { createBrowserRouter } from 'react-router-dom'
import Root from '../Root'
import { TopGames } from '../pages/top-games/TopGames'
import { Favorite } from '../pages/favorite/Favorite'
import { AllStreams } from '../pages/all-streams/AllStreams'
import { SearchChannel } from '../pages/search-channel'
import { SearchStream } from '../pages/search-stream'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <AllStreams />
        },
        {
          path: '/top-games',
          element: <TopGames />
        },
        {
          path: '/favorite',
          element: <Favorite />
        },
        {
          path: '/search-channel',
          element: <SearchChannel />
        },
        {
          path: '/search-stream',
          element: <SearchStream />
        }
      ]
    }
  ],
  { basename: '/twitch-streaming' }
)
