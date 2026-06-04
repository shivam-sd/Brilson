const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    // HERO SECTION
    hero: {
      title: String,
      subtitle: String,
      description: String,
      primaryButton: {
        text: String,
        link: String,
      },
      secondaryButton: {
        text: String,
        link: String,
      },
      cards: [
        {
          title: String,
          description: String,
          features: [String],
        },
      ],
    },

    // STATS SECTION
    stats: [
      {
        label: String, // Active Users
        value: String, // 10K+
        image: String,
      },
    ],

    // JOURNEY / TIMELINE
    journey: [
      {
        year: String,
        title: String,
        description: String,
        image: String,
      },
    ],

    // MISSION
    mission: {
      title: String,
      description: String,
      points: [String],
    },

    // VISION
    vision: {
      title: String,
      description: String,
      goals: [
        {
          year: String,
          text: String,
        },
      ],
    },

    // VALUES
    values: [
      {
        title: String,
        description: String,
        image: String,
      },
    ],

    // TEAM
    team: [
      {
        name: String,
        role: String,
        image: String,
        bio: String,
      },
    ],

    // TESTIMONIAL
    testimonial: {
      text: String,
      author: String,
      designation: String,
      company: String,
    },
  },
  { timestamps: true }
);

const AboutPageModel = mongoose.model("AboutPage", aboutSchema);

module.exports = AboutPageModel;