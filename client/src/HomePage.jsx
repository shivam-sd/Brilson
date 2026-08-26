import React from 'react'
import HeroSection from './Pages/HomePage/HeroSection'
import OurSmartCard from './Pages/HomePage/OurSmartCard'
import PowerFullFeature from "./Pages/HomePage/PowerFullFeatures";
import ChooseYourCard from "./Pages/HomePage/ChooseYourCard";
import Testimonials from './Pages/HomePage/Testimonials';
import Networking from './Pages/HomePage/Networking';
import HowToUse from './Component/HowToUse';
import SmartCardBanner from './Pages/HomePage/SmartCardBanner';

const HomePage = () => {
  return ( 
    <div>
      <HeroSection />
      <PowerFullFeature />
      <HowToUse />
      <Testimonials />
      <Networking />
      <SmartCardBanner />
    </div>
  )
}

export default HomePage
