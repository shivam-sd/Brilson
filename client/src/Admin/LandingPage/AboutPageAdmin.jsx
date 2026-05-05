// AboutPageAdmin.jsx - Fully Responsive Version
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Plus, Trash2, Upload, X, Eye, Edit2, RefreshCw,
  Home, BarChart3, Clock, Target, Eye as VisionIcon,
  Heart, Users, MessageSquare, Image as ImageIcon,
  ArrowUp, ArrowDown, Copy, CheckCircle, AlertCircle,
  Settings, Globe, Zap, Award, TrendingUp, Briefcase,
  UserPlus, Calendar, Mail, Phone, MapPin, Linkedin,
  Twitter, Facebook, Instagram, Youtube, Github, ExternalLink,
  Menu, ChevronDown, ChevronRight, Layout, Feather, Sparkles
} from 'lucide-react';

const AboutPageAdmin = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewMode, setPreviewMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      primaryButton: { text: '', link: '' },
      secondaryButton: { text: '', link: '' },
      cards: []
    },
    stats: [],
    journey: [],
    mission: {
      title: '',
      description: '',
      points: []
    },
    vision: {
      title: '',
      description: '',
      goals: []
    },
    values: [],
    team: [],
    testimonial: {
      text: '',
      author: '',
      designation: '',
      company: ''
    }
  });

  // File states
  const [statsFiles, setStatsFiles] = useState({});
  const [journeyFiles, setJourneyFiles] = useState({});
  const [valuesFiles, setValuesFiles] = useState({});
  const [teamFiles, setTeamFiles] = useState({});
  const [heroCardFiles, setHeroCardFiles] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/about/get`);
      if (res.data.success && res.data.data) {
        setFormData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else if (typeof field === 'object') {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], ...field }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
  };

  const handleArrayAdd = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const handleArrayRemove = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleArrayUpdate = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(formData));

    Object.entries(statsFiles).forEach(([index, file]) => {
      formDataToSend.append('statsImages', file);
    });
    Object.entries(journeyFiles).forEach(([index, file]) => {
      formDataToSend.append('journeyImages', file);
    });
    Object.entries(valuesFiles).forEach(([index, file]) => {
      formDataToSend.append('valuesImages', file);
    });
    Object.entries(teamFiles).forEach(([index, file]) => {
      formDataToSend.append('teamImages', file);
    });
    Object.entries(heroCardFiles).forEach(([index, file]) => {
      formDataToSend.append('heroCardImages', file);
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/about/create-or-update`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        await fetchData();
        setStatsFiles({});
        setJourneyFiles({});
        setValuesFiles({});
        setTeamFiles({});
        setHeroCardFiles({});
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error saving data' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Home, color: 'from-pink-500 to-rose-500', gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20' },
    { id: 'stats', label: 'Statistics', icon: BarChart3, color: 'from-blue-500 to-cyan-500', gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' },
    { id: 'journey', label: 'Journey', icon: Clock, color: 'from-purple-500 to-indigo-500', gradient: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20' },
    { id: 'mission', label: 'Mission', icon: Target, color: 'from-green-500 to-emerald-500', gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' },
    { id: 'vision', label: 'Vision', icon: VisionIcon, color: 'from-orange-500 to-amber-500', gradient: 'bg-gradient-to-br from-orange-500/20 to-amber-500/20' },
    { id: 'values', label: 'Values', icon: Heart, color: 'from-red-500 to-rose-500', gradient: 'bg-gradient-to-br from-red-500/20 to-rose-500/20' },
    { id: 'team', label: 'Team', icon: Users, color: 'from-teal-500 to-cyan-500', gradient: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20' },
    { id: 'testimonial', label: 'Testimonial', icon: MessageSquare, color: 'from-yellow-500 to-orange-500', gradient: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-t-yellow-400 border-r-purple-500 border-b-blue-500 border-l-pink-500 mx-auto mb-4"
          />
          <p className="text-gray-300 text-base md:text-lg">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500">
              <Settings className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              About Page Studio
            </h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Craft your brand story with precision and creativity</p>
        </motion.div>

        {/* Message Toast - Responsive */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-16 sm:top-20 md:top-24 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-2 sm:gap-3 max-w-[calc(100%-1rem)] sm:max-w-md text-sm sm:text-base ${
                message.type === 'success' 
                  ? 'bg-green-500/90 border border-green-400 text-white' 
                  : 'bg-red-500/90 border border-red-400 text-white'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={18} className="sm:w-5 sm:h-5" /> : <AlertCircle size={18} className="sm:w-5 sm:h-5" />}
              <span className="font-medium truncate">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Tab Selector */}
        <div className="md:hidden mb-4">
          
          
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 bg-white/10 rounded-xl overflow-hidden"
              >
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white`
                        : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {tab.icon }
                    <span>{tab.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tabs Navigation - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:block mb-8 overflow-x-auto custom-scrollbar"
        >
          <div className="flex flex-nowrap gap-3 pb-4">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative group px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span className="text-sm lg:text-base">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-20 -z-10"
                    style={{ background: `linear-gradient(to right, ${tab.color})` }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Hero Section - Responsive */}
            {activeTab === 'hero' && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Main Hero Section */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-pink-500 to-rose-500">
                      <Sparkles className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Hero Section</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                      <input
                        type="text"
                        value={formData.hero.title}
                        onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-white transition-all text-sm sm:text-base"
                        placeholder="e.g., Redefining Digital Networking"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={formData.hero.subtitle}
                        onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-white transition-all text-sm sm:text-base"
                        placeholder="e.g., The Future of Networking"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={formData.hero.description}
                      onChange={(e) => handleInputChange('hero', 'description', e.target.value)}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-white transition-all text-sm sm:text-base"
                      placeholder="Tell your brand story..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-medium text-gray-300">Primary Button</label>
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={formData.hero.primaryButton.text}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hero: { ...prev.hero, primaryButton: { ...prev.hero.primaryButton, text: e.target.value } }
                        }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                      />
                      <input
                        type="text"
                        placeholder="Button Link"
                        value={formData.hero.primaryButton.link}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hero: { ...prev.hero, primaryButton: { ...prev.hero.primaryButton, link: e.target.value } }
                        }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-medium text-gray-300">Secondary Button</label>
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={formData.hero.secondaryButton.text}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryButton: { ...prev.hero.secondaryButton, text: e.target.value } }
                        }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                      />
                      <input
                        type="text"
                        placeholder="Button Link"
                        value={formData.hero.secondaryButton.link}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryButton: { ...prev.hero.secondaryButton, link: e.target.value } }
                        }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Cards - Responsive Grid */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Layout size={16} className="sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Hero Cards</h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        const newCards = [...formData.hero.cards, { title: '', description: '', features: [], image: '' }];
                        setFormData(prev => ({ ...prev, hero: { ...prev.hero, cards: newCards } }));
                      }}
                      className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                    >
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                      <span>Add Card</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {formData.hero.cards.map((card, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-gray-700 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const newCards = formData.hero.cards.filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, hero: { ...prev.hero, cards: newCards } }));
                          }}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-red-500/20 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        
                        <div className="space-y-2 sm:space-y-3">
                          <input
                            type="text"
                            placeholder="Card Title"
                            value={card.title}
                            onChange={(e) => {
                              const newCards = [...formData.hero.cards];
                              newCards[idx].title = e.target.value;
                              setFormData(prev => ({ ...prev, hero: { ...prev.hero, cards: newCards } }));
                            }}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                          />
                          <textarea
                            placeholder="Card Description"
                            value={card.description}
                            onChange={(e) => {
                              const newCards = [...formData.hero.cards];
                              newCards[idx].description = e.target.value;
                              setFormData(prev => ({ ...prev, hero: { ...prev.hero, cards: newCards } }));
                            }}
                            rows={2}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Features (comma separated)"
                            value={card.features?.join(', ')}
                            onChange={(e) => {
                              const newCards = [...formData.hero.cards];
                              newCards[idx].features = e.target.value.split(',').map(f => f.trim());
                              setFormData(prev => ({ ...prev, hero: { ...prev.hero, cards: newCards } }));
                            }}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                          />
                          
                          <div>
                            <label className="text-xs sm:text-sm text-gray-400 block mb-2">Card Image</label>
                            {card.image && (
                              <div className="mb-2">
                                <img src={card.image} alt="Card" className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg" />
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  setHeroCardFiles(prev => ({ ...prev, [idx]: e.target.files[0] }));
                                }
                              }}
                              className="w-full text-xs sm:text-sm text-gray-400 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {formData.hero.cards.length === 0 && (
                    <div className="text-center py-8 sm:py-12 text-gray-400">
                      <p>No cards added yet. Click "Add Card" to get started.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Stats Section - Responsive */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                      <TrendingUp size={16} className="sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Statistics</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleArrayAdd('stats', { label: '', value: '', image: '' })}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
                  >
                    <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Add Stat
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {formData.stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-gray-700 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('stats', idx)}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-red-500/20 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <input
                          type="text"
                          placeholder="Label"
                          value={stat.label}
                          onChange={(e) => handleArrayUpdate('stats', idx, 'label', e.target.value)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={stat.value}
                          onChange={(e) => handleArrayUpdate('stats', idx, 'value', e.target.value)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 block mb-2">Icon/Image</label>
                        {stat.image && (
                          <div className="mb-2">
                            <img src={stat.image} alt={stat.label} className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setStatsFiles(prev => ({ ...prev, [idx]: e.target.files[0] }));
                            }
                          }}
                          className="w-full text-xs sm:text-sm text-gray-400 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {formData.stats.length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-gray-400">
                    <p>No statistics added yet. Click "Add Stat" to get started.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Journey Section - Responsive */}
            {activeTab === 'journey' && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500">
                      <Calendar size={16} className="sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Timeline Events</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleArrayAdd('journey', { year: '', title: '', description: '', image: '' })}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
                  >
                    <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Add Event
                  </motion.button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {formData.journey.map((event, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-gray-700 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('journey', idx)}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-red-500/20 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <input
                          type="text"
                          placeholder="Year"
                          value={event.year}
                          onChange={(e) => handleArrayUpdate('journey', idx, 'year', e.target.value)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Event Title"
                          value={event.title}
                          onChange={(e) => handleArrayUpdate('journey', idx, 'title', e.target.value)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                        />
                      </div>
                      
                      <textarea                        placeholder="Event Description"
                        value={event.description}
                        onChange={(e) => handleArrayUpdate('journey', idx, 'description', e.target.value)}
                        rows={2}
                        className="w-full mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                      />
                      
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 block mb-2">Event Image</label>
                        {event.image && (
                          <div className="mb-2">
                            <img src={event.image} alt="Event" className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-lg" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setJourneyFiles(prev => ({ ...prev, [idx]: e.target.files[0] }));
                            }
                          }}
                          className="w-full text-xs sm:text-sm text-gray-400 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {formData.journey.length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-gray-400">
                    <p>No timeline events added yet. Click "Add Event" to get started.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Mission Section - Responsive */}
            {activeTab === 'mission' && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <Target size={16} className="sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Mission Statement</h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    placeholder="Mission Title"
                    value={formData.mission.title}
                    onChange={(e) => handleInputChange('mission', 'title', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                  />
                  <textarea
                    placeholder="Mission Description"
                    value={formData.mission.description}
                    onChange={(e) => handleInputChange('mission', 'description', e.target.value)}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                  />
                  
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-2 sm:mb-3">
                      <label className="text-sm font-medium text-gray-300">Key Points</label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          mission: { ...prev.mission, points: [...prev.mission.points, ''] }
                        }))}
                        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-xs sm:text-sm"
                      >
                        <Plus size={12} className="sm:w-3.5 sm:h-3.5" /> Add Point
                      </button>
                    </div>
                    {formData.mission.points.map((point, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder={`Point ${idx + 1}`}
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...formData.mission.points];
                            newPoints[idx] = e.target.value;
                            setFormData(prev => ({ ...prev, mission: { ...prev.mission, points: newPoints } }));
                          }}
                          className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPoints = formData.mission.points.filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, mission: { ...prev.mission, points: newPoints } }));
                          }}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Vision Section - Responsive */}
            {activeTab === 'vision' && (
              <motion.div
                key="vision"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-amber-500">
                    <Globe size={16} className="sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Vision Statement</h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    placeholder="Vision Title"
                    value={formData.vision.title}
                    onChange={(e) => handleInputChange('vision', 'title', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                  />
                  <textarea
                    placeholder="Vision Description"
                    value={formData.vision.description}
                    onChange={(e) => handleInputChange('vision', 'description', e.target.value)}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                  />
                  
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-2 sm:mb-3">
                      <label className="text-sm font-medium text-gray-300">Goals & Milestones</label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          vision: { ...prev.vision, goals: [...prev.vision.goals, { year: '', text: '' }] }
                        }))}
                        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-xs sm:text-sm"
                      >
                        <Plus size={12} className="sm:w-3.5 sm:h-3.5" /> Add Goal
                      </button>
                    </div>
                    {formData.vision.goals.map((goal, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Year"
                          value={goal.year}
                          onChange={(e) => {
                            const newGoals = [...formData.vision.goals];
                            newGoals[idx].year = e.target.value;
                            setFormData(prev => ({ ...prev, vision: { ...prev.vision, goals: newGoals } }));
                          }}
                          className="sm:w-32 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Goal Description"
                          value={goal.text}
                          onChange={(e) => {
                            const newGoals = [...formData.vision.goals];
                            newGoals[idx].text = e.target.value;
                            setFormData(prev => ({ ...prev, vision: { ...prev.vision, goals: newGoals } }));
                          }}
                          className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newGoals = formData.vision.goals.filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, vision: { ...prev.vision, goals: newGoals } }));
                          }}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Values Section - Responsive */}
            {activeTab === 'values' && (
              <motion.div
                key="values"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-rose-500">
                      <Heart size={16} className="sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Core Values</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleArrayAdd('values', { title: '', description: '', image: '' })}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
                  >
                    <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Add Value
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {formData.values.map((value, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-gray-700 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('values', idx)}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-red-500/20 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      
                      <input
                        type="text"
                        placeholder="Value Title"
                        value={value.title}
                        onChange={(e) => handleArrayUpdate('values', idx, 'title', e.target.value)}
                        className="w-full mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                      />
                      <textarea
                        placeholder="Value Description"
                        value={value.description}
                        onChange={(e) => handleArrayUpdate('values', idx, 'description', e.target.value)}
                        rows={2}
                        className="w-full mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                      />
                      
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 block mb-2">Value Icon</label>
                        {value.image && (
                          <div className="mb-2">
                            <img src={value.image} alt={value.title} className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setValuesFiles(prev => ({ ...prev, [idx]: e.target.files[0] }));
                            }
                          }}
                          className="w-full text-xs sm:text-sm text-gray-400 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {formData.values.length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-gray-400">
                    <p>No core values added yet. Click "Add Value" to get started.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Team Section - Responsive */}
            {activeTab === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500">
                      <Users size={16} className="sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Team Members</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleArrayAdd('team', { name: '', role: '', image: '', bio: '' })}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
                  >
                    <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Add Member
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {formData.team.map((member, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-gray-700 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('team', idx)}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-red-500/20 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={member.name}
                            onChange={(e) => handleArrayUpdate('team', idx, 'name', e.target.value)}
                            className="w-full mb-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Role/Position"
                            value={member.role}
                            onChange={(e) => handleArrayUpdate('team', idx, 'role', e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                          />
                        </div>
                        <div className="w-16 sm:w-20">
                          {member.image && (
                            <img src={member.image} alt={member.name} className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <textarea
                        placeholder="Member Bio"
                        value={member.bio}
                        onChange={(e) => handleArrayUpdate('team', idx, 'bio', e.target.value)}
                        rows={2}
                        className="w-full mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white text-sm"
                      />
                      
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 block mb-2">Profile Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setTeamFiles(prev => ({ ...prev, [idx]: e.target.files[0] }));
                            }
                          }}
                          className="w-full text-xs sm:text-sm text-gray-400 file:mr-2 sm:file:mr-3 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {formData.team.length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-gray-400">
                    <p>No team members added yet. Click "Add Member" to get started.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Testimonial Section - Responsive */}
            {activeTab === 'testimonial' && (
              <motion.div
                key="testimonial"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
                    <MessageSquare size={16} className="sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Featured Testimonial</h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <textarea
                    placeholder="Testimonial Text"
                    value={formData.testimonial.text}
                    onChange={(e) => handleInputChange('testimonial', 'text', e.target.value)}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Author Name"
                    value={formData.testimonial.author}
                    onChange={(e) => handleInputChange('testimonial', 'author', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      type="text"
                      placeholder="Designation"
                      value={formData.testimonial.designation}
                      onChange={(e) => handleInputChange('testimonial', 'designation', e.target.value)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={formData.testimonial.company}
                      onChange={(e) => handleInputChange('testimonial', 'company', e.target.value)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-400 text-white text-sm sm:text-base"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sticky Save Button - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bottom-2 sm:bottom-4 mt-6 sm:mt-8 z-20"
          >
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    
                    
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={fetchData}
                    className="flex-1 sm:flex-none px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-sm"
                  >
                    <RefreshCw size={14} className="inline mr-1 sm:mr-2 sm:w-[18px] sm:h-[18px]" />
                    Reset
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-8 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-5 sm:w-5 border-b-2 border-gray-900"></div>
                        <span className="text-xs sm:text-sm">Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} className="sm:w-[18px] sm:h-[18px]" />
                        <span>Publish</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AboutPageAdmin;