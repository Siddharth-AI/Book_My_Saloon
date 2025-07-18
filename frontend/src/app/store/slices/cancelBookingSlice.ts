// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// // You will need to import your RootState type from your store configuration
// import { RootState } from '../store'; // <-- IMPORTANT: Adjust this path to your store file
// import { getAuthToken } from './authSlice';

// // The URL for your cancel booking API endpoint.
// const CANCEL_BOOKING_URL = 'http://localhost:3005/api/dingg-partner/cancel-booking';

// /**
//  * Interface for the data required to cancel a booking.
//  */
// interface CancelBookingPayload {
//   vendor_location_uuid: string;
//   id: string;
// }

// /**
//  * Interface for the expected success response from the API.
//  */
// interface CancelBookingResponse {
//   message: string;
//   code: number;
// }

// /**
//  * Interface for the state managed by this slice.
//  */
// interface CancelBookingState {
//   loading: boolean;
//   success: boolean;
//   error: string | null;
//   message: string | null;
// }

// // Defines the initial state for the cancelBooking slice.
// const initialState: CancelBookingState = {
//   loading: false,
//   success: false,
//   error: null,
//   message: null,
// };

// /**
//  * An async thunk to perform the API call for cancelling a booking.
//  * It now uses the `thunkAPI` to get the Redux state and include the auth token.
//  */
// export const cancelBooking = createAsyncThunk<
//   CancelBookingResponse,
//   CancelBookingPayload,
//   { rejectValue: string; state: RootState } // Define state type for getState
// >('bookings/cancel', async (payload, { getState, rejectWithValue }) => {
//   try {
//     // --- ADDED AUTH LOGIC ---
//     // Get the auth token from your Redux state.
//     // IMPORTANT: Adjust `state.auth.token` to match the actual location of your token in the Redux store.
//     const token = getState().auth.tempToken || getAuthToken();
//     console.log(token, "cancle============================")

//     if (!token) {
//       return rejectWithValue('Authentication token not found. Please log in again.');
//     }

//     // Set up the headers for the API request.
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     // --- END OF AUTH LOGIC ---

//     // The API call now includes the config object with the auth header.
//     const { data } = await axios.post(CANCEL_BOOKING_URL, payload, config);
//     console.log(data, 'cancle booking api response')
//     if (data.status) {
//       return data.data as CancelBookingResponse;
//     } else {
//       console.log('this else work')
//       return rejectWithValue(data.message || 'Failed to cancel booking due to an unknown API error.');
//     }
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       // Handle specific auth errors if the API sends a 401/403 status
//       if (error.response.status === 401) {
//         console.log('this is 401')
//         return rejectWithValue('Your session has expired. Please log in again.');
//       }
//       console.log('this unkown server error')

//       return rejectWithValue(error.response.data.message || 'An unknown server error occurred.');
//     }
//     // if (error instanceof Error) {
//     //   return rejectWithValue(error.message || 'An unknown error occurred.');
//     // }
//     console.log('catch error occu')
//     return rejectWithValue('An unknown error occurred.');
//   }
// });

// /**
//  * The Redux slice for managing the state of booking cancellation.
//  */
// const cancelBookingSlice = createSlice({
//   name: 'cancelBooking',
//   initialState,
//   reducers: {
//     resetCancelBookingState: (state) => {
//       state.loading = false;
//       state.success = false;
//       state.error = null;
//       state.message = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(cancelBooking.pending, (state) => {
//         state.loading = true;
//         state.success = false;
//         state.error = null;
//         state.message = null;
//       })
//       .addCase(cancelBooking.fulfilled, (state, action: PayloadAction<CancelBookingResponse>) => {
//         state.loading = false;
//         state.success = true;
//         state.message = action.payload.message;
//       })
//       .addCase(cancelBooking.rejected, (state, action: PayloadAction<string | undefined>) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to cancel booking.';
//       });
//   },
// });

// export const { resetCancelBookingState } = cancelBookingSlice.actions;
// export default cancelBookingSlice.reducer;

// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
// import axios from "axios"
// import type { RootState } from "../store"
// import { getAuthToken } from "./authSlice"

// const CANCEL_BOOKING_URL = "http://localhost:3005/api/dingg-partner/cancel-booking"

// interface CancelBookingPayload {
//   vendor_location_uuid: string
//   id: string
// }

// interface CancelBookingResponse {
//   message: string
//   code: number
//   cancelledAppointmentId: string // Add this field to the response type
// }

// interface CancelBookingState {
//   loading: boolean
//   success: boolean
//   error: string | null
//   message: string | null
//   cancelledAppointmentId: string | null
// }

// // Updated initial state
// const initialState: CancelBookingState = {
//   loading: false,
//   success: false,
//   error: null,
//   message: null,
//   cancelledAppointmentId: null, // Added this field
// }

// export const cancelBooking = createAsyncThunk<
//   CancelBookingResponse,
//   CancelBookingPayload,
//   { rejectValue: string; state: RootState }
// >("bookings/cancel", async (payload, { getState, rejectWithValue }) => {
//   try {
//     const token = getState().auth.tempToken || getAuthToken()
//     console.log(token, "cancle============================")

//     if (!token) {
//       return rejectWithValue("Authentication token not found. Please log in again.")
//     }

//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }

//     const { data } = await axios.post(CANCEL_BOOKING_URL, payload, config)
//     console.log(data, "cancle booking api response")

