import React, { useEffect, useState } from 'react'
import {Outlet} from "react-router-dom";
import Header from './Header';
import Footer from "./Footer";
import ScrollToTop from '../utils/ScrollToTop';


const Master = () => {

  return (
    <div className=''>
      <Header />

      <main className="min-h-[95vh]">
        <ScrollToTop />
       <Outlet /> 
      </main>

      <Footer />
    </div>
  )
}

export default Master
