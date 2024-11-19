import React, { useState } from "react";
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { LoginForm } from './pages/login'
import { SignUpForm } from "./pages/signup";
import { NotFound } from "./pages/fallback";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import Home from "./pages/home";
import AdminDashboard from "./pages/admin/admin";
import ProductViewPage from "./pages/admin/product/product-view-page";
import ProductPage from "./pages/admin/products";
import MainLayout from "./pages/main";
import Products from "./pages/products";
import ProductDetails from "./pages/productdetails";
import ProtectedRoute from "./pages/commons/protect";
import Category from "./pages/category";
import SettingsProfilePage from "./pages/userprofile/profile";
import SettingsLayout from "./pages/userprofile/settings";
import SettingsAccountPage from "./pages/userprofile/account/account";
import Checkout from "./pages/checkout";
import Cart from "./pages/cart";
import ResetPassword from "./pages/resetpassword";
import ForgotPassword from "./pages/forgotpassword";
import { SettingsOrderDetails } from "./pages/userprofile/order/order";
import SettingsFavoriteProductsPage from "./pages/userprofile/favourites/favourite";
// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_51QMNsDEbIUYKEOl9F5f6497Nhqmo4SSN00IqCBBaGPWJ4gjV7k7g702RndLhoPIqyarmHrE0omnlcdTZfvJDPTty00nEoyDfmK");



function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const location = useLocation();
  // console.log({ location });

  const setUserAndToken = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />

      {/* { (token || is_allowed(location.pathname)) &&  <Header token={token} callback={(t: string) => setToken(t)} /> } */}
      <Routes>
        <Route path="/login" element={<LoginForm callback={setUserAndToken} />}></Route>
        <Route path="/signup" element={<SignUpForm />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>

        <Route path="/" element={<MainLayout token={token} user={user} setToken={setToken} ></MainLayout>}>
          <Route index element={<Home />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/products/:id" element={<ProductDetails />}></Route>
          <Route path="/category" element={<Category />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          }></Route>
          <Route path="/categories/:category" element={<Products />} />
          <Route path="/reviews/" element={<ProductDetails />}></Route>
          <Route path="/reviews/:id" element={<ProductDetails />}></Route>

          <Route path="/admin" element={<AdminDashboard children={undefined}>
          </AdminDashboard>}  >
            <Route index element={
              <ProtectedRoute token={token}>
                <ProductPage></ProductPage>
              </ProtectedRoute>

            }></Route>
            <Route path="product/:productId" element={
              <ProtectedRoute token={token}>
                <ProductViewPage></ProductViewPage>
              </ProtectedRoute>
            }
            ></Route>
            {/* </Route> */}
          </Route>
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsLayout children={<SettingsProfilePage />} />
            </ProtectedRoute>
          }></Route>
          <Route path="/accounts" element={
            <ProtectedRoute>
              <SettingsLayout children={<SettingsAccountPage />} />
            </ProtectedRoute>
          }></Route>
          <Route path="/orders" element={
            <ProtectedRoute>
              <SettingsLayout children={<SettingsOrderDetails />} />
            </ProtectedRoute>
          }></Route>
          <Route path="/favourites" element={
            <ProtectedRoute>
              <SettingsLayout children={<SettingsFavoriteProductsPage />} />
            </ProtectedRoute>
          }></Route>
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
      {/* { (token || is_allowed(location.pathname)) &&  <Footer /> } */}
    </ThemeProvider>

  )
}

export default App
