import { TabList, TabPanel, TabPanels, Tabs, Flex, Divider, Progress } from '@chakra-ui/react'
import { useState } from 'react'
import { useGetGamesQuery } from '../../features/api/apiSlice'
import { ErrorMessage } from '../../components/ErrorMessage'
import { TabContent } from './TabContent'
import { SectionWrapper } from '../../components/SectionWrapper'
import { TabItem } from '../../components/TabItem'

export const TopGames = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const { data: games, isLoading, isError, isSuccess, error } = useGetGamesQuery(undefined)

  function handleTabChange(index: number): void {
    setTabIndex(index)
  }

  let content

  if (isLoading) {
    content = (
      <Progress
        colorScheme='teal'
        size='xs'
        borderRadius='base'
        isIndeterminate
      />
    )
  } else if (isError) {
    content = <ErrorMessage error={error} />
  } else if (isSuccess) {
    content = (
      <Tabs
        variant='soft-rounded'
        colorScheme='green'
        index={tabIndex}
        onChange={handleTabChange}
      >
        <Flex overflow='auto'>
          <TabList
            w='container.xl'
            justifyContent='flex-start'
          >
            {games.data.map((game) => (
              <TabItem
                key={game.id}
                gameName={game.name}
              />
            ))}
          </TabList>
        </Flex>
        <Divider my={4} />
        <TabPanels>
          {games.data.map((game, index) => (
            <TabPanel key={game.id}>{tabIndex === index && <TabContent gameId={game.id} />}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    )
  }

  return (
    <SectionWrapper
      title='Top 10 Games'
      description='Current streams of top 10 hot games ordered by viewers'
    >
      {content}
    </SectionWrapper>
  )
}
