import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react'
import { FC } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'

const menuItems = [
  { label: 'All Streams', path: '/' },
  { label: 'Top 10 Games', path: '/top-games' },
  { label: 'Favorite', path: '/favorite' },
  { label: 'Search Channel', path: '/search-channel' },
  { label: 'Search Stream', path: '/search-stream' }
]

type MenuProps = {
  menus: typeof menuItems
}

export const Header = () => {
  const headerBgColor = useColorModeValue('white', 'gray.800')

  const menu = useBreakpointValue({
    base: <MenuForMobile menus={menuItems} />,
    md: <MenuForDesktop menus={menuItems} />
  })

  return (
    <Box
      as='header'
      position='sticky'
      bgColor={headerBgColor}
      boxShadow='base'
      top={0}
      left={0}
      zIndex={999}
    >
      <Container
        maxW='container.xl'
        p={5}
      >
        <Flex
          justifyContent='space-between'
          alignItems='center'
        >
          <Box>
            <Heading
              as='h1'
              fontSize='2xl'
            >
              <Box
                as='span'
                bgColor='teal.500'
                display='inline-block'
                color='white'
                borderRadius='base'
                px={2}
                py={1}
                mr={1}
              >
                T
              </Box>
              witch
            </Heading>
          </Box>
          {menu}
        </Flex>
      </Container>
    </Box>
  )
}

const MenuForDesktop: FC<MenuProps> = ({ menus }) => {
  const { toggleColorMode } = useColorMode()
  const modeIcon = useColorModeValue(<MoonIcon />, <SunIcon />)

  return (
    <Flex alignItems='center'>
      {menus.map((menu) => (
        <Link
          key={menu.label}
          p={2}
          as={ReactRouterLink}
          fontWeight={600}
          to={menu.path}
        >
          {menu.label}
        </Link>
      ))}
      <IconButton
        aria-label='Dark mode switcher'
        variant='ghost'
        p={2}
        icon={modeIcon}
        onClick={toggleColorMode}
      />
    </Flex>
  )
}

const MenuForMobile: FC<MenuProps> = ({ menus }) => {
  const { toggleColorMode } = useColorMode()
  const modeIcon = useColorModeValue(<MoonIcon />, <SunIcon />)
  const modeText = useColorModeValue('Dark Mode', 'Light Mode')

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        variant='outline'
      />
      <MenuList>
        {menus.map((menu) => (
          <MenuItem key={menu.label}>
            <Link
              as={ReactRouterLink}
              _hover={{
                textDecoration: 'none'
              }}
              to={menu.path}
              w='full'
              fontWeight={600}
            >
              {menu.label}
            </Link>
          </MenuItem>
        ))}
        <MenuItem
          icon={modeIcon}
          onClick={toggleColorMode}
          fontWeight={600}
        >
          {modeText}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default Header
