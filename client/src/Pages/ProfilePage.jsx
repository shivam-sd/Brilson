import React, { useEffect, useState } from "react";
import {
  FiMail,
  FiSmartphone,
  FiGlobe,
  FiMapPin,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiCopy,
  FiCheck,
  FiChevronRight,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ProfilePage = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [id, setId] = useState(null);
  const [showEditButton, setShowEditButton] = useState();
  const [loading, setLoading] = useState(true);

  const copyEmail = () => {
    if (!profile?.email) return;
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    toast.success("Email copied");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${slug}`
        );
        setProfile(res.data.profile);
        // console.log("-------",res.data.card);
        setShowEditButton(res.data.card._id);
        setId(res.data.card.slug);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Profile not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }


  const socials = [
    { key: "linkedin", icon: <FiLinkedin />, url: profile.linkedin },
    { key: "twitter", icon: <FiTwitter />, url: profile.twitter },
    { key: "instagram", icon: <FiInstagram />, url: profile.instagram },
  ].filter((s) => s.url);

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
            >
         {
          showEditButton ? <>
           <Link to={`/profile/edit/${id}`} className="text-right bg-blue-800 px-2 py-2 rounded-2xl cursor-pointer">Edit Profile</Link>
          </>: <>""</>
         }
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8">

              {/* HEADER */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                  {profile.name}
                </div>

                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  {profile.bio && (
                      <p className="text-gray-300 italic mt-2">
                      “{profile.bio}”
                    </p>
                  )}
                </div>
              </div>

              {/* ABOUT */}
              {profile.about && (
                  <div className="mt-10">
                  <h3 className="text-xl font-bold mb-3">About</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {profile.about}
                  </p>
                </div>
              )}

              {/* CONTACT */}
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiMail className="text-cyan-400" /> Contact
                  </h4>

                  {profile.email && (
                      <ContactRow icon={<FiMail />} text={profile.email}>
                      <button
                        onClick={copyEmail}
                        className="ml-auto p-2 hover:bg-gray-700 rounded-lg"
                        >
                        {copied ? (
                            <FiCheck className="text-green-400" />
                        ) : (
                            <FiCopy />
                        )}
                      </button>
                    </ContactRow>
                  )}

                  {profile.phone && (
                      <ContactRow icon={<FiSmartphone />} text={profile.phone} />
                    )}

                  {profile.website && (
                      <ContactRow icon={<FiGlobe />} text={profile.website} />
                    )}

                  {profile.city && (
                    <ContactRow icon={<FiMapPin />} text={profile.city} />
                  )}
                </div>

                {/* SOCIAL */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiUsers className="text-cyan-400" /> Social
                  </h4>

                  {socials.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No social links added
                    </p>
                  )}

                  {socials.map((s) => (
                    <motion.a
                      key={s.key}
                      whileHover={{ x: 6 }}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 mb-3 bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-500"
                    >
                      <div className="flex items-center gap-3 capitalize">
                        {s.icon}
                        {s.key}
                      </div>
                      <FiChevronRight />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Digital Card</h3>
            <div className="p-4 bg-white rounded-xl inline-block">
              <div className="w-32 h-32 bg-black text-white flex items-center justify-center font-bold">
                QR
              </div>
            </div>
          </div>
        </div>

        {/* <div className="text-center mt-12 text-gray-500 text-sm">
          Powered by <span className="text-cyan-400 font-semibold">Brilson</span>
        </div> */}
      </div>
    </>
  );
};

const ContactRow = ({ icon, text, children }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/60">
    <div className="p-2 bg-gray-800 rounded-lg">{icon}</div>
    <span className="text-gray-300 break-all">{text}</span>
    {children}
  </div>
);

export default ProfilePage;
