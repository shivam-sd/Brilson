import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const HomePage = React.lazy(() => import("./HomePage"));
import ReactLenis from "lenis/react";
import HowitWorks from "./Pages/HowitWorks";
import BestSeller from "./Component/BestSeller";
import PersonalCard from "./Component/PersonalCards";
import BusinessCard from "./Component/BusinessCards";
import Pricing from "./Pages/Pricing";
import LoginPage from "./Component/LoginPage";
import SignupPage from "./Component/SignupPage";
import Master from "./Component/Master";
import OurSmartCard from "./Pages/HomePage/OurSmartCard";
import ErrorPage from "./Pages/ErrorPage";
import ProductCardDetails from "./Pages/ProductCardDetails";
import ContactSales from "./Pages/ContactSalePage";
import CartPage from "./Pages/CartPage";
import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminProducts from "./Admin/AdminProducts";
import AdminOrders from "./Admin/AdminOrders";
import AdminCustomers from "./Admin/AdminCustomers";
// import Settings from './Admin/Settings';
import AdminLayout from "./Admin/AdminLayout";
import AdminAddProduct from "./Admin/ProductsPage/AdminAddProduct";
import AdminEditProduct from "./Admin/ProductsPage/AdminEditProducts";
import ManageCards from "./Admin/ManageCards";
import BulkCreateCardsModal from "./Admin/components.jsx/BulkCreateCardsModal";
import ProtectedRoute from "./Admin/components.jsx/ProtectedRoute";
import ActivateCard from "./Pages/ActivateCard";
import ProfilePage from "./Pages/ProfilePage";
import EditProfile from "./Pages/EditProfile";
import Checkout from "./Component/Checkout";
import PaymentSuccessPage from "./Pages/PaymentSuccessPage";
import Orders from "./Pages/Orders";
import CheckStatusPage from "./Pages/CheckStatusPage";
import PublicProfilePage from "./Pages/PublicProfilePage";
import AdminCategories from "./Admin/ProductsPage/AdminCategories";
import AdminBadges from "./Admin/ProductsPage/AdminBadges";
import GetYourCard from "./Pages/GetYourCard";
import AdminConfig from "./Admin/AdminConfig";
import SellingOverview from "./Admin/SellingOverview";
import AdminInvoices from "./Admin/AdminInvoices";
import LandingPageContent from "./Admin/LandingPageContent";
import HomePageContent from "./Admin/LandingPage/HomePageContent";
import PowerFullFeatures from "./Admin/LandingPage/PowerfullFeatures";
import HowToUseAdmin from "./Admin/LandingPage/HowToUseAdmin";
import Testimonials from "./Admin/LandingPage/Testimonials.Content";
import TransformNetworkAdmin from "./Admin/LandingPage/TransformNetworkAdmin";
import FooterAdmin from "./Admin/LandingPage/FooterAdmin";
import AdminPassToProfile from "./utils/AdminPassToProfile";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsConditionsPage from "./Pages/Terms&Condition";
import RefundPolicyPage from "./Pages/RefundPolicy";
import AboutUsPage from "./Pages/AboutUsPage";
import CareersPage from "./Pages/CareersPage";
import Layout from "./Pages/ProfileComp/EditProfileComp/Layout";
import PortfolioEditProfile from "./Pages/ProfileComp/EditProfileComp/PortfolioEditProfile";
import GalleryEditProfile from "./Pages/ProfileComp/EditProfileComp/GalleryEditProfile";
import ProductsEditProfile from "./Pages/ProfileComp/EditProfileComp/ProductsEditProfile";
import ServicesEditProfile from "./Pages/ProfileComp/EditProfileComp/ServicesEditProfile";
import AddProduct from "./Pages/ProfileComp/EditProfileComp/ProfilePrdoct/AddProducts";
import UpdateProduct from "./Pages/ProfileComp/EditProfileComp/ProfilePrdoct/UpdateProduct";
import AddPortfolio from "./Pages/ProfileComp/EditProfileComp/ProfilePortfolio/AddPortfolio";
import UpdatePortfolio from "./Pages/ProfileComp/EditProfileComp/ProfilePortfolio/UpdatePortfolio";
import AddServices from "./Pages/ProfileComp/EditProfileComp/ProfileServices/AddServices";
import UpdateServices from "./Pages/ProfileComp/EditProfileComp/ProfileServices/UpdateServices";
import AddGallery from "./Pages/ProfileComp/EditProfileComp/ProfileGallery/AddGallery";
import UpdateGallery from "./Pages/ProfileComp/EditProfileComp/ProfileGallery/UpdateGallery";
import ProfileLogoEdit from "./Pages/ProfileComp/EditProfileComp/ProfileLogoEdit";



