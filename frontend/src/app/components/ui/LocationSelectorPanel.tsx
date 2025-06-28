// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { FiMapPin, FiX, FiSearch } from "react-icons/fi";
// import { useAppSelector, useAppDispatch } from "../../store/hook";
// import { fetchLocations } from "../../store/slices/locationsSlice";
// import {
//   fetchServicesByLocation,
//   setSelectedLocation,
//   setSelectedLocationByName,
// } from "../../store/slices/servicesSlice";
// import { fetchBusinessHours } from "@/app/store/slices/businessHoursSlice";
// import { fetchOperatorsByLocation } from "../../store/slices/operatorsSlice"; // Add this import
// import { clearCart } from "@/app/store/slices/cartSlice";

// interface LocationSelectorPanelProps {
//   onLocationChange?: (locationUuid: string, locationName: string) => void;
// }

// export default function LocationSelectorPanel({
//   onLocationChange,
// }: LocationSelectorPanelProps) {
//   const [showLocationPanel, setShowLocationPanel] = useState(false);
//   const [selectedLocationName, setSelectedLocationName] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const locationsState = useAppSelector((state) => state.locations);

//   const dispatch = useAppDispatch();

//   const locationPanelRef = useRef<HTMLDivElement | null>(null);

//   const handleRetryFetch = () => {
//     dispatch(fetchLocations());
//   };
//   // Fetch locations on mount
//   useEffect(() => {
//     if (locationsState.locations.length === 0) {
//       dispatch(fetchLocations());
//     }
//   }, [dispatch, locationsState.locations.length]);

//   // Set default selected location after locations are loaded
//   useEffect(() => {
//     if (locationsState.locations.length && !selectedLocationName) {
//       const firstLocation = locationsState.locations[0];
//       setSelectedLocationName(firstLocation.locality);
//       dispatch(fetchBusinessHours(firstLocation.vendor_location_uuid));
//       dispatch(setSelectedLocationByName(firstLocation.locality));
//       dispatch(setSelectedLocation(firstLocation.vendor_location_uuid));
//       dispatch(fetchServicesByLocation(firstLocation.vendor_location_uuid));

//       // Add this line to fetch operators when location is set
//       dispatch(fetchOperatorsByLocation(firstLocation.vendor_location_uuid));
//     }
//   }, [locationsState.locations, selectedLocationName, dispatch]);

//   // Close panel on outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       const target = event.target as Node;
//       if (
//         locationPanelRef.current &&
//         !locationPanelRef.current.contains(target)
//       ) {
//         setShowLocationPanel(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Prevent body scroll when panel is open and ensure full height
//   useEffect(() => {
//     if (showLocationPanel) {
//       document.body.style.overflow = "hidden";
//       document.documentElement.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//       document.documentElement.style.overflow = "unset";
//     }

//     return () => {
//       document.body.style.overflow = "unset";
//       document.documentElement.style.overflow = "unset";
//     };
//   }, [showLocationPanel]);

//   const handleLocationSelect = (location: any) => {
//     setSelectedLocationName(location.locality);
//     setShowLocationPanel(false);
//     setSearchTerm("");
//     dispatch(fetchBusinessHours(location.vendor_location_uuid));
//     dispatch(setSelectedLocation(location.vendor_location_uuid));
//     dispatch(setSelectedLocationByName(location.locality));
//     dispatch(fetchServicesByLocation(location.vendor_location_uuid));
//     dispatch(fetchOperatorsByLocation(location.vendor_location_uuid));
//     dispatch(clearCart());

//     onLocationChange?.(location.vendor_location_uuid, location.locality);
//   };

//   // Filter locations based on search term
//   const filteredLocations = locationsState.locations.filter((location: any) =>
//     location.locality.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       {/* Enhanced Location Button */}
//       {locationsState.loading ? (
//         ""
//       ) : (
//         <button
//           className="relative flex items-center ml-4 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c59d5f]/60 rounded-xl transition-all duration-300 text-white text-sm font-medium focus:outline-none group overflow-hidden"
//           onClick={() => setShowLocationPanel(true)}
//           aria-label="Select Location">
//           {/* Shimmer effect */}
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

