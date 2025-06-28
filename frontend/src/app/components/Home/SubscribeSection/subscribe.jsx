"use client";

export default function SubscribeSection() {
  return (
    <section className="bg-[#f7f7f8] py-16 flex items-center justify-center min-h-[50vh]">
      <div className="w-full max-w-4xl flex flex-col items-center px-4">
        {/* Small Top Text */}
        <p className="text-center text-xs tracking-widest text-gray-600 mb-3">
          DON'T MISS OUT
        </p>
        {/* Main Heading */}
        <h2 className="text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-black mb-8 leading-tight uppercase tracking-wide">
          LET YOUR HAIR SHINE WITH SPECIAL OFFERS AND DEALS! SUBSCRIBE!
        </h2>

        {/* Email Form */}
        <form className="w-full max-w-xl flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Email"
            className="flex-1 px-4 py-3 border border-gray-400 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:border-black bg-white text-gray-700 text-base"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-black text-white font-semibold rounded-md sm:rounded-r-md sm:rounded-l-none uppercase tracking-wider hover:bg-gray-900 transition w-full sm:w-auto">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}
