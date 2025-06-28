// // // appointmentsSlice.ts
// // import { convertMinutesToTime } from "@/app/utils/timeutils";
// // import { AuthState, getAuthToken } from "./authSlice";
// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // // Defines the shape of a single appointment object for our UI
// // interface Appointment {
// //   id: string;
// //   service_name: string;
// //   salon_name: string;
// //   location: string;
// //   date: string;
// //   time: string;
// //   duration: string;
// //   stylist: string;
// //   status: "upcoming" | "completed" | "cancelled";
// //   price: number;
// // }

// // // Defines the shape of the appointments state
// // interface AppointmentsState {
// //   upcoming: Appointment[];
// //   completed: Appointment[];
// //   cancelled: Appointment[];
// //   status: "idle" | "loading" | "succeeded" | "failed";
// //   error: string | null;
// // }

// // interface RawAppointment {
// //   id: string;
// //   services: {
// //     service: string;
// //     service_time: string;
// //     employee_name: string;
// //     price: number;
// //   }[];
// //   vendor_location: {
// //     name: string;
// //     address: string;
// //   };
// //   appointment_date: string;
// //   start_time: number;
// //   booking_status: string;
// // }

// // const initialState: AppointmentsState = {
// //   upcoming: [],
// //   completed: [],
// //   cancelled: [],
// //   status: "idle",
// //   error: null,
// // };


// // // Async thunk to fetch appointments using a POST request
// // export const fetchAppointments = createAsyncThunk(
// //   "appointments/fetchAppointments",
// //   async (
// //     {
// //       vendor_location_uuid,
// //       booking_type,
// //       page,
// //       limit,
// //     }: {
// //       vendor_location_uuid: string;
// //       booking_type: number;
// //       page: number;
// //       limit: number;
// //     },
// //     { getState }
// //   ) => {
// //     const state = getState() as { auth: AuthState }
// //     const authToken = getAuthToken() || state.auth.tempToken


