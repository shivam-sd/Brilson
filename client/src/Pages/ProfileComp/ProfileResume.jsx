import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { useParams } from "react-router-dom";

const ProfileResume = ({activationCode}) => {
  const [resume, setResume] = useState(null);

  const fetchResume = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/profile/resume/get/${activationCode}`
      );

      setResume(res?.data?.resume);
    } catch (error) {
      console.log("Resume not found");
    }
  };

  useEffect(() => {
    fetchResume();
  }, [activationCode]);

  if (!resume) return null;

  return (
    <div className="w-full max-w-7xl">

      {/* Main Card */}
      <div className="border border-slate-700/50 
                      rounded-2xl 
                      p-5 
                      shadow-xl 
                      hover:shadow-2xl 
                      transition-all duration-300">

        {/* Title */}
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Download size={18} className="text-yellow-400" />
          Resume / CV
        </h3>

        {/* Download Button */}
        <a
          href={resume.resume}
          download={resume.name}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 
                     bg-[#1e293b] hover:bg-[#334155] 
                     border border-slate-600/40
                     text-slate-200 
                     py-3 
                     rounded-xl 
                     transition-all duration-300 
                     text-sm font-medium"
        >
          <Download size={16} className="text-yellow-400" />
          Download Resume/CV
        </a>
      </div>
    </div>
  );
};

export default ProfileResume;