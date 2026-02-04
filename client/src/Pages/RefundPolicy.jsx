import React, { useState } from 'react';
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

const RefundPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };


  const refundTypes = [
    {
      title: "30-Day Money Back",
      period: "30 days",
      amount: "Full refund",
      icon: <Shield className="text-green-400" size={24} />,
      color: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30"
    },
    {
      title: "Technical Issues",
      period: "7 days",
      amount: "Partial refund",
      icon: <HelpCircle className="text-blue-400" size={24} />,
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30"
    },
    {
      title: "Service Issues",
      period: "14 days",
      amount: "Case-by-case",
      icon: <AlertCircle className="text-orange-400" size={24} />,
      color: "from-orange-500/20 to-amber-500/20",
      border: "border-orange-500/30"
    }
  ];

  const refundSteps = [
    {
      step: 1,
      title: "Submit Request",
      description: "Fill refund form in your account",
      time: "5 minutes",
      icon: "📝"
    },
    {
      step: 2,
      title: "Review & Approval",
      description: "Our team reviews your request",
      time: "1-2 business days",
      icon: "🔍"
    },
    {
      step: 3,
      title: "Processing",
      description: "Refund initiated to your payment method",
      time: "3-5 business days",
      icon: "⚡"
    },
    {
      step: 4,
      title: "Completion",
      description: "Funds appear in your account",
      time: "5-10 business days",
      icon: "✅"
    }
  ];

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

            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Refund Policy
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We stand behind our services with a transparent and fair refund policy. 
              Your satisfaction is our priority.
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
              {/* Refund Types */}
              <div className="grid md:grid-cols-3 gap-6">
                {refundTypes.map((type, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${type.color} border ${type.border} backdrop-blur-sm cursor-pointer`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-white/10">
                        {type.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white">{type.title}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Period</span>
                        <span className="font-semibold text-white">{type.period}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Refund Amount</span>
                        <span className="font-semibold text-green-300">{type.amount}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Overview */}
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
                      <h2 className="text-3xl font-bold text-white">1. Policy Overview</h2>
                      <p className="text-gray-400 mt-2">Transparent & Fair Refunds</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-gray-300">
                    <p className="text-lg leading-relaxed">
                      At BRILSON, we're committed to your satisfaction. Our refund policy is designed 
                      to be transparent, fair, and easy to understand. We offer a 30-day money-back 
                      guarantee on all our subscription plans.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                          <CheckCircle size={18} />
                          Money-Back Guarantee
                        </h4>
                        <p className="text-sm">
                          Full refund within 30 days if you're not satisfied with our services.
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                          <Clock size={18} />
                          Quick Processing
                        </h4>
                        <p className="text-sm">
                          Most refunds are processed within 5-10 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Eligibility */}
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
                      <h2 className="text-3xl font-bold text-white">2. Refund Eligibility</h2>
                      <p className="text-gray-400 mt-2">What Qualifies for Refund</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-green-300">✅ Eligible Cases</h4>
                        <ul className="space-y-4">
                          {[
                            "Service not as described",
                            "Technical issues we can't resolve",
                            "Duplicate charges",
                            "Unauthorized transactions"
                          ].map((item, index) => (
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
                        <h4 className="text-xl font-semibold text-red-300">❌ Non-Eligible Cases</h4>
                        <ul className="space-y-4">
                          {[
                            "Change of mind after 30 days",
                            "Violation of terms of service",
                            "Excessive refund requests",
                            "Using service extensively"
                          ].map((item, index) => (
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
                        Refund eligibility is determined on a case-by-case basis. Contact our support team for specific questions.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Process */}
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
                      <h2 className="text-3xl font-bold text-white">3. Refund Process</h2>
                      <p className="text-gray-400 mt-2">Simple 4-Step Process</p>
                    </div>
                  </div>

                  {/* Process Steps */}
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/30 via-pink-500/30 to-blue-500/30 hidden md:block" />
                    
                    <div className="space-y-8">
                      {refundSteps.map((step, index) => (
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
                              <div className="text-2xl font-bold text-white">{step.icon}</div>
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{step.step}</span>
                            </div>
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 pt-3">
                            <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
                            <p className="text-gray-300 mb-3">{step.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock size={14} />
                              <span>Typically takes: {step.time}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Timeline */}
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
                      <h2 className="text-3xl font-bold text-white">4. Refund Timeline</h2>
                      <p className="text-gray-400 mt-2">What to Expect & When</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Initial Response</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Time</span>
                          <span className="font-semibold text-green-300">24-48 hours</span>
                        </div>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Processing Time</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Time</span>
                          <span className="font-semibold text-blue-300">3-5 business days</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Bank Processing</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Time</span>
                          <span className="font-semibold text-purple-300">5-10 business days</span>
                        </div>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <h4 className="font-semibold text-[#E1C48A] mb-3">Total Timeline</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Time</span>
                          <span className="font-semibold text-orange-300">7-15 business days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Non-Refundable */}
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
                      <h2 className="text-3xl font-bold text-white">5. Non-Refundable Items</h2>
                      <p className="text-gray-400 mt-2">What We Cannot Refund</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-red-300">Services</h4>
                        <ul className="space-y-3">
                          {[
                            "Custom development work",
                            "One-time setup fees",
                            "Third-party integrations",
                            "Consultation sessions"
                          ].map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-red-300">Other Items</h4>
                        <ul className="space-y-3">
                          {[
                            "Digital products downloaded",
                            "Services used beyond 30 days",
                            "Domain registration fees",
                            "SSL certificates"
                          ].map((item, index) => (
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
                      <h2 className="text-3xl font-bold text-white">6. Contact Support</h2>
                      <p className="text-gray-400 mt-2">Get Help with Refunds</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Mail className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">Email</h4>
                        <p className="text-gray-400">refunds@brilson.com</p>
                        <p className="text-xs text-gray-500 mt-2">24/7 Support</p>
                      </div>
                      
                      <div className="p-5 text-center rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <Phone className="mx-auto mb-3 text-[#E1C48A]" size={24} />
                        <h4 className="font-semibold mb-2">Phone</h4>
                        <p className="text-gray-400">+1 (555) 123-4567</p>
                        <p className="text-xs text-gray-500 mt-2">Mon-Fri, 9AM-6PM EST</p>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h4 className="font-semibold text-green-300 mb-2">Required Information</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Please have the following ready when contacting support:
                      </p>
                      <ul className="grid md:grid-cols-2 gap-2 text-sm">
                        {[
                          "Order/Transaction ID",
                          "Account email address",
                          "Payment method details",
                          "Reason for refund request"
                        ].map((item, index) => (
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
    </div>
  );
};

export default RefundPolicyPage;