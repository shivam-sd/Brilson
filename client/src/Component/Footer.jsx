import axios from "axios";
import { icons, LucideBadgeHelp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  const [bottomLinks, setbottomLinks] = useState([]);
  const [Company, setCompany] = useState([]);
  const [Contact, setContact] = useState("");
  // const [Support, SetSupport] = useState([]);
  const [Social, setSocial] = useState("");
  const [Products, setProducts] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/footer`,
        );

        //  console.log(res.data.data);
        setProducts(res.data.data.products);
        setbottomLinks(res.data.data.bottomLinks);
        setCompany(res.data.data.company);
        setContact(res.data.data.contact);
        setSocial(res.data.data.socialLinks);
        //  SetSupport(res.data.data.support);
        setDescription(res.data.data.description);
      } catch (err) {
        console.log("Footer Load Error", err);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="w-full bg-black shadow-2xl border-t border-white/8 text-gray-300 px-6 md:px-12 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 ">
        {/* Brand Section */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center">
            <img src="./logo2.png" alt="" className="w-6" loading="lazy" />
            <h2 className="text-3xl font-semibold text-white">RILSON</h2>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

          
        </div>

        {/* Products */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 md:mt-2 lg:mt-2">
            Products
          </h3>
          <ul className="space-y-2 text-sm">
            {Products.map((item, i) => (
              <Link
                to={item.link}
                key={i}
                className="hover:text-blue-400 cursor-pointer duration-200 flex flex-col"
              >
                {item.label}
              </Link>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            {Company.map((item, i) => (
              <Link
                to={item.link}
                key={i}
                className="hover:text-blue-400 cursor-pointer duration-200 flex flex-col"
              >
                {item.label}
              </Link>
            ))}
          </ul>
        </div>

        {/* Support
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            {
              Support.map((item, i) => (
              <Link
              to={item.link} 
                key={i}
                className="hover:text-blue-400 cursor-pointer duration-200 flex flex-col"
              >
                {item.label}
              </Link>
            ))}
            
          </ul>
        </div> */}

        {/* Contact */}
        <div className="md:col-span-1">
          <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer duration-200">
              <MdEmail className="text-lg" /> {Contact.email}
            </li>
            <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer duration-200">
              <MdPhone className="text-lg" /> {Contact.phone}
            </li>
            <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer duration-200">
              <MdLocationOn className="text-lg" /> {Contact.address}
            </li>
            <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer duration-200">
              <LucideBadgeHelp className="text-lg" /> {Contact.Link}
            </li>
          </ul>
        </div>
      </div>


{/* Social Icons */}
<div className="flex items-center justify-center mt-5">

          <div className="flex gap-8 mt-6">
            {[
              { Icon: FaTwitter, link: Social.twitter },
              { Icon: FaInstagram, link: Social.instagram },
              { Icon: FaLinkedin, link: Social.linkedin },
            ].map(({ Icon, link }, i) => (
              <Link
              key={i}
              to={link}
              target="_blank"
              className="p-2 rounded-lg bg-[#1a2234] hover:bg-blue-500/20 hover:scale-110 duration-300 cursor-pointer"
              >
                <Icon className="text-xl text-white" />
              </Link>
            ))}
          </div>
            </div>


      {/* Divider */}
      <div className="border-t border-gray-700 mt-10"></div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mt-6 text-xs sm:text-sm text-gray-500 gap-3">
        <p>© {new Date().getFullYear()} Brilson. All rights reserved.</p>

        <div className="flex gap-6">
          {bottomLinks.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              className="hover:text-blue-400 cursor-pointer duration-200 flex flex-col"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
