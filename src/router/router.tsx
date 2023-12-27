import { createBrowserRouter } from 'react-router-dom'
import Root from '../Root'
import { TopGames } from '../pages/top-games/TopGames'
import { Favorite } from '../pages/favorite/Favorite'
import { AllStreams } from '../pages/all-streams/AllStreams'
import { Search } from '../pages/search/Search'

export const router = createBrowserRouter([
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
        path: '/search',
        element: <Search />
      }
    ]
  }
], { basename: '/twitch-streaming' })
