export default function OurStory() {
  return (
    <div className="py-14 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center md:items-start relative">
        {/* Scripted "History" text */}
        <div className="w-full md:w-1/2 relative flex justify-center md:justify-start min-h-[120px] md:min-h-0">
          <div
            className="
              absolute md:static
              left-1/2 md:left-0
              -translate-x-1/2 md:translate-x-0
              top-0 md:top-6
              text-[3rem] xs:text-[4.5rem] sm:text-[6rem] md:text-[9rem]
              font-light text-[#c59d5f] italic
              select-none pointer-events-none
              leading-none
              whitespace-nowrap
              opacity-40
            "
            style={{ fontFamily: "Quentinregular, cursive" }}>
            History
          </div>
        </div>
        <div className="w-full md:w-1/2 sm:mt-10 md:mt-0">
          <p className="uppercase text-lg sm:text-xl md:text-2xl mb-4 md:mb-6 font-bold">
            2011. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed{" "}
          </p>
          <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
            Lorem ipsum dolor sit, adipiscing elit, sed do eiusmod tempor ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </p>
          <p className="text-gray-600 text-sm md:text-base">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum dolore magna aliqua ad ipsum.
          </p>
        </div>
      </div>
    </div>
  );
}
