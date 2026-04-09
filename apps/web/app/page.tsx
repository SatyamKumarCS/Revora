import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FeatureTextReveal from "../components/landing/FeatureTextReveal";
import DashboardPreview from "../components/landing/DashboardPreview";
// import FeaturesBento from "../components/landing/FeaturesBento";
import Integrations from "../components/landing/Integrations";
import ProcessSteps from "../components/landing/ProcessSteps";
import Milestones from "../components/landing/Milestones";
import Pricing from "../components/landing/Pricing";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";
import LaunchModal from "../components/landing/LaunchModal";
import AuthModal from "../components/AuthModal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureTextReveal />
        <DashboardPreview />
        {/* <FeaturesBento /> */}
        <Integrations />
        <ProcessSteps />
        <Milestones />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <LaunchModal />
      <AuthModal />
    </>
  );
}
