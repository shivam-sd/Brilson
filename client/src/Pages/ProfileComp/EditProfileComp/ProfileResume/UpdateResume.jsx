import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UploadCloud,
  FileText,
  Loader2,
  RefreshCcw,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const UpdateResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [existingResume, setExistingResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [resumeId, setResumeId] = useState(null);

  //  Fetch Existing Resume
  const fetchResume = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/profile/resume/get/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          withCredentials: true,
        }
      );

    
    //   console.log(res)
        setExistingResume(res?.data?.resume);
        setResumeId(res?.data?.resume._id);
    
    } catch (error) {
      toast.error("Failed to load resume");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, [id]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selected.type)) {
      toast.error("Only PDF or DOCX allowed");
      return;
    }

    setFile(selected);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select new resume file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/profile/resume/update/${resumeId}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          withCredentials: true,
        }
      );

      toast.success("Resume updated successfully ✨");
      navigate(`/profile/edit/${id}`, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-900">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden p-6">

      {/* Glow Effects */}
      {/* <div className="absolute w-96 h-96 bg-indigo-500 opacity-30 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-500 opacity-30 blur-3xl rounded-full bottom-10 right-10"></div> */}

      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl w-full max-w-xl p-8 text-white">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <RefreshCcw className="text-indigo-300" size={26} />
          <h2 className="text-3xl font-semibold">
            Update Resume
          </h2>
        </div>

        {/* Existing Resume */}
        {existingResume && (
  <div className="mb-6 bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <FileText className="text-indigo-300" />
      <div>
        <p className="font-medium">
          {existingResume.name}
        </p>
        {/* <p className="text-xs text-gray-300 break-all">
          {existingResume.resume}
        </p> */}
      </div>
    </div>

    <a
      href={existingResume.resume}
      target="_blank"
      download={existingResume.name}
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm transition"
    >
      <Download size={16} />
      View
    </a>
  </div>
)}

        {/* Replace Form */}
        <form onSubmit={handleUpdate} className="space-y-6">

          <div className="relative border-2 border-dashed border-white/30 rounded-2xl p-8 text-center hover:border-indigo-400 transition-all duration-300 cursor-pointer bg-white/5">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            <UploadCloud className="mx-auto mb-3 text-indigo-300" size={48} />

            <p className="font-medium text-lg">
              Replace with New Resume
            </p>
            <p className="text-sm text-gray-300 mt-1">
              PDF or DOCX (Max 5MB)
            </p>
          </div>

          {/* New File Preview */}
          {file && (
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <FileText className="text-indigo-300" />
              <div className="flex-1">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-300">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Updating...
              </>
            ) : (
              "Update Resume"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateResume;