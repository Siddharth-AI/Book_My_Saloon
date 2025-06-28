// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useAppSelector, useAppDispatch } from "../../../../store/hook";
// import { fetchServicesByLocation } from "../../../../store/slices/servicesSlice";
// import { FiArrowLeft, FiCalendar, FiUser, FiClock } from "react-icons/fi";
// import { useMemo, useEffect, useRef } from "react";
// import { IoCutSharp } from "react-icons/io5";
// import ContactDetails from "@/app/components/Home/contactDetails/ContactDetails";
// import Image from "next/image";

// // --- HELPER FUNCTIONS ---

// const formatDate = (dateString: string): string => {
//   const date = new Date(dateString);
//   const options: Intl.DateTimeFormatOptions = {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   };
//   return date.toLocaleDateString("en-US", options);
// };

// const parseTimeStringToDate = (timeString: string, baseDate: Date): Date => {
//   const time = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
//   if (!time) return baseDate;
//   let hours = parseInt(time[1], 10);
//   const minutes = parseInt(time[2], 10);
//   const ampm = time[3].toUpperCase();
//   if (ampm === "PM" && hours < 12) hours += 12;
//   if (ampm === "AM" && hours === 12) hours = 0;
//   const date = new Date(baseDate);
//   date.setHours(hours, minutes, 0, 0);
//   return date;
// };

// const formatTimeFromDate = (date: Date): string => {
//   return date.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// // New helper to format date for Google Calendar URL (YYYYMMDDTHHMMSSZ)
// const formatToGoogleCalendarDate = (date: Date): string => {
//   return date.toISOString().replace(/-|:|\.\d{3}/g, "");
// };

// export default function AppointmentDetailsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const dispatch = useAppDispatch();
//   const { id, status } = params;

//   // Get selectedLocationByName to add to calendar event
//   const { selectedLocationUuid, allServices, selectedLocationByName } =
//     useAppSelector((state) => state.services);
//   const { upcoming, completed, cancelled } = useAppSelector(
//     (state) => state.appointments
//   );
//   const initialLocationId = useRef(selectedLocationUuid);

//   useEffect(() => {
//     if (selectedLocationUuid && allServices.length === 0) {
//       dispatch(fetchServicesByLocation(selectedLocationUuid));
//     }
//   }, [dispatch, selectedLocationUuid, allServices.length]);

//   useEffect(() => {
//     // This check now ensures the initial ID was not null/undefined.
//     // This stops the redirect on refresh.
//     if (
//       selectedLocationUuid &&
//       initialLocationId.current !== selectedLocationUuid
//     ) {
//       // This now redirects to a valid page if the location really does change.
//       router.push("/settings/appointments/upcoming");
//     }
//   }, [selectedLocationUuid, router]);

//   // Define the Appointment type based on your data structure
//   interface Appointment {
//     id: string;
//     date: string;
//     time: string;
//     booking_status: string;
//     booking_comment?: string;
//     services: {
//       service_id: string;
//       service_name: string;
//       operator_name: string;
//       duration: string;
//     }[];
//     // Add other fields as needed
//   }

//   const appointment = useMemo(() => {
//     const list: Appointment[] =
//       status === "upcoming"
//         ? upcoming
//         : status === "completed"
//         ? completed
//         : cancelled;
//     return list.find((app) => app.id === id);
//   }, [id, status, upcoming, completed, cancelled]);

//   // --- VVVV NEW "ADD TO CALENDAR" FUNCTION VVVV ---
//   const handleAddToCalendar = () => {
//     if (!appointment) {
//       alert("Appointment details not found.");
//       return;
//     }

//     // 1. Calculate precise start and end times
//     const startDate = parseTimeStringToDate(
//       appointment.time,
//       new Date(appointment.date)
//     );
//     const totalDuration = appointment.services.reduce(
//       (total, service) => total + (parseInt(service.duration, 10) || 0),
//       0
//     );
//     const endDate = new Date(startDate.getTime());
//     endDate.setMinutes(endDate.getMinutes() + totalDuration);

