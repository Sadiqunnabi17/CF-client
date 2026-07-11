import Hero from "@/components/home/Hero";
import TopFundedCampaigns from "@/components/home/TopFundedCampaigns";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import ExploreByCategory from "@/components/home/ExploreByCategory";
import PlatformImpact from "@/components/home/PlatformImpact";

export default function Home() {
  return (
    <>
      <Hero />
      <TopFundedCampaigns />
      <HowItWorks />
      <ExploreByCategory />
      <PlatformImpact />
      <Testimonials />
    </>
  );
}