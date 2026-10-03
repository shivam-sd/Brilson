const axios = require("axios");

const sendGreetingMessage = async (phoneNumber, name) => {
  try {
    const response = await axios.get(
      "https://aigreentick.com/api/v1/send/by_broadcast",
      {
        params: {
          api_key: process.env.AIGREEN_API_KEY,
          templatename: "registration_successful",
          country: "india",
          camp_name: "Api",

          mobile_numbers: String(phoneNumber),

          is_media: false,

          variables: String(name),
        },
      }
    );

    console.log("WhatsApp Response:", response.data);

    return response.data;
  } catch (err) {
    console.error(
      "WhatsApp Error:",
      JSON.stringify(err.response?.data, null, 2)
    );

    throw err;
  }
};

module.exports = sendGreetingMessage;