//           <FiMapPin className="mr-2 text-[#c59d5f] group-hover:scale-110 transition-transform duration-300" />
//           <span className="relative z-10 group-hover:text-[#c59d5f] transition-colors durat</span>ion-300">
//             {selectedLocationName}
//           </span>

//           {/* Glow effect */}
//           <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
//         </button>
//       )}

//       {/* FIXED: Full Height Location Panel */}
//       {showLocationPanel && (
//         <div
//           className="fixed inset-0 z-50 flex"
//           style={{ height: "100vh", width: "100vw" }}>
//           <div
//             ref={locationPanelRef}
//             className="bg-black/95 backdrop-blur-xl w-[350px] shadow-2xl flex flex-col animate-fadeInLeft border-r border-white/10"
//             style={{ height: "100vh", minWidth: 180 }}>
//             {/* Enhanced Header */}
//             <div className="relative flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-[#c59d5f]/10 to-transparent flex-shrink-0">
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-[#c59d5f] rounded-full animate-pulse" />
//                 <span className="text-white font-bold text-lg">
//                   Select Location
//                 </span>
//               </div>
//               <button
//                 onClick={() => setShowLocationPanel(false)}
//                 className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 group"
//                 aria-label="Close">
//                 <FiX className="group-hover:rotate-90 transition-transform duration-300" />
//               </button>
//             </div>

//             {/* Enhanced Search Input */}
//             <div className="p-6 border-b border-white/10 flex-shrink-0">
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <FiSearch className="text-gray-400 group-focus-within:text-[#c59d5f] transition-colors duration-300" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search locations..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-white/5 backdrop-blur-sm text-white pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#c59d5f]/50 focus:bg-white/10 transition-all duration-300"
//                 />
//               </div>
//             </div>

//             {/* FIXED: Full Height Location List */}
//             <div
//               className="flex-1 overflow-y-auto p-6"
//               style={{ height: "calc(100vh - 200px)" }}>
//               {locationsState.loading ? (
//                 <div className="flex items-center justify-center h-32">
//                   <div className="relative">
//                     <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#c59d5f]/30 border-t-[#c59d5f]"></div>
//                     <div className="absolute inset-0 rounded-full bg-[#c59d5f]/20 animate-pulse"></div>
//                   </div>
//                 </div>
//               ) : locationsState.error ? (
//                 <div className="text-red-400 p-4 text-center bg-red-500/10 rounded-xl border border-red-500/20">
//                   <p className="mb-4">
//                     Could not load locations. Please check your connection and
//                     try again.
//                   </p>
//                   <button
//                     onClick={handleRetryFetch}
//                     className="px-4 py-2 bg-[#c59d5f]/20 text-[#c59d5f] rounded-lg hover:bg-[#c59d5f]/40 transition-colors duration-300">
//                     Retry
//                   </button>
//                 </div>
//               ) : filteredLocations.length === 0 ? (
//                 <div className="text-gray-400 p-8 text-center">
//                   <FiSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                   <p>No locations found</p>
//                 </div>
//               ) : (
//                 <ul className="space-y-2">
//                   {filteredLocations.map((location: any, index: any) => (
//                     <li
//                       key={location.vendor_location_uuid}
//                       className="animate-fadeIn"
//                       style={{ animationDelay: `${index * 50}ms` }}>
//                       <button
//                         className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
//                           selectedLocationName === location.locality
//                             ? "bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border border-[#c59d5f]/30 text-[#c59d5f]"
//                             : "text-white hover:bg-white/5 border border-transparent hover:border-white/10"
//                         }`}
//                         onClick={() => handleLocationSelect(location)}>
//                         {/* Shimmer effect */}
//                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

//                         <div className="flex items-center space-x-3 relative z-10">
//                           <div
//                             className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                               selectedLocationName === location.locality
//                                 ? "bg-[#c59d5f] shadow-lg shadow-[#c59d5f]/50"
//                                 : "bg-gray-500 group-hover:bg-[#c59d5f]"
//                             }`}
//                           />
//                           <span className="font-medium">
//                             {location.locality}
//                           </span>
//                         </div>
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           {/* Enhanced Overlay */}
//           <div
//             className="flex-1 bg-black/70 backdrop-blur-sm animate-fadeIn"
//             onClick={() => setShowLocationPanel(false)}
//             style={{ height: "100vh" }}
//           />
//         </div>
//       )}
//     </>
//   );
// }

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { FiMapPin, FiX, FiSearch } from "react-icons/fi";
// import { useAppSelector, useAppDispatch } from "../../store/hook";
// import { fetchLocations } from "../../store/slices/locationsSlice";
// import {
//   fetchServicesByLocation,
//   setSelectedLocation,
//   setSelectedLocationByName,
// } from "../../store/slices/servicesSlice";
// import { fetchBusinessHours } from "@/app/store/slices/businessHoursSlice";
// import { fetchOperatorsByLocation } from "../../store/slices/operatorsSlice";
// import { clearCart } from "@/app/store/slices/cartSlice";

// interface LocationSelectorPanelProps {
//   onLocationChange?: (locationUuid: string, locationName: string) => void;
// }

// export default function LocationSelectorPanel({
//   onLocationChange,
// }: LocationSelectorPanelProps) {
//   const [showLocationPanel, setShowLocationPanel] = useState(false);
//   const [selectedLocationName, setSelectedLocationName] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const dispatch = useAppDispatch();
//   const locationsState = useAppSelector((state) => state.locations);
//   const { items } = useAppSelector((state) => state.cart); // Get cart items from store

//   const locationPanelRef = useRef<HTMLDivElement | null>(null);

//   const handleRetryFetch = () => {
//     dispatch(fetchLocations());
//   };

//   // Helper function to set all state and dispatch actions for a given location
//   // Using useCallback to prevent this function from being recreated on every render
//   const setLocationContext = useCallback(
//     (location: any) => {
//       if (!location) return;

//       const locationUuid = location.vendor_location_uuid;
//       const locationName = location.locality;

//       setSelectedLocationName(locationName);
//       dispatch(fetchBusinessHours(locationUuid));
//       dispatch(setSelectedLocation(locationUuid));
//       dispatch(setSelectedLocationByName(locationName));
//       dispatch(fetchServicesByLocation(locationUuid));
//       dispatch(fetchOperatorsByLocation(locationUuid));
//       onLocationChange?.(locationUuid, locationName);
//     },
//     [dispatch, onLocationChange]
//   );

//   // Effect to fetch locations on initial component mount if they aren't loaded
//   useEffect(() => {
//     if (locationsState.locations.length === 0) {
//       dispatch(fetchLocations());
//     }
//   }, [dispatch, locationsState.locations.length]);

//   // MODIFIED EFFECT:
//   // Sets the initial location. It prioritizes the location from the cart.
//   // If the cart is empty, it falls back to the first location in the fetched list.
//   useEffect(() => {
//     // Proceed only when locations are available and a location hasn't been selected yet
//     if (locationsState.locations.length > 0 && !selectedLocationName) {
//       let locationToSet = null;

//       // 1. Check if the cart has items and if the items contain location info
//       if (items.length > 0 && items[0]?.vendor_location_uuid) {
//         const locationUuidFromCart = items[0].vendor_location_uuid;
//         // Find the full location object that matches the UUID from the cart
//         locationToSet = locationsState.locations.find(
//           (loc: any) => loc.vendor_location_uuid === locationUuidFromCart
//         );
//       }

//       // 2. If no location was found from the cart (or cart is empty), default to the first location
//       if (!locationToSet) {
//         locationToSet = locationsState.locations[0];
//       }

//       // 3. Set the determined location context
//       setLocationContext(locationToSet);
//     }
//   }, [
//     locationsState.locations,
//     selectedLocationName,
//     items,
//     setLocationContext,
//   ]);

//   // Effect to close the location panel when clicking outside of it
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       const target = event.target as Node;
//       if (
//         locationPanelRef.current &&
//         !locationPanelRef.current.contains(target)
//       ) {
//         setShowLocationPanel(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Effect to prevent the body from scrolling when the panel is open
//   useEffect(() => {
//     if (showLocationPanel) {
//       document.body.style.overflow = "hidden";
//       document.documentElement.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//       document.documentElement.style.overflow = "unset";
//     }

//     return () => {
//       document.body.style.overflow = "unset";
//       document.documentElement.style.overflow = "unset";
//     };
//   }, [showLocationPanel]);

//   // Handler for when a user manually selects a location from the list
//   const handleLocationSelect = (location: any) => {
//     setLocationContext(location); // Use the reusable helper function
//     setShowLocationPanel(false);
//     setSearchTerm("");
//     dispatch(clearCart()); // Important: Clear cart when location is manually changed
//   };

//   // Filter locations based on the user's search term
//   const filteredLocations = locationsState.locations.filter((location: any) =>
//     location.locality.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       {/* Location Selector Button */}
//       {locationsState.loading ? (
//         "" // Render nothing while loading to prevent layout shift
//       ) : (
//         <button
//           className="relative flex items-center ml-4 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c59d5f]/60 rounded-xl transition-all duration-300 text-white text-sm font-medium focus:outline-none group overflow-hidden"
//           onClick={() => setShowLocationPanel(true)}
//           aria-label="Select Location">
//           {/* Shimmer effect */}
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

//           <FiMapPin className="mr-2 text-[#c59d5f] group-hover:scale-110 transition-transform duration-300" />
//           <span className="relative z-10 group-hover:text-[#c59d5f] transition-colors duration-300">
//             {selectedLocationName || "Select Location..."}
//           </span>

//           {/* Glow effect */}
//           <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
//         </button>
//       )}

//       {/* Location Selection Panel (Side Panel) */}
//       {showLocationPanel && (
//         <div
//           className="fixed inset-0 z-50 flex"
//           style={{ height: "100vh", width: "100vw" }}>
//           <div
//             ref={locationPanelRef}
//             className="bg-black/95 backdrop-blur-xl w-[350px] shadow-2xl flex flex-col animate-fadeInLeft border-r border-white/10"
//             style={{ height: "100vh", minWidth: 180 }}>
//             {/* Panel Header */}
//             <div className="relative flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-[#c59d5f]/10 to-transparent flex-shrink-0">
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-[#c59d5f] rounded-full animate-pulse" />
//                 <span className="text-white font-bold text-lg">
//                   Select Location
//                 </span>
//               </div>
//               <button
//                 onClick={() => setShowLocationPanel(false)}
//                 className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 group"
//                 aria-label="Close">
//                 <FiX className="group-hover:rotate-90 transition-transform duration-300" />
//               </button>
//             </div>

//             {/* Search Input */}
//             <div className="p-6 border-b border-white/10 flex-shrink-0">
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <FiSearch className="text-gray-400 group-focus-within:text-[#c59d5f] transition-colors duration-300" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search locations..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-white/5 backdrop-blur-sm text-white pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#c59d5f]/50 focus:bg-white/10 transition-all duration-300"
//                 />
//               </div>
//             </div>

//             {/* Location List */}
//             <div
//               className="flex-1 overflow-y-auto p-6"
//               style={{ height: "calc(100vh - 200px)" }}>
//               {locationsState.loading ? (
//                 <div className="flex items-center justify-center h-32">
//                   <div className="relative">
//                     <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#c59d5f]/30 border-t-[#c59d5f]"></div>
//                     <div className="absolute inset-0 rounded-full bg-[#c59d5f]/20 animate-pulse"></div>
//                   </div>
//                 </div>
//               ) : locationsState.error ? (
//                 <div className="text-red-400 p-4 text-center bg-red-500/10 rounded-xl border border-red-500/20">
//                   <p className="mb-4">
//                     Could not load locations. Please check your connection and
//                     try again.
//                   </p>
//                   <button
//                     onClick={handleRetryFetch}
//                     className="px-4 py-2 bg-[#c59d5f]/20 text-[#c59d5f] rounded-lg hover:bg-[#c59d5f]/40 transition-colors duration-300">
//                     Retry
//                   </button>
//                 </div>
//               ) : filteredLocations.length === 0 ? (
//                 <div className="text-gray-400 p-8 text-center">
//                   <FiSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                   <p>No locations found</p>
//                 </div>
//               ) : (
//                 <ul className="space-y-2">
//                   {filteredLocations.map((location: any, index: any) => (
//                     <li
//                       key={location.vendor_location_uuid}
//                       className="animate-fadeIn"
//                       style={{ animationDelay: `${index * 50}ms` }}>
//                       <button
//                         className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
//                           selectedLocationName === location.locality
//                             ? "bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border border-[#c59d5f]/30 text-[#c59d5f]"
//                             : "text-white hover:bg-white/5 border border-transparent hover:border-white/10"
//                         }`}
//                         onClick={() => handleLocationSelect(location)}>
//                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//                         <div className="flex items-center space-x-3 relative z-10">
//                           <div
//                             className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                               selectedLocationName === location.locality
//                                 ? "bg-[#c59d5f] shadow-lg shadow-[#c59d5f]/50"
//                                 : "bg-gray-500 group-hover:bg-[#c59d5f]"
//                             }`}
//                           />
//                           <span className="font-medium">
//                             {location.locality}
//                           </span>
//                         </div>
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           {/* Panel Overlay */}
//           <div
//             className="flex-1 bg-black/70 backdrop-blur-sm animate-fadeIn"
//             onClick={() => setShowLocationPanel(false)}
//             style={{ height: "100vh" }}
//           />
//         </div>
//       )}
//     </>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FiMapPin, FiX, FiSearch } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { fetchLocations } from "../../store/slices/locationsSlice";
import {
  fetchServicesByLocation,
  setSelectedLocation,
  setSelectedLocationByName,
} from "../../store/slices/servicesSlice";
import { fetchBusinessHours } from "@/app/store/slices/businessHoursSlice";
import { fetchOperatorsByLocation } from "../../store/slices/operatorsSlice";
import { clearCart } from "@/app/store/slices/cartSlice";

interface LocationSelectorPanelProps {
  onLocationChange?: (locationUuid: string, locationName: string) => void;
}

export default function LocationSelectorPanel({
  onLocationChange,
}: LocationSelectorPanelProps) {
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useAppDispatch();
  const locationsState = useAppSelector((state) => state.locations);
  const { items } = useAppSelector((state) => state.cart);
  const { selectedLocationUuid, selectedLocationByName } = useAppSelector(
    (state) => state.services
  );

  const locationPanelRef = useRef<HTMLDivElement | null>(null);

  const handleRetryFetch = () => {
    dispatch(fetchLocations());
  };

  // FIXED: Preserve location context from Redux state on page refresh
  useEffect(() => {
    if (selectedLocationByName && !selectedLocationName) {
      setSelectedLocationName(selectedLocationByName);
    }
  }, [selectedLocationByName, selectedLocationName]);

  const setLocationContext = useCallback(
    (location: any) => {
      if (!location) return;

      const locationUuid = location.vendor_location_uuid;
      const locationName = location.locality;

      setSelectedLocationName(locationName);
      dispatch(fetchBusinessHours(locationUuid));
      dispatch(setSelectedLocation(locationUuid));
      dispatch(setSelectedLocationByName(locationName));
      dispatch(fetchServicesByLocation(locationUuid));
      dispatch(fetchOperatorsByLocation(locationUuid));
      onLocationChange?.(locationUuid, locationName);

      // FIXED: Store location in localStorage to persist across page refreshes
      localStorage.setItem("selectedLocationUuid", locationUuid);
      localStorage.setItem("selectedLocationName", locationName);
    },
    [dispatch, onLocationChange]
  );

  useEffect(() => {
    if (locationsState.locations.length === 0) {
      dispatch(fetchLocations());
    }
  }, [dispatch, locationsState.locations.length]);

  // FIXED: Enhanced location initialization with localStorage fallback
  useEffect(() => {
    if (locationsState.locations.length > 0 && !selectedLocationName) {
      let locationToSet = null;

      // 1. First, try to get location from Redux state (if already set)
      if (selectedLocationUuid) {
        locationToSet = locationsState.locations.find(
          (loc: any) => loc.vendor_location_uuid === selectedLocationUuid
        );
      }

      // 2. If not in Redux, try localStorage (for page refresh)
      if (!locationToSet) {
        const storedLocationUuid = localStorage.getItem("selectedLocationUuid");
        const storedLocationName = localStorage.getItem("selectedLocationName");

        if (storedLocationUuid && storedLocationName) {
          locationToSet = locationsState.locations.find(
            (loc: any) => loc.vendor_location_uuid === storedLocationUuid
          );
          if (locationToSet) {
            // Set the stored location name immediately to prevent UI flash
            setSelectedLocationName(storedLocationName);
          }
        }
      }

      // 3. Check cart items for location
      if (
        !locationToSet &&
        items.length > 0 &&
        items[0]?.vendor_location_uuid
      ) {
        const locationUuidFromCart = items[0].vendor_location_uuid;
        locationToSet = locationsState.locations.find(
          (loc: any) => loc.vendor_location_uuid === locationUuidFromCart
        );
      }

      // 4. Default to first location if nothing else works
      if (!locationToSet) {
        locationToSet = locationsState.locations[0];
      }

      // 5. Set the determined location context
      if (locationToSet) {
        setLocationContext(locationToSet);
      }
    }
  }, [
    locationsState.locations,
    selectedLocationName,
    selectedLocationUuid,
    items,
    setLocationContext,
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        locationPanelRef.current &&
        !locationPanelRef.current.contains(target)
      ) {
        setShowLocationPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showLocationPanel) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [showLocationPanel]);

  const handleLocationSelect = (location: any) => {
    setLocationContext(location);
    setShowLocationPanel(false);
    setSearchTerm("");
    dispatch(clearCart());
  };

  const filteredLocations = locationsState.locations.filter((location: any) =>
    location.locality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Location Selector Button */}
      {locationsState.loading ? (
        ""
      ) : (
        <button
          className="relative flex items-center ml-4 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c59d5f]/60 rounded-xl transition-all duration-300 text-white text-sm font-medium focus:outline-none group overflow-hidden"
          onClick={() => setShowLocationPanel(true)}
          aria-label="Select Location">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <FiMapPin className="mr-2 text-[#c59d5f] group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10 group-hover:text-[#c59d5f] transition-colors duration-300">
            {selectedLocationName || "Select Location..."}
          </span>

          <div className="absolute inset-0 bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        </button>
      )}

      {/* Location Selection Panel */}
      {showLocationPanel && (
        <div
          className="fixed inset-0 z-50 flex"
          style={{ height: "100vh", width: "100vw" }}>
          <div
            ref={locationPanelRef}
            className="bg-black/95 backdrop-blur-xl w-[350px] shadow-2xl flex flex-col animate-fadeInLeft border-r border-white/10"
            style={{ height: "100vh", minWidth: 180 }}>
            <div className="relative flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-[#c59d5f]/10 to-transparent flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#c59d5f] rounded-full animate-pulse" />
                <span className="text-white font-bold text-lg">
                  Select Location
                </span>
              </div>
              <button
                onClick={() => setShowLocationPanel(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 group"
                aria-label="Close">
                <FiX className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="p-6 border-b border-white/10 flex-shrink-0">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 group-focus-within:text-[#c59d5f] transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 backdrop-blur-sm text-white pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#c59d5f]/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6"
              style={{ height: "calc(100vh - 200px)" }}>
              {locationsState.loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#c59d5f]/30 border-t-[#c59d5f]"></div>
                    <div className="absolute inset-0 rounded-full bg-[#c59d5f]/20 animate-pulse"></div>
                  </div>
                </div>
              ) : locationsState.error ? (
                <div className="text-red-400 p-4 text-center bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="mb-4">
                    Could not load locations. Please check your connection and
                    try again.
                  </p>
                  <button
                    onClick={handleRetryFetch}
                    className="px-4 py-2 bg-[#c59d5f]/20 text-[#c59d5f] rounded-lg hover:bg-[#c59d5f]/40 transition-colors duration-300">
                    Retry
                  </button>
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="text-gray-400 p-8 text-center">
                  <FiSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No locations found</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredLocations.map((location: any, index: any) => (
                    <li
                      key={location.vendor_location_uuid}
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}>
                      <button
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          selectedLocationName === location.locality
                            ? "bg-gradient-to-r from-[#c59d5f]/20 to-[#f4d03f]/20 border border-[#c59d5f]/30 text-[#c59d5f]"
                            : "text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                        }`}
                        onClick={() => handleLocationSelect(location)}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <div className="flex items-center space-x-3 relative z-10">
                          <div
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              selectedLocationName === location.locality
                                ? "bg-[#c59d5f] shadow-lg shadow-[#c59d5f]/50"
                                : "bg-gray-500 group-hover:bg-[#c59d5f]"
                            }`}
                          />
                          <span className="font-medium">
                            {location.locality}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div
            className="flex-1 bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowLocationPanel(false)}
            style={{ height: "100vh" }}
          />
        </div>
      )}
    </>
  );
}
