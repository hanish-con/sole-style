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
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";



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
        <Route path="/" element={<MainLayout token={token} user={user} setToken={setToken} ></MainLayout>}>
          <Route index element={<Home />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/products/:id" element={<ProductDetails />}></Route>
          <Route path="/category" element={<Category />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          
          <Route path="/categories/:category" element={<Products />} />
          <Route path="/reviews/" element={<ProductDetails />}></Route>
          <Route path="/reviews/:id" element={<ProductDetails />}></Route>

          <Route path="/admin" element={<AdminDashboard>
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
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
      {/* { (token || is_allowed(location.pathname)) &&  <Footer /> } */}
    </ThemeProvider>

  )
}

export default App
