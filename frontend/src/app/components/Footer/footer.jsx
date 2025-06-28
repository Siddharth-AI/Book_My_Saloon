import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-100 relative overflow-hidden">
      {/* Optional: Subtle gradient overlay for extra depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 opacity-80" />
      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 py-14 px-6 z-10">
        {/* Logo & About */}
        <div className="flex-1 min-w-[220px]">
          <div className="mb-2">
            <h1 className="text-3xl font-extrabold tracking-wide text-white">
              Belle Femme
            </h1>
            <p className="text-neutral-400 italic mt-1 max-w-xs">
              "Transforming Beauty, One Strand at a Time"
            </p>
          </div>
          <p className="text-neutral-400 mb-7 text-sm leading-relaxed">
            Experience the art of beauty and relaxation at Belle Femme. Our team
            delivers exceptional salon services in a serene, elegant atmosphere.
          </p>
          <div className="flex items-center gap-4 text-2xl">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-neutral-400 transition"
            >
              <FaFacebookF />
            </a>
            <span className="text-neutral-600">|</span>
            <a
              href="#"
              aria-label="Close"
              className="hover:text-neutral-400 transition"
            >
              <FiX />
            </a>
            <span className="text-neutral-600">|</span>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-neutral-400 transition"
            >
              <FaInstagram />
            </a>
            <span className="text-neutral-600">|</span>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-neutral-400 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="flex-1 min-w-[180px]">
          <h3 className="font-semibold text-lg mb-4 tracking-wide text-neutral-200">
            CONTACT
          </h3>
          <p className="mb-2 text-neutral-400">
            6 West Broadway, New York, NY 10012, USA
          </p>
          <p className="mb-2 text-neutral-400">info@bellefemme.com</p>
          <p className="mb-2 text-neutral-400">212-308-3838</p>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-[180px]">
          <h3 className="font-semibold text-lg mb-4 tracking-wide text-neutral-200">
            INFO
          </h3>
          <div className="flex justify-between text-neutral-400 text-sm mb-1">
            <span>Working Days</span>
            <span>9AM - 9PM</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-sm mb-1">
            <span>Saturday</span>
            <span>10AM - 8PM</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-sm">
            <span>Sunday</span>
            <span>Closed</span>
          </div>
        </div>

        {/* Maps */}
        <div className="flex-1 min-w-[280px] max-w-[400px]">
          <h3 className="font-semibold text-lg mb-4 tracking-wide text-neutral-200">
            MAPS
          </h3>
          <div
            className="w-full rounded-md shadow-md overflow-hidden"
            style={{ aspectRatio: "16/10", minHeight: 200 }}
          >
            <iframe
              title="Belle Femme Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.567749632756!2d-74.0120843!3d40.7130547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316c7c7b0b%3A0x8e0a0d0c0f0c0b0!2s6%20West%20Broadway%2C%20New%20York%2C%20NY%2010012!5e0!3m2!1sen!2sus!4v1683899234567!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{
                border: 0,
                width: "100%",
                height: "100%",
                minHeight: "200px",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="relative text-center text-neutral-500 text-xs mt-6 border-t border-neutral-800 pt-6 z-10">
        © {new Date().getFullYear()} Belle Femme, All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
