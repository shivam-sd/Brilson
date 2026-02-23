const CardProfile = require("../../models/CardProfile");
const ProfilePhoto = require("../../models/ProfileModel/ProfileLogo.Model");

const sharePublicProfile = async (req, res) => {
    try{
        const {slug} = req.params;
        const activationCode = slug;

        const ProfileName = await CardProfile.findOne({slug});
        if (!ProfileName) return res.status(404).send("Profile Name Not found");

        console.log(ProfileName.profile.name);
        
        const Profile = await ProfilePhoto.findOne({activationCode});
        if(!Profile) return res.status(404).send("Profile Photo Not Found");

        console.log(Profile.image);
        

        // <meta property="og:description" content="${profile.bio || "Digital Card on Brilson"}" />


         res.send(`

  <!DOCTYPE html>
  <html>
  <head>
    <title>${ProfileName.profile.name}</title>

    <meta property="og:title" content="${ProfileName.profile.name}" />
    <meta property="og:image" content="${Profile.image}" />
    <meta property="og:url" content="https://brilson.in/public/profile/${activationCode}" />
    <meta property="og:type" content="website" />

    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <script>
      window.location.href = "https://brilson.in/public/profile/${activationCode}";
    </script>
  </body>
  </html>

  `);

    }catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
}


module.exports = {
    sharePublicProfile
}