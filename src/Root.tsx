import { Box, Link } from '@chakra-ui/react'
import React from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'

function Root() {
  return (
    <React.Fragment>
      <Header />
      <Box
        as='main'
        // (header = 80) & (footer = 37)
        minH={'calc(100vh - 80px - 37px)'}
      >
        <Outlet />
      </Box>
      <Box
        as='footer'
        textAlign='center'
        p={2}
        fontSize='sm'
      >
        © 2023 <Link href='https://github.com/jubeatt/twitch-streaming'>PeaNu.</Link> All Rights Reserved.
      </Box>
    </React.Fragment>
  )
}

export default Root
