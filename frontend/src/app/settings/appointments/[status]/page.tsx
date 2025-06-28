"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  X,
  LucidePackagePlus,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../../store/hook";
import {
  fetchAppointments,
  type Appointment,
  clearAppointments,
} from "../../../store/slices/appointmentsSlice";
import {
  cancelBooking,
  resetCancelBookingState,
} from "../../../store/slices/cancelBookingSlice";
import { IoCutSharp } from "react-icons/io5";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toastError, toastSuccess } from "@/app/components/common/toastService";

// --- HELPERS ---

const getDayWithOrdinal = (day: number): string => {
  if (day > 3 && day < 21) return day + "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const dayOfMonth = date.getDate();
  return formattedDate.replace(
    String(dayOfMonth),
    dayOfMonth + getDayWithOrdinal(dayOfMonth)
  );
};

// --- CONFIRMATION MODAL COMPONENT ---

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      onClick={handleClose}>
      <div
        className="bg-[#1c1c22] border border-white/20 rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all"
        onClick={handleModalClick}>
        <div className="flex items-center mb-4">
          <div className="mr-4 bg-red-500/10 p-2 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="text-gray-400 mb-6">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
            No, Keep It
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600/80 border border-red-500/50 rounded-lg text-white hover:bg-red-500 transition-colors">
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED APPOINTMENT CARD SUB-COMPONENT ---

