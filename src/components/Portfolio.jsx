import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Lightbox({ open, onClose, image, onDelete }){
  if(!open) return null
  const stop = (e)=> e.stopPropagation()
  return (
    <div className="fixed inset-0 bg-black/90 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="max-w-6xl w-full" onClick={stop}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-300 truncate pr-4">{image?.alt || 'Untitled'}</div>
          <div className="flex gap-2">
            <button onClick={()=>onDelete(image)} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm">Delete</button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Close</button>
          </div>
        </div>
        <img src={image?.url} alt={image?.alt||''} className="max-h-[78vh] w-full object-contain rounded-lg" />
      </div>
    </div>
  )
}

export default function Portfolio(){
  const params = new URLSearchParams(location.search)
  const category = params.get('category')
  const folderId = params.get('folder')
  const [categories, setCategories] = useState([])
  const [folders, setFolders] = useState([])
  const [images, setImages] = useState([])
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)

  // Load categories (for landing tiles if no category chosen)
  useEffect(()=>{
    fetch(`${API}/categories`).then(r=>r.json()).then(setCategories).catch(()=>{})
  },[])

  // Load folders for Events (or selected category)
  useEffect(()=>{
    if(category){
      fetch(`${API}/folders?category_slug=${category}`).then(r=>r.json()).then(setFolders).catch(()=>{})
    } else {
      setFolders([])
    }
  },[category])

  // Load images for chosen folder or entire category
  useEffect(()=>{
    let url = `${API}/images`
    const qs = new URLSearchParams()
    if(folderId){ qs.set('folder_id', folderId) }
    else if(category){ qs.set('category_slug', category) }
    if(Array.from(qs.keys()).length){ url += `?${qs.toString()}` }
    fetch(url).then(r=>r.json()).then(setImages).catch(()=>{})
  },[category, folderId])

  const onDelete = async (img) => {
    if(!img?.id) return
    const sure = confirm('Delete this image? This cannot be undone.')
    if(!sure) return
    try{
      const res = await fetch(`${API}/images/${img.id}`, { method: 'DELETE' })
      if(res.ok){
        setImages(prev => prev.filter(i => i.id !== img.id))
        setOpen(false)
      }
    }catch(e){
      // ignore
    }
  }

  // Grid with subtle white gutters
  const gridStyles = { gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }

  return (
    <main className="min-h-screen bg-[#0b0b0b]">
      {/* Hero header over backdrop when landing at Portfolio without category */}
      {!category && (
        <section className="relative h-[50vh] grid place-items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={categories[0]?.cover_url || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60"/>
          </div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold">Portfolio</h1>
            <p className="mt-3 text-white/80 max-w-2xl">Explore portraits, events and street collections.</p>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Step 1: show top categories if no selection */}
        {!category && (
          <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
            {['portraits','events','street'].map(slug => {
              const cat = categories.find(c=>c.slug===slug)
              return (
                <a key={slug} href={`/portfolio?category=${slug}`} className="group relative rounded-xl overflow-hidden ring-1 ring-white/15">
                  <div className="aspect-[4/3]">
                    <img src={cat?.cover_url || 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb0?q=80&w=1200&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform" />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-lg md:text-xl font-semibold capitalize">{slug}</span>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {/* Step 2: category selected -> show folders (notably for Events nested folders) */}
        {category && !folderId && (
          <>
            <div className="mb-6 text-gray-300">
              <a href="/portfolio" className="text-indigo-400 hover:text-indigo-300">All</a>
              <span className="mx-2">/</span>
              <span className="text-white font-medium capitalize">{category}</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {folders.map(f => (
                <a key={f.id} href={`/portfolio?category=${category}&folder=${f.id}`} className="px-4 py-2 rounded-full border border-white/20 text-white/90 hover:bg-white hover:text-black transition">
                  {f.name}
                </a>
              ))}
              {folders.length===0 && <div className="text-gray-400">No folders yet in this category.</div>}
            </div>
          </>
        )}

        {/* Step 3: Mosaic grid of images for folder or entire category */}
        {(category || folderId) && (
          <div className="grid gap-2 md:gap-3" style={gridStyles}>
            {images.map(img => (
              <button key={img.id} className="group relative overflow-hidden bg-white/5 ring-1 ring-white/10" onClick={()=>{setCurrent(img);setOpen(true)}}>
                {/* Mixed aspect ratios by reading width/height if provided, otherwise alternate */}
                <div className="aspect-[4/3] md:aspect-[3/4]">
                  <img src={img.url} alt={img.alt||''} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"/>
                </div>
              </button>
            ))}
            {images.length===0 && (
              <div className="text-gray-400">No images yet.</div>
            )}
          </div>
        )}
      </section>

      <Lightbox open={open} image={current} onClose={()=>setOpen(false)} onDelete={onDelete} />
    </main>
  )
}
