import react from 'react'
import {Route, Routes} from "react-router-dom";
import HomePage from './HomePage';
import HowitWorks from "./Pages/HowitWorks";
import BestSeller from "./Component/BestSeller";
import PersonalCard from "./Component/PersonalCards";
import BusinessCard from "./Component/BusinessCards";
import Pricing from "./Pages/Pricing";
import LoginPage from "./Component/LoginPage";
import SignupPage from "./Component/SignupPage";
import Master from './Component/Master';
import OurSmartCard from './Pages/HomePage/OurSmartCard';
import ErrorPage from './Pages/ErrorPage';
import ProductCardDetails from './Pages/ProductCardDetails';
import ContactSales from './Pages/ContactSalePage';
import CartPage from './Pages/CartPage';
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import AdminProducts from './Admin/AdminProducts';
import AdminOrders from './Admin/AdminOrders';
import AdminCustomers from './Admin/AdminCustomers';
// import Settings from './Admin/Settings';
import AdminLayout from './Admin/AdminLayout';
import AdminAddProduct from './Admin/ProductsPage/AdminAddProduct';
import AdminEditProduct from './Admin/ProductsPage/AdminEditProducts';
import ManageCards from './Admin/ManageCards';
import BulkCreateCardsModal from './Admin/components.jsx/BulkCreateCardsModal';
import ProtectedRoute from './Admin/components.jsx/ProtectedRoute';
import ActivateCard from './Pages/ActivateCard';
import ProfilePage from './Pages/ProfilePage';
import EditProfile from './Pages/EditProfile';


function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Master />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/how-it-works' element={<HowitWorks />} />
          <Route path='/products' element={<OurSmartCard />} />
          <Route path='/bestseller-card' element={<BestSeller />} />
          <Route path='/personal-card' element={<PersonalCard />} />
          <Route path='/business-card' element={<BusinessCard />} />
          <Route path='/products/:id' element={<ProductCardDetails />} />
          <Route path='/contact-sale' element={<ContactSales />} />
          <Route path='/your-items' element={<CartPage />} />
          </Route>

<Route path='/profile/:slug' element={<ProfilePage />} />
<Route path='/profile/edit/:id' element={<EditProfile />} />
<Route path='/card/activate' element={<ActivateCard />} />

          <Route path='/best-seller' element={<BestSeller />} />
          <Route path='/personal-card' element={<PersonalCard />} />
          <Route path='/business-card' element={<BusinessCard />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/admin/login' element={<AdminLogin />} />

          <Route path='admindashboard' element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<ProtectedRoute><AdminDashboard /> </ProtectedRoute>} />
          <Route path='products/list' element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path='customers/list' element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
          <Route path='orders/list' element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path='manage-cards' element={<ProtectedRoute><ManageCards /></ProtectedRoute>} />
          {/* <Route path='settings' element={<Settings />} /> */}
          </Route>
          <Route path='/api/cards/bulk' element={<ProtectedRoute><BulkCreateCardsModal /></ProtectedRoute>} />
          {/* Products Route */}
          <Route path='/admin/add/products' element={<ProtectedRoute><AdminAddProduct /></ProtectedRoute>} />
          <Route path='/admin/edit/products/:id' element={<ProtectedRoute><AdminEditProduct /></ProtectedRoute>} />

          {/* error Page */}
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