function App() {
  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <ReactLenis
                root
                options={{
                  lerp: 0.1,
                  duration: 1.2,
                  orientation: "vertical",
                  gestureOrientation: "vertical",
                  smoothWheel: true,
                  wheelMultiplier: 1,
                  smoothTouch: true,
                  touchMultiplier: 2,
                }}
              >
                <Master />
              </ReactLenis>
            }
          >
            <Route
              path="/"
              element={
                <Suspense fallback={<div className="app-loader"></div>}>
                  <HomePage />
                </Suspense>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/how-it-works" element={<HowitWorks />} />
            <Route path="/products" element={<OurSmartCard />} />
            <Route path="/bestseller-card" element={<BestSeller />} />
            <Route path="/personal-card" element={<PersonalCard />} />
            <Route path="/business-card" element={<BusinessCard />} />
            <Route path="/products/:id" element={<ProductCardDetails />} />
            <Route path="/contact-sale" element={<ContactSales />} />
            <Route path="/your-items" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/paymentsucess" element={<PaymentSuccessPage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/get-card" element={<GetYourCard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/careers" element={<CareersPage />} />
          </Route>

          <Route path="/c/card/:activationCode" element={<CheckStatusPage />} />
          <Route path="/admin/passTo/Profile" element={<AdminPassToProfile />} />
          <Route path="/profile/:slug" element={<ProfilePage />} />
          <Route path="/public/profile/:slug" element={<PublicProfilePage />} />
          <Route path="/card/activate" element={<ActivateCard />} />


          <Route path="/profile/edit/:id" element={<Layout />}>
  <Route index element={<EditProfile />} />
  <Route path="Profile-logo" element={<ProfileLogoEdit />} />
  <Route path="portfolio" element={<PortfolioEditProfile />} />
  <Route path="services" element={<ServicesEditProfile />} />
  <Route path="products" element={<ProductsEditProfile />} />
  <Route path="gallery" element={<GalleryEditProfile />} />
</Route>

  <Route path="/profile/products/add/:id" element={<AddProduct />} />
  <Route path="/profile/products/update/:id" element={<UpdateProduct />} />
  <Route path="/profile/portfolio/add/:id" element={<AddPortfolio />} />
  <Route path="/profile/portfolio/update/:id" element={<UpdatePortfolio />} />
  <Route path="/profile/services/add/:id" element={<AddServices />} />
  <Route path="/profile/services/update/:id" element={<UpdateServices />} />
  <Route path="/profile/gallery/add/:id" element={<AddGallery />} />
  <Route path="/profile/gallery/update/:id" element={<UpdateGallery />} />



          <Route path="/best-seller" element={<BestSeller />} />
          <Route path="/personal-card" element={<PersonalCard />} />
          <Route path="/business-card" element={<BusinessCard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="admindashboard"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute>
                  <AdminDashboard />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="products/list"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="customers/list"
              element={
                <ProtectedRoute>
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />

            <Route
              path="landing/page/content"
              element={
                <ProtectedRoute>
                  <LandingPageContent />
                </ProtectedRoute>
              }
            />

            <Route
              path="setting/config"
              element={
                <ProtectedRoute>
                  <AdminConfig />
                </ProtectedRoute>
              }
            />

            <Route
              path="orders/list"
              element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-cards"
              element={
                <ProtectedRoute>
                  <ManageCards />
                </ProtectedRoute>
              }
            />

            <Route
              path="selling-overview"
              element={
                <ProtectedRoute>
                  <SellingOverview />
                </ProtectedRoute>
              }
            />

            <Route
              path="orders/invoices"
              element={
                <ProtectedRoute>
                  <AdminInvoices />
                </ProtectedRoute>
              }
            />

            {/* <Route path='settings' element={<Settings />} /> */}
          </Route>
          <Route
            path="/api/cards/bulk"
            element={
              <ProtectedRoute>
                <BulkCreateCardsModal />
              </ProtectedRoute>
            }
          />
          {/* Products Route */}
          <Route
            path="/admin/add/products"
            element={
              <ProtectedRoute>
                <AdminAddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/products/:id"
            element={
              <ProtectedRoute>
                <AdminEditProduct />
              </ProtectedRoute>
            }
          />

          {/* add dynamic categories */}
          <Route
            path="/admin/add/category"
            element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            }
          />

          {/* add dynamic badegs */}
          <Route
            path="/admin/add/badges"
            element={
              <ProtectedRoute>
                <AdminBadges />
              </ProtectedRoute>
            }
          />

          {/* landing Page */}

          <Route
            path="/admin/landing/hero"
            element={
              <ProtectedRoute>
                <HomePageContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/landing/features"
            element={
              <ProtectedRoute>
                <PowerFullFeatures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/landing/howtouse"
            element={
              <ProtectedRoute>
                <HowToUseAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/landing/testimonials"
            element={
              <ProtectedRoute>
                <Testimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/landing/transform/network"
            element={
              <ProtectedRoute>
                <TransformNetworkAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/landing/footer"
            element={
              <ProtectedRoute>
                <FooterAdmin />
              </ProtectedRoute>
            }
          />

          {/* error Page */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
