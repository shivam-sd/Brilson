// AdminTermsConditions.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL12;

const TermsCondition = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    hero: { title: 'Terms & Conditions', description: '' },
    introduction: { title: 'Introduction', welcomeText: 'Welcome to BRILSON', description: '', agreement: { title: 'Agreement', text: '' }, review: { title: 'Review', text: '' } },
    accountTerms: { title: 'Account Terms', subtitle: 'Your Responsibilities', requirements: { title: 'Requirements', items: [] }, prohibited: { title: 'Prohibited', items: [] } },
    services: { title: 'Services', subtitle: 'What We Provide', items: [], availability: { title: 'Service Availability', description: '' } },
    paymentsBilling: { title: 'Payments & Billing', subtitle: 'Financial Terms', subscriptionPlans: { title: 'Subscription Plans', items: [] }, refunds: { title: 'Refunds', items: [] } },
    intellectualProperty: { title: 'Intellectual Property', subtitle: 'Ownership Rights', ourRights: { title: 'Our Rights', description: '' }, yourRights: { title: 'Your Rights', description: '' } },
    limitationLiability: { title: 'Limitation of Liability', subtitle: 'Legal Disclaimers', maximumLiability: { title: 'Maximum Liability', description: '' }, asIsService: { title: 'Service "As Is"', description: '' } },
    termination: { title: 'Termination', subtitle: 'Account Closure', youMayTerminate: { title: 'You May Terminate', description: '' }, weMayTerminate: { title: 'We May Terminate', description: '' } },
    contactInfo: { title: 'Contact Information', subtitle: 'Contact Us', email: { title: 'Email', value: '' }, responseTime: { title: 'Response Time', value: '' }, support: { title: 'Support', value: '' } },
    footer: { title: 'Brilson', description: '', products: { title: 'Products', items: [] }, company: { title: 'Company', items: [] }, contact: { title: 'Contact', email: '', phone: '', address: '' } }
  });

  const navigationItems = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'introduction', label: 'Introduction' },
    { id: 'accountTerms', label: 'Account Terms' },
    { id: 'services', label: 'Services' },
    { id: 'paymentsBilling', label: 'Payments & Billing' },
    { id: 'intellectualProperty', label: 'Intellectual Property' },
    { id: 'limitationLiability', label: 'Limitation of Liability' },
    { id: 'termination', label: 'Termination' },
    { id: 'contactInfo', label: 'Contact Information' },
    { id: 'footer', label: 'Footer' },
  ];

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/terms-conditions/get`);
      if (response.data.success && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      if (error.response?.status !== 404) {
        setMessage({ text: 'Failed to load existing data', type: 'error' });
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setFormData(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const handleSimpleChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [subsection]: { ...prev[section][subsection], [field]: value } }
    }));
  };

  // Fixed: For direct properties like agreement.title, review.title etc.
  const handleIntroNestedChange = (subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      introduction: {
        ...prev.introduction,
        [subsection]: { ...prev.introduction[subsection], [field]: value }
      }
    }));
  };

  // Fixed: For termination and other sections with direct properties
  const handleTerminationChange = (subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      termination: {
        ...prev.termination,
        [subsection]: { ...prev.termination[subsection], [field]: value }
      }
    }));
  };

  // Fixed: For intellectual property
  const handleIPChange = (subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      intellectualProperty: {
        ...prev.intellectualProperty,
        [subsection]: { ...prev.intellectualProperty[subsection], [field]: value }
      }
    }));
  };

  // Fixed: For limitation liability
  const handleLimitationChange = (subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      limitationLiability: {
        ...prev.limitationLiability,
        [subsection]: { ...prev.limitationLiability[subsection], [field]: value }
      }
    }));
  };

  // Fixed: For contact info
  const handleContactInfoChange = (subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [subsection]: { ...prev.contactInfo[subsection], [field]: value }
      }
    }));
  };

  const handleArrayChange = (section, subsection, index, value) => {
    const newItems = [...formData[section][subsection].items];
    newItems[index] = value;
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [subsection]: { ...prev[section][subsection], items: newItems } }
    }));
  };

  const addArrayItem = (section, subsection) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: { ...prev[section][subsection], items: [...prev[section][subsection].items, ''] }
      }
    }));
  };

  const removeArrayItem = (section, subsection, index) => {
    const newItems = [...formData[section][subsection].items];
    newItems.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [subsection]: { ...prev[section][subsection], items: newItems } }
    }));
  };

  const handleServicesItemsChange = (index, field, value) => {
    const newItems = [...formData.services.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, services: { ...prev.services, items: newItems } }));
  };

  const addServiceItem = () => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: [...prev.services.items, { number: String(prev.services.items.length + 1), title: '', description: '' }]
      }
    }));
  };

  const removeServiceItem = (index) => {
    const newItems = [...formData.services.items];
    newItems.splice(index, 1);
    const renumbered = newItems.map((item, idx) => ({ ...item, number: String(idx + 1) }));
    setFormData(prev => ({ ...prev, services: { ...prev.services, items: renumbered } }));
  };

  const handleFooterArrayChange = (section, index, value) => {
    const newItems = [...formData.footer[section].items];
    newItems[index] = value;
    setFormData(prev => ({
      ...prev,
      footer: { ...prev.footer, [section]: { ...prev.footer[section], items: newItems } }
    }));
  };

  const addFooterArrayItem = (section) => {
    setFormData(prev => ({
      ...prev,
      footer: { ...prev.footer, [section]: { ...prev.footer[section], items: [...prev.footer[section].items, ''] } }
    }));
  };

  const removeFooterArrayItem = (section, index) => {
    const newItems = [...formData.footer[section].items];
    newItems.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      footer: { ...prev.footer, [section]: { ...prev.footer[section], items: newItems } }
    }));
  };

  const handleFooterContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      footer: { ...prev.footer, contact: { ...prev.footer.contact, [field]: value } }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    const cleanedData = JSON.parse(JSON.stringify(formData));
    
    // Clean arrays
    const arraySections = ['accountTerms', 'paymentsBilling'];
    arraySections.forEach(section => {
      if (cleanedData[section]?.requirements?.items) {
        cleanedData[section].requirements.items = cleanedData[section].requirements.items.filter(i => i.trim());
      }
      if (cleanedData[section]?.prohibited?.items) {
        cleanedData[section].prohibited.items = cleanedData[section].prohibited.items.filter(i => i.trim());
      }
      if (cleanedData[section]?.subscriptionPlans?.items) {
        cleanedData[section].subscriptionPlans.items = cleanedData[section].subscriptionPlans.items.filter(i => i.trim());
      }
      if (cleanedData[section]?.refunds?.items) {
        cleanedData[section].refunds.items = cleanedData[section].refunds.items.filter(i => i.trim());
      }
    });
    
    if (cleanedData.services?.items) {
      cleanedData.services.items = cleanedData.services.items.filter(i => i.title.trim() || i.description.trim());
    }
    
    if (cleanedData.footer?.products?.items) {
      cleanedData.footer.products.items = cleanedData.footer.products.items.filter(i => i.trim());
    }
    
    if (cleanedData.footer?.company?.items) {
      cleanedData.footer.company.items = cleanedData.footer.company.items.filter(i => i.trim());
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/terms-conditions/create-or-update`, cleanedData);
      if (response.data.success) {
        setMessage({ text: 'Terms & Conditions saved successfully!', type: 'success' });
        fetchTerms();
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

      case 'introduction':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.introduction.title}
                onChange={(e) => handleSimpleChange('introduction', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Text</label>
              <input
                type="text"
                value={formData.introduction.welcomeText}
                onChange={(e) => handleSimpleChange('introduction', 'welcomeText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.introduction.description}
                onChange={(e) => handleSimpleChange('introduction', 'description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Title</label>
                <input
                  type="text"
                  value={formData.introduction.agreement.title}
                  onChange={(e) => handleIntroNestedChange('agreement', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Agreement Text</label>
                <input
                  type="text"
                  value={formData.introduction.agreement.text}
                  onChange={(e) => handleIntroNestedChange('agreement', 'text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                <input
                  type="text"
                  value={formData.introduction.review.title}
                  onChange={(e) => handleIntroNestedChange('review', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Review Text</label>
                <input
                  type="text"
                  value={formData.introduction.review.text}
                  onChange={(e) => handleIntroNestedChange('review', 'text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
          </div>
        );

      case 'accountTerms':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.accountTerms.title}
                onChange={(e) => handleSimpleChange('accountTerms', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.accountTerms.subtitle}
                onChange={(e) => handleSimpleChange('accountTerms', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              {formData.accountTerms.requirements.items.map((item, idx) => (
                <div key={`req-${idx}`} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('accountTerms', 'requirements', idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                    placeholder={`Requirement ${idx + 1}`}
                  />
                  <button onClick={() => removeArrayItem('accountTerms', 'requirements', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer">Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('accountTerms', 'requirements')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">+ Add Requirement</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prohibited</label>
              {formData.accountTerms.prohibited.items.map((item, idx) => (
                <div key={`pro-${idx}`} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('accountTerms', 'prohibited', idx, e.target.value)}
                    className="flex-1 px-4 py-2 border text-black border-gray-300 rounded-lg"
                    placeholder={`Prohibited ${idx + 1}`}
                  />
                  <button onClick={() => removeArrayItem('accountTerms', 'prohibited', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer">Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('accountTerms', 'prohibited')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">+ Add Prohibited</button>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.services.title}
                onChange={(e) => handleSimpleChange('services', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.services.subtitle}
                onChange={(e) => handleSimpleChange('services', 'subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Items</label>
              {formData.services.items.map((item, idx) => (
                <div key={`svc-${idx}`} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Item #{item.number || idx + 1}</span>
                    <button onClick={() => removeServiceItem(idx)} className="text-red-600 hover:text-red-800 text-sm cursor-pointer">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => handleServicesItemsChange(idx, 'title', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-black"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleServicesItemsChange(idx, 'description', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                </div>
              ))}
              <button onClick={addServiceItem} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">+ Add Service Item</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability Title</label>
              <input
                type="text"
                value={formData.services.availability.title}
                onChange={(e) => handleNestedChange('services', 'availability', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
              <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Availability Description</label>
              <textarea
                rows={2}
                value={formData.services.availability.description}
                onChange={(e) => handleNestedChange('services', 'availability', 'description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
          </div>
        );

      case 'paymentsBilling':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.paymentsBilling.title}
                onChange={(e) => handleSimpleChange('paymentsBilling', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plans</label>
              {formData.paymentsBilling.subscriptionPlans.items.map((item, idx) => (
                <div key={`sub-${idx}`} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('paymentsBilling', 'subscriptionPlans', idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                    placeholder={`Plan ${idx + 1}`}
                  />
                  <button onClick={() => removeArrayItem('paymentsBilling', 'subscriptionPlans', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('paymentsBilling', 'subscriptionPlans')} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Plan Item</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refunds</label>
              {formData.paymentsBilling.refunds.items.map((item, idx) => (
                <div key={`ref-${idx}`} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('paymentsBilling', 'refunds', idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                    placeholder={`Refund ${idx + 1}`}
                  />
                  <button onClick={() => removeArrayItem('paymentsBilling', 'refunds', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('paymentsBilling', 'refunds')} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Refund Item</button>
            </div>
          </div>
        );

      case 'intellectualProperty':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.intellectualProperty.title}
                onChange={(e) => handleSimpleChange('intellectualProperty', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Our Rights Title</label>
                <input
                  type="text"
                  value={formData.intellectualProperty.ourRights.title}
                  onChange={(e) => handleIPChange('ourRights', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Our Rights Description</label>
                <textarea
                  rows={3}
                  value={formData.intellectualProperty.ourRights.description}
                  onChange={(e) => handleIPChange('ourRights', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rights Title</label>
                <input
                  type="text"
                  value={formData.intellectualProperty.yourRights.title}
                  onChange={(e) => handleIPChange('yourRights', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Your Rights Description</label>
                <textarea
                  rows={3}
                  value={formData.intellectualProperty.yourRights.description}
                  onChange={(e) => handleIPChange('yourRights', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
          </div>
        );

      case 'limitationLiability':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.limitationLiability.title}
                onChange={(e) => handleSimpleChange('limitationLiability', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Liability Title</label>
                <input
                  type="text"
                  value={formData.limitationLiability.maximumLiability.title}
                  onChange={(e) => handleLimitationChange('maximumLiability', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Maximum Liability Description</label>
                <textarea
                  rows={3}
                  value={formData.limitationLiability.maximumLiability.description}
                  onChange={(e) => handleLimitationChange('maximumLiability', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service "As Is" Title</label>
                <input
                  type="text"
                  value={formData.limitationLiability.asIsService.title}
                  onChange={(e) => handleLimitationChange('asIsService', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Service "As Is" Description</label>
                <textarea
                  rows={3}
                  value={formData.limitationLiability.asIsService.description}
                  onChange={(e) => handleLimitationChange('asIsService', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
          </div>
        );

      case 'termination':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.termination.title}
                onChange={(e) => handleSimpleChange('termination', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">You May Terminate Title</label>
                <input
                  type="text"
                  value={formData.termination.youMayTerminate.title}
                  onChange={(e) => handleTerminationChange('youMayTerminate', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">You May Terminate Description</label>
                <textarea
                  rows={3}
                  value={formData.termination.youMayTerminate.description}
                  onChange={(e) => handleTerminationChange('youMayTerminate', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">We May Terminate Title</label>
                <input
                  type="text"
                  value={formData.termination.weMayTerminate.title}
                  onChange={(e) => handleTerminationChange('weMayTerminate', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">We May Terminate Description</label>
                <textarea
                  rows={3}
                  value={formData.termination.weMayTerminate.description}
                  onChange={(e) => handleTerminationChange('weMayTerminate', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
          </div>
        );

      case 'contactInfo':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.contactInfo.title}
                onChange={(e) => handleSimpleChange('contactInfo', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Title</label>
                <input
                  type="text"
                  value={formData.contactInfo.email.title}
                  onChange={(e) => handleContactInfoChange('email', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Email Value</label>
                <input
                  type="email"
                  value={formData.contactInfo.email.value}
                  onChange={(e) => handleContactInfoChange('email', 'value', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time Title</label>
                <input
                  type="text"
                  value={formData.contactInfo.responseTime.title}
                  onChange={(e) => handleContactInfoChange('responseTime', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Response Time Value</label>
                <input
                  type="text"
                  value={formData.contactInfo.responseTime.value}
                  onChange={(e) => handleContactInfoChange('responseTime', 'value', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Title</label>
                <input
                  type="text"
                  value={formData.contactInfo.support.title}
                  onChange={(e) => handleContactInfoChange('support', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Support Value</label>
                <input
                  type="text"
                  value={formData.contactInfo.support.value}
                  onChange={(e) => handleContactInfoChange('support', 'value', e.target.value)}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.footer.title}
                onChange={(e) => handleSimpleChange('footer', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.footer.description}
                onChange={(e) => handleSimpleChange('footer', 'description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Products</label>
                {formData.footer.products.items.map((item, idx) => (
                  <div key={`prod-${idx}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleFooterArrayChange('products', idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                    />
                    <button onClick={() => removeFooterArrayItem('products', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">X</button>
                  </div>
                ))}
                <button onClick={() => addFooterArrayItem('products')} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Product</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                {formData.footer.company.items.map((item, idx) => (
                  <div key={`comp-${idx}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleFooterArrayChange('company', idx, e.target.value)}
                      className="flex-1 text-black px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button onClick={() => removeFooterArrayItem('company', idx)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer">X</button>
                  </div>
                ))}
                <button onClick={() => addFooterArrayItem('company')} className="mt-2 text-sm text-indigo-600 font-medium cursor-pointer">+ Add Company Item</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.footer.contact.email}
                  onChange={(e) => handleFooterContactChange('email', e.target.value)}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.footer.contact.phone}
                  onChange={(e) => handleFooterContactChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.footer.contact.address}
                  onChange={(e) => handleFooterContactChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
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
          <p className="mt-4 text-gray-600">Loading Terms & Conditions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className='w-[70%] mt-10'>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 text-center">Terms & Conditions</h3>
        </div>
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-72 bg-white border-r border-gray-200 min-h-screen shadow-sm">
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Navigation</p>
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {navigationItems.find(i => i.id === activeSection)?.label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage content for the {navigationItems.find(i => i.id === activeSection)?.label.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mx-8 mt-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {renderSectionContent()}
              </div>
            </div>
            <div className="w-full flex items-center justify-center pb-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;