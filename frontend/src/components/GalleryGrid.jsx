import React, { useState } from 'react'

function Lightbox({ open, onClose, images, index }){
  if(!open) return null
  const img = images[index]
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <img src={img.url} alt={img.alt || ''} className="max-h-full max-w-full object-contain" />
    </div>
  )
}

export default function GalleryGrid({ images }){
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <div className="grid-auto-fit">
        {images.map((img, i) => (
          <button key={i} className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-white/5" onClick={()=>{setIndex(i); setOpen(true)}}>
            <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover group-hover:scale-105 transition" />
          </button>
        ))}
      </div>
      <Lightbox open={open} index={index} images={images} onClose={()=>setOpen(false)} />
    </>
  )
}
