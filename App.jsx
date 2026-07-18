import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AdminGate from './pages/Admin/AdminGate.jsx'

export default function App() {
  return (
    <>
      {/* Fixed grain texture sits above all routes */}
      <div className="grain-overlay bg-grain" aria-hidden="true" />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Deliberately unlinked from any nav — reachable only by direct URL */}
        <Route path="/admin" element={<AdminGate />} />
      </Routes>
    </>
  )
}
