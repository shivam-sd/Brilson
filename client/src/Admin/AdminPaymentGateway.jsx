import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCreditCard, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import { toast } from "react-toastify";

const gateways = [
  {
    name: "razorpay",
    label: "Razorpay",
    color: "from-blue-500 to-indigo-600"
  },
  {
    name: "cashfree",
    label: "Cashfree",
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "payu",
    label: "PayU",
    color: "from-purple-500 to-pink-600"
  }
];

const AdminPaymentGateway = () => {

  const [activeGateway,setActiveGateway] = useState(null);
  const [loading,setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_BASE_URL;

  const fetchGateway = async()=>{

    try{

      const res = await axios.get(`${baseURL}/api/payment/isactive/gateway`);
      setActiveGateway(res.data.gateway);

    }catch(err){

      console.log(err);

    }

  }

  useEffect(()=>{
    fetchGateway();
  },[])


  const updateGateway = async(gateway)=>{

    try{

      setLoading(true);

      const res = await axios.put(
        `${baseURL}/api/payment/isactive/gateway/update`,
        {
          gateway,
          isActive:true
        }
      );

      if(res.data.success){

        setActiveGateway(gateway);
        toast.success(`${gateway} activated`);

      }

    }catch(err){

      toast.error("Gateway update failed");

    }finally{

      setLoading(false);

    }

  }


  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-10">

      <h2 className="text-4xl mt-4 font-bold mb-10 text-center">
        Payment Gateway Settings
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {gateways.map((item)=>{

          const isActive = activeGateway === item.name;

          return(

            <div
              key={item.name}
              className={`p-6 rounded-2xl shadow-xl border border-gray-700 bg-gradient-to-br ${item.color} relative`}
            >

              <div className="flex items-center gap-3 mb-6">

                <FaCreditCard size={28} />

                <h2 className="text-2xl font-bold">
                  {item.label}
                </h2>

              </div>

              <p className="text-sm opacity-90 mb-6">
                Enable this gateway for checkout payments.
              </p>

              {isActive && (

                <span className="absolute top-4 right-4 bg-black/40 px-3 py-1 rounded-full text-sm">
                  Active
                </span>

              )}

              <button
                onClick={()=>updateGateway(item.name)}
                disabled={loading || isActive}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer
                ${isActive
                ? "bg-gray-800 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"}
                `}
              >

                {isActive
                  ? <>
                      <FaToggleOn/> Active
                    </>
                  : <>
                      <FaToggleOff/> Enable
                    </>
                }

              </button>

            </div>

          )

        })}

      </div>

    </div>

  );

}

export default AdminPaymentGateway;