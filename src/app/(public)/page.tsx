import Navbar from "./components/Navbar";
import "../../styles/globals.css";
import ContactSection from "./components/Contact";
import About from "./components/About";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <About />
      <ContactSection />
      <Footer />
    </>
  );
}
