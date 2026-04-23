const CardProfile = require("../../models/CardProfile");
const ProfilePhoto = require("../../models/ProfileModel/ProfileLogo.Model");

const sharePublicProfile = async (req, res) => {
    try{
           const { slug } = req.params;

    const userAgent = req.headers["user-agent"] || "";

    const isBot = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot/i.test(userAgent);

    const profile = await CardProfile.findOne({ slug });
    const image = await ProfilePhoto.findOne({activationCode:slug});

    console.log(profile?.profile?.name);
    console.log(profile.profile.bio);

    console.log(image);

    if (!profile) {
      return res.send("Profile not found");
    }

    console.log(isBot)

    //  BOT (WhatsApp preview)
    if (isBot) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${profile?.profile?.name}</title>
          <meta property="og:title" content="${profile?.profile?.name}" />
          <meta property="og:description" content="${profile.profile.bio}" />
          <meta property="og:image" content="${image.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm1ayfwR-KXU_ZmSpKEX9sc1Xoqv1PHDQkbQ&s"}" />
          <meta property="og:url" content="https://brilson.in/public/profile/${slug}" />
          <meta property="og:type" content="website" />
        </head>
        <body>
          <script>
            window.location.href = "https://brilson.in/public/profile/${slug}";
          </script>
        </body>
        </html>
      `);
    }

res.redirect([200] `https://brilson.in/public/profile/${slug}`)

    }catch(err){
        res.status(500).json({error:"Internal Server Error", err});
        console.log(err)
    }
}


module.exports = {
    sharePublicProfile
}