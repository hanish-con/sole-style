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

function App() {
  const [token, setToken] = useState("");
  const location = useLocation();
  console.log({ location });

  // check if the path is allowed to show header and footer
  // TODO: think of a better way to show header and footer
  const is_allowed = (path: string) => {
    return path === "/";
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      { (token || is_allowed(location.pathname)) &&  <Header callback={(t: string) => setToken(t)} /> }
      <Routes>
        <Route path="/">
          <Route index element={<Home />}></Route>
          <Route path="/login" element={<LoginForm callback={setToken} />}></Route>
          <Route path="/signup" element={<SignUpForm />}></Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      { (token || is_allowed(location.pathname)) &&  <Footer /> }
    </ThemeProvider>

  )
}

export default App
