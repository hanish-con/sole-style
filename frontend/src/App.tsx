import React, { useState } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { LoginForm } from './pages/login';
import { SignUpForm } from "./pages/signup";
import { NotFound } from "./pages/fallback";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import Header from "./pages/commons/header";
import Footer from "./pages/commons/footer";
import Home from "./pages/home";
import Products from "./pages/products"; 
import ProductDetails from "./pages/productdetails"; 


function App() {
  const [token, setToken] = useState("");
  const location = useLocation();

  const is_allowed = (path: string) => {
    // Don't show header and footer for /login and /signup
    return !(path === "/login" || path === "/signup");
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      {(token || is_allowed(location.pathname)) && <Header token={token} callback={(t: string) => setToken(t)} />}
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/login" element={<LoginForm callback={setToken} />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/products" element={<Products />} /> 
          <Route path="/products/:id" element={<ProductDetails />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {(token || is_allowed(location.pathname)) && <Footer />}
    </ThemeProvider>
  );
}

export default App;
