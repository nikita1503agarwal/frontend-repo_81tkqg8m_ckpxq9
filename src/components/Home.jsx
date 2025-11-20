import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Home(){
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState({})
  const [thumbs, setThumbs] = useState({})
  const navigate = useNavigate()

  useEffect(()=>{
    fetch(`${API}/categories`).then(r=>r.json()).then(setCategories).catch(()=>{})
    fetch(`${API}/settings`).then(r=>r.json()).then(setSettings).catch(()=>{})
  },[])

  // Fetch first image per category for cards
  useEffect(()=>{
    const wanted = ['portraits','events','street']
    Promise.all(wanted.map(async slug => {
      try{
        const res = await fetch(`${API}/images?category_slug=${slug}&limit=1`)
        const data = await res.json()
        return { slug, url: data?.[0]?.url || null }
      }catch{ return { slug, url: null } }
    })).then(list => {
      const map = {}
      list.forEach(({slug,url})=> map[slug]=url)
      setThumbs(map)
    })
  },[])

  const getCover = (slug) => categories.find(c=>c.slug===slug)?.cover_url

  const heroUrl = useMemo(()=>{
    return settings?.hero_url || getCover('portraits') || getCover('events') || getCover('street') || 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb0?q=80&w=1600&auto=format&fit=crop'
  },[settings, categories])

  return (
    <main className="relative min-h-[90vh]">
      {/* Fullscreen hero background with custom setting fallback */}
      <div className="absolute inset-0 -z-10">
        <img src={heroUrl} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80"/>
      </div>

      {/* Centered title + tagline using display serif + sans */}
      <div className="pt-24 md:pt-28 pb-10 md:pb-14 text-center px-4">
        <h1 className="font-serif-display text-white text-4xl md:text-6xl font-extrabold tracking-tight">PERSPECTIVE by Adi</h1>
        <p className="font-sans-body mt-4 max-w-3xl mx-auto text-white/85 text-base md:text-lg">
          Berlin-based cinematic professional photographer capturing raw, candid moments and authentic stories
        </p>
      </div>

      {/* Category tiles over hero - smaller with more spacing */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid gap-6 md:gap-8" style={{gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))'}}>
          {['Portraits','Events','Street'].map(name => {
            const slug = name.toLowerCase()
            const cover = thumbs[slug] || getCover(slug)
            return (
              <button key={slug} onClick={()=>navigate(`/portfolio?category=${slug}`)} className="group relative h-28 md:h-40 rounded-xl overflow-hidden ring-1 ring-white/15">
                <div className="absolute inset-0">
                  {cover ? (
                    <img src={cover} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-white/5 grid place-items-center">
                      <span className="text-white/80 text-lg md:text-xl">{name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" />
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-white text-lg md:text-xl font-semibold drop-shadow">{name}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
