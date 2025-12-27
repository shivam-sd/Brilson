import React from 'react'
import HeroSection from './Pages/HomePage/HeroSection'
import OurSmartCard from './Pages/HomePage/OurSmartCard'
import PowerFullFeature from "./Pages/HomePage/PowerFullFeatures";
import ChooseYourCard from "./Pages/HomePage/ChooseYourCard";
import Testimonials from './Pages/HomePage/Testimonials';
import Networking from './Pages/HomePage/Networking';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      {/* <ChooseYourCard /> */}
      <PowerFullFeature />
      {/* <OurSmartCard /> */}
      <Testimonials />
      <Networking />
    </div>
  )
}

export default HomePage
