import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Lightbox({ open, onClose, image }){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/90 z-50 grid place-items-center p-4" onClick={onClose}>
      <img src={image?.url} alt={image?.alt||''} className="max-h-[90vh] max-w-full object-contain" />
    </div>
  )
}

export default function Portfolio(){
  const params = new URLSearchParams(location.search)
  const category = params.get('category')
  const [images, setImages] = useState([])
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)

  useEffect(()=>{
    const qs = category ? `?category_slug=${category}` : ''
    fetch(`${API}/images${qs}`).then(r=>r.json()).then(setImages).catch(()=>{})
  },[category])

  const grouped = useMemo(()=>{
    return images
  },[images])

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Portfolio {category?`/ ${category}`:''}</h1>
      <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
        {grouped.map(img => (
          <button key={img.id} className="group relative rounded-xl overflow-hidden bg-white/5" onClick={()=>{setCurrent(img);setOpen(true)}}>
            <div className="aspect-[4/3]">
              <img src={img.url} alt={img.alt||''} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"/>
            </div>
          </button>
        ))}
        {images.length===0 && (
          <div className="text-gray-400">No images yet. Use Admin to add some.</div>
        )}
      </div>
      <Lightbox open={open} image={current} onClose={()=>setOpen(false)} />
    </main>
  )
}
