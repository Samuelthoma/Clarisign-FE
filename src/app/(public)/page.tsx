import Navbar from "./components/Navbar";
import "@/src/styles/globals.css";

import HomeSection from "./components/Home";
import FeaturesSection from "./components/Features";

import ContactSection from "./components/Contact";
import Footer from "./components/Footer";
import HowItWorkSection from "./components/HowItWork";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HomeSection />
      <FeaturesSection />
      <HowItWorkSection />
      <ContactSection />
      <Footer />
    </>
  );
}
