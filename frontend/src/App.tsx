import React, { useState } from "react";
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { LoginForm } from './pages/login'
import { SignUpForm } from "./pages/signup";
import { NotFound } from "./pages/fallback";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import Header from "./pages/commons/header";
import Footer from "./pages/commons/footer";
import Home from "./pages/home";
import AdminDashboard from "./pages/commons/admin/admin";

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
      { (token || is_allowed(location.pathname)) &&  <Header token={token} callback={(t: string) => setToken(t)} /> }
      <Routes>
        <Route path="/">
          <Route index element={<Home />}></Route>
          <Route path="/login" element={<LoginForm callback={setToken} />}></Route>
          <Route path="/signup" element={<SignUpForm />}></Route>
          <Route path="/admin">
            <Route index element={<AdminDashboard>
                <h1>Foo Bar</h1>
                </AdminDashboard>}>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      { (token || is_allowed(location.pathname)) &&  <Footer /> }

    </ThemeProvider>

  )
}

export default App
