const ContactInfo = () => {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center my-5 px-2">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl flex flex-col md:flex-row h-full md:h-[50vh] p-4 md:p-8 gap-6 md:gap-8 border border-gray-700">
        {/* Map Section */}
        <div className="w-full md:w-1/2 h-64 md:h-full">
          <div className="overflow-hidden rounded-lg shadow-inner h-full border border-gray-600">
            <iframe
              title="New York Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24156.217476660066!2d-74.0120843!3d40.7130547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316c7c7b0b%3A0x8e0a0d0c0f0c0b0!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1683899234567!5m2!1sen!2sin"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              className="border-0 w-full h-full"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
        {/* Contact Info Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center h-full text-gray-800 mt-6 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 border-b border-gray-600 pb-2 tracking-wide uppercase">
            CONTACT INFO
          </h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Salons offer hair services like cuts, styling, and coloring, often
            with additional beauty treatments. They aim for a relaxing
            experience with skilled staff and professional products.
            Appointments are common, and hygiene is crucial. Prices and salon
            types vary.
          </p>
          <ul className="space-y-4 text-gray-700 text-sm md:text-base">
            <li className="flex items-center">
              <span className="material-icons text-xl mr-3 text-gray-500">
                location_on
              </span>
              <span>6 West Broadway, New York, NY 10012, USA</span>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-xl mr-3 text-gray-500">
                email
              </span>
              <span>curly@qodeinteractive.com</span>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-xl mr-3 text-gray-500">
                phone
              </span>
              <span>212 308 3838</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
