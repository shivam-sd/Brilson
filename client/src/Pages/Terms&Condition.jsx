import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Shield,
  Users,
  Globe,
  Briefcase,
  DollarSign,
  Clock,
  Eye,
  Lock,
  Mail,
  ArrowRight,
  ChevronRight,
  Download,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const TermsConditionsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch data on mount
    fetchTermsConditions();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchTermsConditions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/terms-conditions/get`);
      if (response.data.success && response.data.data) {
        setData(response.data.data);
      } else {
        setError('No data found');
      }
    } catch (err) {
      console.error('Error fetching terms:', err);
      setError('Failed to load terms & conditions');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E1C48A] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading Terms & Conditions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
          <p className="text-gray-400">{error || 'No terms & conditions available'}</p>
        </div>
      </div>
    );
  }

  // Destructure data with fallbacks
  const { 
    hero, 
    introduction, 
    accountTerms, 
    services, 
    paymentsBilling, 
    intellectualProperty, 
    limitationLiability, 
    termination, 
    contactInfo 
  } = data;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1C48A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
      <section className="relative pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {hero?.title || 'Terms & Conditions'}
            </h2>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {hero?.description || 'These terms govern your use of BRILSON\'s services. By accessing our platform, you agree to be bound by these terms and all applicable laws and regulations.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Content */}
            <div className="lg:w-full space-y-12">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                      <BookOpen className="text-blue-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{introduction?.title || '1. Introduction'}</h2>
                      <p className="text-gray-400 mt-2">{introduction?.welcomeText || 'Welcome to BRILSON'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-gray-300">
                    <p className="text-lg leading-relaxed">
                      {introduction?.description || 'Welcome to BRILSON Our. These Terms and Conditions ("Terms") govern your access to and use of our website, applications, and services.'}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3 flex items-center gap-2">
                          <CheckCircle size={18} />
                          {introduction?.agreement?.title || 'Agreement'}
                        </h4>
                        <p className="text-sm">
                          {introduction?.agreement?.text || 'By accessing or using our Services, you agree to be bound by these Terms.'}
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3 flex items-center gap-2">
                          <Eye size={18} />
                          {introduction?.review?.title || 'Review'}
                        </h4>
                        <p className="text-sm">
                          {introduction?.review?.text || 'We recommend reviewing these Terms periodically as they may be updated.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Account Terms */}
              <section id="account-terms" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                      <Users className="text-green-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{accountTerms?.title || '2. Account Terms'}</h2>
                      <p className="text-gray-400 mt-2">{accountTerms?.subtitle || 'Your Responsibilities'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-[#E1C48A]">{accountTerms?.requirements?.title || 'Requirements'}</h4>
                        <ul className="space-y-4">
                          {(accountTerms?.requirements?.items?.length > 0 ? accountTerms.requirements.items : [
                            "You must be at least 18 years old",
                            "Provide accurate and complete information",
                            "Maintain account security",
                            "You are responsible for all activities"
                          ]).map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="p-1 rounded bg-gradient-to-r from-green-500/20 to-emerald-500/20 mt-1">
                                <CheckCircle size={16} className="text-green-400" />
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-[#E1C48A]">{accountTerms?.prohibited?.title || 'Prohibited'}</h4>
                        <ul className="space-y-4">
                          {(accountTerms?.prohibited?.items?.length > 0 ? accountTerms.prohibited.items : [
                            "No fraudulent activities",
                            "No unauthorized access",
                            "No commercial use without permission",
                            "No violation of laws"
                          ]).map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="p-1 rounded bg-gradient-to-r from-red-500/20 to-pink-500/20 mt-1">
                                <AlertCircle size={16} className="text-red-400" />
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Services */}
              <section id="services" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                      <Briefcase className="text-purple-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{services?.title || '3. Services'}</h2>
                      <p className="text-gray-400 mt-2">{services?.subtitle || 'What We Provide'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {(services?.items?.length > 0 ? services.items : [
                        { number: "1", title: "Digital Profiles", description: "Professional business profiles" },
                        { number: "2", title: "Networking Tools", description: "Connect with professionals" },
                        { number: "3", title: "Analytics", description: "Performance insights" }
                      ]).map((service, index) => (
                        <div key={index} className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                          <div className="text-2xl font-bold text-[#E1C48A] mb-2">{service.number || index + 1}</div>
                          <h4 className="font-semibold mb-2">{service.title}</h4>
                          <p className="text-sm text-gray-400">{service.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 rounded-xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                      <h4 className="font-semibold text-blue-300 mb-3">{services?.availability?.title || 'Service Availability'}</h4>
                      <p className="text-gray-300">
                        {services?.availability?.description || 'We strive to maintain 99.9% uptime but reserve the right to modify, suspend, or discontinue any part of our Services at any time.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Payments */}
              <section id="payments" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
                      <DollarSign className="text-yellow-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{paymentsBilling?.title || '4. Payments & Billing'}</h2>
                      <p className="text-gray-400 mt-2">{paymentsBilling?.subtitle || 'Financial Terms'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">{paymentsBilling?.subscriptionPlans?.title || 'Subscription Plans'}</h4>
                        <ul className="space-y-3">
                          {(paymentsBilling?.subscriptionPlans?.items?.length > 0 ? paymentsBilling.subscriptionPlans.items : [
                            "Monthly/Yearly billing",
                            "Auto-renewal",
                            "Cancel anytime"
                          ]).map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">{paymentsBilling?.refunds?.title || 'Refunds'}</h4>
                        <ul className="space-y-3">
                          {(paymentsBilling?.refunds?.items?.length > 0 ? paymentsBilling.refunds.items : [
                            "30-day money-back guarantee",
                            "No refunds after 30 days"
                          ]).map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              {index === 0 ? (
                                <CheckCircle size={16} className="text-green-400" />
                              ) : (
                                <AlertCircle size={16} className="text-yellow-400" />
                              )}
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20">
                      <FileText className="text-indigo-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{intellectualProperty?.title || '5. Intellectual Property'}</h2>
                      <p className="text-gray-400 mt-2">{intellectualProperty?.subtitle || 'Ownership Rights'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">{intellectualProperty?.ourRights?.title || 'Our Rights'}</h4>
                        <p className="text-gray-300">
                          {intellectualProperty?.ourRights?.description || 'All content, features, and functionality are owned by BRILSON and protected by international copyright laws.'}
                        </p>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">{intellectualProperty?.yourRights?.title || 'Your Rights'}</h4>
                        <p className="text-gray-300">
                          {intellectualProperty?.yourRights?.description || 'You retain ownership of your content but grant us license to use it for service provision.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Liability */}
              <section id="liability" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20">
                      <Shield className="text-orange-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{limitationLiability?.title || '6. Limitation of Liability'}</h2>
                      <p className="text-gray-400 mt-2">{limitationLiability?.subtitle || 'Legal Disclaimers'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">{limitationLiability?.maximumLiability?.title || 'Maximum Liability'}</h4>
                        <p className="text-gray-300">
                          {limitationLiability?.maximumLiability?.description || 'Our total liability shall not exceed the amount paid by you in the last 12 months.'}
                        </p>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">{limitationLiability?.asIsService?.title || 'Service "As Is"'}</h4>
                        <p className="text-gray-300">
                          {limitationLiability?.asIsService?.description || 'Services are provided "as is" without warranties of any kind, either express or implied.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Termination */}
              <section id="termination" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-500/20">
                      <Clock className="text-gray-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{termination?.title || '7. Termination'}</h2>
                      <p className="text-gray-400 mt-2">{termination?.subtitle || 'Account Closure'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">{termination?.youMayTerminate?.title || 'You May Terminate'}</h4>
                        <p className="text-gray-300">
                          {termination?.youMayTerminate?.description || 'You may terminate your account at any time through account settings.'}
                        </p>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">{termination?.weMayTerminate?.title || 'We May Terminate'}</h4>
                        <p className="text-gray-300">
                          {termination?.weMayTerminate?.description || 'We reserve the right to terminate accounts that violate these terms.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Contact */}
              <section id="contact" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                      <Mail className="text-cyan-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{contactInfo?.title || '8. Contact Information'}</h2>
                      <p className="text-gray-400 mt-2">{contactInfo?.subtitle || 'Get In Touch'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Mail className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">{contactInfo?.email?.title || 'Email'}</h4>
                        <p className="text-gray-400">{contactInfo?.email?.value || 'legal@brilson.com'}</p>
                      </div>
                      
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Clock className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">{contactInfo?.responseTime?.title || 'Response Time'}</h4>
                        <p className="text-gray-400">{contactInfo?.responseTime?.value || '24-48 hours'}</p>
                      </div>
                      
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <HelpCircle className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">{contactInfo?.support?.title || 'Support'}</h4>
                        <p className="text-gray-400">{contactInfo?.support?.value || '24/7 available'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-[#E1C48A] text-black rounded-full shadow-lg hover:bg-[#d4b87a] transition-all duration-300 z-50"
        >
          <ArrowRight className="w-6 h-6 rotate-[-90deg]" />
        </button>
      )}
    </div>
  );
};

export default TermsConditionsPage;