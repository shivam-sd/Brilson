import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdArrowDropdown } from "react-icons/io";
import { 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Lock,
  Server,
  Mail,
  Globe,
  Users,
  Database,
  Share2,
  FileText,
  Clock,
  Eye,
  Edit3,
  Menu
} from 'lucide-react';


const PrivacyPolicyUpdatePage = () => {
  const [formData, setFormData] = useState({
    hero: { title: 'Privacy Policy', description: '' },
    overview: { title: 'Overview', descriptionOne: '', descriptionTwo: '', highlightText: '' },
    dataCollection: {
      title: 'Data Collection',
      personalInformation: { title: 'Personal Information', items: [] },
      usageData: { title: 'Usage Data', items: []
      }
    },
    howWeUseData: { title: 'How We Use Your Data', description: '', items: [] },
    dataSharing: {
      title: 'Data Sharing',
      description: '',
      neverShare: { title: 'We Never Share', items: [] },
      mayShare: { title: 'We May Share', items: []
      }
    },
    securityMeasures: { title: 'Security Measures', cards: [] },
    userRights: {
      title: 'Your Rights',
      accessControl: { title: 'Access & Control', items: [] },
      additionalRights: { title: 'Additional Rights', items: []
      }
    },
    policyChanges: { title: 'Policy Changes', description: '', highlightText: '' },
    contact: { title: 'Contact Us', description: '', email: '', responseTime: '' }
  });

  

  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeSection, setActiveSection] = useState('hero');
  const [previewMode, setPreviewMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const GET_URL = `${API_BASE_URL}/api/privacy-policy/get`;
  const UPDATE_URL = `${API_BASE_URL}/api/privacy-policy/create-or-update`;
  
  useEffect(() => {
      fetchPrivacyPolicy();
    }, []);
    
    const fetchPrivacyPolicy = async () => {
        try {
            setLoading(true);
            const response = await axios.get(GET_URL);
            if (response.data.success && response.data.data) {
                setFormData(response.data.data);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load privacy policy data' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } finally {
            setLoading(false);
        }
    };
    
  const handleInputChange = (section, field, value, subSection = null, index = null) => {
      setFormData(prev => {
          const newData = JSON.parse(JSON.stringify(prev));
          if (subSection) {
              if (index !== null && newData[section][subSection]?.items) {
                  newData[section][subSection].items[index] = value;
                } else if (newData[section][subSection]) {
                    newData[section][subSection][field] = value;
                }
            } else if (field && newData[section]) {
        newData[section][field] = value;
      }
      return newData;
    });
  };

  const handleArrayItem = (section, subSection, action, index = null) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const items = [...(newData[section][subSection].items || [])];
      if (action === 'add') items.push('');
      else if (action === 'remove' && index !== null) items.splice(index, 1);
      newData[section][subSection].items = items;
      return newData;
    });
  };

  const handleSecurityCard = (action, index = null) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const cards = [...(newData.securityMeasures.cards || [])];
      if (action === 'add') cards.push({ title: '', subtitle: '' });
      else if (action === 'remove' && index !== null) cards.splice(index, 1);
      newData.securityMeasures.cards = cards;
      return newData;
    });
  };

  const handleSecurityCardChange = (index, field, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.securityMeasures.cards[index][field] = value;
      return newData;
    });
  };

  const handleHowWeUseItem = (action, index = null) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const items = [...(newData.howWeUseData.items || [])];
      if (action === 'add') items.push({ number: String(items.length + 1), text: '' });
      else if (action === 'remove' && index !== null) {
        items.splice(index, 1);
        items.forEach((item, idx) => { item.number = String(idx + 1); });
      }
      newData.howWeUseData.items = items;
      return newData;
    });
  };

  const handleHowWeUseItemChange = (index, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.howWeUseData.items[index].text = value;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post(UPDATE_URL, formData);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Privacy Policy updated successfully!' });
        setTimeout(() => fetchPrivacyPolicy(), 1000);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update privacy policy' });
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: Globe, color: 'blue' },
    { id: 'overview', label: 'Overview', icon: FileText, color: 'purple' },
    { id: 'dataCollection', label: 'Data Collection', icon: Database, color: 'green' },
    { id: 'howWeUseData', label: 'How We Use Data', icon: Users, color: 'orange' },
    { id: 'dataSharing', label: 'Data Sharing', icon: Share2, color: 'yellow' },
    { id: 'securityMeasures', label: 'Security', icon: Shield, color: 'indigo' },
    { id: 'userRights', label: 'User Rights', icon: Lock, color: 'pink' },
    { id: 'policyChanges', label: 'Policy Changes', icon: Clock, color: 'gray' },
    { id: 'contact', label: 'Contact', icon: Mail, color: 'cyan' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading privacy policy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Privacy Policy Manager</h2>
                <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">Manage your privacy policy content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden sticky top-16 z-20 bg-gray-50 px-4 py-2 border-b border-gray-200">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-gray-200"
        >
          <span className="font-medium text-gray-700">
            {sections.find(s => s.id === activeSection)?.label || 'Navigation'}
          </span>
          <Menu size={20} />
        </button>
      </div>

      {/* Toast Message */}
      {message.text && (
        <div className={`fixed top-16 right-2 sm:right-4 z-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm sm:text-base ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 sticky top-24">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Navigation</h3>
              </div>
              <div className="p-2 space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm">{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Mobile */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
              <div className="fixed top-24 left-0 right-0 bg-white border-b border-gray-200 shadow-lg mx-4 rounded-lg" onClick={e => e.stopPropagation()}>
                <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-sm">{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              {!previewMode ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Hero Section */}
                  {activeSection === 'hero' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Globe size={18} className="text-blue-600" />
                          Hero Section
                        </h2>
                        <span className="text-slate-700 bg-gray-100 px-2 py-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer lg:hidden">
                          <IoMdArrowDropdown size={25} />
                        </span>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.hero?.title || ''}
                            onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={formData.hero?.description || ''}
                            onChange={(e) => handleInputChange('hero', 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                            placeholder="Enter hero description..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Overview Section */}
                  {activeSection === 'overview' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <FileText size={18} className="text-purple-600" />
                          Overview
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.overview?.title || ''}
                            onChange={(e) => handleInputChange('overview', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description One</label>
                          <textarea
                            value={formData.overview?.descriptionOne || ''}
                            onChange={(e) => handleInputChange('overview', 'descriptionOne', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description Two</label>
                          <textarea
                            value={formData.overview?.descriptionTwo || ''}
                            onChange={(e) => handleInputChange('overview', 'descriptionTwo', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Text</label>
                          <input
                            type="text"
                            value={formData.overview?.highlightText || ''}
                            onChange={(e) => handleInputChange('overview', 'highlightText', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                            placeholder="We never sell your personal data to third parties."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Data Collection Section */}
                  {activeSection === 'dataCollection' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Database size={18} className="text-green-600" />
                          Data Collection
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={formData.dataCollection?.title || ''}
                            onChange={(e) => handleInputChange('dataCollection', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                          />
                        </div>

                        {/* Personal Information */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <Users size={16} />
                            Personal Information
                          </h3>
                          <div className="mb-3">
                            <input
                              type="text"
                              value={formData.dataCollection?.personalInformation?.title || ''}
                              onChange={(e) => handleInputChange('dataCollection', 'title', e.target.value, 'personalInformation')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                              placeholder="Title"
                            />
                          </div>
                          {formData.dataCollection?.personalInformation?.items?.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('dataCollection', null, e.target.value, 'personalInformation', idx)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                                placeholder="Enter item"
                              />
                              <button
                                type="button"
                                onClick={() => handleArrayItem('dataCollection', 'personalInformation', 'remove', idx)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition self-end sm:self-auto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleArrayItem('dataCollection', 'personalInformation', 'add')}
                            className="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Item
                          </button>
                        </div>

                        {/* Usage Data */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <Server size={16} />
                            Usage Data
                          </h3>
                          <div className="mb-3">
                            <input
                              type="text"
                              value={formData.dataCollection?.usageData?.title || ''}
                              onChange={(e) => handleInputChange('dataCollection', 'title', e.target.value, 'usageData')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                              placeholder="Title"
                            />
                          </div>
                          {formData.dataCollection?.usageData?.items?.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('dataCollection', null, e.target.value, 'usageData', idx)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                                placeholder="Enter item"
                              />
                              <button
                                type="button"
                                onClick={() => handleArrayItem('dataCollection', 'usageData', 'remove', idx)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition self-end sm:self-auto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleArrayItem('dataCollection', 'usageData', 'add')}
                            className="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* How We Use Data Section */}
                  {activeSection === 'howWeUseData' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Users size={18} className="text-orange-600" />
                          How We Use Your Data
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.howWeUseData?.title || ''}
                            onChange={(e) => handleInputChange('howWeUseData', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={formData.howWeUseData?.description || ''}
                            onChange={(e) => handleInputChange('howWeUseData', 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">List Items</label>
                          {formData.howWeUseData?.items?.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                              <div className="w-12 px-2 py-2 bg-blue-100 text-blue-700 rounded-lg text-center text-sm font-medium">
                                {item.number}
                              </div>
                              <input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleHowWeUseItemChange(idx, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-black"
                                placeholder="Description"
                              />
                              <button
                                type="button"
                                onClick={() => handleHowWeUseItem('remove', idx)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg self-end sm:self-auto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleHowWeUseItem('add')}
                            className="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Data Sharing Section */}
                  {activeSection === 'dataSharing' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Share2 size={18} className="text-yellow-600" />
                          Data Sharing
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.dataSharing?.title || ''}
                            onChange={(e) => handleInputChange('dataSharing', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={formData.dataSharing?.description || ''}
                            onChange={(e) => handleInputChange('dataSharing', 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                          />
                        </div>

                        {/* Never Share */}
                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                          <h3 className="font-medium text-green-800 mb-3 text-sm sm:text-base">Never Share</h3>
                          <div className="mb-3">
                            <input
                              type="text"
                              value={formData.dataSharing?.neverShare?.title || ''}
                              onChange={(e) => handleInputChange('dataSharing', 'title', e.target.value, 'neverShare')}
                              className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm bg-white text-black"
                              placeholder="Title"
                            />
                          </div>
                          {formData.dataSharing?.neverShare?.items?.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('dataSharing', null, e.target.value, 'neverShare', idx)}
                                className="flex-1 px-3 py-2 border border-green-200 rounded-lg text-sm bg-white text-black"
                                placeholder="Enter item"
                              />
                              <button
                                type="button"
                                onClick={() => handleArrayItem('dataSharing', 'neverShare', 'remove', idx)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg self-end sm:self-auto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleArrayItem('dataSharing', 'neverShare', 'add')}
                            className="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Item
                          </button>
                        </div>

                        {/* May Share */}
                        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
                          <h3 className="font-medium text-yellow-800 mb-3 text-sm sm:text-base">May Share</h3>
                          <div className="mb-3">
                            <input
                              type="text"
                              value={formData.dataSharing?.mayShare?.title || ''}
                              onChange={(e) => handleInputChange('dataSharing', 'title', e.target.value, 'mayShare')}
                              className="w-full px-3 py-2 border border-yellow-200 rounded-lg text-sm bg-white text-black"
                              placeholder="Title"
                            />
                          </div>
                          {formData.dataSharing?.mayShare?.items?.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('dataSharing', null, e.target.value, 'mayShare', idx)}
                                className="flex-1 px-3 py-2 border border-yellow-200 rounded-lg text-sm bg-white text-black"
                                placeholder="Enter item"
                              />
                              <button
                                type="button"
                                onClick={() => handleArrayItem('dataSharing', 'mayShare', 'remove', idx)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg self-end sm:self-auto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleArrayItem('dataSharing', 'mayShare', 'add')}
                            className="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Measures Section */}
                  {activeSection === 'securityMeasures' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Shield size={18} className="text-indigo-600" />
                          Security Measures
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.securityMeasures?.title || ''}
                            onChange={(e) => handleInputChange('securityMeasures', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Security Cards</label>
                          {formData.securityMeasures?.cards?.map((card, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3">
                              <div className="mb-2">
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => handleSecurityCardChange(idx, 'title', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                                  placeholder="Card Title"
                                />
                              </div>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  value={card.subtitle}
                                  onChange={(e) => handleSecurityCardChange(idx, 'subtitle', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                                  placeholder="Subtitle"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSecurityCard('remove', idx)}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Remove Card
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleSecurityCard('add')}
                            className="px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Security Card
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Rights Section */}
                  {activeSection === 'userRights' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Lock size={18} className="text-pink-600" />
                          User Rights
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.userRights?.title || ''}
                            onChange={(e) => handleInputChange('userRights', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                          />
                        </div>

                        {/* Access Control */}
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                          <h3 className="font-medium text-blue-800 mb-3 text-sm sm:text-base">Access & Control</h3>
                          <div className="mb-3">
                            <input
                              type="text"
                              value={formData.userRights?.accessControl?.title || ''}
                              onChange={(e) => handleInputChange('userRights', 'title', e.target.value, 'accessControl')}
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white text-black"
                              placeholder="Title"
                            />
                          </div>
                          {formData.userRights?.accessControl?.items?.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('userRights', null, e.target.value, 'accessControl', idx)}
                                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white text-black"
                                placeholder="Enter right"
                              />
                              <button
                                type="button"
                                onClick={() => handleArrayItem('userRights', 'accessControl', 'remove', idx)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg self-end sm:self-auto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleArrayItem('userRights', 'accessControl', 'add')}
                            className="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Right
                          </button>
                        </div>

                        {/* Additional Rights */}
                        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
                          <h3 className="font-medium text-purple-800 mb-3 text-sm sm:text-base">Additional Rights</h3>
                          <div className="mb-3">
                            <input
                              type="text"
                              value={formData.userRights?.additionalRights?.title || ''}
                              onChange={(e) => handleInputChange('userRights', 'title', e.target.value, 'additionalRights')}
                              className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm bg-white text-black"
                              placeholder="Title"
                            />
                          </div>
                          {formData.userRights?.additionalRights?.items?.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('userRights', null, e.target.value, 'additionalRights', idx)}
                                className="flex-1 px-3 py-2 border border-purple-200 rounded-lg text-sm bg-white text-black"
                                placeholder="Enter right"
                              />
                              <button
                                type="button"
                                onClick={() => handleArrayItem('userRights', 'additionalRights', 'remove', idx)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg self-end sm:self-auto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleArrayItem('userRights', 'additionalRights', 'add')}
                            className="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Right
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Policy Changes Section */}
                  {activeSection === 'policyChanges' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Clock size={18} className="text-gray-600" />
                          Policy Changes
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.policyChanges?.title || ''}
                            onChange={(e) => handleInputChange('policyChanges', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={formData.policyChanges?.description || ''}
                            onChange={(e) => handleInputChange('policyChanges', 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Text</label>
                          <input
                            type="text"
                            value={formData.policyChanges?.highlightText || ''}
                            onChange={(e) => handleInputChange('policyChanges', 'highlightText', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                            placeholder="You are advised to review this Privacy Policy periodically"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Section */}
                  {activeSection === 'contact' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Mail size={18} className="text-cyan-600" />
                          Contact Section
                        </h2>
                      </div>
                      <div className="p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.contact?.title || ''}
                            onChange={(e) => handleInputChange('contact', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={formData.contact?.description || ''}
                            onChange={(e) => handleInputChange('contact', 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={formData.contact?.email || ''}
                            onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                            placeholder="hello@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Response Time</label>
                          <input
                            type="text"
                            value={formData.contact?.responseTime || ''}
                            onChange={(e) => handleInputChange('contact', 'responseTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm sm:text-base"
                            placeholder="We typically respond within 24-48 hours"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 sticky bottom-4 sm:bottom-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save All Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={fetchPrivacyPolicy}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <RefreshCw size={16} />
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyUpdatePage;