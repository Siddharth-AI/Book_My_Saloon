/* eslint-disable @typescript-eslint/no-explicit-any */
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import axios from "axios"

// // Types for the API response
// interface TimeSlot {
//   date: string
//   start_time: number
//   end_time: number
//   available: boolean
// }

// interface DaySlots {
//   date: string
//   slots: TimeSlot[]
//   isHoliday: boolean
// }

// interface TimeSlotsResponse {
//   slots: DaySlots[]
//   max_available_date: string
//   start_date: string
//   end_date: string
// }

// // Processed slot for UI
// interface ProcessedSlot {
//   date: string
//   start_time: number
//   end_time: number
//   start_time_formatted: string
//   end_time_formatted: string
//   available: boolean
//   period: "morning" | "afternoon" | "evening"
// }

// interface TimeSlotsState {
//   slots: ProcessedSlot[]
//   loading: boolean
//   error: string | null
//   maxAvailableDate: string | null
// }

// const initialState: TimeSlotsState = {
//   slots: [],
//   loading: false,
//   error: null,
//   maxAvailableDate: null,
// }

// // Utility function to convert numeric time to 12-hour format
// function convertMinutesToTime(minutes: number): string {
//   const hours = Math.floor(minutes / 60)
//   const mins = minutes % 60
//   const period = hours >= 12 ? "PM" : "AM"
//   const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
//   return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`
// }

// // Utility function to determine time period
// function getTimePeriod(minutes: number): "morning" | "afternoon" | "evening" {
//   const hours = Math.floor(minutes / 60)
//   if (hours < 12) return "morning"
//   if (hours < 17) return "afternoon"
//   return "evening"
// }

// // Async thunk to fetch time slots
// export const fetchTimeSlots = createAsyncThunk<
//   TimeSlotsResponse,
//   {
//     locationUuid: string
//     startDate: string
//     endDate: string
//     serviceIds: number[]
//   },
//   { rejectValue: string }
// >("timeSlots/fetchTimeSlots", async ({ locationUuid, startDate, endDate, serviceIds }, { rejectWithValue }) => {
//   try {
//     console.log("🔄 Fetching time slots for:", { locationUuid, startDate, endDate, serviceIds })

//     const response = await axios.post(`http://localhost:3005/api/dingg-partner/get-slots/${locationUuid}`, {
//       startDate,
//       endDate,
//       serviceIds,
//     })

//     if (!response.data.status) {
//       throw new Error(response.data.message || "Failed to fetch time slots")
//     }

//     console.log("✅ Time slots API response:", response.data)
//     return response.data.data.data
//   } catch (error: any) {
//     console.error("❌ Error fetching time slots:", error)
//     return rejectWithValue(error.message || "Failed to fetch time slots")
//   }
// })

// const timeSlotsSlice = createSlice({
//   name: "timeSlots",
//   initialState,
//   reducers: {
//     clearTimeSlots: (state) => {
//       state.slots = []
//       state.error = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTimeSlots.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchTimeSlots.fulfilled, (state, action) => {
//         state.loading = false
//         state.maxAvailableDate = action.payload.max_available_date

//         // Process and flatten all slots
//         const processedSlots: ProcessedSlot[] = []

//         action.payload.slots.forEach((daySlot) => {
//           daySlot.slots.forEach((slot) => {
//             processedSlots.push({
//               date: slot.date,
//               start_time: slot.start_time,
//               end_time: slot.end_time,
//               start_time_formatted: convertMinutesToTime(slot.start_time),
//               end_time_formatted: convertMinutesToTime(slot.end_time),
//               available: slot.available,
//               period: getTimePeriod(slot.start_time),
//             })
//           })
//         })

//         state.slots = processedSlots
//         console.log("✅ Processed slots:", processedSlots)
//       })
//       .addCase(fetchTimeSlots.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//         state.slots = []
//       })
//   },
// })

// export const { clearTimeSlots } = timeSlotsSlice.actions
// export default timeSlotsSlice.reducer


import { convertMinutesToTime } from "@/app/utils/timeutils"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Types for the API response
interface TimeSlot {
  date: string
  start_time: number
  end_time: number
  available: boolean
}

interface DaySlots {
  date: string
  slots: TimeSlot[]
  isHoliday: boolean
}

interface TimeSlotsResponse {
  slots: DaySlots[]
  max_available_date: string
  start_date: string
  end_date: string
}

// Processed slot for UI
interface ProcessedSlot {
  date: string
  start_time: number
  end_time: number
  start_time_formatted: string
  end_time_formatted: string
  available: boolean
  period: "morning" | "afternoon" | "evening"
}

interface TimeSlotsState {
  slots: ProcessedSlot[]
  loading: boolean
  error: string | null
  maxAvailableDate: string | null
}

const initialState: TimeSlotsState = {
  slots: [],
  loading: false,
  error: null,
  maxAvailableDate: null,
}

// Utility function to determine time period
function getTimePeriod(minutes: number): "morning" | "afternoon" | "evening" {
  const hours = Math.floor(minutes / 60)
  if (hours < 12) return "morning"
  if (hours < 17) return "afternoon"
  return "evening"
}

// Async thunk to fetch time slots
export const fetchTimeSlots = createAsyncThunk<
  TimeSlotsResponse,
  {
    locationUuid: string
    startDate: string
    endDate: string
    serviceIds: number[]
  },
  { rejectValue: string }
>("timeSlots/fetchTimeSlots", async ({ locationUuid, startDate, endDate, serviceIds }, { rejectWithValue }) => {
  try {
    const payload = {
      startDate,
      endDate,
      serviceIds,
    }

    console.log("🔄 API Call:", `POST ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-slots/${locationUuid}`)
    console.log("📦 Payload:", payload)

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-slots/${locationUuid}`, payload)

    console.log("📡 Response status:", response.status)
    console.log("📡 Response data:", response.data)

    if (!response.data.status) {
      throw new Error(response.data.message || "Failed to fetch time slots")
    }

    return response.data.data.data
  } catch (error: any) {
    console.log("❌ API Error:", error)

    let errorMessage = "Failed to fetch time slots"
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    return rejectWithValue(errorMessage)
  }
})

const timeSlotsSlice = createSlice({
  name: "timeSlots",
  initialState,
  reducers: {
    clearTimeSlots: (state) => {
      state.slots = []
      state.error = null
    },
    resetTimeSlotsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.maxAvailableDate = action.payload.max_available_date

        // Process and flatten all slots
        const processedSlots: ProcessedSlot[] = []

        action.payload.slots.forEach((daySlot) => {
          daySlot.slots.forEach((slot) => {
            processedSlots.push({
              date: slot.date,
              start_time: slot.start_time,
              end_time: slot.end_time,
              start_time_formatted: convertMinutesToTime(slot.start_time),
              end_time_formatted: convertMinutesToTime(slot.end_time),
              available: slot.available,
              period: getTimePeriod(slot.start_time),
            })
          })
        })

        state.slots = processedSlots
        console.log("✅ Processed", processedSlots.length, "slots")
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "An unknown error occurred"
      })
  },
})

export const { clearTimeSlots, resetTimeSlotsError } = timeSlotsSlice.actions
export default timeSlotsSlice.reducer