//     // 2. Format dates for Google Calendar
//     const googleCalendarStartDate = formatToGoogleCalendarDate(startDate);
//     const googleCalendarEndDate = formatToGoogleCalendarDate(endDate);

//     // 3. Create descriptive details
//     const title = `Appointment at The Belle Femme Salon`;
//     const details = `Services: ${appointment.services
//       .map((s) => s.service_name)
//       .join(", ")}\n\nInstructions: ${appointment.booking_comment || "None"}`;
//     const location = selectedLocationByName || "The Belle Femme Salon";

//     // 4. Build the URL and open it
//     const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
//       title
//     )}&dates=${googleCalendarStartDate}/${googleCalendarEndDate}&details=${encodeURIComponent(
//       details
//     )}&location=${encodeURIComponent(location)}`;

//     window.open(calendarUrl, "_blank");
//   };
//   // --- ^^^^ NEW "ADD TO CALENDAR" FUNCTION ^^^^ ---

//   if (!appointment) {
//     return (
//       <div className="lg:w-3/4 text-center py-20">
//         <h2 className="text-2xl font-bold text-white">Appointment Not Found</h2>
//         <p className="text-gray-400 mt-2">
//           The appointment may have been moved or does not exist.
//         </p>
//         <button
//           onClick={() => router.back()}
//           className="mt-6 flex items-center gap-2 mx-auto text-white/80 hover:text-white transition-colors">
//           <FiArrowLeft /> Go Back
//         </button>
//       </div>
//     );
//   }

//   const runningTime = parseTimeStringToDate(
//     appointment.time,
//     new Date(appointment.date)
//   );

//   const services = appointment?.services || [];

//   return (
//     <div className="lg:w-3/4 space-y-6 animate-fadeIn">
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-white/80 hover:text-white mb-2 transition-colors duration-200 group">
//         <FiArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
//         <span className="font-medium">Back to Appointments</span>
//       </button>
//       <div className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
//         {/* <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4"> */}
//         <ContactDetails />
//       </div>

//       <div className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
//         <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
//           <h3 className="text-xl font-semibold text-white">
//             Appointment Details
//           </h3>
//           <span
//             className={`text-xs px-3 py-1 rounded-full capitalize ${
//               appointment.booking_status === "Confirmed"
//                 ? "bg-green-500/20 text-green-300"
//                 : "bg-purple-500/20 text-purple-300"
//             }`}>
//             {appointment.booking_status}
//           </span>
//         </div>

//         <div className="flex items-center gap-2 text-gray-300 mb-6">
//           <FiCalendar className="w-4 h-4 text-[#c59d5f] flex-shrink-0" />
//           <span>
//             {formatDate(appointment.date)}, starting at {appointment.time}
//           </span>
//         </div>

//         <div className="space-y-3">
//           {services.map((service, index) => {
//             const fullServiceDetails = allServices.find(
//               (s: { id: string; image?: string }) => s.id === service.service_id
//             );
//             const imageUrl = fullServiceDetails?.image;
//             const serviceStartTime = formatTimeFromDate(runningTime);
//             const durationInMinutes = parseInt(service.duration, 10) || 0;
//             runningTime.setMinutes(
//               runningTime.getMinutes() + durationInMinutes
//             );

//             return (
//               <div
//                 key={index}
//                 className="bg-white/5 p-3 rounded-lg flex justify-between items-center border border-white/10">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
//                     {imageUrl ? (
//                       <Image
//                         src={imageUrl}
//                         alt={service.service_name}
//                         layout="fill"
//                         className="object-cover"
//                       />
//                     ) : (
//                       <IoCutSharp className="text-[#c59d5f] text-2xl" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-bold text-white">
//                       {service.service_name}
//                     </p>
//                     <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
//                       <span>With</span>
//                       <FiUser className="w-3 h-3" />
//                       <span>
//                         {service.operator_name} at{" "}
//                         <span>{serviceStartTime}</span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-sm text-right text-gray-300 flex-shrink-0">
//                   <div className="flex items-center gap-1.5">
//                     <FiClock className="w-3 h-3" />
//                     <span>{service.duration}</span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
//         <h3 className="text-xl font-semibold text-white mb-3">Instruction</h3>
//         <p className="text-gray-300 italic">
//           {appointment.booking_comment || "No instructions were provided."}
//         </p>
//       </div>

