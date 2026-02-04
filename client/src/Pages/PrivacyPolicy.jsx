import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll handler
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

  return (
    <div className="min-h-screen from-black text-white">
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
              Privacy Policy
            </h2>

            <p className="text-xl text-gray-300 mb-5 max-w-2xl mx-auto">
              Your privacy is our top priority. Learn how BRILSON protects your data with 
              enterprise-grade security and transparent practices.
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
                    <h2 className="text-3xl font-bold text-white">Overview</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      Welcome to BRILSON's Privacy Policy. This document explains how we collect, 
                      use, and protect your personal information when you use our services.
                    </p>
                    <p>
                      We are committed to protecting your privacy and ensuring that your personal 
                      data is handled in a safe and responsible manner. This policy outlines our 
                      practices regarding data collection, usage, and protection.
                    </p>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/20 mt-6">
                      <p className="text-[#E1C48A] font-medium">
                        <CheckCircle className="inline mr-2" size={18} />
                        We never sell your personal data to third parties.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Data Collection */}
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
                    <h2 className="text-3xl font-bold text-white">Data Collection</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="text-lg font-semibold text-[#E1C48A] mb-2">Personal Information</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-400 mt-1" />
                            Name and contact details
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-400 mt-1" />
                            Professional information
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-400 mt-1" />
                            Payment information
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="text-lg font-semibold text-[#E1C48A] mb-2">Usage Data</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-400 mt-1" />
                            Device information
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-400 mt-1" />
                            Log data and analytics
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-400 mt-1" />
                            Cookies and tracking
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Data Use */}
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
                    <h2 className="text-3xl font-bold text-white">How We Use Your Data</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We use your personal data to provide, improve, and personalize our services. 
                      This includes:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded bg-gradient-to-r from-[#E1C48A]/20 to-[#C9A86A]/20">
                          <span className="text-[#E1C48A] font-bold">1</span>
                        </div>
                        <span>Delivering and maintaining our services</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded bg-gradient-to-r from-[#E1C48A]/20 to-[#C9A86A]/20">
                          <span className="text-[#E1C48A] font-bold">2</span>
                        </div>
                        <span>Personalizing your experience</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded bg-gradient-to-r from-[#E1C48A]/20 to-[#C9A86A]/20">
                          <span className="text-[#E1C48A] font-bold">3</span>
                        </div>
                        <span>Processing transactions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded bg-gradient-to-r from-[#E1C48A]/20 to-[#C9A86A]/20">
                          <span className="text-[#E1C48A] font-bold">4</span>
                        </div>
                        <span>Communicating with you</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </section>

              {/* Data Sharing */}
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
                    <h2 className="text-3xl font-bold text-white">Data Sharing</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We do not sell, trade, or rent your personal information to third parties. 
                      We may share data only in the following circumstances:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20">
                        <h4 className="font-semibold text-red-300 mb-2">We Never Share</h4>
                        <ul className="text-sm space-y-1">
                          <li>✓ With advertisers</li>
                          <li>✓ With data brokers</li>
                          <li>✓ For marketing lists</li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                        <h4 className="font-semibold text-green-300 mb-2">We May Share</h4>
                        <ul className="text-sm space-y-1">
                          <li>✓ With service providers</li>
                          <li>✓ For legal compliance</li>
                          <li>✓ With your consent</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Security */}
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
                    <h2 className="text-3xl font-bold text-white">Security Measures</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Lock className="mx-auto mb-2 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold">AES-256 Encryption</h4>
                        <p className="text-sm text-gray-400 mt-1">Military-grade encryption</p>
                      </div>
                      <div className="p-4 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Shield className="mx-auto mb-2 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold">SOC 2 Certified</h4>
                        <p className="text-sm text-gray-400 mt-1">Enterprise security</p>
                      </div>
                      <div className="p-4 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Bell className="mx-auto mb-2 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold">24/7 Monitoring</h4>
                        <p className="text-sm text-gray-400 mt-1">Real-time threat detection</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Your Rights */}
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
                    <h2 className="text-3xl font-bold text-white">Your Rights</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#E1C48A]">Access & Control</h4>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          Right to access your data
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          Right to correct data
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          Right to delete data
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#E1C48A]">Additional Rights</h4>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          Right to data portability
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          Right to object processing
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          Right to withdraw consent
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Policy Changes */}
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
                    <h2 className="text-3xl font-bold text-white">Policy Changes</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We may update this Privacy Policy from time to time. We will notify you of 
                      any changes by posting the new Privacy Policy on this page and updating 
                      the "Last Updated" date.
                    </p>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-[#E1C48A]/10 to-[#C9A86A]/10 border border-[#E1C48A]/20">
                      <p className="text-[#E1C48A] font-medium">
                        You are advised to review this Privacy Policy periodically for any changes. 
                        Changes to this Privacy Policy are effective when they are posted on this page.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Contact */}
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
                    <h2 className="text-3xl font-bold text-white">Contact Us</h2>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-300">
                      If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Email</h4>
                        <p className="text-gray-300">privacy@brilson.com</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Response Time</h4>
                        <p className="text-gray-300">Within 48 hours</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

            </div>
          </div>
        </div>
      </main>
      </div>
  );
};

export default PrivacyPolicyPage;