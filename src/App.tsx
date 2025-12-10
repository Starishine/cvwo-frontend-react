import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import SigninPage from './pages/SigninPage'
import Dashboard from './pages/Dashboard'
import AddPost from './pages/AddPost'
import YourPosts from './pages/YourPosts'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SigninPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/your-posts" element={<YourPosts />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
