import React from "react";
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { LoginForm } from './pages/login'
import { SignUpForm } from "./pages/signup";
import { NotFound } from "./pages/fallback";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";
import MainApp from "./pages/main";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      {/* <div className="app"> */}
      <Routes>
        <Route path="/">
          <Route index element={<LoginForm />}></Route>
          <Route path="/signup" element={<SignUpForm />}></Route>
          <Route path="/home" element={<MainApp />}></Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* </div> */}
    </ThemeProvider>

  )
}

export default App
