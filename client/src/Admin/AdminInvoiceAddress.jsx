import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {toast, Toaster} from "react-hot-toast";
import { replace, useNavigate } from "react-router-dom";


const AdminInvoiceAddress = () => {

const [FormData, setFormData] = useState({
    email:"",
    phone:"",
    address:""
});

const navigate = useNavigate();

const handleInputData = (e) => {
    setFormData({...FormData, [e.target.name]: e.target.value});
}


const handleSubmitData = async (e) => {
    e.preventDefault();
    try{

        if(FormData.phone.length !== 10){
            return toast.error("Phone Length must be 10 digit");
        }

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/invoice/address`, FormData);

        const data = res.data;
        const status = res.status;

        if(status == 200){
         toast.success(data?.message);
         setTimeout(() =>{ 
            navigate("/admindashboard", {replace:true});
         },1500)   
            // console.log(data);
        }


    }catch(err){
        toast.error(err);
        // console.log("Error From invoice Address Handler", err);
    }
}


useEffect(() => {
    const FetchInvoiceAddress = async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/invoice/address`);

            const data = res.data.InvoiceAddress;

            setFormData({
                email:data?.email,
                phone:data?.phone,
                address:data?.address
            });

            // console.log(data);

        }catch(err){
            console.log("error in fetching invoice address",err);
        }
    }

    FetchInvoiceAddress();

},[]);



  return (
    <div className="w-full h-full flex items-center justify-center">
        <Toaster position="top-right" />
      <div className="border border-gray-300/30 py-4 px-5 rounded-xl">
        <form className="lg:w-96 w-80 flex flex-col gap-4" onSubmit={handleSubmitData}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xl tracking-widest font-Playfair">Invoice Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter Invoice Email" className="border border-gray-300/40 rounded-md px-4 py-2 font-Playfair" value={FormData.email} onChange={handleInputData} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xl tracking-widest font-Playfair" >Invoice Phone:</label>
            <input type="number" id="phone" name="phone" placeholder="Enter Invoice Phone No."  className="border border-gray-300/40 rounded-md px-4 py-2 font-Playfair [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={FormData.phone} onChange={handleInputData} maxLength={10} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-xl tracking-widest font-Playfair">Invoice Full Address:</label>
            <textarea id="address" name="address" rows={4} cols={20} placeholder="Enter Invoice Full Address" className="border border-gray-300/40 rounded-md px-4 py-2 font-Playfair" value={FormData.address} onChange={handleInputData} />
          </div>

<button className="bg-blue-700 py-2 rounded-lg font-bold font-Playfair tracking-widest cursor-pointer ">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AdminInvoiceAddress;
