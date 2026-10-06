import Navbar from "../../components/common/Navbar";
import Hero from "../../components/home/Hero";

function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/70 via-white to-white">
      <Navbar />
      <Hero />
    </main>
  );
}

export default Home;
