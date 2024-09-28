import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { LoginForm } from './pages/login'
import { SignUpForm } from "./pages/signup";
import { NotFound } from "./pages/fallback";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import MainApp from "./pages/main";
import Header from "./pages/commons/header";
import Footer from "./pages/commons/footer";
import Home from "./pages/home";

function App() {
  const [token, setToken] = useState("");
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      { token &&  <Header callback={(t: string) => setToken(t)} /> }
      <Routes>
        <Route path="/">
          <Route index element={<Home />}></Route>
          <Route path="/login" element={<LoginForm callback={setToken} />}></Route>
          <Route path="/signup" element={<SignUpForm />}></Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      { token &&  <Footer /> }
    </ThemeProvider>

  )
}

export default App
