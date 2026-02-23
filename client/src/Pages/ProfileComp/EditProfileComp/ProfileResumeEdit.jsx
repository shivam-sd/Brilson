import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Download,
  UploadCloud,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

const ProfileResumeEdit = () => {
  const { id } = useParams();
  const activationCode = id;
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/profile/resume/get/${activationCode}`
      );
      setResume(res?.data?.resume);
    } catch (error) {
      toast.error("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, [id]);

  return (
    <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center">

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10 text-white">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Resume Management
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            Upload, view, or update your professional resume
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-white" size={40} />
          </div>
        ) : resume ? (
          /* Resume Exists UI */
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            {/* Resume Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-600/20 rounded-xl">
                <FileText className="text-indigo-300" size={28} />
              </div>

              <div>
                <p className="font-semibold text-base sm:text-lg break-all">
                  {resume.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  PDF / DOCX Resume File
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

              {/* View */}
              {/* <a
                href={resume.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-sm font-medium transition w-full sm:w-auto"
              >
                <Eye size={16} />
                View
              </a> */}

              {/* Download */}
              <a
                href={resume.resume}
                download={resume.name}
                target="_blank"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-sm font-medium transition w-full sm:w-auto"
              >
                <Download size={16} />
                Download
              </a>

              {/* Update */}
              <button
                onClick={() =>
                  navigate(`/profile/resume/update/${id}`)
                }
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition w-full sm:w-auto cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        ) : (
          /* No Resume UI */
          <div className="text-center py-14 sm:py-20 border-2 border-dashed border-white/30 rounded-2xl">

            <UploadCloud
              className="mx-auto text-indigo-400 mb-4"
              size={50}
            />

            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              No Resume Uploaded
            </h3>

            <p className="text-gray-300 text-sm mb-6 px-4">
              Upload your resume so visitors can view or download it from your profile.
            </p>

            <Link
              to={`/profile/resume/add/${id}`}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl font-medium transition shadow-lg"
            >
              Add Resume
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileResumeEdit;