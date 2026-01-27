import React, { useEffect, useState } from 'react'
import {Outlet} from "react-router-dom";
import Header from './Header';
import Footer from "./Footer";
// import BrilsonLoader from './BrilsonLoader';
// import axios from 'axios';

const Master = () => {

//   const [loading, setloading] = useState(false);


//   useEffect(() => {
//     const LoadData = async () => {
//      try{
//        setloading(true);
//       const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/home/content`);

// if(res.data.success){
//   setloading(false);
// }
// }catch(err){
//   console.log("Error in Load Master Content",err);
// }finally{
//   setloading(false);
// }
// LoadData();
// }
// },[]);

  return (
    <div className=''>
      <Header />

      <main className="min-h-[95vh]">
       <Outlet /> 
      </main>

      <Footer />
    </div>
  )
}

export default Master
