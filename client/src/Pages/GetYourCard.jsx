import React from 'react'
import ChooseYourCard from './HomePage/ChooseYourCard'
import SmartNFCSection from './SmartNFCSection'
import OurSmartCard from './HomePage/OurSmartCard'


const GetYourCard = () => {
  return (
    <div> 
      <SmartNFCSection />
      {/* <ChooseYourCard /> */}
      <OurSmartCard />
    </div>
  )
}

export default GetYourCard
