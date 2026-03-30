import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  CreditCard, 
  Cloud, 
  Save, 
  Lock, 
  Key,
  Eye,
  EyeOff,
  Shield,
  Server,
  Globe,
  Link
} from "lucide-react";

const AdminConfig = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSecrets, setShowSecrets] = useState({
    razorpayKeySecret: false,
    cloudinaryApiSecret: false,
    cashfreeSecretKey: false,
    payUSalt: false,
  });

  const [formData, setFormData] = useState({
    // Razorpay
    razorpayKeyId: "",
    razorpayKeySecret: "",
    // Cashfree
    cashfreeAppId: "",
    cashfreeSecretKey: "",
    cashfreeEnvironment: "",
    // PayU
    payUKey: "",
    payUSalt: "",
    payUBaseUrl: "",
    // Cloudinary
    cloudinaryName: "",
    cloudinaryApiKey: "",
    cloudinaryApiSecret: "",
  });

  const navigate = useNavigate();

  // Fetch existing configuration on component mount
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/config`,
      { withCredentials: true }
    );
    
    // Check if response has success flag and config data
    if (res.data.success && res.data.config) {
      const config = res.data.config;
      setFormData({
        // Razorpay
        razorpayKeyId: config.razorpay?.keyId || "",
        razorpayKeySecret: config.razorpay?.keySecret || "",
        // Cashfree
        cashfreeAppId: config.cashfree?.appId || "",
        cashfreeSecretKey: config.cashfree?.secretKey || "",
        cashfreeEnvironment: config.cashfree?.environment || "sandbox",
        // PayU
        payUKey: config.payU?.key || "",
        payUSalt: config.payU?.salt || "",
        payUBaseUrl: config.payU?.payUBaseUrl || "https://test.payu.in",
        // Cloudinary
        cloudinaryName: config.cloudinary?.cloudName || "",
        cloudinaryApiKey: config.cloudinary?.apiKey || "",
        cloudinaryApiSecret: config.cloudinary?.apiSecret || "",
      });
    } else if (res.data.config) {
      // Handle case without success flag but with config
      const config = res.data.config;
      setFormData({
        razorpayKeyId: config.razorpay?.keyId || "",
        razorpayKeySecret: config.razorpay?.keySecret || "",
        cashfreeAppId: config.cashfree?.appId || "",
        cashfreeSecretKey: config.cashfree?.secretKey || "",
        cashfreeEnvironment: config.cashfree?.environment || "sandbox",
        payUKey: config.payU?.key || "",
        payUSalt: config.payU?.salt || "",
        payUBaseUrl: config.payU?.payUBaseUrl || "https://test.payu.in",
        cloudinaryName: config.cloudinary?.cloudName || "",
        cloudinaryApiKey: config.cloudinary?.apiKey || "",
        cloudinaryApiSecret: config.cloudinary?.apiSecret || "",
      });
    }
  } catch (err) {
    console.error("Error fetching config:", err);
    // Don't show error toast if it's just a 404 (no config found)
    if (err.response?.status !== 404) {
      toast.error("Failed to fetch existing configuration");
    }
  } finally {
    setFetching(false);
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSecretVisibility = (field) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {

    const payload = {};

    // Razorpay
    if (
      formData.razorpayKeyId ||
      (formData.razorpayKeySecret && formData.razorpayKeySecret !== "********")
    ) {
      payload.razorpay = {};
      if (formData.razorpayKeyId)
        payload.razorpay.keyId = formData.razorpayKeyId;

      if (
        formData.razorpayKeySecret &&
        formData.razorpayKeySecret !== "********"
      )
        payload.razorpay.keySecret = formData.razorpayKeySecret;
    }

    // Cashfree
    if (
      formData.cashfreeAppId ||
      (formData.cashfreeSecretKey &&
        formData.cashfreeSecretKey !== "********") ||
      formData.cashfreeEnvironment
    ) {
      payload.cashfree = {};

      if (formData.cashfreeAppId)
        payload.cashfree.appId = formData.cashfreeAppId;

      if (
        formData.cashfreeSecretKey &&
        formData.cashfreeSecretKey !== "********"
      )
        payload.cashfree.secretKey = formData.cashfreeSecretKey;

      if (formData.cashfreeEnvironment)
        payload.cashfree.environment = formData.cashfreeEnvironment;
    }

    // PayU
    if (
      formData.payUKey ||
      (formData.payUSalt && formData.payUSalt !== "********") ||
      formData.payUBaseUrl
    ) {
      payload.payU = {};

      if (formData.payUKey) payload.payU.key = formData.payUKey;

      if (formData.payUSalt && formData.payUSalt !== "********")
        payload.payU.salt = formData.payUSalt;

      if (formData.payUBaseUrl)
        payload.payU.payUBaseUrl = formData.payUBaseUrl;
    }

    // Cloudinary
    if (
      formData.cloudinaryName ||
      formData.cloudinaryApiKey ||
      (formData.cloudinaryApiSecret &&
        formData.cloudinaryApiSecret !== "********")
    ) {
      payload.cloudinary = {};

      if (formData.cloudinaryName)
        payload.cloudinary.cloudName = formData.cloudinaryName;

      if (formData.cloudinaryApiKey)
        payload.cloudinary.apiKey = formData.cloudinaryApiKey;

      if (
        formData.cloudinaryApiSecret &&
        formData.cloudinaryApiSecret !== "********"
      )
        payload.cloudinary.apiSecret = formData.cloudinaryApiSecret;
    }

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/config/update`,
      payload,
      { withCredentials: true }
    );

    toast.success("Configuration updated successfully!");
    navigate("/admindashboard");

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to update configuration"
    );
    console.error("Update error:", err);
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl md:text-3xl text-center text-white">
              Configuration Settings
            </p>
          </div>
          <p className="text-gray-300 text-center">
            Manage your payment gateway and media storage configurations
          </p>
        </div>

        <div className="bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            
            {/* Razorpay Section */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Razorpay Payment Gateway
                  </h2>
                  <p className="text-sm text-gray-500">
                    Razorpay configuration for payment processing
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Razorpay Key ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="razorpayKeyId"
                      value={formData.razorpayKeyId}
                      placeholder="rzp_test_xxxxxxxxxxxx"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-black"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Razorpay Key Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.razorpayKeySecret ? "text" : "password"}
                      name="razorpayKeySecret"
                      value={formData.razorpayKeySecret}
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 pr-12 text-black"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility("razorpayKeySecret")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets.razorpayKeySecret ? (
                        <EyeOff className="w-5 h-5 cursor-pointer" />
                      ) : (
                        <Eye className="w-5 h-5 cursor-pointer" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your key secret is encrypted and stored securely
                  </p>
                </div>
              </div>
            </div>

            {/* Cashfree Section */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Cashfree Payment Gateway
                  </h2>
                  <p className="text-sm text-gray-500">
                    Cashfree configuration for alternative payment processing
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Cashfree App ID
                  </label>
                  <input
                    type="text"
                    name="cashfreeAppId"
                    value={formData.cashfreeAppId}
                    placeholder="your-app-id"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-black"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Cashfree Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.cashfreeSecretKey ? "text" : "password"}
                      name="cashfreeSecretKey"
                      value={formData.cashfreeSecretKey}
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 pr-12 text-black"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility("cashfreeSecretKey")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets.cashfreeSecretKey ? (
                        <EyeOff className="w-5 h-5 cursor-pointer" />
                      ) : (
                        <Eye className="w-5 h-5 cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Cashfree Environment
                  </label>
                  <select
                    name="cashfreeEnvironment"
                    value={formData.cashfreeEnvironment}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-black"
                  >
                    <option value="sandbox">Sandbox (Test)</option>
                    <option value="production">Production (Live)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Use Sandbox for testing, Production for live payments
                  </p>
                </div>
              </div>
            </div>

            {/* PayU Section */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    PayU Payment Gateway
                  </h2>
                  <p className="text-sm text-gray-500">
                    PayU configuration for payment processing
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    PayU Key
                  </label>
                  <input
                    type="text"
                    name="payUKey"
                    value={formData.payUKey}
                    placeholder="your-payu-key"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-black"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    PayU Salt
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.payUSalt ? "text" : "password"}
                      name="payUSalt"
                      value={formData.payUSalt}
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 pr-12 text-black"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility("payUSalt")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets.payUSalt ? (
                        <EyeOff className="w-5 h-5 cursor-pointer" />
                      ) : (
                        <Eye className="w-5 h-5 cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    PayU Base URL
                  </label>
                  <input
                    type="text"
                    name="payUBaseUrl"
                    value={formData.payUBaseUrl}
                    placeholder="https://test.payu.in"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-black"
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Use https://test.payu.in for testing, https://secure.payu.in for production
                  </p>
                </div>
              </div>
            </div>

            {/* Cloudinary Section */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Cloud className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Media Storage
                  </h2>
                  <p className="text-sm text-gray-500">
                    Cloudinary configuration for image and file storage
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Cloudinary Cloud Name
                  </label>
                  <input
                    type="text"
                    name="cloudinaryName"
                    value={formData.cloudinaryName}
                    placeholder="your-cloud-name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-black"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Cloudinary API Key
                  </label>
                  <input
                    type="text"
                    name="cloudinaryApiKey"
                    value={formData.cloudinaryApiKey}
                    placeholder="123456789012345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-black"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Cloudinary API Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.cloudinaryApiSecret ? "text" : "password"}
                      name="cloudinaryApiSecret"
                      value={formData.cloudinaryApiSecret}
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 pr-12 text-black"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility("cloudinaryApiSecret")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets.cloudinaryApiSecret ? (
                        <EyeOff className="w-5 h-5 cursor-pointer" />
                      ) : (
                        <Eye className="w-5 h-5 cursor-pointer" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Keep your API secrets confidential
                  </p>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    Security Information
                  </h3>
                  <p className="text-xs text-blue-600">
                    All sensitive information is encrypted before storage. 
                    Never share your API keys or secrets with unauthorized parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto min-w-[200px] px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Changes will take effect immediately after saving
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;