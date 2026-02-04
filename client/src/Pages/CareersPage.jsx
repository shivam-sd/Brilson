import React, { useState } from 'react';
import { 
  Search, MapPin, Briefcase, Clock, DollarSign,
  TrendingUp, Users, Heart, Zap, ChevronRight,
  BookOpen, Globe, Cpu, Palette, Shield, Coffee,
  Star, Award, Linkedin, Twitter, Instagram,
  CheckCircle, ArrowRight, Mail, Phone, Map,
  Play, Sparkles, Rocket, Target, Brain, Cloud,
  ShieldCheck, Palette as Paint, Code, MessageSquare,
  Target as TargetIcon, GitBranch, Zap as Lightning,
  Users as Team, Building, Home, Coffee as Tea,
  Calendar, Gift, Smartphone, Video, Music,
  Monitor, Headphones, Gamepad, Camera, Plane,
  Sun, Moon, Coffee as CoffeeIcon
} from 'lucide-react';

const CareersPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: ''
  });
  const [hoveredJob, setHoveredJob] = useState(null);

  const jobCategories = [
    { id: 'all', label: 'All Jobs', icon: <Briefcase size={18} />, count: 24, color: 'from-blue-500 to-cyan-500' },
    { id: 'tech', label: 'Technology', icon: <Cpu size={18} />, count: 12, color: 'from-purple-500 to-pink-500' },
    { id: 'design', label: 'Design', icon: <Palette size={18} />, count: 6, color: 'from-orange-500 to-red-500' },
    { id: 'marketing', label: 'Marketing', icon: <TrendingUp size={18} />, count: 4, color: 'from-green-500 to-emerald-500' },
    { id: 'hr', label: 'Human Resources', icon: <Users size={18} />, count: 2, color: 'from-indigo-500 to-blue-500' },
    { id: 'product', label: 'Product', icon: <Target size={18} />, count: 3, color: 'from-rose-500 to-pink-500' },
  ];

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      category: 'tech',
      type: 'Full-time',
      location: 'Remote',
      salary: '$90K - $130K',
      experience: '3+ years',
      posted: '2 days ago',
      description: 'Build cutting-edge user interfaces with React and modern JavaScript.',
      tags: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
      gradient: 'from-blue-500 to-cyan-500',
      urgent: true
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      category: 'design',
      type: 'Full-time',
      location: 'New York',
      salary: '$75K - $110K',
      experience: '2+ years',
      posted: '1 week ago',
      description: 'Create beautiful and intuitive user experiences for our products.',
      tags: ['Figma', 'UI Design', 'Prototyping', 'User Research'],
      gradient: 'from-purple-500 to-pink-500',
      featured: true
    },
    {
      id: 3,
      title: 'Digital Marketing Manager',
      category: 'marketing',
      type: 'Full-time',
      location: 'San Francisco',
      salary: '$85K - $120K',
      experience: '4+ years',
      posted: '3 days ago',
      description: 'Lead our digital marketing strategy and campaign execution.',
      tags: ['SEO', 'Social Media', 'Analytics', 'Strategy'],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: 'Backend Engineer',
      category: 'tech',
      type: 'Full-time',
      location: 'Remote',
      salary: '$95K - $140K',
      experience: '3+ years',
      posted: '5 days ago',
      description: 'Build scalable backend systems with Node.js and cloud technologies.',
      tags: ['Node.js', 'AWS', 'Python', 'MongoDB'],
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      id: 5,
      title: 'HR Manager',
      category: 'hr',
      type: 'Full-time',
      location: 'London',
      salary: '$70K - $100K',
      experience: '5+ years',
      posted: '2 weeks ago',
      description: 'Oversee talent acquisition and employee development programs.',
      tags: ['Recruitment', 'Training', 'Culture', 'Management'],
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      category: 'tech',
      type: 'Contract',
      location: 'Remote',
      salary: '$80K - $120K',
      experience: '2+ years',
      posted: '1 day ago',
      description: 'Implement and maintain CI/CD pipelines and infrastructure.',
      tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      gradient: 'from-violet-500 to-purple-500',
      new: true
    },
  ];

  const perks = [
    {
      icon: <DollarSign />,
      title: 'Competitive Salary',
      description: 'Top-tier compensation with performance bonuses',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
    },
    {
      icon: <Globe />,
      title: 'Remote First',
      description: 'Work from anywhere in the world',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: <BookOpen />,
      title: 'Learning Budget',
      description: '$5,000 annual budget for growth',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
    },
    {
      icon: <Heart />,
      title: 'Health & Wellness',
      description: 'Comprehensive medical & mental health coverage',
      color: 'from-rose-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-rose-500/20 to-pink-500/20'
    },
    {
      icon: <Shield />,
      title: 'Stock Options',
      description: 'Own a piece of what you build',
      color: 'from-amber-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
    },
    {
      icon: <Coffee />,
      title: 'Flexible Hours',
      description: 'Design your own productive schedule',
      color: 'from-indigo-500 to-blue-500',
      gradient: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20'
    },
    {
      icon: <Plane />,
      title: 'Travel Budget',
      description: '$3,000 annual travel allowance',
      color: 'from-sky-500 to-blue-500',
      gradient: 'bg-gradient-to-br from-sky-500/20 to-blue-500/20'
    },
    {
      icon: <Gamepad />,
      title: 'Gaming Zone',
      description: 'Latest consoles & gaming setups',
      color: 'from-violet-500 to-purple-500',
      gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20'
    },
  ];

  const cultureValues = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Innovation First',
      description: 'We encourage bold ideas and experimentation',
      color: 'text-purple-500'
    },
    {
      icon: <Team className="w-6 h-6" />,
      title: 'Collaborative Spirit',
      description: 'Together we achieve more',
      color: 'text-blue-500'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Excellence',
      description: 'We strive for exceptional in everything',
      color: 'text-amber-500'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Inclusivity',
      description: 'Diverse voices make us stronger',
      color: 'text-pink-500'
    },
  ];

  const testimonials = [
    {
      name: 'Alex Morgan',
      role: 'Senior Developer',
      quote: 'The best career decision I ever made. The growth opportunities are incredible.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      tenure: '2 years',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Sarah Chen',
      role: 'Product Designer',
      quote: 'Brilosn truly values creativity and innovation. The culture is amazing!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      tenure: '1.5 years',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Marketing Lead',
      quote: 'Working here feels like being part of a family that challenges you to grow.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      tenure: '3 years',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesCategory = activeCategory === 'all' || job.category === activeCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Application submitted successfully! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Floating Elements */}
      <section className="relative overflow-hidden py-32 px-4 sm:px-6 lg:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                We're Hiring
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Build Your
              </span>
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dream Career
                </span>
                <Rocket className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 text-purple-500 animate-bounce" />
              </span>
            </h1>
            
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Join a team of innovators building the future. Work on meaningful projects with cutting-edge technology and grow your career like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button className="relative flex items-center cursor-pointer">
                  Explore Open Roles
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </button>
              </button>
              
              <button className="group relative px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-600 font-bold text-lg hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 group-hover:via-blue-500/10 transition-all duration-500"></div>
                <button className="relative flex items-center cursor-pointer">
                  <Play className="mr-2" size={20} />
                  Watch Culture Video
                </button>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                label: 'Global Team', 
                value: '150+', 
                icon: <Users className="w-8 h-8" />,
                gradient: 'from-blue-500 to-cyan-500',
                description: 'Members worldwide'
              },
              { 
                label: 'Remote Culture', 
                value: '25+', 
                icon: <Globe className="w-8 h-8" />,
                gradient: 'from-purple-500 to-pink-500',
                description: 'Countries represented'
              },
              { 
                label: 'Growth Rate', 
                value: '80%', 
                icon: <Zap className="w-8 h-8" />,
                gradient: 'from-green-500 to-emerald-500',
                description: 'YoY team expansion'
              },
              { 
                label: 'Satisfaction', 
                value: '4.9/5', 
                icon: <Heart className="w-8 h-8" />,
                gradient: 'from-rose-500 to-pink-500',
                description: 'Employee happiness'
              },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="group relative p-6 rounded-3xl  border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-gray-300">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-400 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Search Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Open Positions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find your perfect role in our growing, innovative team
            </p>
          </div>

          {/* Job Listings */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobOpenings.map(job => (
              <div 
                key={job.id}
                onMouseEnter={() => setHoveredJob(job.id)}
                onMouseLeave={() => setHoveredJob(null)}
                className={`group relative rounded-3xl bg-transparent backdrop-blur-sm border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer ${
                  hoveredJob === job.id ? '-translate-y-4' : ''
                }`}
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  {job.urgent && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                      🔥 Urgent
                    </span>
                  )}
                  {job.featured && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      ⭐ Featured
                    </span>
                  )}
                  {job.new && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      🆕 New
                    </span>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${job.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Briefcase className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {job.title}
                      </h3>
                      <p className="text-gray-200 mt-3 leading-relaxed">{job.description}</p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={18} className="text-blue-500" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <DollarSign size={18} className="text-green-500" />
                        <span className="font-semibold">{job.salary}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Briefcase size={18} className="text-purple-500" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={18} className="text-amber-500" />
                        <span>{job.posted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {job.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="px-4 py-2 bg-gradient-to-br from-gray-50 to-white border border-gray-200 text-gray-700 text-sm rounded-full hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <button className="w-full group relative px-6 py-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${job.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <button className="relative flex items-center justify-center cursor-pointer">
                      Apply Now
                      <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">No positions found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search criteria or check back later for new opportunities
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4">
              <Gift className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Amazing Benefits
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perks & Benefits
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We believe in taking exceptional care of our team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 rounded-3xl bg-transparent cursor-pointer border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className={perk.gradient}></div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${perk.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  {React.cloneElement(perk.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-3">{perk.title}</h3>
                <p className="text-gray-300 leading-relaxed">{perk.description}</p>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Culture
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Where innovation meets collaboration and passion drives excellence
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Culture Values */}
            <div>
              <div className="grid grid-cols-2 gap-6">
                {cultureValues.map((value, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-transparent cursor-pointer hover:scale-105 duration-150 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`w-14 h-14 rounded-2xl ${value.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                      {value.icon}
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-200">{value.title}</h4>
                    <p className="text-gray-300 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Culture Highlights */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-white shadow-2xl">
                <h3 className="text-3xl font-bold mb-8">Why Our Team Loves It Here</h3>
                <div className="space-y-6">
                  {[
                    { text: 'Flexible remote work with no location bias', icon: '🏠' },
                    { text: 'Regular global team retreats & events', icon: '✈️' },
                    { text: '$5,000 annual learning & development budget', icon: '📚' },
                    { text: 'Cutting-edge tech stack & tools', icon: '⚡' },
                    { text: 'Flat hierarchy with transparent communication', icon: '💬' },
                    { text: 'Meaningful projects with real-world impact', icon: '🎯' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-lg">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Team Stories
              </span>
            </h2>
            <p className="text-xl text-gray-300">Hear directly from our team members</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 rounded-3xl bg-transparent border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} rounded-full blur`}></div>
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="relative w-16 h-16 rounded-full border-4 border-white"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-300">{testimonial.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400">{testimonial.role}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                        {testimonial.tenure}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-lg italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   </div>
  );
};

export default CareersPage;