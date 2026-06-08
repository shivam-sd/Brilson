import React from "react";
import { FaWifi } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";

const tempDesign = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center font-bold text-white">
      <div className="py-15 rounded-xl bg-white border-black w-4xl h-auto shadow-2xl flex gap-6">
        <div className="w-[50%] rounded-lg border-r-2 border-black flex flex-col items-center ">
          <div className="flex items-center justify-center flex-col gap-8">
            <span className="text-black flex flex-col items-center justify-center ">
              <FaWifi size={110}/>
              <h4 className="uppercase text-3xl font-extrabold">nfc</h4>
            </span>
            <h1 className="text-black text-5xl font-extrabold">Brilson</h1>
            <p className="text-black text-xl tracking-widest">www.brilson.in</p>
          </div>
        </div>
        <div className="w-[50%]">
          <div className="flex items-center justify-center flex-col gap-5">
            <span className="text-black p-4 border-3 border-black rounded-lg">
              <BsQrCode size={200} />
            </span>
            <div className="flex items-center justify-center flex-col gap-3">
            <p className="text-black text-xl tracking-widest">Activation Key</p>
            <font className="text-black text-3xl font-extrabold rounded-lg border-2 border-black px-5 py-1">521-trb-4855-sfawdf</font>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default tempDesign;
