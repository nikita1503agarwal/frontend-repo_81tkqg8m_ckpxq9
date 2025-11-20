import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './components/Home'
import Portfolio from './components/Portfolio'
import Events from './components/Events'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'

function Navbar(){
  const linkBase = 'text-sm tracking-wide uppercase';
  const linkActive = 'text-white';
  const linkIdle = 'text-gray-400 hover:text-white';
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="container-default py-4 flex items-center justify-between">
        <NavLink to="/" className="font-extrabold text-xl">Perspective by Adi</NavLink>
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={({isActive})=>`${linkBase} ${isActive?linkActive:linkIdle}`}>Home</NavLink>
          <NavLink to="/portraits" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkIdle}`}>Portraits</NavLink>
          <NavLink to="/events" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkIdle}`}>Events</NavLink>
          <NavLink to="/street" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkIdle}`}>Street</NavLink>
          <NavLink to="/about" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkIdle}`}>About</NavLink>
          <NavLink to="/contact" className={({isActive})=>`${linkBase} ${isActive?linkActive:linkIdle}`}>Contact</NavLink>
        </nav>
      </div>
    </header>
  )
}

function Footer(){
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="container-default py-10 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Perspective by Adi — Berlin / EU</p>
        <p>Instagram · Email · WhatsApp</p>
      </div>
    </footer>
  )
}

export default function App(){
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/portraits" element={<Portfolio category="portraits" title="Portraits"/>} />
          <Route path="/events/*" element={<Events/>} />
          <Route path="/street" element={<Portfolio category="street" title="Street"/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
