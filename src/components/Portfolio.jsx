import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Lightbox({ open, onClose, image, onDelete }){
  if(!open) return null
  const stop = (e)=> e.stopPropagation()
  return (
    <div className="fixed inset-0 bg-black/90 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="max-w-5xl w-full" onClick={stop}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-300 truncate pr-4">{image?.alt || 'Untitled'}</div>
          <div className="flex gap-2">
            <button onClick={()=>onDelete(image)} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm">Delete</button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Close</button>
          </div>
        </div>
        <img src={image?.url} alt={image?.alt||''} className="max-h-[75vh] w-full object-contain rounded-lg" />
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

  // Load categories to show top-level "folders" under portfolio
  useEffect(()=>{
    fetch(`${API}/categories`).then(r=>r.json()).then(setCategories).catch(()=>{})
  },[])

  // Load folders when a category is chosen
  useEffect(()=>{
    if(category){
      fetch(`${API}/folders?category_slug=${category}`).then(r=>r.json()).then(setFolders).catch(()=>{})
    } else {
      setFolders([])
    }
  },[category])

  // Load images when folder chosen; if none, and category chosen, show all in category
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

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Portfolio</h1>

      {/* Step 1: show categories as sub-folders */}
      {!category && (
        <div className="grid gap-4 mb-10" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          {categories.map(cat => (
            <a key={cat.id || cat.slug} href={`/portfolio?category=${cat.slug}`} className="group relative rounded-xl overflow-hidden bg-white/5">
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
            </a>
          ))}
          {categories.length===0 && (
            <div className="text-gray-400">No categories yet. Use Admin to seed starter data.</div>
          )}
        </div>
      )}

      {/* Step 2: when a category is selected, show its folders */}
      {category && !folderId && (
        <>
          <div className="mb-6 text-gray-300">
            <a href="/portfolio" className="text-indigo-400 hover:text-indigo-300">All</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{category}</span>
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

      {/* Step 3: show images for folder or entire category */}
      {(category || folderId) && (
        <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
          {images.map(img => (
            <button key={img.id} className="group relative rounded-xl overflow-hidden bg-white/5" onClick={()=>{setCurrent(img);setOpen(true)}}>
              <div className="aspect-[4/3]">
                <img src={img.url} alt={img.alt||''} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"/>
              </div>
            </button>
          ))}
          {images.length===0 && (
            <div className="text-gray-400">No images yet.</div>
          )}
        </div>
      )}

      <Lightbox open={open} image={current} onClose={()=>setOpen(false)} onDelete={onDelete} />
    </main>
  )
}
