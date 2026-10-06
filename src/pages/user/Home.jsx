import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import CTA from "../../components/home/CTA";
import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/home/HowItWorks";
import WhyQueueLess from "../../components/home/WhyQueueLess";

function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/70 via-white to-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhyQueueLess />
      <CTA />
      <Footer />
    </main>
  );
}

export default Home;
