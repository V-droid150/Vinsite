import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminLayout from './pages/Admin/AdminLayout'

// HashRouter is used (instead of BrowserRouter) for GitHub Pages compatibility —
// GH Pages serves static files and doesn't understand client-side routes,
// so hash-based URLs (/#/admin) work without any server config.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public portfolio */}
        <Route path="/"        element={<Home />} />

        {/* Hidden admin dashboard — all /admin/* sub-routes handled inside AdminLayout */}
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </HashRouter>
  )
}
