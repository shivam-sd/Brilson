import React, { useState } from 'react';
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

const TermsConditionsPage = () => {

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


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
              Terms & Conditions
            </h2>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              These terms govern your use of BRILSON's services. By accessing our platform, 
              you agree to be bound by these terms and all applicable laws and regulations.
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
                      <h2 className="text-3xl font-bold text-white">1. Introduction</h2>
                      <p className="text-gray-400 mt-2">Welcome to BRILSON</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-gray-300">
                    <p className="text-lg leading-relaxed">
                      Welcome to BRILSON ("we," "our," or "us"). These Terms and Conditions 
                      ("Terms") govern your access to and use of our website, applications, 
                      and services ("Services").
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3 flex items-center gap-2">
                          <CheckCircle size={18} />
                          Agreement
                        </h4>
                        <p className="text-sm">
                          By accessing or using our Services, you agree to be bound by these Terms.
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3 flex items-center gap-2">
                          <Eye size={18} />
                          Review
                        </h4>
                        <p className="text-sm">
                          We recommend reviewing these Terms periodically as they may be updated.
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
                      <h2 className="text-3xl font-bold text-white">2. Account Terms</h2>
                      <p className="text-gray-400 mt-2">Your Responsibilities</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-[#E1C48A]">Requirements</h4>
                        <ul className="space-y-4">
                          {[
                            "You must be at least 18 years old",
                            "Provide accurate and complete information",
                            "Maintain account security",
                            "You are responsible for all activities"
                          ].map((item, index) => (
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
                        <h4 className="text-xl font-semibold text-[#E1C48A]">Prohibited</h4>
                        <ul className="space-y-4">
                          {[
                            "No fraudulent activities",
                            "No unauthorized access",
                            "No commercial use without permission",
                            "No violation of laws"
                          ].map((item, index) => (
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
                      <h2 className="text-3xl font-bold text-white">3. Services</h2>
                      <p className="text-gray-400 mt-2">What We Provide</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { title: "Digital Profiles", desc: "Professional business profiles" },
                        { title: "Networking Tools", desc: "Connect with professionals" },
                        { title: "Analytics", desc: "Performance insights" }
                      ].map((service, index) => (
                        <div key={index} className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                          <div className="text-2xl font-bold text-[#E1C48A] mb-2">{index + 1}</div>
                          <h4 className="font-semibold mb-2">{service.title}</h4>
                          <p className="text-sm text-gray-400">{service.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 rounded-xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                      <h4 className="font-semibold text-blue-300 mb-3">Service Availability</h4>
                      <p className="text-gray-300">
                        We strive to maintain 99.9% uptime but reserve the right to modify, 
                        suspend, or discontinue any part of our Services at any time.
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
                      <h2 className="text-3xl font-bold text-white">4. Payments & Billing</h2>
                      <p className="text-gray-400 mt-2">Financial Terms</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Subscription Plans</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-400" />
                            Monthly/Yearly billing
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-400" />
                            Auto-renewal
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-400" />
                            Cancel anytime
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Refunds</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-400" />
                            30-day money-back guarantee
                          </li>
                          <li className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-yellow-400" />
                            No refunds after 30 days
                          </li>
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
                      <h2 className="text-3xl font-bold text-white">5. Intellectual Property</h2>
                      <p className="text-gray-400 mt-2">Ownership Rights</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Our Rights</h4>
                        <p className="text-gray-300">
                          All content, features, and functionality are owned by BRILSON and 
                          protected by international copyright laws.
                        </p>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Your Rights</h4>
                        <p className="text-gray-300">
                          You retain ownership of your content but grant us license to use it 
                          for service provision.
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
                      <h2 className="text-3xl font-bold text-white">6. Limitation of Liability</h2>
                      <p className="text-gray-400 mt-2">Legal Disclaimers</p>
                    </div>
                  </div>

                  <div className="space-y-6">

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Maximum Liability</h4>
                        <p className="text-gray-300">
                          Our total liability shall not exceed the amount paid by you 
                          in the last 12 months.
                        </p>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Service "As Is"</h4>
                        <p className="text-gray-300">
                          Services are provided "as is" without warranties of any kind, 
                          either express or implied.
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
                      <h2 className="text-3xl font-bold text-white">7. Termination</h2>
                      <p className="text-gray-400 mt-2">Account Closure</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">You May Terminate</h4>
                        <p className="text-gray-300">
                          You may terminate your account at any time through account settings.
                        </p>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">We May Terminate</h4>
                        <p className="text-gray-300">
                          We reserve the right to terminate accounts that violate these terms.
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
                      <h2 className="text-3xl font-bold text-white">8. Contact Information</h2>
                      <p className="text-gray-400 mt-2">Get In Touch</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Mail className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">Email</h4>
                        <p className="text-gray-400">legal@brilson.com</p>
                      </div>
                      
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Clock className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">Response Time</h4>
                        <p className="text-gray-400">24-48 hours</p>
                      </div>
                      
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <HelpCircle className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">Support</h4>
                        <p className="text-gray-400">24/7 available</p>
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

export default TermsConditionsPage;