import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";



const EditProfile = () => {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Id, setId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    about: "",
    city: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  });


     // FETCH EXISTING PROFILE

  useEffect(() => {
    const getProfileInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/card/${id}`,
          { withCredentials: true }
        );
console.log(res.data.card._id)
setId(res.data.card._id);
const profile = res.data.card.profile;

setForm({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    about: profile?.about || "",
    city: profile?.city || "",
    website: profile?.website || "",
    linkedin: profile?.linkedin || "",
    twitter: profile?.twitter || "",
    instagram: profile?.instagram || "",
});

} catch (err) {
    console.error(err);
        toast.error("Failed to load profile data");
    }
};

getProfileInfo();
}, [id]);


// HANDLE INPUT CHANGE

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};


// UPDATE PROFILE

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.phone) {
        toast.error("Name, Email and Phone are required");
        return;
    }
    // console.log(Id)

    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/card/${Id}/edit`,
        form,
        { withCredentials: true }
      );

      toast.success("Profile updated successfully");

      setTimeout(() => {
        navigate(`/profile/${id}`)
      },800)

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#05070D] to-[#0B0F1A] flex items-center justify-center px-4 py-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-[#111827] border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          <h1 className="text-3xl font-bold text-white text-center">
            Edit Your Profile
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="City" name="city" value={form.city} onChange={handleChange} />
            <Input label="Website" name="website" value={form.website} onChange={handleChange} />
            <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} />
            <Input label="Twitter" name="twitter" value={form.twitter} onChange={handleChange} />
            <Input label="Instagram" name="instagram" value={form.instagram} onChange={handleChange} />
          </div>

          <div className="mt-6">
            <Textarea label="Bio" name="bio" value={form.bio} onChange={handleChange} rows={2} />
          </div>

          <div className="mt-6">
            <Textarea label="About" name="about" value={form.about} onChange={handleChange} rows={4} />
          </div>

          <motion.button
            disabled={loading}
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

/* ================================
   🔹 REUSABLE COMPONENTS
================================= */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400 mb-2 block">{label}</label>
    <input {...props} className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400 mb-2 block">{label}</label>
    <textarea {...props} className="w-full px-4 py-3 rounded-xl bg-[#0B1220] border border-gray-700 text-white resize-none" />
  </div>
);

export default EditProfile;
