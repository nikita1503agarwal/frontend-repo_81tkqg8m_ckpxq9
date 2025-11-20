import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import GalleryGrid from './GalleryGrid'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function EventFolders(){
  const [folders, setFolders] = useState([])
  useEffect(()=>{
    fetch(`${API}/folders?category_slug=events`).then(r=>r.json()).then(setFolders).catch(()=>{})
  },[])

  const top = folders.filter(f=>!f.parent_id)

  return (
    <section className="container-default py-14">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {top.map(f => (
          <Link to={f.slug} key={f.slug} className="group rounded-lg overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <div className="aspect-[16/9] bg-gradient-to-br from-white/10 to-white/0 flex items-center justify-center">
              <span className="text-5xl font-black opacity-20 group-hover:opacity-30 transition">{f.name[0]}</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{f.name}</h3>
              <p className="text-sm text-gray-400">Events gallery</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function FolderGallery(){
  const { folderSlug } = useParams()
  const [folder, setFolder] = useState(null)
  const [subfolders, setSubfolders] = useState([])
  const [images, setImages] = useState([])

  useEffect(()=>{
    fetch(`${API}/folders?category_slug=events`).then(r=>r.json()).then(data =>{
      const f = data.find(x=>x.slug===folderSlug)
      setFolder(f)
      if(!f) return
      fetch(`${API}/folders?category_slug=events&parent_id=${f.id}`).then(r=>r.json()).then(setSubfolders)
      fetch(`${API}/images?category_slug=events&folder_id=${f.id}`).then(r=>r.json()).then(setImages)
    }).catch(()=>{})
  },[folderSlug])

  return (
    <section className="container-default py-14">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-3xl font-bold">{folder?.name || 'Events'}</h1>
        <Link to="/events" className="text-sm text-gray-400 hover:text-white">All events</Link>
      </div>
      {subfolders.length>0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Subfolders</h2>
          <div className="flex flex-wrap gap-3">
            {subfolders.map(s => (
              <Link to={`/${s.slug}`} key={s.slug} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10">{s.name}</Link>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <p className="text-gray-400">No images yet.</p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </section>
  )
}

export default function Events(){
  return (
    <Routes>
      <Route index element={<EventFolders/>} />
      <Route path=":folderSlug/*" element={<FolderGallery/>} />
    </Routes>
  )
}
