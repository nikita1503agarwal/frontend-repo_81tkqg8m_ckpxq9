import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Events(){
  const [folders, setFolders] = useState([])
  const [images, setImages] = useState([])
  const [activeFolder, setActiveFolder] = useState(null)

  useEffect(()=>{
    fetch(`${API}/folders?category_slug=events`).then(r=>r.json()).then(setFolders).catch(()=>{})
  },[])

  useEffect(()=>{
    if(activeFolder){
      fetch(`${API}/images?folder_id=${activeFolder}`).then(r=>r.json()).then(setImages).catch(()=>{})
    } else {
      setImages([])
    }
  },[activeFolder])

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Events</h1>

      <div className="flex gap-3 overflow-auto pb-2 mb-8">
        {folders.map(f => (
          <button key={f.id} onClick={()=>setActiveFolder(f.id)} className={`px-4 py-2 rounded-full border ${activeFolder===f.id? 'bg-white text-black' : 'border-white/20 text-white/80'}`}>
            {f.name}
          </button>
        ))}
        {folders.length===0 && <div className="text-gray-400">No event folders yet.</div>}
      </div>

      <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
        {images.map(img => (
          <div key={img.id} className="rounded-xl overflow-hidden bg-white/5">
            <div className="aspect-[4/3]"><img src={img.url} alt="" className="w-full h-full object-cover"/></div>
          </div>
        ))}
      </div>
    </main>
  )
}
