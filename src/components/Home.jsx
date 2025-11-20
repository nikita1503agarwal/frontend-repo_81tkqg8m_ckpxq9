import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero(){
  return (
    <section className="relative min-h-[70vh] grid place-items-center overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <Spline scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Perspective by Adi</h1>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">Cinematic photography with a focus on timeless stories, crafted in a modern dark aesthetic.</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/portfolio" className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Explore Portfolio</Link>
          <Link to="/contact" className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20">Book a Shoot</Link>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/40 to-[#0a0a0a]" />
    </section>
  )
}

function FeaturedGrid(){
  const [categories, setCategories] = useState([])
  useEffect(()=>{
    fetch(`${API}/categories`).then(r=>r.json()).then(setCategories).catch(()=>{})
  },[])
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">Featured</h2>
        <Link to="/portfolio" className="text-indigo-400 hover:text-indigo-300">See all</Link>
      </div>
      <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
        {categories.map(cat => (
          <Link key={cat.id || cat.slug} to={`/portfolio?category=${cat.slug}`} className="group relative rounded-xl overflow-hidden bg-white/5">
            <div className="aspect-[4/3] bg-gradient-to-br from-indigo-900/40 to-fuchsia-900/30">
              {cat.cover_url && (
                <img src={cat.cover_url} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
            <div className="absolute bottom-0 p-4">
              <h3 className="text-lg font-medium">{cat.name}</h3>
              {cat.description && <p className="text-sm text-gray-300/80 line-clamp-2">{cat.description}</p>}
            </div>
          </Link>
        ))}
        {categories.length===0 && (
          <div className="text-gray-400">No categories yet. Use Admin to seed starter data.</div>
        )}
      </div>
    </section>
  )
}

export default function Home(){
  return (
    <main>
      <Hero />
      <FeaturedGrid />
    </main>
  )
}
