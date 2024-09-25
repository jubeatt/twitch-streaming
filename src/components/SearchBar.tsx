import { SearchIcon } from '@chakra-ui/icons'
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react'
import { FC, useState } from 'react'

interface Props {
  onInputChange: (value: string) => void
}

export const SearchBar: FC<Props> = ({ onInputChange }) => {
  const [value, setValue] = useState('')

  return (
    <InputGroup mb={8}>
      <InputLeftElement pointerEvents='none'>
        <SearchIcon color='gray.300' />
      </InputLeftElement>
      <Input
        id='search-input'
        focusBorderColor='teal.500'
        borderRadius='md'
        type='text'
        placeholder='game name'
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          onInputChange(event.target.value)
        }}
      />
    </InputGroup>
  )
}
