import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import SigninPage from './pages/SigninPage'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SigninPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