// //     const response = await axios.post(
// //       "http://localhost:3005/api/dingg-partner/get-user-bookings",
// //       {
// //         vendor_location_uuid,
// //         booking_type,
// //         page,
// //         limit,
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${authToken}`,
// //         },
// //       }
// //     );
// //     console.log(response.data.data.data.row, "booking data")
// //     // Return the data and the original booking_type to the reducer
// //     return { data: response.data.data.data.row, booking_type };
// //   }
// // );

// // const appointmentsSlice = createSlice({
// //   name: "appointments",
// //   initialState,
// //   reducers: {},
// //   // Handles the state changes based on the async thunk's status
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchAppointments.pending, (state) => {
// //         state.status = "loading";
// //         state.error = null;
// //       })
// //       .addCase(fetchAppointments.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         const { data, booking_type } = action.payload;

// //         // Transform the raw API data into the Appointment shape our component expects


// //         const formattedData: Appointment[] = data.map((item: RawAppointment) => {

// //           const time = convertMinutesToTime(item.start_time);
// //           return {
// //             id: item.id,
// //             service_name: item.services.map((s: RawAppointment["services"][number]) => s.service).join(", "),
// //             salon_name: item.vendor_location.name,
// //             booking_status: item.booking_status,
// //             location: item.vendor_location.address,
// //             date: item.appointment_date,
// //             time: time, // Note: You may want to format this (e.g., "930" -> "09:30 AM")
// //             duration: `${item.services.reduce(
// //               (acc: number, s: RawAppointment["services"][number]) => acc + parseInt(s.service_time, 10), 0
// //             )} min`,
// //             stylist: item.services.map((s: RawAppointment["services"][number]) => s.employee_name).join(", "),
// //             status:
// //               booking_type === 1
// //                 ? "upcoming"
// //                 : booking_type === 2
// //                   ? "cancelled"
// //                   : "completed",
// //             price: item.services.reduce(
// //               (acc: number, s: RawAppointment["services"][number]) => acc + s.price, 0
// //             ),
// //           }
// //         });

// //         // Place the formatted data into the correct array based on the booking type
// //         if (booking_type === 1) {
// //           state.upcoming = formattedData;
// //         } else if (booking_type === 2) {
// //           state.cancelled = formattedData;
// //         } else if (booking_type === 3) {
// //           state.completed = formattedData;
// //         }
// //       })
// //       .addCase(fetchAppointments.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.error.message || "Failed to fetch appointments";
// //       });
// //   },
// // });

// // export default appointmentsSlice.reducer;

// // appointmentsSlice.ts
// import { convertMinutesToTime } from "@/app/utils/timeutils";
// import { AuthState, getAuthToken } from "./authSlice";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // --- UPDATED: The shape of an individual service in an appointment ---
// interface ServiceDetails {
//   service_id: number; //
//   service_name: string;
//   operator_name: string;
//   duration: string;
//   price: number;
// }

// // --- UPDATED: The shape of a single appointment for our UI ---
// export interface Appointment {
//   id: string;
//   salon_name: string;
//   location: string;
//   date: string;
//   time: string; // Overall start time
//   duration: string; // Total duration
//   status: "upcoming" | "completed" | "cancelled";
//   price: number;
//   booking_status: string;
//   booking_comment: string; // Added for instructions
//   services: ServiceDetails[]; // Changed from string to an array of objects
// }

// // Defines the shape of the appointments state
// interface AppointmentsState {
//   upcoming: Appointment[];
//   completed: Appointment[];
//   cancelled: Appointment[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// // Raw data shape from the API
// interface RawAppointment {
//   id: string;
//   services: {
//     id: number;
//     service: string;
//     service_time: string; // This is actually duration in minutes
//     employee_name: string;
//     price: number;
//   }[];
//   vendor_location: {
//     name: string;
//     address: string;
//   };
//   appointment_date: string;
//   start_time: number;
//   booking_status: string;
//   booking_comment: string; // Added this field
// }

// const initialState: AppointmentsState = {
//   upcoming: [],
//   completed: [],
//   cancelled: [],
//   status: "idle",
//   error: null,
// };

// // Async thunk is unchanged
// export const fetchAppointments = createAsyncThunk(
//   "appointments/fetchAppointments",
//   async (
//     {
//       vendor_location_uuid,
//       booking_type,
//       page,
//       limit,
//     }: {
//       vendor_location_uuid: string;
//       booking_type: number;
//       page: number;
//       limit: number;
//     },
//     { getState }
//   ) => {
//     const state = getState() as { auth: AuthState };
//     const authToken = getAuthToken() || state.auth.tempToken;

//     const response = await axios.post(
//       "http://localhost:3005/api/dingg-partner/get-user-bookings",
//       {
//         vendor_location_uuid,
//         booking_type,
//         page,
//         limit,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//     return { data: response.data.data.data.row, booking_type };
//   }
// );

// const appointmentsSlice = createSlice({
//   name: "appointments",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAppointments.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchAppointments.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const { data, booking_type } = action.payload;

//         // --- UPDATED: This is the new, correct data transformation ---
//         const formattedData: Appointment[] = data.map((item: RawAppointment) => {
//           const time = convertMinutesToTime(item.start_time);
//           const totalDuration = item.services.reduce(
//             (acc, s) => acc + parseInt(s.service_time, 10), 0
//           );
//           const totalPrice = item.services.reduce(
//             (acc, s) => acc + s.price, 0
//           );

//           return {
//             id: item.id,
//             salon_name: item.vendor_location.name,
//             booking_status: item.booking_status,
//             location: item.vendor_location.address,
//             date: item.appointment_date,
//             time: time,
//             duration: `${totalDuration} min`,
//             price: totalPrice,
//             booking_comment: item.booking_comment || "", // Get the instruction text
//             status:
//               booking_type === 1
//                 ? "upcoming"
//                 : booking_type === 2
//                   ? "cancelled"
//                   : "completed",
//             // --- UPDATED: Keep services as a structured array ---
//             services: item.services.map((s) => ({
//               service_name: s.service,
//               operator_name: s.employee_name,
//               duration: `${s.service_time} min`,
//               price: s.price,
//             })),
//           };
//         });

//         if (booking_type === 1) {
//           state.upcoming = formattedData;
//         } else if (booking_type === 2) {
//           state.cancelled = formattedData;
//         } else if (booking_type === 3) {
//           state.completed = formattedData;
//         }
//       })
//       .addCase(fetchAppointments.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message || "Failed to fetch appointments";
//       });
//   },
// });

// export default appointmentsSlice.reducer;

import { convertMinutesToTime } from "@/app/utils/timeutils"
import { type AuthState, getAuthToken } from "./authSlice"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

interface ServiceDetails {
  service_id?: number
  service_name: string
  operator_name: string
  duration: string
  price: number
}

export interface Appointment {
  id: string
  salon_name: string
  location: string
  date: string
  time: string
  duration: string
  status: "upcoming" | "completed" | "cancelled"
  price: number
  booking_status: string
  booking_comment: string
  services: ServiceDetails[]
}

interface AppointmentsState {
  upcoming: Appointment[]
  completed: Appointment[]
  cancelled: Appointment[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

interface RawAppointment {
  id: string
  services: {
    id: number
    service: string
    service_time: string
    employee_name: string
    price: number
  }[]
  vendor_location: {
    name: string
    address: string
  }
  appointment_date: string
  start_time: number
  booking_status: string
  booking_comment: string
}

const initialState: AppointmentsState = {
  upcoming: [],
  completed: [],
  cancelled: [],
  status: "idle",
  error: null,
}

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (
    {
      vendor_location_uuid,
      booking_type,
      page,
      limit,
    }: {
      vendor_location_uuid: string
      booking_type: number
      page: number
      limit: number
    },
    { getState },
  ) => {
    const state = getState() as { auth: AuthState }
    const authToken = getAuthToken() || state.auth.tempToken

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dingg-partner/get-user-bookings`,
      {
        vendor_location_uuid,
        booking_type,
        page,
        limit,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
    return { data: response.data.data.data.row, booking_type }
  },
)

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    // Added clearAppointments action
    clearAppointments: (state) => {
      state.upcoming = []
      state.completed = []
      state.cancelled = []
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "succeeded"
        const { data, booking_type } = action.payload

        const formattedData: Appointment[] = data.map((item: RawAppointment) => {
          const time = convertMinutesToTime(item.start_time)
          const totalDuration = item.services.reduce((acc, s) => acc + Number.parseInt(s.service_time, 10), 0)
          const totalPrice = item.services.reduce((acc, s) => acc + s.price, 0)

          return {
            id: item.id,
            salon_name: item.vendor_location.name,
            booking_status: item.booking_status,
            location: item.vendor_location.address,
            date: item.appointment_date,
            time: time,
            duration: `${totalDuration} min`,
            price: totalPrice,
            booking_comment: item.booking_comment || "",
            status: booking_type === 1 ? "upcoming" : booking_type === 2 ? "cancelled" : "completed",
            services: item.services.map((s) => ({
              service_name: s.service,
              operator_name: s.employee_name,
              duration: `${s.service_time} min`,
              price: s.price,
            })),
          }
        })

        if (booking_type === 1) {
          state.upcoming = formattedData
        } else if (booking_type === 2) {
          state.cancelled = formattedData
        } else if (booking_type === 3) {
          state.completed = formattedData
        }
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch appointments"
      })
  },
})

// Export the new action
export const { clearAppointments } = appointmentsSlice.actions
export default appointmentsSlice.reducer
