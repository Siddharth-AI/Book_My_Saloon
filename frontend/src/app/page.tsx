// import ContactForm from "./components/contactus/user-contact/ContactForm";
import MultiImageCarousel from "./components/Home/Carousel/carousel";
import HairGrid from "./components/Home/GridBox/gridboxes";
import ParallaxImage from "./components/Home/parallex/parallex";
import ImageGrid from "./components/Home/imagegrid/imagegrid";
import Impress from "./components/Home/readyToImpress/impress";
import Subscribe from "./components/Home/SubscribeSection/subscribe";
import TestimonialsCarousel from "./components/Home/testimonials/Testimonilas";
import ContactCard from "./components/Home/contactCard/ContactCard";
import ContactDetails from "./components/Home/contactDetails/ContactDetails";

export default function Home() {
  return (
    <>
      <title>Belle Femme - The Hair Salon</title>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <div style={{ backgroundColor: "black" }}>
        <MultiImageCarousel />
        <div className="bg-white/10">
          {/* <ContactForm /> */}
          <ContactDetails bookButton={true} />
        </div>
        <HairGrid />
        <ParallaxImage />
        <ImageGrid />
        <Impress />
        <Subscribe />
        <TestimonialsCarousel />
        <ContactCard />
      </div>
    </>
  );
}
