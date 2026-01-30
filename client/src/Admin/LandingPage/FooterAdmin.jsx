import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Save,
  Plus,
  Trash2,
  Globe,
  Users,
  Headphones,
  Link as LinkIcon,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Linkedin,
  FileText,
  Building,
  Shield,
  Sparkles
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const emptyLink = { label: "", link: "" };

const FooterAdmin = () => {
  const navigate = useNavigate();
  const [footer, setFooter] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  /*  GET FOOTER  */
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/admin/footer`)
      .then((res) => {
        setFooter(res.data.data);
      })
      .catch(() => {
        toast.error("Failed to load footer");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /*  UPDATE FOOTER  */
  const handleUpdate = async () => {
    try {
      setSaving(true);
      await axios.put(`${BASE_URL}/api/admin/footer/update`, footer);
      toast.success("Footer updated successfully");
      setTimeout(() => {
        navigate("/admindashboard/landing/page/content");
      }, 1500);
    } catch {
      toast.error(" Update failed");
    } finally {
      setSaving(false);
    }
  };

  /*  ARRAY HELPERS  */
  const addItem = (key) =>
    setFooter({ ...footer, [key]: [...footer[key], { ...emptyLink }] });

  const updateItem = (key, index, field, value) => {
    const updated = [...footer[key]];
    updated[index][field] = value;
    setFooter({ ...footer, [key]: updated });
  };

  const removeItem = (key, index) => {
    const updated = footer[key].filter((_, i) => i !== index);
    setFooter({ ...footer, [key]: updated });
  };

  const updateSocial = (key, value) =>
    setFooter({
      ...footer,
      socialLinks: { ...footer.socialLinks, [key]: value },
    });

  const updateContact = (key, value) =>
    setFooter({
      ...footer,
      contact: { ...footer.contact, [key]: value },
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading footer...</p>
        </div>
      </div>
    );
  }

  if (!footer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <p className="text-white text-lg">Failed to load footer data</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
              <Globe className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-white to-teal-400 bg-clip-text text-transparent">
                Footer
              </h2>
             
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                  <FileText className="text-emerald-400" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Description</h2>
              </div>
              <textarea
                value={footer.description || ""}
                onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500/50 focus:border-transparent transition resize-none"
                placeholder="Company footer description..."
              />
            </div>

            {/* Social Links */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                  <Users className="text-blue-400" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Social Links</h2>
              </div>
              <div className="space-y-4">
                <Input 
                  icon={<Twitter className="text-blue-400" size={18} />} 
                  value={footer.socialLinks?.twitter || ""} 
                  onChange={(v) => updateSocial("twitter", v)} 
                  placeholder="Twitter URL" 
                />
                <Input 
                  icon={<Instagram className="text-pink-400" size={18} />} 
                  value={footer.socialLinks?.instagram || ""} 
                  onChange={(v) => updateSocial("instagram", v)} 
                  placeholder="Instagram URL" 
                />
                <Input 
                  icon={<Linkedin className="text-blue-500" size={18} />} 
                  value={footer.socialLinks?.linkedin || ""} 
                  onChange={(v) => updateSocial("linkedin", v)} 
                  placeholder="LinkedIn URL" 
                />
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <Mail className="text-purple-400" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Contact Information</h2>
              </div>
              <div className="space-y-4">
                <Input 
                  icon={<Mail className="text-purple-400" size={18} />} 
                  value={footer.contact?.email || ""} 
                  onChange={(v) => updateContact("email", v)} 
                  placeholder="Email" 
                />
                <Input 
                  icon={<Phone className="text-pink-400" size={18} />} 
                  value={footer.contact?.phone || ""} 
                  onChange={(v) => updateContact("phone", v)} 
                  placeholder="Phone" 
                />
                <Input 
                  icon={<MapPin className="text-rose-400" size={18} />} 
                  value={footer.contact?.address || ""} 
                  onChange={(v) => updateContact("address", v)} 
                  placeholder="Address" 
                />
                <Input 
                  icon={<MapPin className="text-rose-400" size={18} />} 
                  value={footer.contact?.Link || ""} 
                  onChange={(v) => updateContact("Link", v)} 
                  placeholder="Text" 
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ArrayEditor 
              title="Products" 
              icon={<Building className="text-amber-400" size={20} />}
              color="from-amber-500/10 to-orange-500/10"
              items={footer.products} 
              onAdd={() => addItem("products")} 
              onRemove={(i) => removeItem("products", i)} 
              onChange={(i, f, v) => updateItem("products", i, f, v)} 
            />
            
            <ArrayEditor 
              title="Company" 
              icon={<Globe className="text-blue-400" size={20} />}
              color="from-blue-500/10 to-cyan-500/10"
              items={footer.company} 
              onAdd={() => addItem("company")} 
              onRemove={(i) => removeItem("company", i)} 
              onChange={(i, f, v) => updateItem("company", i, f, v)} 
            />
            
            {/* <ArrayEditor 
              title="Support" 
              icon={<Headphones className="text-emerald-400" size={20} />}
              color="from-emerald-500/10 to-green-500/10"
              items={footer.support} 
              onAdd={() => addItem("support")} 
              onRemove={(i) => removeItem("support", i)} 
              onChange={(i, f, v) => updateItem("support", i, f, v)} 
            /> */}
            
            <ArrayEditor 
              title="Bottom Links" 
              icon={<LinkIcon className="text-violet-400" size={20} />}
              color="from-violet-500/10 to-purple-500/10"
              items={footer.bottomLinks} 
              onAdd={() => addItem("bottomLinks")} 
              onRemove={(i) => removeItem("bottomLinks", i)} 
              onChange={(i, f, v) => updateItem("bottomLinks", i, f, v)} 
            />
          </div>
        </div>

        {/* Footer Preview */}
        
        {/* Save Button */}
        <div className="bottom-6">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 
                     bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white 
                     rounded-xl hover:opacity-90 transition-all disabled:opacity-50
                     shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving Footer...
              </>
            ) : (
              <>
                <Save size={20} />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/*  SMALL COMPONENTS  */

const Input = ({ icon, value, onChange, placeholder }) => (
  <div className="group">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-sm text-gray-400">{placeholder}</span>
    </div>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg 
               text-white placeholder-gray-500 focus:outline-none focus:ring-1 
               focus:ring-emerald-500/50 focus:border-transparent transition group-hover:border-emerald-500/30"
      placeholder={placeholder}
    />
  </div>
);

const ArrayEditor = ({ title, icon, color, items, onAdd, onChange, onRemove }) => (
  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-gradient-to-r ${color}`}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{items.length} items</p>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 
                 text-emerald-400 hover:opacity-90 transition hover:scale-110"
      >
        <Plus size={20} />
      </button>
    </div>

    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={item._id || i}
          className="group bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 
                   hover:border-emerald-500/30 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 rounded-lg bg-gray-700/50">
              <span className="text-xs text-gray-400">{i + 1}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Label</label>
                <input
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => onChange(i, "label", e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                           focus:ring-emerald-500/50 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Link</label>
                <input
                  placeholder="https://example.com"
                  value={item.link}
                  onChange={(e) => onChange(i, "link", e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:ring-1 
                           focus:ring-emerald-500/50 focus:border-transparent transition"
                />
              </div>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition hover:scale-110 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>

    {items.length === 0 && (
      <div className="text-center py-8 border-2 border-dashed border-gray-700/50 rounded-xl mt-4">
        <div className="p-3 rounded-full bg-gray-800/50 inline-block mb-3">
          <LinkIcon className="text-gray-600" size={24} />
        </div>
        <p className="text-gray-400">No {title.toLowerCase()} added yet</p>
        <p className="text-sm text-gray-500 mt-1">Click the + button to add one</p>
      </div>
    )}
  </div>
);

export default FooterAdmin;