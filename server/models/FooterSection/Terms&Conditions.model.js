const mongoose = require("mongoose");

const termsConditionsSchema = new mongoose.Schema(
  {
    // HERO SECTION
    hero: {
      title: {
        type: String,
        default: "Terms & Conditions",
      },
      description: {
        type: String,
        default: "These terms govern your use of BRILSON's services. By accessing our platform, you agree to be bound by these terms and all applicable laws and regulations.",
      },
    },

    // INTRODUCTION
    introduction: {
      title: {
        type: String,
        default: "Introduction",
      },
      welcomeText: {
        type: String,
        default: "Welcome to BRILSON",
      },
      description: {
        type: String,
        default: "These Terms and Conditions ('Terms') govern your access to and use of our website, applications, and services ('Services').",
      },
      agreement: {
        title: {
          type: String,
          default: "Agreement",
        },
        text: {
          type: String,
          default: "By accessing or using our Services, you agree to be bound by these Terms.",
        },
      },
      review: {
        title: {
          type: String,
          default: "Review",
        },
        text: {
          type: String,
          default: "We recommend reviewing these Terms periodically as they may be updated.",
        },
      },
    },

    // ACCOUNT TERMS
    accountTerms: {
      title: {
        type: String,
        default: "Account Terms",
      },
      subtitle: {
        type: String,
        default: "Your Responsibilities",
      },
      requirements: {
        title: {
          type: String,
          default: "Requirements",
        },
        items: [String],
      },
      prohibited: {
        title: {
          type: String,
          default: "Prohibited",
        },
        items: [String],
      },
    },

    // SERVICES
    services: {
      title: {
        type: String,
        default: "Services",
      },
      subtitle: {
        type: String,
        default: "What We Provide",
      },
      items: [
        {
          number: String,
          title: String,
          description: String,
        },
      ],
      availability: {
        title: {
          type: String,
          default: "Service Availability",
        },
        description: {
          type: String,
          default: "We strive to maintain 99.9% uptime but reserve the right to modify, suspend, or discontinue any part of our Services at any time.",
        },
      },
    },

    // PAYMENTS & BILLING
    paymentsBilling: {
      title: {
        type: String,
        default: "Payments & Billing",
      },
      subtitle: {
        type: String,
        default: "Financial Terms",
      },
      subscriptionPlans: {
        title: {
          type: String,
          default: "Subscription Plans",
        },
        items: [String],
      },
      refunds: {
        title: {
          type: String,
          default: "Refunds",
        },
        items: [String],
      },
    },

    // INTELLECTUAL PROPERTY
    intellectualProperty: {
      title: {
        type: String,
        default: "Intellectual Property",
      },
      subtitle: {
        type: String,
        default: "Ownership Rights",
      },
      ourRights: {
        title: {
          type: String,
          default: "Our Rights",
        },
        description: {
          type: String,
          default: "All content, features, and functionality are owned by BRILSON and protected by international copyright laws.",
        },
      },
      yourRights: {
        title: {
          type: String,
          default: "Your Rights",
        },
        description: {
          type: String,
          default: "You retain ownership of your content but grant us license to use it for service provision.",
        },
      },
    },

    // LIMITATION OF LIABILITY
    limitationLiability: {
      title: {
        type: String,
        default: "Limitation of Liability",
      },
      subtitle: {
        type: String,
        default: "Legal Disclaimers",
      },
      maximumLiability: {
        title: {
          type: String,
          default: "Maximum Liability",
        },
        description: {
          type: String,
          default: "Our total liability shall not exceed the amount paid by you in the last 12 months.",
        },
      },
      asIsService: {
        title: {
          type: String,
          default: "Service 'As Is'",
        },
        description: {
          type: String,
          default: "Services are provided 'as is' without warranties of any kind, either express or implied.",
        },
      },
    },

    // TERMINATION
    termination: {
      title: {
        type: String,
        default: "Termination",
      },
      subtitle: {
        type: String,
        default: "Account Closure",
      },
      youMayTerminate: {
        title: {
          type: String,
          default: "You May Terminate",
        },
        description: {
          type: String,
          default: "You may terminate your account at any time through account settings.",
        },
      },
      weMayTerminate: {
        title: {
          type: String,
          default: "We May Terminate",
        },
        description: {
          type: String,
          default: "We reserve the right to terminate accounts that violate these terms.",
        },
      },
    },

    // CONTACT INFORMATION
    contactInfo: {
      title: {
        type: String,
        default: "Contact Information",
      },
      subtitle: {
        type: String,
        default: "Contact Us",
      },
      email: {
        title: {
          type: String,
          default: "Email",
        },
        value: {
          type: String,
          default: "legal@brilson.com",
        },
      },
      responseTime: {
        title: {
          type: String,
          default: "Response Time",
        },
        value: {
          type: String,
          default: "24-48 hours",
        },
      },
      support: {
        title: {
          type: String,
          default: "Support",
        },
        value: {
          type: String,
          default: "24/7 available",
        },
      },
    },

    // FOOTER SECTION
    footer: {
      title: {
        type: String,
        default: "Brilson",
      },
      description: {
        type: String,
        default: "Transform your networking with smart digital business cards. NFC & QR technology for the modern professional.",
      },
      products: {
        title: {
          type: String,
          default: "Products",
        },
        items: [String],
      },
      company: {
        title: {
          type: String,
          default: "Company",
        },
        items: [String],
      },
      contact: {
        title: {
          type: String,
          default: "Contact",
        },
        email: {
          type: String,
          default: "hello@brilson.com",
        },
        phone: {
          type: String,
          default: "+91 98765 43210",
        },
        address: {
          type: String,
          default: "Rajeshwar, India",
        },
      },
    },
  },

  {
    timestamps: true,
  }
);

const TermsConditionsModel = mongoose.model(
  "TermsConditions",
  termsConditionsSchema
);

module.exports = TermsConditionsModel;