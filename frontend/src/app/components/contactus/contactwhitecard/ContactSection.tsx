// "use client";

// import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

// export default function ContactSection() {
//     return (
//         <div className="w-full min-h-screen flex items-center justify-center bg-white py-12">
//             <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
//                 {/* Contact Form */}
//                 <form
//                     className="flex flex-col gap-6"
//                     onSubmit={e => e.preventDefault()}
//                 >
//                     <input
//                         type="text"
//                         placeholder="Name"
//                         className="border border-black/70 px-6 py-4 text-black placeholder-gray-400 bg-transparent outline-none transition-all duration-200
//               focus:border-blue-400 focus:shadow-lg focus:bg-blue-50/40 hover:border-blue-300"
//                     />
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         className="border border-black/70 px-6 py-4 text-black placeholder-gray-400 bg-transparent outline-none transition-all duration-200
//               focus:border-blue-400 focus:shadow-lg focus:bg-blue-50/40 hover:border-blue-300"
//                     />
//                     <textarea
//                         placeholder="Write a message..."
//                         rows={5}
//                         className="border border-black/70 px-6 py-4 text-black placeholder-gray-400 bg-transparent outline-none transition-all duration-200
//               focus:border-blue-400 focus:shadow-lg focus:bg-blue-50/40 hover:border-blue-300 resize-none"
//                     />
//                     <button
//                         type="submit"
//                         className="w-40 mt-2 bg-black text-white font-semibold tracking-widest py-4 transition-all duration-200
//               hover:bg-blue-600 hover:scale-105 focus:bg-blue-700 focus:scale-105 active:scale-100"
//                     >
//                         SEND
//                     </button>
//                 </form>

//                 {/* Contact Info */}
//                 <div className="flex flex-col justify-center">
//                     <h2 className="text-3xl font-extrabold mb-4">CONTACT INFO</h2>
//                     <p className="text-gray-500 mb-6">
//                         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip commodo.
//                     </p>
//                     <ul className="space-y-5">
//                         <li className="flex items-start gap-4 group transition-all duration-200 hover:translate-x-2">
//                             <span className="mt-1 text-blue-600 transition-colors duration-200 group-hover:text-black">
//                                 <FaMapMarkerAlt size={20} />
//                             </span>
//                             <span className="text-gray-700 group-hover:text-black transition-colors duration-200">
//                                 6 West Broadway, New York,<br />NY 10012, USA
//                             </span>
//                         </li>
//                         <li className="flex items-center gap-4 group transition-all duration-200 hover:translate-x-2">
//                             <span className="text-blue-600 transition-colors duration-200 group-hover:text-black">
//                                 <FaEnvelope size={20} />
//                             </span>
//                             <span className="text-gray-700 group-hover:text-black transition-colors duration-200">
//                                 info@example.com
//                             </span>
//                         </li>
//                         <li className="flex items-center gap-4 group transition-all duration-200 hover:translate-x-2">
//                             <span className="text-blue-600 transition-colors duration-200 group-hover:text-black">
//                                 <FaPhone size={20} />
//                             </span>
//                             <span className="text-gray-700 group-hover:text-black transition-colors duration-200">
//                                 212 308 3838
//                             </span>
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactSection() {
  const animationVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-white py-10">
      <motion.div
        className="w-full flex justify-center items-center py-12"
        variants={animationVariants}
        initial="initial"
        animate="animate">
        <div className="w-[75vw] max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}>
            <motion.input
              type="text"
              placeholder="Name"
              className="border border-black px-6 py-4 text-black placeholder-gray-400 bg-transparent outline-none transition-all duration-300
              focus:border-[#c59d5f] hover:shadow-md"
              whileFocus={{ scale: 1.03 }}
            />
            <motion.input
              type="email"
              placeholder="Email"
              className="border border-black px-6 py-4 text-black placeholder-gray-400 bg-transparent outline-none transition-all duration-300
              focus:border-[#c59d5f] hover:shadow-md"
              whileFocus={{ scale: 1.03 }}
            />
            <motion.textarea
              placeholder="Write a message..."
              rows={5}
              className="border border-black px-6 py-4 text-black placeholder-gray-400 bg-transparent outline-none transition-all duration-300
              focus:border-[#c59d5f] hover:shadow-md resize-none"
              whileFocus={{ scale: 1.03 }}
            />
            <motion.button
              type="submit"
              className="w-48 bg-black text-white font-semibold tracking-widest py-4 transition-all duration-300
              hover:bg-[#c59d5f] hover:scale-105 active:scale-100"
              style={{ letterSpacing: "0.15em" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}>
              SEND
            </motion.button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col">
            <motion.h2
              className="text-3xl font-extrabold mb-4 font-sans"
              whileHover={{
                scale: 1.05,
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              }}>
              CONTACT INFO
            </motion.h2>
            <motion.p
              className="text-gray-500 mb-6 font-sans"
              whileHover={{ x: 5, transition: { duration: 0.3 } }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip commodo.
            </motion.p>
            <ul className="space-y-6">
              <motion.li
                className="flex items-start gap-4"
                whileHover={{ x: 5, transition: { duration: 0.3 } }}>
                <span className="mt-1 text-black">
                  <FaMapMarkerAlt size={20} />
                </span>
                <span className="text-gray-700 font-sans">
                  6 West Broadway, New York,
                  <br />
                  NY 10012, USA
                </span>
              </motion.li>
              <motion.li
                className="flex items-center gap-4"
                whileHover={{ x: 5, transition: { duration: 0.3 } }}>
                <span className="text-black">
                  <FaEnvelope size={20} />
                </span>
                <span className="text-gray-700 font-sans">
                  info@example.com
                </span>
              </motion.li>
              <motion.li
                className="flex items-center gap-4"
                whileHover={{ x: 5, transition: { duration: 0.3 } }}>
                <span className="text-black">
                  <FaPhone size={20} />
                </span>
                <span className="text-gray-700 font-sans">212 308 3838</span>
              </motion.li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
