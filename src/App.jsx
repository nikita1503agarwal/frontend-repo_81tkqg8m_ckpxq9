import { useState } from 'react'
import { Link, Outlet, Route, Routes } from 'react-router-dom'
import { Camera, GalleryHorizontal, Images, Info, Mail, Settings, Menu } from 'lucide-react'
import Home from './components/Home'
import Portfolio from './components/Portfolio'
import Events from './components/Events'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0ae6] backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-gray-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 grid place-items-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm uppercase tracking-widest text-gray-400">Perspective</div>
            <div className="-mt-1 text-lg font-semibold">by Adi</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-gray-200">
          <Link to="/portfolio" className="hover:text-white transition">Portfolio</Link>
          <Link to="/events" className="hover:text-white transition">Events</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/admin" className="hover:text-white transition">Admin</Link>
        </nav>
        <button className="md:hidden text-gray-200" onClick={() => setOpen(v=>!v)}>
          <Menu />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4">
          <div className="flex flex-col gap-3 text-gray-200">
            <Link to="/portfolio" onClick={()=>setOpen(false)}>Portfolio</Link>
            <Link to="/events" onClick={()=>setOpen(false)}>Events</Link>
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
        <Route path="events" element={<Events />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}
