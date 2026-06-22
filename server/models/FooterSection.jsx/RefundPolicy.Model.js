const mongoose = require("mongoose");

const refundPolicySchema = new mongoose.Schema(
{
  // HERO SECTION
  hero: {
    title: {
      type: String,
      default: "Refund Policy",
    },
    description: {
      type: String,
      default:
        "We stand behind our services with a transparent and fair refund policy. Your satisfaction is our priority.",
    },
  },

  // TOP REFUND CARDS
  refundCards: [
    {
      title: String,
      periodLabel: String,
      periodValue: String,
      refundAmountLabel: String,
      refundAmountValue: String,
    },
  ],

  // POLICY OVERVIEW
  policyOverview: {
    title: {
      type: String,
      default: "Policy Overview",
    },
    subtitle: {
      type: String,
      default: "Transparent & Fair Refunds",
    },
    description: String,

    moneyBackGuarantee: {
      title: String,
      description: String,
    },

    quickProcessing: {
      title: String,
      description: String,
    },
  },

  // REFUND ELIGIBILITY
  refundEligibility: {
    title: {
      type: String,
      default: "Refund Eligibility",
    },
    subtitle: {
      type: String,
      default: "What Qualifies for Refund",
    },

    eligibleCases: {
      title: String,
      items: [String],
    },

    nonEligibleCases: {
      title: String,
      items: [String],
    },

    note: String,
  },

  // REFUND PROCESS
  refundProcess: {
    title: {
      type: String,
      default: "Refund Process",
    },
    subtitle: {
      type: String,
      default: "Simple 4 Step Process",
    },

    steps: [
      {
        stepNumber: Number,
        title: String,
        description: String,
        duration: String,
      },
    ],
  },

  // REFUND TIMELINE
  refundTimeline: {
    title: {
      type: String,
      default: "Refund Timeline",
    },
    subtitle: {
      type: String,
      default: "What to Expect & When",
    },

    items: [
      {
        title: String,
        label: String,
        value: String,
      },
    ],
  },

  // NON REFUNDABLE ITEMS
  nonRefundableItems: {
    title: {
      type: String,
      default: "Non-Refundable Items",
    },
    subtitle: {
      type: String,
      default: "What We Cannot Refund",
    },

    services: {
      title: String,
      items: [String],
    },

    otherItems: {
      title: String,
      items: [String],
    },
  },

  // CONTACT SUPPORT
  contactSupport: {
    title: {
      type: String,
      default: "Contact Support",
    },
    subtitle: {
      type: String,
      default: "Get Help with Refunds",
    },

    email: {
      title: String,
      value: String,
      note: String,
    },

    phone: {
      title: String,
      value: String,
      note: String,
    },

    requiredInformation: {
      title: String,
      items: [String],
    },
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model(
  "Refund Policy", 
  refundPolicySchema
);