import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  HelpCircle,
  Calendar,
  CreditCard,
  ArrowRight,
  Download,
  ChevronRight,
  ExternalLink,
  Info,
  ThumbsUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const RefundPolicyPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch data on mount
    fetchRefundPolicy();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchRefundPolicy = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/get/refund-policy`);
      if (response.data.success && response.data.data) {
        setData(response.data.data);
      } else {
        setError('No data found');
      }
    } catch (err) {
      console.error('Error fetching refund policy:', err);
      setError('Failed to load refund policy');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E1C48A] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading Refund Policy...</p>
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
          <p className="text-gray-400">{error || 'No refund policy available'}</p>
        </div>
      </div>
    );
  }

  // Destructure data with fallbacks
  const { 
    hero, 
    refundCards, 
    policyOverview, 
    refundEligibility, 
    refundProcess, 
    refundTimeline, 
    nonRefundableItems, 
    contactSupport 
  } = data;

  // Default refund cards if not available
  const defaultRefundCards = [
    {
      title: "30-Day Money Back",
      periodLabel: "Period",
      periodValue: "30 days",
      refundAmountLabel: "Refund Amount",
      refundAmountValue: "Full refund"
    },
    {
      title: "Technical Issues",
      periodLabel: "Period",
      periodValue: "7 days",
      refundAmountLabel: "Refund Amount",
      refundAmountValue: "Partial refund"
    },
    {
      title: "Service Issues",
      periodLabel: "Period",
      periodValue: "14 days",
      refundAmountLabel: "Refund Amount",
      refundAmountValue: "Case-by-case"
    }
  ];

  const cards = refundCards?.length > 0 ? refundCards : defaultRefundCards;

  // Default steps if not available
  const defaultSteps = [
    {
      stepNumber: 1,
      title: "Submit Request",
      description: "Fill refund form in your account",
      duration: "5 minutes"
    },
    {
      stepNumber: 2,
      title: "Review & Approval",
      description: "Our team reviews your request",
      duration: "1-2 business days"
    },
    {
      stepNumber: 3,
      title: "Processing",
      description: "Refund initiated to your payment method",
      duration: "3-5 business days"
    },
    {
      stepNumber: 4,
      title: "Completion",
      description: "Funds appear in your account",
      duration: "5-10 business days"
    }
  ];

  const steps = refundProcess?.steps?.length > 0 ? refundProcess.steps : defaultSteps;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1C48A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
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
      <section className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h4 className="text-2xl md:text-4xl font-bold mb-3 text-white">
              {hero?.title || 'Refund Policy'}
            </h4>

            <p className="text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {hero?.description || 'We stand behind our services with a transparent and fair refund policy. Your satisfaction is our priority.'}
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
              {/* Refund Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {cards.map((card, index) => {
                  const colors = [
                    "from-green-500/20 to-emerald-500/20",
                    "from-blue-500/20 to-cyan-500/20",
                    "from-orange-500/20 to-amber-500/20"
                  ];
                  const borders = [
                    "border-green-500/30",
                    "border-blue-500/30",
                    "border-orange-500/30"
                  ];
                  const icons = [
                    <Shield className="text-green-400" size={24} />,
                    <HelpCircle className="text-blue-400" size={24} />,
                    <AlertCircle className="text-orange-400" size={24} />
                  ];
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                      className={`p-6 rounded-2xl bg-gradient-to-br ${colors[index % 3]} border ${borders[index % 3]} backdrop-blur-sm cursor-pointer`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-white/10">
                          {icons[index % 3]}
                        </div>
                        <h3 className="text-xl font-bold text-white">{card.title}</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">{card.periodLabel || 'Period'}</span>
                          <span className="font-semibold text-white">{card.periodValue}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">{card.refundAmountLabel || 'Refund Amount'}</span>
                          <span className="font-semibold text-green-300">{card.refundAmountValue}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Policy Overview */}
              <section id="overview" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                      <Info className="text-blue-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{policyOverview?.title || '1. Policy Overview'}</h2>
                      <p className="text-gray-400 mt-2">{policyOverview?.subtitle || 'Transparent & Fair Refunds'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-gray-300">
                    <p className="text-lg leading-relaxed">
                      {policyOverview?.description || 'At BRILSON, we\'re committed to your satisfaction. Our refund policy is designed to be transparent, fair, and easy to understand. We offer a 30-day money-back guarantee on all our subscription plans.'}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                          <CheckCircle size={18} />
                          {policyOverview?.moneyBackGuarantee?.title || 'Money-Back Guarantee'}
                        </h4>
                        <p className="text-sm">
                          {policyOverview?.moneyBackGuarantee?.description || 'Full refund within 30 days if you\'re not satisfied with our services.'}
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                          <Clock size={18} />
                          {policyOverview?.quickProcessing?.title || 'Quick Processing'}
                        </h4>
                        <p className="text-sm">
                          {policyOverview?.quickProcessing?.description || 'Most refunds are processed within 5-10 business days.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Refund Eligibility */}
              <section id="eligibility" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                      <CheckCircle className="text-green-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{refundEligibility?.title || '2. Refund Eligibility'}</h2>
                      <p className="text-gray-400 mt-2">{refundEligibility?.subtitle || 'What Qualifies for Refund'}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-green-300">✅ {refundEligibility?.eligibleCases?.title || 'Eligible Cases'}</h4>
                        <ul className="space-y-4">
                          {(refundEligibility?.eligibleCases?.items?.length > 0 ? refundEligibility.eligibleCases.items : [
                            "Service not as described",
                            "Technical issues we can't resolve",
                            "Duplicate charges",
                            "Unauthorized transactions"
                          ]).map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="p-1 rounded bg-gradient-to-r from-green-500/20 to-emerald-500/20 mt-1">
                                <CheckCircle size={16} className="text-green-400" />
                              </div>
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-red-300">❌ {refundEligibility?.nonEligibleCases?.title || 'Non-Eligible Cases'}</h4>
                        <ul className="space-y-4">
                          {(refundEligibility?.nonEligibleCases?.items?.length > 0 ? refundEligibility.nonEligibleCases.items : [
                            "Change of mind after 30 days",
                            "Violation of terms of service",
                            "Excessive refund requests",
                            "Using service extensively"
                          ]).map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="p-1 rounded bg-gradient-to-r from-red-500/20 to-pink-500/20 mt-1">
                                <XCircle size={16} className="text-red-400" />
                              </div>
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                      <p className="text-yellow-300">
                        <AlertCircle className="inline mr-2" size={18} />
                        {refundEligibility?.note || 'Refund eligibility is determined on a case-by-case basis. Contact our support team for specific questions.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Refund Process */}
              <section id="process" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                      <RefreshCw className="text-purple-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{refundProcess?.title || '3. Refund Process'}</h2>
                      <p className="text-gray-400 mt-2">{refundProcess?.subtitle || 'Simple 4-Step Process'}</p>
                    </div>
                  </div>

                  {/* Process Steps */}
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/30 via-pink-500/30 to-blue-500/30 hidden md:block" />
                    
                    <div className="space-y-8">
                      {steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-6"
                        >
                          {/* Step Number */}
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 flex items-center justify-center">
                              <div className="text-2xl font-bold text-white">
                                {['📝', '🔍', '⚡', '✅'][index % 4]}
                              </div>
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{step.stepNumber || index + 1}</span>
                            </div>
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 pt-3">
                            <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
                            <p className="text-gray-300 mb-3">{step.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock size={14} />
                              <span>Typically takes: {step.duration}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Refund Timeline */}
              <section id="timeline" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20">
                      <Clock className="text-orange-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{refundTimeline?.title || '4. Refund Timeline'}</h2>
                      <p className="text-gray-400 mt-2">{refundTimeline?.subtitle || 'What to Expect & When'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {(refundTimeline?.items?.length > 0 ? refundTimeline.items : [
                        { title: 'Initial Response', label: 'Time', value: '24-48 hours' },
                        { title: 'Processing Time', label: 'Time', value: '3-5 business days' },
                        { title: 'Bank Processing', label: 'Time', value: '5-10 business days' },
                        { title: 'Total Timeline', label: 'Time', value: '7-15 business days' }
                      ]).map((item, index) => (
                        <div key={index} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                          <h4 className="font-semibold text-[#E1C48A] mb-3">{item.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">{item.label || 'Time'}</span>
                            <span className="font-semibold text-green-300">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Non-Refundable Items */}
              <section id="non-refundable" className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-transparent border-2 border-white/10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20">
                      <XCircle className="text-red-400" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{nonRefundableItems?.title || '5. Non-Refundable Items'}</h2>
                      <p className="text-gray-400 mt-2">{nonRefundableItems?.subtitle || 'What We Cannot Refund'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-red-300">{nonRefundableItems?.services?.title || 'Services'}</h4>
                        <ul className="space-y-3">
                          {(nonRefundableItems?.services?.items?.length > 0 ? nonRefundableItems.services.items : [
                            "Custom development work",
                            "One-time setup fees",
                            "Third-party integrations",
                            "Consultation sessions"
                          ]).map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-red-300">{nonRefundableItems?.otherItems?.title || 'Other Items'}</h4>
                        <ul className="space-y-3">
                          {(nonRefundableItems?.otherItems?.items?.length > 0 ? nonRefundableItems.otherItems.items : [
                            "Digital products downloaded",
                            "Services used beyond 30 days",
                            "Domain registration fees",
                            "SSL certificates"
                          ]).map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Contact Support */}
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
                      <h2 className="text-3xl font-bold text-white">{contactSupport?.title || '6. Contact Support'}</h2>
                      <p className="text-gray-400 mt-2">{contactSupport?.subtitle || 'Get Help with Refunds'}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Mail className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">{contactSupport?.email?.title || 'Email'}</h4>
                        <p className="text-gray-400">{contactSupport?.email?.value || 'refunds@brilson.com'}</p>
                        <p className="text-xs text-gray-500 mt-2">{contactSupport?.email?.note || '24/7 Support'}</p>
                      </div>
                      
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Phone className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">{contactSupport?.phone?.title || 'Phone'}</h4>
                        <p className="text-gray-400">{contactSupport?.phone?.value || '+1 (555) 123-4567'}</p>
                        <p className="text-xs text-gray-500 mt-2">{contactSupport?.phone?.note || 'Mon-Fri, 9AM-6PM EST'}</p>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h4 className="font-semibold text-green-300 mb-2">{contactSupport?.requiredInformation?.title || 'Required Information'}</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Please have the following ready when contacting support:
                      </p>
                      <ul className="grid md:grid-cols-2 gap-2 text-sm">
                        {(contactSupport?.requiredInformation?.items?.length > 0 ? contactSupport.requiredInformation.items : [
                          "Order/Transaction ID",
                          "Account email address",
                          "Payment method details",
                          "Reason for refund request"
                        ]).map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
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

export default RefundPolicyPage;