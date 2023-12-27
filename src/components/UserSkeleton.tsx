import { Stack, Flex, SkeletonCircle, Skeleton } from '@chakra-ui/react'

export const UserSkeleton = () => {
  return (
    <Stack>
      <Flex justifyContent='center'>
        <SkeletonCircle size='10' />
      </Flex>
      <Skeleton height='20px' />
      <Skeleton height='20px' />
      <Skeleton height='20px' />
    </Stack>
  )
}
