import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  Shield, 
  Zap,
  TrendingUp,
  Star,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Quote,
  Mail,
  MapPin,
  Phone,
  Calendar,
  UserPlus,
  UsersIcon,
  Briefcase,
  DollarSign,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  const [activeSection, setActiveSection] = useState('story');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const stats = [
    { value: '10K+', label: 'Active Users', icon: <Users size={24} />, color: 'from-blue-500/20 to-cyan-500/20' },
    { value: '99.9%', label: 'Uptime', icon: <Shield size={24} />, color: 'from-purple-500/20 to-pink-500/20' },
    { value: '4.9', label: 'Rating', icon: <Star size={24} />, color: 'from-yellow-500/20 to-amber-500/20' }
  ];

  const values = [
    {
      title: 'Innovation First',
      description: 'Pushing boundaries in digital networking',
      icon: <Rocket className="text-blue-400" size={24} />,
      color: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Customer Centric',
      description: 'Your success is our priority',
      icon: <Heart className="text-red-400" size={24} />,
      color: 'bg-gradient-to-br from-red-500/10 to-pink-500/10'
    },
    {
      title: 'Excellence',
      description: 'Striving for perfection in everything',
      icon: <Award className="text-yellow-400" size={24} />,
      color: 'bg-gradient-to-br from-yellow-500/10 to-amber-500/10'
    },
    {
      title: 'Growth Mindset',
      description: 'Always learning, always improving',
      icon: <TrendingUp className="text-green-400" size={24} />,
      color: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10'
    }
  ];

  const team = [
    {
      name: 'Alex Morgan',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      description: 'Visionary leader with 15+ years in tech'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w-400&h=400&fit=crop',
      description: 'Tech expert with AI/ML specialization'
    },
    {
      name: 'David Park',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      description: 'Product genius with user-first approach'
    },
    {
      name: 'Maria Garcia',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      description: 'Growth hacker with proven track record'
    }
  ];

  const milestones = [
    { year: '2022', event: 'BRILSON Founded', icon: '🚀' },
    { year: '2023', event: 'First 1000 Users', icon: '👥' },
    { year: '2024', event: 'International Launch', icon: '🌍' },
    { year: '2024', event: 'Mobile App Release', icon: '📱' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#E1C48A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-3xl" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#E1C48A]/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-[#E1C48A] to-white bg-clip-text text-transparent">
                  Redefining
                </span>
                <br />
                <span className="text-white">Digital Networking</span>
              </h2>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                BRILSON is more than a platform—it's a movement. We're building the future 
                of professional connections with cutting-edge technology and human-centric design.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] text-black font-bold shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  Join Our Community
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-white/10 to-transparent border border-white/10 hover:border-[#E1C48A]/40 transition-colors cursor-pointer"
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-10 left-10 w-64 h-72 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm p-6 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <UserPlus className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Smart Connections</h3>
                <p className="text-sm text-gray-300">AI-powered networking</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-10 right-10 w-64 h-72 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm p-6 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Briefcase className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Business Growth</h3>
                <p className="text-sm text-gray-300">Expand your professional reach</p>
              </motion.div>

              {/* Center Main Card */}
              <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] flex items-center justify-center">
                      <Zap className="text-black" size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">BRILSON AI</h3>
                      <p className="text-gray-400">Next-gen networking platform</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-400" size={20} />
                      <span className="text-gray-300">Instant Profile Creation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-400" size={20} />
                      <span className="text-gray-300">Smart Matchmaking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-400" size={20} />
                      <span className="text-gray-300">Real-time Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 backdrop-blur-sm cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] bg-clip-text text-transparent">
                Our Journey
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From a simple idea to a global platform transforming how professionals connect.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#E1C48A]/30 via-purple-500/30 to-blue-500/30" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                      <div className="text-5xl mb-4">{milestone.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{milestone.year}</h3>
                      <p className="text-gray-300">{milestone.event}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="relative w-4 h-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] rounded-full" />
                    <div className="absolute inset-0 animate-ping bg-[#E1C48A]/30 rounded-full" />
                  </div>

                  {/* Empty Space */}
                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Target className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                To democratize professional networking by making it accessible, intelligent, 
                and meaningful for everyone, everywhere.
              </p>
              <ul className="space-y-4">
                {[
                  'Break down barriers in professional connections',
                  'Leverage AI for smarter networking',
                  'Create value for every interaction',
                  'Foster global professional communities'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <Globe className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                To become the world's most trusted platform for professional growth and 
                meaningful business connections.
              </p>
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#E1C48A] mb-2">By 2025</h4>
                  <p className="text-gray-300">Serve 1 million professionals worldwide</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-[#E1C48A] mb-2">By 2027</h4>
                  <p className="text-gray-300">Launch AI-powered career mentorship</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide every decision we make and every feature we build.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`p-6 rounded-2xl ${value.color} border border-white/10 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{value.title}</h3>
                </div>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#E1C48A] to-[#C9A86A] bg-clip-text text-transparent">
                Meet The Team
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Passionate innovators building the future of professional networking.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-6">
                  {/* Image */}
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#E1C48A]/30">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-bold text-white text-center mb-2">{member.name}</h3>
                  <p className="text-[#E1C48A] text-center mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm text-center">{member.description}</p>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E1C48A]/10 to-[#C9A86A]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-xl"
          >
            <Quote className="absolute top-8 left-8 text-[#E1C48A]/20" size={48} />
            <Quote className="absolute bottom-8 right-8 text-[#E1C48A]/20" size={48} />

            <div className="text-center">
              <p className="text-2xl md:text-3xl text-gray-300 italic mb-8 leading-relaxed">
                "BRILSON has transformed how our company connects with clients. The platform's 
                intuitive design and powerful features have increased our networking efficiency 
                by 300%."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E1C48A] to-[#C9A86A]" />
                <div>
                  <h4 className="font-bold text-white">Michael Rodriguez</h4>
                  <p className="text-gray-400">CEO, TechGrowth Inc.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
  );
};

export default AboutUsPage;