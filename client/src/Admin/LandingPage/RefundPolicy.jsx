import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  Shield, 
  Clock, 
  Mail, 
  Phone, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  CreditCard,
  Calendar,
  Users,
  HelpCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    hero: { 
      title: 'Refund Policy', 
      description: 'We stand behind our services with a transparent and fair refund policy. Your satisfaction is our priority.' 
    },
    refundCards: [
      { title: 'Money Back Guarantee', periodLabel: 'Days', periodValue: '30', refundAmountLabel: 'Refund', refundAmountValue: '100%' },
      { title: 'Quick Processing', periodLabel: 'Business Days', periodValue: '5-7', refundAmountLabel: 'Processing', refundAmountValue: 'Fast' },
      { title: 'Satisfaction Guaranteed', periodLabel: 'Happiness', periodValue: '100%', refundAmountLabel: 'Quality', refundAmountValue: 'Assured' }
    ],
    policyOverview: {
      title: 'Policy Overview',
      subtitle: 'Transparent & Fair Refunds',
      description: 'We believe in complete transparency when it comes to refunds. Our policy is designed to be fair to both our customers and our business.',
      moneyBackGuarantee: { title: 'Money Back Guarantee', description: 'Full refund within 30 days of purchase' },
      quickProcessing: { title: 'Quick Processing', description: 'Refunds processed within 5-7 business days' }
    },
    refundEligibility: {
      title: 'Refund Eligibility',
      subtitle: 'What Qualifies for Refund',
      eligibleCases: { 
        title: 'Eligible Cases', 
        items: ['Technical issues preventing service use', 'Billing errors or duplicate charges', 'Service not as described'] 
      },
      nonEligibleCases: { 
        title: 'Non-Eligible Cases', 
        items: ['Change of mind after purchase', 'Services already rendered', 'Third-party integrations'] 
      },
      note: 'All refund requests are reviewed on a case-by-case basis.'
    },
    refundProcess: {
      title: 'Refund Process',
      subtitle: 'Simple 4 Step Process',
      steps: [
        { stepNumber: 1, title: 'Submit Request', description: 'Contact our support team with your refund request', duration: '~5 min' },
        { stepNumber: 2, title: 'Review', description: 'We review your request and eligibility', duration: '24-48 hours' },
        { stepNumber: 3, title: 'Approval', description: 'Your refund is approved and processed', duration: '2-3 business days' },
        { stepNumber: 4, title: 'Completion', description: 'Refund is credited to your original payment method', duration: '5-7 business days' }
      ]
    },
    refundTimeline: {
      title: 'Refund Timeline',
      subtitle: 'What to Expect & When',
      items: [
        { title: 'Request Submitted', label: 'Time', value: 'Day 0' },
        { title: 'Review Process', label: 'Duration', value: '24-48 hours' },
        { title: 'Approval', label: 'Time', value: '2-3 business days' },
        { title: 'Refund Credited', label: 'Time', value: '5-7 business days' }
      ]
    },
    nonRefundableItems: {
      title: 'Non-Refundable Items',
      subtitle: 'What We Cannot Refund',
      services: { 
        title: 'Non-Refundable Services', 
        items: ['Custom development work', 'Consultation fees', 'Setup and installation fees'] 
      },
      otherItems: { 
        title: 'Other Non-Refundable Items', 
        items: ['Third-party software licenses', 'Domain registration fees', 'SSL certificates'] 
      }
    },
    contactSupport: {
      title: 'Contact Support',
      subtitle: 'Get Help with Refunds',
      email: { title: 'Email Support', value: 'refunds@brilson.com', note: 'Response within 24 hours' },
      phone: { title: 'Phone Support', value: '+1 (555) 123-4567', note: 'Available Mon-Fri 9AM-6PM' },
      requiredInformation: { 
        title: 'Required Information', 
        items: ['Order ID or Transaction Number', 'Date of Purchase', 'Reason for Refund Request'] 
      }
    }
  });

  const navigationItems = [
    { id: 'hero', label: 'Hero Section', icon: FileText },
    { id: 'refundCards', label: 'Refund Cards', icon: CreditCard },
    { id: 'policyOverview', label: 'Policy Overview', icon: Shield },
    { id: 'refundEligibility', label: 'Refund Eligibility', icon: CheckCircle },
    { id: 'refundProcess', label: 'Refund Process', icon: Clock },
    { id: 'refundTimeline', label: 'Refund Timeline', icon: Calendar },
    { id: 'nonRefundableItems', label: 'Non-Refundable Items', icon: AlertCircle },
    { id: 'contactSupport', label: 'Contact Support', icon: HelpCircle },
  ];

  useEffect(() => {
    fetchRefundPolicy();
  }, []);

  const fetchRefundPolicy = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/get/refund-policy`);
      if (response.data.success && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching refund policy:', error);
      if (error.response?.status !== 404) {
        setMessage({ text: 'Failed to load existing data', type: 'error' });
      }
    } finally {
      setFetchLoading(false);
    }
  };

  // Hero Section Handlers
  const handleHeroChange = (field, value) => {
    setFormData(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  // Refund Cards Handlers
  const handleRefundCardChange = (index, field, value) => {
    const newCards = [...formData.refundCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setFormData(prev => ({ ...prev, refundCards: newCards }));
  };

  const addRefundCard = () => {
    setFormData(prev => ({
      ...prev,
      refundCards: [
        ...prev.refundCards,
        { title: '', periodLabel: '', periodValue: '', refundAmountLabel: '', refundAmountValue: '' }
      ]
    }));
  };

  const removeRefundCard = (index) => {
    const newCards = [...formData.refundCards];
    newCards.splice(index, 1);
    setFormData(prev => ({ ...prev, refundCards: newCards }));
  };

  // Simple Change Handler
  const handleSimpleChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  // Nested Change Handler (for policyOverview moneyBackGuarantee, quickProcessing)
  const handleNestedChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: { ...prev[section][subsection], [field]: value }
      }
    }));
  };

  // For refundEligibility nested objects - FIXED
  const handleEligibilityChange = (subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      refundEligibility: {
        ...prev.refundEligibility,
        [subsection]: { 
          ...prev.refundEligibility[subsection], 
          [field]: value 
        }
      }
    }));
  };

  // For nonRefundableItems nested objects - FIXED
  const handleNonRefundableChange = (subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      nonRefundableItems: {
        ...prev.nonRefundableItems,
        [subsection]: { 
          ...prev.nonRefundableItems[subsection], 
          [field]: value 
        }
      }
    }));
  };

  // For contactSupport nested objects
  const handleContactInfoChange = (subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      contactSupport: {
        ...prev.contactSupport,
        [subsection]: { 
          ...prev.contactSupport[subsection], 
          [field]: value 
        }
      }
    }));
  };

  // Array Change Handler for nested arrays - FIXED
  const handleNestedArrayChange = (section, subsection, index, value) => {
    setFormData(prev => {
      const newItems = [...prev[section][subsection].items];
      newItems[index] = value;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: { 
            ...prev[section][subsection], 
            items: newItems 
          }
        }
      };
    });
  };

  const addNestedArrayItem = (section, subsection) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          items: [...prev[section][subsection].items, '']
        }
      }
    }));
  };

  const removeNestedArrayItem = (section, subsection, index) => {
    setFormData(prev => {
      const newItems = [...prev[section][subsection].items];
      newItems.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: { 
            ...prev[section][subsection], 
            items: newItems 
          }
        }
      };
    });
  };

  // Refund Process Steps Handlers
  const handleStepChange = (index, field, value) => {
    const newSteps = [...formData.refundProcess.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      refundProcess: { ...prev.refundProcess, steps: newSteps }
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      refundProcess: {
        ...prev.refundProcess,
        steps: [
          ...prev.refundProcess.steps,
          { stepNumber: prev.refundProcess.steps.length + 1, title: '', description: '', duration: '' }
        ]
      }
    }));
  };

  const removeStep = (index) => {
    const newSteps = [...formData.refundProcess.steps];
    newSteps.splice(index, 1);
    const renumbered = newSteps.map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
    setFormData(prev => ({
      ...prev,
      refundProcess: { ...prev.refundProcess, steps: renumbered }
    }));
  };

  // Refund Timeline Handlers
  const handleTimelineChange = (index, field, value) => {
    const newItems = [...formData.refundTimeline.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      refundTimeline: { ...prev.refundTimeline, items: newItems }
    }));
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      refundTimeline: {
        ...prev.refundTimeline,
        items: [...prev.refundTimeline.items, { title: '', label: '', value: '' }]
      }
    }));
  };

  const removeTimelineItem = (index) => {
    const newItems = [...formData.refundTimeline.items];
    newItems.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      refundTimeline: { ...prev.refundTimeline, items: newItems }
    }));
  };

  // Contact Support Array Handlers
  const handleContactArrayChange = (index, value) => {
    const newItems = [...formData.contactSupport.requiredInformation.items];
    newItems[index] = value;
    setFormData(prev => ({
      ...prev,
      contactSupport: {
        ...prev.contactSupport,
        requiredInformation: { ...prev.contactSupport.requiredInformation, items: newItems }
      }
    }));
  };

  const addContactArrayItem = () => {
    setFormData(prev => ({
      ...prev,
      contactSupport: {
        ...prev.contactSupport,
        requiredInformation: {
          ...prev.contactSupport.requiredInformation,
          items: [...prev.contactSupport.requiredInformation.items, '']
        }
      }
    }));
  };

  const removeContactArrayItem = (index) => {
    const newItems = [...formData.contactSupport.requiredInformation.items];
    newItems.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      contactSupport: {
        ...prev.contactSupport,
        requiredInformation: { ...prev.contactSupport.requiredInformation, items: newItems }
      }
    }));
  };

  // Submit Handler
  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    const cleanedData = JSON.parse(JSON.stringify(formData));

    // Clean refundCards
    if (cleanedData.refundCards) {
      cleanedData.refundCards = cleanedData.refundCards.filter(card => 
        card.title?.trim() || card.periodLabel?.trim() || card.periodValue?.trim()
      );
    }

    // Clean nested arrays
    ['refundEligibility', 'nonRefundableItems'].forEach(section => {
      if (cleanedData[section]) {
        Object.keys(cleanedData[section]).forEach(key => {
          if (cleanedData[section][key]?.items) {
            cleanedData[section][key].items = cleanedData[section][key].items.filter(i => String(i).trim());
          }
        });
      }
    });

    // Clean refundProcess steps
    if (cleanedData.refundProcess?.steps) {
      cleanedData.refundProcess.steps = cleanedData.refundProcess.steps.filter(step => 
        step.title?.trim() || step.description?.trim()
      );
    }

    // Clean refundTimeline items
    if (cleanedData.refundTimeline?.items) {
      cleanedData.refundTimeline.items = cleanedData.refundTimeline.items.filter(item => 
        item.title?.trim() || item.value?.trim()
      );
    }

    // Clean contact support array
    if (cleanedData.contactSupport?.requiredInformation?.items) {
      cleanedData.contactSupport.requiredInformation.items = 
        cleanedData.contactSupport.requiredInformation.items.filter(i => String(i).trim());
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/create-or-update/refund-policy`, cleanedData);
      if (response.data.success) {
        setMessage({ text: 'Refund Policy saved successfully!', type: 'success' });
        fetchRefundPolicy();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: response.data.message || 'Failed to save', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'An error occurred while saving', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Render Section Content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={formData.hero.description}
                onChange={(e) => handleHeroChange('description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="Enter hero description..."
              />
            </div>
          </div>
        );

      case 'refundCards':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 mb-4">Manage the 3 refund cards displayed on the page</p>
            {formData.refundCards.map((card, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-500">Card #{index + 1}</span>
                  <button onClick={() => removeRefundCard(index)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleRefundCardChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period Label</label>
                    <input
                      type="text"
                      value={card.periodLabel}
                      onChange={(e) => handleRefundCardChange(index, 'periodLabel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period Value</label>
                    <input
                      type="text"
                      value={card.periodValue}
                      onChange={(e) => handleRefundCardChange(index, 'periodValue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount Label</label>
                    <input
                      type="text"
                      value={card.refundAmountLabel}
                      onChange={(e) => handleRefundCardChange(index, 'refundAmountLabel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount Value</label>
                    <input
                      type="text"
                      value={card.refundAmountValue}
                      onChange={(e) => handleRefundCardChange(index, 'refundAmountValue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addRefundCard} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1">
              <Plus size={16} /> Add Refund Card
            </button>
          </div>
        );

      case 'policyOverview':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.policyOverview.title}
                onChange={(e) => handleSimpleChange('policyOverview', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.policyOverview.subtitle}
                onChange={(e) => handleSimpleChange('policyOverview', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.policyOverview.description}
                onChange={(e) => handleSimpleChange('policyOverview', 'description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Money Back Guarantee Title</label>
                <input
                  type="text"
                  value={formData.policyOverview.moneyBackGuarantee.title}
                  onChange={(e) => handleNestedChange('policyOverview', 'moneyBackGuarantee', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Money Back Guarantee Description</label>
                <textarea
                  rows={2}
                  value={formData.policyOverview.moneyBackGuarantee.description}
                  onChange={(e) => handleNestedChange('policyOverview', 'moneyBackGuarantee', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Processing Title</label>
                <input
                  type="text"
                  value={formData.policyOverview.quickProcessing.title}
                  onChange={(e) => handleNestedChange('policyOverview', 'quickProcessing', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Quick Processing Description</label>
                <textarea
                  rows={2}
                  value={formData.policyOverview.quickProcessing.description}
                  onChange={(e) => handleNestedChange('policyOverview', 'quickProcessing', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
          </div>
        );

      case 'refundEligibility':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.refundEligibility.title}
                onChange={(e) => handleSimpleChange('refundEligibility', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.refundEligibility.subtitle}
                onChange={(e) => handleSimpleChange('refundEligibility', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Cases Title</label>
                <input
                  type="text"
                  value={formData.refundEligibility.eligibleCases.title}
                  onChange={(e) => handleEligibilityChange('eligibleCases', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Eligible Cases Items</label>
                {formData.refundEligibility.eligibleCases.items.map((item, idx) => (
                  <div key={`eligible-${idx}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNestedArrayChange('refundEligibility', 'eligibleCases', idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                      placeholder={`Item ${idx + 1}`}
                    />
                    <button onClick={() => removeNestedArrayItem('refundEligibility', 'eligibleCases', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">Remove</button>
                  </div>
                ))}
                <button onClick={() => addNestedArrayItem('refundEligibility', 'eligibleCases')} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Item</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Non-Eligible Cases Title</label>
                <input
                  type="text"
                  value={formData.refundEligibility.nonEligibleCases.title}
                  onChange={(e) => handleEligibilityChange('nonEligibleCases', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Non-Eligible Cases Items</label>
                {formData.refundEligibility.nonEligibleCases.items.map((item, idx) => (
                  <div key={`non-eligible-${idx}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNestedArrayChange('refundEligibility', 'nonEligibleCases', idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                      placeholder={`Item ${idx + 1}`}
                    />
                    <button onClick={() => removeNestedArrayItem('refundEligibility', 'nonEligibleCases', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">Remove</button>
                  </div>
                ))}
                <button onClick={() => addNestedArrayItem('refundEligibility', 'nonEligibleCases')} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Item</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <textarea
                rows={2}
                value={formData.refundEligibility.note}
                onChange={(e) => handleSimpleChange('refundEligibility', 'note', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
          </div>
        );

      case 'refundProcess':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.refundProcess.title}
                onChange={(e) => handleSimpleChange('refundProcess', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.refundProcess.subtitle}
                onChange={(e) => handleSimpleChange('refundProcess', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Steps</label>
              {formData.refundProcess.steps.map((step, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Step #{step.stepNumber}</span>
                    <button onClick={() => removeStep(idx)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={step.duration}
                        onChange={(e) => handleStepChange(idx, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addStep} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1">
                <Plus size={16} /> Add Step
              </button>
            </div>
          </div>
        );

      case 'refundTimeline':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.refundTimeline.title}
                onChange={(e) => handleSimpleChange('refundTimeline', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.refundTimeline.subtitle}
                onChange={(e) => handleSimpleChange('refundTimeline', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Timeline Items</label>
              {formData.refundTimeline.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 mb-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleTimelineChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleTimelineChange(idx, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleTimelineChange(idx, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <button onClick={() => removeTimelineItem(idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg mb-0.5 cursor-pointer">Remove</button>
                </div>
              ))}
              <button onClick={addTimelineItem} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer flex items-center gap-1">
                <Plus size={16} /> Add Timeline Item
              </button>
            </div>
          </div>
        );

      case 'nonRefundableItems':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.nonRefundableItems.title}
                onChange={(e) => handleSimpleChange('nonRefundableItems', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.nonRefundableItems.subtitle}
                onChange={(e) => handleSimpleChange('nonRefundableItems', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Title</label>
                <input
                  type="text"
                  value={formData.nonRefundableItems.services.title}
                  onChange={(e) => handleNonRefundableChange('services', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Services Items</label>
                {formData.nonRefundableItems.services.items.map((item, idx) => (
                  <div key={`svc-${idx}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNestedArrayChange('nonRefundableItems', 'services', idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                      placeholder={`Item ${idx + 1}`}
                    />
                    <button onClick={() => removeNestedArrayItem('nonRefundableItems', 'services', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">Remove</button>
                  </div>
                ))}
                <button onClick={() => addNestedArrayItem('nonRefundableItems', 'services')} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Item</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Items Title</label>
                <input
                  type="text"
                  value={formData.nonRefundableItems.otherItems.title}
                  onChange={(e) => handleNonRefundableChange('otherItems', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Other Items</label>
                {formData.nonRefundableItems.otherItems.items.map((item, idx) => (
                  <div key={`other-${idx}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleNestedArrayChange('nonRefundableItems', 'otherItems', idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                      placeholder={`Item ${idx + 1}`}
                    />
                    <button onClick={() => removeNestedArrayItem('nonRefundableItems', 'otherItems', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">Remove</button>
                  </div>
                ))}
                <button onClick={() => addNestedArrayItem('nonRefundableItems', 'otherItems')} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Item</button>
              </div>
            </div>
          </div>
        );

      case 'contactSupport':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.contactSupport.title}
                onChange={(e) => handleSimpleChange('contactSupport', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.contactSupport.subtitle}
                onChange={(e) => handleSimpleChange('contactSupport', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Title</label>
                <input
                  type="text"
                  value={formData.contactSupport.email.title}
                  onChange={(e) => handleContactInfoChange('email', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Email Value</label>
                <input
                  type="email"
                  value={formData.contactSupport.email.value}
                  onChange={(e) => handleContactInfoChange('email', 'value', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Email Note</label>
                <input
                  type="text"
                  value={formData.contactSupport.email.note}
                  onChange={(e) => handleContactInfoChange('email', 'note', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Title</label>
                <input
                  type="text"
                  value={formData.contactSupport.phone.title}
                  onChange={(e) => handleContactInfoChange('phone', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Phone Value</label>
                <input
                  type="text"
                  value={formData.contactSupport.phone.value}
                  onChange={(e) => handleContactInfoChange('phone', 'value', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Phone Note</label>
                <input
                  type="text"
                  value={formData.contactSupport.phone.note}
                  onChange={(e) => handleContactInfoChange('phone', 'note', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Information Title</label>
              <input
                type="text"
                value={formData.contactSupport.requiredInformation.title}
                onChange={(e) => handleContactInfoChange('requiredInformation', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
              <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">Required Information Items</label>
              {formData.contactSupport.requiredInformation.items.map((item, idx) => (
                <div key={`req-${idx}`} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContactArrayChange(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                    placeholder={`Item ${idx + 1}`}
                  />
                  <button onClick={() => removeContactArrayItem(idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">Remove</button>
                </div>
              ))}
              <button onClick={addContactArrayItem} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Item</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Refund Policy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className='w-[90%] max-w-7xl mt-10'>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 text-center">Refund Policy Manager</h3>
        </div>
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 bg-white border-r border-gray-200 shadow-sm">
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Navigation</p>
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                        activeSection === item.id
                          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {navigationItems.find(i => i.id === activeSection)?.label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage content for {navigationItems.find(i => i.id === activeSection)?.label.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mx-4 sm:mx-8 mt-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
                {renderSectionContent()}
              </div>
              <div className="mt-6 flex items-center justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;