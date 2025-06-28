// "use client";

// export default function ContactForm() {
//     return (
//         <div className="w-full bg-[#181818] py-10 flex justify-center">
//             <form
//                 className="w-full max-w-5xl flex gap-6 items-center"
//                 onSubmit={e => e.preventDefault()}
//             >
//                 <input
//                     type="text"
//                     placeholder="First Name"
//                     className="flex-1 bg-transparent border border-white text-white placeholder-gray-400 px-6 py-4 outline-none focus:border-gray-300 transition-all"
//                 />
//                 <input
//                     type="email"
//                     placeholder="E-mail"
//                     className="flex-1 bg-transparent border border-white text-white placeholder-gray-400 px-6 py-4 outline-none focus:border-gray-300 transition-all"
//                 />
//                 <input
//                     type="text"
//                     placeholder="Company"
//                     className="flex-1 bg-transparent border border-white text-white placeholder-gray-400 px-6 py-4 outline-none focus:border-gray-300 transition-all"
//                 />
//                 <button
//                     type="submit"
//                     className="bg-white text-black font-bold tracking-widest px-10 py-4 rounded-none transition-all hover:bg-gray-100"
//                     style={{ letterSpacing: "0.15em" }}
//                 >
//                     SEND
//                 </button>
//             </form>
//         </div>
//     );
// }
"use client";

export default function ContactForm() {
  return (
    <div className="w-full bg-[#181818] py-10 flex justify-center">
      <form
        className="w-full max-w-5xl flex flex-col lg:flex-row gap-4 md:gap-6 items-stretch lg:items-center px-4"
        onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="First Name"
          className="flex-1 bg-transparent border border-white/70 text-white placeholder-gray-500 px-6 py-4 outline-none transition-all duration-200
            focus:border-[#c59d5f] focus:bg-white/5 focus:shadow-[0_2px_16px_0_rgba(255,255,255,0.10)]
            hover:border-[#c59d5f] hover:bg-white/5
            placeholder:transition-colors placeholder:duration-200"
        />
        <input
          type="email"
          placeholder="E-mail"
          className="flex-1 bg-transparent border border-white/70 text-white placeholder-gray-500 px-6 py-4 outline-none transition-all duration-200
            focus:border-[#c59d5f] focus:bg-white/5 focus:shadow-[0_2px_16px_0_rgba(255,255,255,0.10)]
            hover:border-[#c59d5f] hover:bg-white/5
            placeholder:transition-colors placeholder:duration-200"
        />
        <input
          type="text"
          placeholder="Company"
          className="flex-1 bg-transparent border border-white/70 text-white placeholder-gray-500 px-6 py-4 outline-none transition-all duration-200
            focus:border-[#c59d5f] focus:bg-white/5 focus:shadow-[0_2px_16px_0_rgba(255,255,255,0.10)]
            hover:border-[#c59d5f] hover:bg-white/5
            placeholder:transition-colors placeholder:duration-200"
        />
        <button
          type="submit"
          className="bg-white text-black font-extrabold uppercase tracking-widest px-10 py-4 rounded-none transition-all duration-200
            hover:bg-[#c59d5f] hover:text-[#181818] hover:scale-105 hover:shadow-lg
            focus:bg-[#c59d5f] focus:text-[#181818] focus:scale-105 focus:shadow-lg
            active:scale-100 w-full md:w-auto"
          style={{ letterSpacing: "0.15em" }}>
          SEND
        </button>
      </form>
    </div>
  );
}