const AppointmentCard = ({
  appointment,
  vendorLocationUuid,
  activeTab,
}: {
  appointment: Appointment;
  vendorLocationUuid: string | null;
  activeTab: "upcoming" | "completed" | "cancelled";
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { loading, error, success, message, cancelledAppointmentId } =
    useAppSelector((state) => state.cancelBooking);

  const firstService = appointment.services?.[0];
  const additionalServicesCount =
    appointment.services.length > 1 ? appointment.services.length - 1 : 0;

  const getStatusStyles = () => {
    switch (appointment.status) {
      case "completed":
        return {
          border: "border-green-500/30",
          tagBg: "bg-green-500/20",
          tagText: "text-green-400",
        };
      case "cancelled":
        return {
          border: "border-red-500/30",
          tagBg: "bg-red-500/20",
          tagText: "text-red-400",
        };
      case "upcoming":
      default:
        return {
          border: "border-white/20",
          tagBg: "bg-blue-500/20",
          tagText: "text-blue-400",
        };
    }
  };
  const statusStyles = getStatusStyles();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCancelling && cancelledAppointmentId === appointment.id) {
      if (success && message) {
        toastSuccess("appointment successfully deleted");
        setIsCancelling(false);
        dispatch(resetCancelBookingState());

        if (vendorLocationUuid) {
          let booking_type: number;
          switch (activeTab) {
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
          dispatch(
            fetchAppointments({
              vendor_location_uuid: vendorLocationUuid,
              booking_type,
              page: 1,
              limit: 10,
            })
          );
        }
      }

      if (error) {
        console.log(error, "Failed to cancel appointment. Please try again.");
        toastError("Failed to cancel appointment. Please try again.");
        setIsCancelling(false);
        dispatch(resetCancelBookingState());
      }
    }
  }, [
    success,
    error,
    message,
    cancelledAppointmentId,
    appointment.id,
    isCancelling,
    dispatch,
    vendorLocationUuid,
    activeTab,
  ]);

  const handleConfirmCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (loading || !vendorLocationUuid) return;

    setIsCancelling(true);
    dispatch(
      cancelBooking({
        id: appointment.id,
        vendor_location_uuid: vendorLocationUuid,
      })
    );
    setIsModalOpen(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment?">
        <p>
          Are you sure you want to cancel this appointment? This action cannot
          be undone.
        </p>
      </ConfirmationModal>

      <div
        className={`bg-black/50 backdrop-blur-sm border ${statusStyles.border} rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 hover:bg-white/5 transition-colors relative`}>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-white">Date & Time</h3>
            <span
              className={`text-xs px-2 py-1 mr-14 rounded-full capitalize ${statusStyles.tagBg} ${statusStyles.tagText}`}>
              {appointment.booking_status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Calendar className="h-4 w-4 text-[#c59d5f] flex-shrink-0" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Clock className="h-4 w-4 text-[#c59d5f] flex-shrink-0" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <IoCutSharp className="h-4 w-4 text-[#c59d5f] flex-shrink-0" />
              <span>{appointment.salon_name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <MapPin className="h-4 w-4 text-[#c59d5f] flex-shrink-0" />
              <span>{appointment.location}</span>
            </div>
            <div className="flex items-start gap-3 text-gray-400 text-sm">
              <LucidePackagePlus className="h-4 w-4 text-[#c59d5f] flex-shrink-0 mt-1" />
              <div>
                {firstService ? (
                  <div>
                    <h3 className="font-medium text-white">
                      {firstService.service_name}
                    </h3>
                    {additionalServicesCount > 0 && (
                      <h6 className="text-gray-400 text-xs font-normal">
                        +{additionalServicesCount} more service
                        {additionalServicesCount > 1 ? "s" : ""}
                      </h6>
                    )}
                  </div>
                ) : (
                  <h3 className="font-medium text-white">No services found</h3>
                )}
              </div>
            </div>
          </div>
        </div>

        {appointment.status === "upcoming" && (
          <div className="absolute top-[19px] right-4 z-50" ref={menuRef}>
            <button
              onClick={handleMenuClick}
              className="text-gray-400 cursor-pointer hover:text-white focus:outline-none bg-black/50 p-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
            {isMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1c1c22] ring-1 ring-white/10 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={handleCancelClick}
                    className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-white/5 disabled:opacity-50"
                    role="menuitem"
                    disabled={loading && isCancelling}>
                    {loading && isCancelling
                      ? "Cancelling..."
                      : "Cancel Appointment"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// --- MAIN COMPONENT ---
export default function MyAppointments() {
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const router = useRouter();
  const pathname = usePathname();

  // FIXED: Memoize this function to prevent unnecessary recalculations
  const getActiveTabFromPath = useCallback(() => {
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (["upcoming", "completed", "cancelled"].includes(lastSegment)) {
      return lastSegment as "upcoming" | "completed" | "cancelled";
    }
    return "upcoming";
  }, [pathname]);

  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useAppDispatch();
  const { upcoming, completed, cancelled, status } = useAppSelector(
    (state) => state.appointments
  );

  console.log("test=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"); // Your console.log

  // FIXED: Single useEffect that handles everything properly
  useEffect(() => {
    const newActiveTab = getActiveTabFromPath();

    // Only proceed if we have selectedLocationUuid
    if (!selectedLocationUuid) return;

    // If tab changed, update state and clear data
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
      dispatch(clearAppointments());
    }

    // Determine booking type
    let booking_type: number;
    switch (newActiveTab) {
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

    // Fetch appointments
    dispatch(
      fetchAppointments({
        vendor_location_uuid: selectedLocationUuid,
        booking_type,
        page: 1,
        limit: 10,
      })
    );
  }, [pathname, selectedLocationUuid, getActiveTabFromPath, dispatch]); // Removed activeTab from dependencies

  // FIXED: Simplified tab click handler
  const handleTabClick = useCallback(
    (tab: "upcoming" | "completed" | "cancelled") => {
      if (tab === activeTab) return; // Don't do anything if clicking the same tab
      router.push(`/settings/appointments/${tab}`);
    },
    [activeTab, router]
  );

  const appointments =
    activeTab === "upcoming"
      ? upcoming
      : activeTab === "completed"
      ? completed
      : cancelled;

  const filteredAppointments = (appointments as Appointment[]).filter(
    (appointment: Appointment) => {
      if (!searchQuery) return true;
      const lowerCaseQuery = searchQuery.toLowerCase();
      const firstServiceName =
        appointment.services?.[0]?.service_name.toLowerCase() || "";
      const salonName = appointment.salon_name.toLowerCase();

      return (
        firstServiceName.includes(lowerCaseQuery) ||
        salonName.includes(lowerCaseQuery)
      );
    }
  );

  return (
    <div className="lg:w-3/4 bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">My Appointments</h2>
            <p className="text-gray-400 mt-1">
              View and manage your salon appointments
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c59d5f]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/10 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="border-b border-white/10 mb-6">
          <div className="overflow-x-auto whitespace-nowrap -mb-px">
            {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 font-medium text-sm capitalize inline-block ${
                  activeTab === tab
                    ? "text-[#c59d5f] border-b-2 border-[#c59d5f]"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => handleTabClick(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div>
          {status === "loading" ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c59d5f]"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6"
              title="show">
              {filteredAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/settings/appointments/${activeTab}/${appointment.id}`}
                  className="block hover:scale-[1.02] transition-transform duration-300 cursor-auto">
                  <AppointmentCard
                    appointment={appointment}
                    vendorLocationUuid={selectedLocationUuid}
                    activeTab={activeTab}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/30 border border-white/10 rounded-xl mt-8">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-black/50 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-[#c59d5f]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No {activeTab} appointments
              </h3>
              <p className="text-gray-400 max-w-md mx-auto px-4">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming appointments. Book a new one to get started."
                  : `You don't have any ${activeTab} appointments in your history.`}
              </p>
              {activeTab === "upcoming" && (
                <button className="mt-6 bg-gradient-to-r from-[#c59d5f] to-[#f4d03f] text-black font-medium rounded-lg px-6 py-2 hover:shadow-lg hover:shadow-[#c59d5f]/20 transition-all">
                  Book Appointment
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
