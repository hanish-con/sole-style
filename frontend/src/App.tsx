import React, { useState } from "react";
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { LoginForm } from './pages/login'
import { SignUpForm } from "./pages/signup";
import { NotFound } from "./pages/fallback";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import Home from "./pages/home";
import AdminDashboard from "./pages/commons/admin/admin";
import ProductViewPage from "./pages/commons/admin/product/product-view-page";
import ProductPage from "./pages/commons/admin/products";
import MainLayout from "./pages/main";
import Products from "./pages/products";
import ProductDetails from "./pages/productdetails";

function App() {
  const [token, setToken] = useState("");
  const location = useLocation();
  // console.log({ location });

  // check if the path is allowed to show header and footer
  // TODO: think of a better way to show header and footer
  const is_allowed = (path: string) => {
    // don't show header and footer for /login and /signup
    const disallowed_routes = ["/login", "/signup", "/admin"];
    return !disallowed_routes.some(p => path === p);
    // return !(path === "/login" || path === "/signup");
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />

      {/* { (token || is_allowed(location.pathname)) &&  <Header token={token} callback={(t: string) => setToken(t)} /> } */}
      <Routes>
        <Route path="/" element={<MainLayout token={token} setToken={setToken} ></MainLayout>}>
        <Route path="/login" element={<LoginForm callback={setToken} />}></Route>
        <Route path="/signup" element={<SignUpForm />}></Route>
          <Route index element={<Home />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/products/:id" element={<ProductDetails />}></Route>
          
          <Route path="/admin" element={<AdminDashboard>
                </AdminDashboard>}  >
            {/* <Route index element={<AdminDashboard>
                <h1>Foo Bar</h1>
                </AdminDashboard>}> */}
                <Route index element={<ProductPage></ProductPage>}></Route>
                <Route path="product/:productId" element={<ProductViewPage></ProductViewPage>}></Route>
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
