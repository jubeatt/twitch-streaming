import { SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const initialState = {
  isNotified: false
}

export const sendEmail = createAsyncThunk('email/sendEmail', async (error: FetchBaseQueryError | SerializedError) => {
  const errorName = 'status' in error ? (error.data as any).error : error.name
  const errorMessage = 'status' in error ? (error.data as any).message : error.message
  const data = {
    service_id: process.env.REACT_APP_APP_SERVICE_ID,
    template_id: process.env.REACT_APP_APP_TEMPLATE_ID,
    user_id: process.env.REACT_APP_APP_USER_ID,
    template_params: {
      errorMessage: `${errorName}: ${errorMessage}`
    }
  }
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    return Promise.reject('Failed to send email')
  }
  return Promise.resolve('OK')
})

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendEmail.fulfilled, (state) => {
      state.isNotified = true
    })
  }
})

export default emailSlice.reducer