//     if (data.status) {
//       // Return the response with the appointment ID that was cancelled
//       return {
//         ...data.data,
//         cancelledAppointmentId: payload.id,
//       } as CancelBookingResponse
//     } else {
//       console.log("this else work")
//       return rejectWithValue(data.message || "Failed to cancel booking due to an unknown API error.")
//     }
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error) && error.response) {
//       if (error.response.status === 401) {
//         console.log("this is 401")
//         return rejectWithValue("Your session has expired. Please log in again.")
//       }
//       console.log("this unkown server error")
//       return rejectWithValue(error.response.data.message || "An unknown server error occurred.")
//     }
//     console.log("catch error occu")
//     return rejectWithValue("An unknown error occurred.")
//   }
// })

// const cancelBookingSlice = createSlice({
//   name: "cancelBooking",
//   initialState,
//   reducers: {
//     resetCancelBookingState: (state) => {
//       state.loading = false
//       state.success = false
//       state.error = null
//       state.message = null
//       state.cancelledAppointmentId = null // Reset this as well
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(cancelBooking.pending, (state, action) => {
//         state.loading = true
//         state.success = false
//         state.error = null
//         state.message = null
//         // Store which appointment is being cancelled
//         state.cancelledAppointmentId = action.meta.arg.id
//       })
//       .addCase(cancelBooking.fulfilled, (state, action: PayloadAction<CancelBookingResponse>) => {
//         state.loading = false
//         state.success = true
//         state.message = action.payload.message
//         state.cancelledAppointmentId = action.payload.cancelledAppointmentId
//       })
//       .addCase(cancelBooking.rejected, (state, action: PayloadAction<string | undefined>) => {
//         state.loading = false
//         state.error = action.payload || "Failed to cancel booking."
//         // Keep the cancelledAppointmentId for error handling
//       })
//   },
// })

// export const { resetCancelBookingState } = cancelBookingSlice.actions
// export default cancelBookingSlice.reducer


import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { RootState } from "../store"
import { getAuthToken } from "./authSlice"

const CANCEL_BOOKING_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/cancel-booking`

interface CancelBookingPayload {
  vendor_location_uuid: string
  id: string
}

interface CancelBookingResponse {
  message: string
  code: number
}

interface CancelBookingState {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  cancelledAppointmentId: string | null
}

const initialState: CancelBookingState = {
  loading: false,
  success: false,
  error: null,
  message: null,
  cancelledAppointmentId: null,
}

// Helper function to extract error message from API response
const extractErrorMessage = (messageData: unknown): string => {
  if (typeof messageData === "string") {
    return messageData
  }

  if (typeof messageData === "object" && messageData !== null) {
    // Handle different possible object structures
    if ("message" in messageData && typeof (messageData as { message?: unknown }).message === "string") {
      return (messageData as { message: string }).message
    }
    if ("error" in messageData && typeof (messageData as { error?: unknown }).error === "string") {
      return (messageData as { error: string }).error
    }
    if ("details" in messageData && typeof (messageData as { details?: unknown }).details === "string") {
      return (messageData as { details: string }).details
    }
    // If it's an object but no recognizable error field, stringify it
    return JSON.stringify(messageData)
  }

  return "Failed to cancel booking due to an unknown error."
}

export const cancelBooking = createAsyncThunk<
  CancelBookingResponse & { cancelledAppointmentId: string },
  CancelBookingPayload,
  { rejectValue: string; state: RootState }
>("bookings/cancel", async (payload, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.tempToken || getAuthToken()
    console.log(token, "cancle============================")

    if (!token) {
      return rejectWithValue("Authentication token not found. Please log in again.")
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const { data } = await axios.post(CANCEL_BOOKING_URL, payload, config)
    console.log(data, "cancle booking api response")

    if (data.status) {
      // Success case
      return {
        ...data.data,
        cancelledAppointmentId: payload.id,
      } as CancelBookingResponse & { cancelledAppointmentId: string }
    } else {
      // Error case - extract proper error message
      console.log("this else work")
      const errorMessage = extractErrorMessage(data.message)
      console.log("Extracted error message:", errorMessage)
      return rejectWithValue(errorMessage)
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        console.log("this is 401")
        return rejectWithValue("Your session has expired. Please log in again.")
      }
      console.log("this unknown server error")

      // Handle error response data
      const errorMessage = extractErrorMessage(error.response.data?.message || error.response.data)
      return rejectWithValue(errorMessage || "An unknown server error occurred.")
    }
    console.log("catch error occurred")
    return rejectWithValue("An unknown error occurred.")
  }
})

const cancelBookingSlice = createSlice({
  name: "cancelBooking",
  initialState,
  reducers: {
    resetCancelBookingState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
      state.message = null
      state.cancelledAppointmentId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cancelBooking.pending, (state, action) => {
        state.loading = true
        state.success = false
        state.error = null
        state.message = null
        state.cancelledAppointmentId = action.meta.arg.id
      })
      .addCase(
        cancelBooking.fulfilled,
        (state, action: PayloadAction<CancelBookingResponse & { cancelledAppointmentId: string }>) => {
          state.loading = false
          state.success = true
          state.message = action.payload.message
          // Keep the cancelledAppointmentId
        },
      )
      .addCase(cancelBooking.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || "Failed to cancel booking."
        // Keep the cancelledAppointmentId for error handling
      })
  },
})

export const { resetCancelBookingState } = cancelBookingSlice.actions
export default cancelBookingSlice.reducer
