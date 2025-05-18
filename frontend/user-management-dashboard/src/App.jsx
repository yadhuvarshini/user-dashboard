import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Login from "./pages/Login"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path = "/" element={<Login />} />
      </Routes>
    </Router>
      
    </>
  )
}

export default App
