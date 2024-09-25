import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React from 'react'

interface Props {
  error: FetchBaseQueryError | SerializedError | Error
}

export const ErrorMessage: React.FC<Props> = ({ error }) => {
  const errorName = 'status' in error ? (error.data as any).error : error.name
  const errorMessage = 'status' in error ? (error.data as any).message : error.message

  return (
    <Alert
      status='error'
      borderRadius='base'
    >
      <AlertIcon />
      <AlertTitle>{errorName}</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )
}
