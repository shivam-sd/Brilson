import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Users, 
  Globe, 
  FileText, 
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Key,
  Clock,
  Bell,
  Mail,
  Settings,
  Download,
  X,
  Menu,
  ArrowUp
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const GET_URL = `${API_BASE_URL}/api/privacy-policy/get`;

  // Fetch data from API
  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const response = await axios.get(GET_URL);
        if (response.data.success && response.data.data) {
          setPolicyData(response.data.data);
        } else {
          setError('Privacy policy data not found');
        }
      } catch (err) {
        console.error('Error fetching privacy policy:', err);
        setError('Failed to load privacy policy');
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E1C48A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading privacy policy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl">⚠️ {error}</div>
          <p className="mt-4 text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No privacy policy data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1C48A]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mt-5 mb-6 text-white">
              {policyData.hero?.title || 'Privacy Policy'}
            </h2>
            <p className="text-xl text-gray-300 mb-5 max-w-2xl mx-auto">
              {policyData.hero?.description || 'Your privacy is our top priority. Learn how BRILSON protects your data with enterprise-grade security and transparent practices.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="w-full">
            {/* Content */}
            <div className="lg:w-full space-y-12">
              {/* Overview */}
              {policyData.overview && (
                <section id="overview" className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                        <Eye className="text-blue-400" size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{policyData.overview.title || 'Overview'}</h2>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <p>{policyData.overview.descriptionOne}</p>
                      <p>{policyData.overview.descriptionTwo}</p>
                      {policyData.overview.highlightText && (
                        <div className="p-4 rounded-lg bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/20 mt-6">
                          <p className="text-[#E1C48A] font-medium">
                            <CheckCircle className="inline mr-2" size={18} />
                            {policyData.overview.highlightText}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Data Collection */}
              {policyData.dataCollection && (
                <section id="data-collection" className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                        <Database className="text-green-400" size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{policyData.dataCollection.title || 'Data Collection'}</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {policyData.dataCollection.personalInformation && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                            <h4 className="text-lg font-semibold text-[#E1C48A] mb-2">
                              {policyData.dataCollection.personalInformation.title || 'Personal Information'}
                            </h4>
                            <ul className="space-y-2 text-gray-300">
                              {policyData.dataCollection.personalInformation.items?.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle size={16} className="text-green-400 mt-1" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {policyData.dataCollection.usageData && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                            <h4 className="text-lg font-semibold text-[#E1C48A] mb-2">
                              {policyData.dataCollection.usageData.title || 'Usage Data'}
                            </h4>
                            <ul className="space-y-2 text-gray-300">
                              {policyData.dataCollection.usageData.items?.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle size={16} className="text-green-400 mt-1" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </section>
              )}

              {/* How We Use Your Data */}
              {policyData.howWeUseData && (
                <section id="data-use" className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                        <Settings className="text-purple-400" size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{policyData.howWeUseData.title || 'How We Use Your Data'}</h2>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <p>{policyData.howWeUseData.description}</p>
                      <ul className="space-y-3">
                        {policyData.howWeUseData.items?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="p-1 rounded bg-gradient-to-r from-[#E1C48A]/20 to-[#C9A86A]/20">
                              <span className="text-[#E1C48A] font-bold">{item.number}</span>
                            </div>
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Data Sharing */}
              {policyData.dataSharing && (
                <section id="data-sharing" className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20">
                        <Users className="text-orange-400" size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{policyData.dataSharing.title || 'Data Sharing'}</h2>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <p>{policyData.dataSharing.description}</p>
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        {policyData.dataSharing.neverShare && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20">
                            <h4 className="font-semibold text-red-300 mb-2">{policyData.dataSharing.neverShare.title || 'We Never Share'}</h4>
                            <ul className="text-sm space-y-1">
                              {policyData.dataSharing.neverShare.items?.map((item, idx) => (
                                <li key={idx}> {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {policyData.dataSharing.mayShare && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                            <h4 className="font-semibold text-green-300 mb-2">{policyData.dataSharing.mayShare.title || 'We May Share'}</h4>
                            <ul className="text-sm space-y-1">
                              {policyData.dataSharing.mayShare.items?.map((item, idx) => (
                                <li key={idx}> {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Security Measures */}
              {policyData.securityMeasures && (
                <section id="security" className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                        <ShieldCheck className="text-cyan-400" size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{policyData.securityMeasures.title || 'Security Measures'}</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        {policyData.securityMeasures.cards?.map((card, idx) => (
                          <div key={idx} className="p-4 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                            {idx === 0 && <Lock className="mx-auto mb-2 text-[#E1C48A]" size={24} />}
                            {idx === 1 && <Shield className="mx-auto mb-2 text-[#E1C48A]" size={24} />}
                            {idx === 2 && <Bell className="mx-auto mb-2 text-[#E1C48A]" size={24} />}
                            <h4 className="font-semibold">{card.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{card.subtitle}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Your Rights */}
              {policyData.userRights && (
                <section id="rights" className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20">
                        <Key className="text-emerald-400" size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{policyData.userRights.title || 'Your Rights'}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {policyData.userRights.accessControl && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-[#E1C48A]">{policyData.userRights.accessControl.title || 'Access & Control'}</h4>
                          <ul className="space-y-3 text-gray-300">
                            {policyData.userRights.accessControl.items?.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {policyData.userRights.additionalRights && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-[#E1C48A]">{policyData.userRights.additionalRights.title || 'Additional Rights'}</h4>
                          <ul className="space-y-3 text-gray-300">
                            {policyData.userRights.additionalRights.items?.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Policy Changes */}
              {policyData.policyChanges && (
                <section id="changes" className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
                        <Clock className="text-yellow-400" size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{policyData.policyChanges.title || 'Policy Changes'}</h2>
                    </div>
                    <div className="space-y-4 text-gray-300">
                      <p>{policyData.policyChanges.description}</p>
                      {policyData.policyChanges.highlightText && (
                        <div className="p-4 rounded-lg bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/20">
                          <p className="text-[#E1C48A] font-medium">
                            {policyData.policyChanges.highlightText}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Contact */}
              {policyData.contact && (
                <section id="contact" className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20">
                        <Mail className="text-indigo-400" size={24} />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{policyData.contact.title || 'Contact Us'}</h2>
                    </div>
                    <div className="space-y-6">
                      <p className="text-gray-300">{policyData.contact.description}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                          <h4 className="font-semibold text-[#E1C48A] mb-3">Email</h4>
                          <p className="text-gray-300">{policyData.contact.email}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                          <h4 className="font-semibold text-[#E1C48A] mb-3">Response Time</h4>
                          <p className="text-gray-300">{policyData.contact.responseTime}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </section>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;