//       {/* This button now correctly calls our new function */}
//       <button
//         onClick={handleAddToCalendar}
//         className="w-full bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-bold text-lg py-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-[#c59d5f]/40">
//         Add To My Calendar
//       </button>
//     </div>
//   );
// }

"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../../store/hook";
import { fetchServicesByLocation } from "../../../../store/slices/servicesSlice";
import { fetchAppointments } from "../../../../store/slices/appointmentsSlice";
import { FiArrowLeft, FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { useMemo, useEffect, useRef, useState } from "react";
import { IoCutSharp } from "react-icons/io5";
import ContactDetails from "@/app/components/Home/contactDetails/ContactDetails";
import Image from "next/image";

// --- HELPER FUNCTIONS ---

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const parseTimeStringToDate = (timeString: string, baseDate: Date): Date => {
  const time = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!time) return baseDate;
  let hours = Number.parseInt(time[1], 10);
  const minutes = Number.parseInt(time[2], 10);
  const ampm = time[3].toUpperCase();
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTimeFromDate = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatToGoogleCalendarDate = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d{3}/g, "");
};

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { id, status } = params;
  const [isLoading, setIsLoading] = useState(false);

  const { selectedLocationUuid, allServices, selectedLocationByName } =
    useAppSelector((state) => state.services);
  const { upcoming, completed, cancelled } = useAppSelector(
    (state) => state.appointments
  );
  const initialLocationId = useRef(selectedLocationUuid);

  // Define the Appointment type based on your data structure
  interface Appointment {
    id: string;
    date: string;
    time: string;
    booking_status: string;
    booking_comment?: string;
    services: {
      service_id: string;
      service_name: string;
      operator_name: string;
      duration: string;
    }[];
  }

  const appointment = useMemo(() => {
    const list: Appointment[] =
      status === "upcoming"
        ? upcoming
        : status === "completed"
        ? completed
        : cancelled;
    return list.find((app) => app.id === id);
  }, [id, status, upcoming, completed, cancelled]);

  // FIXED: Fetch appointment data if not found (handles page refresh)
  useEffect(() => {
    const fetchAppointmentData = async () => {
      // If appointment is not found and we have selectedLocationUuid, fetch the appointments
      if (!appointment && selectedLocationUuid && !isLoading) {
        setIsLoading(true);
        try {
          let booking_type: number;
          switch (status) {
            case "completed":
              booking_type = 3;
              break;
            case "cancelled":
              booking_type = 2;
              break;
            default:
              booking_type = 1;
              break;
          }

          await dispatch(
            fetchAppointments({
              vendor_location_uuid: selectedLocationUuid,
              booking_type,
              page: 1,
              limit: 10,
            })
          );
        } catch (error) {
          console.error("Failed to fetch appointments:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAppointmentData();
  }, [appointment, selectedLocationUuid, status, dispatch, isLoading]);

  useEffect(() => {
    if (selectedLocationUuid && allServices.length === 0) {
      dispatch(fetchServicesByLocation(selectedLocationUuid));
    }
  }, [dispatch, selectedLocationUuid, allServices.length]);

  // FIXED: Only redirect if location actually changes (not on initial load)
  useEffect(() => {
    if (
      initialLocationId.current &&
      selectedLocationUuid &&
      initialLocationId.current !== selectedLocationUuid
    ) {
      router.push("/settings/appointments/upcoming");
    }
  }, [selectedLocationUuid, router]);

  const handleAddToCalendar = () => {
    if (!appointment) {
      alert("Appointment details not found.");
      return;
    }

    const startDate = parseTimeStringToDate(
      appointment.time,
      new Date(appointment.date)
    );
    const totalDuration = appointment.services.reduce(
      (total, service) => total + (Number.parseInt(service.duration, 10) || 0),
      0
    );
    const endDate = new Date(startDate.getTime());
    endDate.setMinutes(endDate.getMinutes() + totalDuration);

    const googleCalendarStartDate = formatToGoogleCalendarDate(startDate);
    const googleCalendarEndDate = formatToGoogleCalendarDate(endDate);

    const title = `Appointment at The Belle Femme Salon`;
    const details = `Services: ${appointment.services
      .map((s) => s.service_name)
      .join(", ")}\n\nInstructions: ${appointment.booking_comment || "None"}`;
    const location = selectedLocationByName || "The Belle Femme Salon";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${googleCalendarStartDate}/${googleCalendarEndDate}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}`;

    window.open(calendarUrl, "_blank");
  };

  // Show loading state while fetching appointment data
  if (isLoading) {
    return (
      <div className="lg:w-3/4 text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c59d5f] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white">
          Loading appointment details...
        </h2>
      </div>
    );
  }

  // Show not found only after we've tried to fetch the data
  if (!appointment && !isLoading) {
    return (
      <div className="lg:w-3/4 text-center py-20">
        <h2 className="text-2xl font-bold text-white">Appointment Not Found</h2>
        <p className="text-gray-400 mt-2">
          The appointment may have been moved or does not exist.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 flex items-center gap-2 mx-auto text-white/80 hover:text-white transition-colors">
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  if (!appointment) return null;

  const runningTime = parseTimeStringToDate(
    appointment.time,
    new Date(appointment.date)
  );
  const services = appointment?.services || [];

  return (
    <div className="lg:w-3/4 space-y-3 animate-fadeIn">
      <div className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-2 shadow-2xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 group">
          <FiArrowLeft className="w-7 h-7 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-medium text-xl">Back to Appointments</span>
        </button>
      </div>
      <div className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 shadow-2xl z-50">
        <ContactDetails />
      </div>

      <div className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
          <h3 className="text-xl font-semibold text-white">
            Appointment Details
          </h3>
          <span
            className={`text-xs px-3 py-1 rounded-full capitalize ${
              appointment.booking_status === "Confirmed"
                ? "bg-green-500/20 text-green-300"
                : "bg-purple-500/20 text-purple-300"
            }`}>
            {appointment.booking_status}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-300 mb-6">
          <FiCalendar className="w-4 h-4 text-[#c59d5f] flex-shrink-0" />
          <span>
            {formatDate(appointment.date)}, starting at {appointment.time}
          </span>
        </div>

        <div className="space-y-3">
          {services.map((service, index) => {
            const fullServiceDetails = allServices.find(
              (s: { id: string; image?: string }) => s.id === service.service_id
            );
            const imageUrl = fullServiceDetails?.image;
            const serviceStartTime = formatTimeFromDate(runningTime);
            const durationInMinutes =
              Number.parseInt(service.duration, 10) || 0;
            runningTime.setMinutes(
              runningTime.getMinutes() + durationInMinutes
            );

            return (
              <div
                key={index}
                className="bg-white/5 p-3 rounded-lg flex justify-between items-center border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={service.service_name}
                        layout="fill"
                        className="object-cover"
                      />
                    ) : (
                      <IoCutSharp className="text-[#c59d5f] text-2xl" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      {service.service_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>With</span>
                      <FiUser className="w-3 h-3" />
                      <span>
                        {service.operator_name} at{" "}
                        <span>{serviceStartTime}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-right text-gray-300 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="w-3 h-3" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-3">Instruction</h3>
        <p className="text-gray-300 italic">
          {appointment.booking_comment || "No instructions were provided."}
        </p>
      </div>

      <button
        onClick={handleAddToCalendar}
        className="w-full bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-bold text-lg py-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-[#c59d5f]/40">
        Add To My Calendar
      </button>
    </div>
  );
}
