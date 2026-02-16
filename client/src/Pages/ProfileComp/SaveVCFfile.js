const downloadVCF = async (profile, logo) => {
  try {

    // Image ko base64 me convert karna
    const getBase64FromUrl = async (url) => {
      const data = await fetch(url);
      const blob = await data.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      });
    };

    let base64Image = "";

    if (logo) {
      base64Image = await getBase64FromUrl(logo);
    }

    const vcf = `
BEGIN:VCARD
FN:${profile.name}
TEL:${profile.phone}
EMAIL:${profile.email}
ORG:${profile.company}
URL:${profile.website}
ADR:${profile.address || ""}
PHOTO;ENCODING=b;TYPE=JPEG:${base64Image.replace(
      "data:image/jpeg;base64,",
      ""
    )}
END:VCARD
`;

    const blob = new Blob([vcf], { type: "text/vcard" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${profile.name}.vcf`;
    link.click();

  } catch (err) {
    console.log(err);
  }
};



export default downloadVCF;