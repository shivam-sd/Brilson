import AboutSection from "./AboutSection";
import GallerySection from "./GallerySection";
import GoogleReviewSection from "./GoogleReviewSection";
import LocationSection from "./LocationSection";
import PaymentSection from "./PaymentSection";
import PortfolioSection from "./PortfolioSection";
import ResumeSection from "./ResumeSection";
import ServicesSection from "./ServicesSection";

/** accordion id (see data/profileConfig.js) -> content component */
export const SECTION_COMPONENTS = {
  about: AboutSection,
  services: ServicesSection,
  portfolio: PortfolioSection,
  gallery: GallerySection,
  location: LocationSection,
  resume: ResumeSection,
  "google-review": GoogleReviewSection,
  payment: PaymentSection,
};
