import React, { useEffect, useState } from 'react'
import GalleryGrid from './GalleryGrid'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Portfolio({ category, title }){
  const [images, setImages] = useState([])

  useEffect(()=>{
    fetch(`${API}/images?category_slug=${category}`).then(r=>r.json()).then(setImages).catch(()=>{})
  },[category])

  return (
    <section className="container-default py-14">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {images.length === 0 ? (
        <p className="text-gray-400">No images yet. Check back soon.</p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </section>
  )
}
