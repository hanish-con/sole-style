import React from "react";
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Button } from './components/ui/button'
import { LoginForm } from './pages/login'
import { SignUpForm } from "./pages/signup";
import { NotFound } from "./pages/fallback";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<LoginForm />}></Route>
        <Route path="/signup" element={<SignUpForm />}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>

  )
}

export default App
