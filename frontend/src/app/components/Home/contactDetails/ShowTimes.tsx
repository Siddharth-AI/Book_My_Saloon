import React from "react";
import clsx from "clsx";
import { IoTime } from "react-icons/io5";

// Define the shape of the business hours data
interface BusinessHours {
  today_hour: string;
  today_opening_status: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

// Update component props to accept the hours object
interface ShowTimesProps {
  ifSlot: boolean;
  hours: BusinessHours;
}

const dayOrder: (keyof Omit<
  BusinessHours,
  "today_hour" | "today_opening_status"
>)[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const ShowTimes: React.FC<ShowTimesProps> = ({ ifSlot, hours }) => {
  // Guard clause in case hours are not passed correctly
  if (!hours) {
    return null;
  }

  // Create a display-friendly array from the hours object
  const openingTimes = dayOrder.map((day) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    time: hours[day] || "Closed",
  }));

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div
      className={clsx("rounded-lg bg-white p-3 text-black shadow-lg", {
        "absolute lg:-right-[26rem] -right-11 top-0 lg:-top-8 z-50 ml-[-7rem] mt-4 w-[300px] sm:min-w-[400px]  border border-gray-200":
          ifSlot,
        "mt-[30px] w-[420px] z-50": !ifSlot,
      })}>
      <h6 className="mb-3 flex items-center gap-2 font-bold">
        <IoTime /> Opening times
      </h6>
      <ul className="m-0 list-none">
        {openingTimes.map(({ day, time }) => (
          <li
            key={day}
            className={clsx("flex justify-between py-1", {
              "font-bold text-[#c59d5f]": day === todayName,
              "font-normal": day !== todayName,
            })}>
            <span>{day}</span>
            <span>{time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowTimes;
