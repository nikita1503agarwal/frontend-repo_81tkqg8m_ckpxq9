import { useState } from 'react'
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Camera, Mail, Menu } from 'lucide-react'
import Home from './components/Home'
import Portfolio from './components/Portfolio'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const onHome = location.pathname === '/'

  return (
    <header className={`${onHome ? 'absolute top-0 inset-x-0 z-50 bg-transparent' : 'sticky top-0 z-40 bg-[#0a0a0ae6] backdrop-blur border-b border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center relative">
        {/* Minimal, centered brand */}
        <Link to="/" className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 text-gray-100/90 hover:text-white">
          <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center ring-1 ring-white/20">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm tracking-widest uppercase">Perspective by Adi</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-gray-100">
          <Link to="/portfolio" className="hover:text-white transition">Portfolio</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/admin" className="hover:text-white transition">Admin</Link>
        </nav>
        <button className="md:hidden text-gray-200 absolute right-4" onClick={() => setOpen(v=>!v)}>
          <Menu />
        </button>
      </div>
      {open && (
        <div className={`md:hidden border-t ${onHome ? 'border-white/20' : 'border-white/10'} px-4 pb-4 bg-[#0a0a0acc] backdrop-blur` }>
          <div className="flex flex-col gap-3 text-gray-200">
            <Link to="/portfolio" onClick={()=>setOpen(false)}>Portfolio</Link>
            <Link to="/about" onClick={()=>setOpen(false)}>About</Link>
            <Link to="/contact" onClick={()=>setOpen(false)}>Contact</Link>
            <Link to="/admin" onClick={()=>setOpen(false)}>Admin</Link>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer(){
  return (
    <footer className="mt-20 border-t border-white/10 py-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Perspective by Adi. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="mailto:hello@perspectivebyadi.de" className="hover:text-white flex items-center gap-2"><Mail className="w-4 h-4"/> Email</a>
          <a href="https://wa.me/0000000000" target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp</a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
        </div>
      </div>
    </footer>
  )
}

function AppLayout(){
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App(){
  return (
    <Routes>
      <Route element={<AppLayout />}> 
        <Route index element={<Home />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}
