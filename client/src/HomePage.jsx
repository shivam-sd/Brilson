import React from 'react'
import HeroSection from './Pages/HomePage/HeroSection'
import OurSmartCard from './Pages/HomePage/OurSmartCard'
import PowerFullFeature from "./Pages/HomePage/PowerFullFeatures";
import ChooseYourCard from "./Pages/HomePage/ChooseYourCard";
import Testimonials from './Pages/HomePage/Testimonials';
import Networking from './Pages/HomePage/Networking';
import HowToUse from './Component/HowToUse';
import SmartCardBanner from './Pages/HomePage/SmartCardBanner';
import NfcCardBanner from './Pages/HomePage/NfcCardBanner';
import ParkingTagBanner from './Pages/HomePage/ParkingTagBanner';

const HomePage = () => {
  return (
    <div>
      <SmartCardBanner />
      {/* <HeroSection /> */}
      <PowerFullFeature />
      <HowToUse />
      <Testimonials />
      <Networking />
      <NfcCardBanner />
      <ParkingTagBanner />
    </div>
  )
}

export default HomePage
