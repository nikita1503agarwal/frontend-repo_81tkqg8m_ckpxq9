import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Home(){
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    fetch(`${API}/categories`).then(r=>r.json()).then(setCategories).catch(()=>{})
  },[])

  const getCover = (slug) => categories.find(c=>c.slug===slug)?.cover_url

  return (
    <main className="relative min-h-[90vh]">
      {/* Fullscreen hero background */}
      <div className="absolute inset-0 -z-10">
        <img src={getCover('portraits') || getCover('events') || getCover('street') || 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb0?q=80&w=1600&auto=format&fit=crop'} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80"/>
      </div>

      {/* Centered title + tagline */}
      <div className="pt-28 pb-16 text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">PERSPECTIVE by Adi</h1>
        <p className="mt-4 max-w-3xl mx-auto text-white/80 text-base md:text-lg">
          Berlin-based cinematic professional photographer capturing raw, candid moments and authentic stories
        </p>
      </div>

      {/* Minimal top-centered nav already handled by global Navbar */}

      {/* Category tiles over hero */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid gap-4 md:gap-6" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          {['Portraits','Events','Street'].map(name => {
            const slug = name.toLowerCase()
            const cover = getCover(slug)
            return (
              <button key={slug} onClick={()=>navigate(`/portfolio?category=${slug}`)} className="group relative h-40 md:h-56 rounded-xl overflow-hidden ring-1 ring-white/15">
                <div className="absolute inset-0">
                  <img src={cover || 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb0?q=80&w=1200&auto=format&fit=crop'} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-white text-xl md:text-2xl font-semibold drop-shadow">{name}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
