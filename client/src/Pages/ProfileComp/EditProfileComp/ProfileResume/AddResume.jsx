import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const AddResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select resume file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("activationCode", id);
      formData.append("resume", file);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/profile/resume/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
          withCredentials: true,
        }
      );

      toast.success("Resume uploaded successfully ✨");
      navigate(`/profile/edit/${id}`, { replace: true });
      setFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br  p-6">

      {/* Background Glow Blobs */}
      {/* <div className="absolute w-96 h-96 bg-purple-500 opacity-30 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-indigo-500 opacity-30 blur-3xl rounded-full bottom-10 right-10"></div> */}

      {/* Glass Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl w-full max-w-lg p-8 text-white">

        <h2 className="text-3xl font-semibold text-center mb-6 tracking-wide">
          Upload Resume
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-white/30 rounded-2xl p-8 text-center hover:border-indigo-400 transition-all duration-300 cursor-pointer bg-white/5">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            <UploadCloud className="mx-auto mb-3 text-indigo-300" size={48} />

            <p className="font-medium text-lg">
              Drag & Drop or Click to Upload
            </p>
            <p className="text-sm text-gray-300 mt-1">
              PDF or DOCX (Max 5MB)
            </p>
          </div>

          {/* File Preview */}
          {file && (
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <FileText className="text-indigo-300" size={24} />
              <div className="flex-1">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-300">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              "Upload Resume"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResume;