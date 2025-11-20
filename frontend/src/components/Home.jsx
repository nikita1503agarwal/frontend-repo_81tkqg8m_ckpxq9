import React, { useEffect, useState } from 'react'
import Hero from './Hero'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Home(){
  const [categories, setCategories] = useState([
    { name: 'Portraits', slug: 'portraits', description: 'People & character studies' },
    { name: 'Events', slug: 'events', description: 'Documenting celebrations and milestones' },
    { name: 'Street', slug: 'street', description: 'Candid slices of city life' },
  ])

  useEffect(()=>{
    fetch(`${API}/categories`).then(r=>r.json()).then(setCategories).catch(()=>{})
  },[])

  return (
    <div>
      <Hero />
      <section className="container-default py-14">
        <h2 className="text-2xl font-semibold mb-6">Featured Work</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link to={cat.slug === 'events' ? '/events' : `/${cat.slug}`} key={cat.slug} className="group rounded-lg overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition">
              <div className="aspect-[16/9] bg-gradient-to-br from-white/10 to-white/0 flex items-center justify-center">
                <span className="text-5xl font-black opacity-20 group-hover:opacity-30 transition">{cat.name[0]}</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{cat.name}</h3>
                <p className="text-sm text-gray-400">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
