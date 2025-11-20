import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Admin(){
  const [key, setKey] = useState('')
  const [seeded, setSeeded] = useState(false)

  const seed = async (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('owner_key', key)
    const r = await fetch(`${API}/admin/seed`, { method: 'POST', body: form })
    if(r.ok){ setSeeded(true) } else { alert('Unauthorized') }
  }

  return (
    <section className="container-default py-14">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-gray-400 mb-6">Enter your owner key to manage categories and seed starter content.</p>

      <form onSubmit={seed} className="flex items-center gap-3 mb-8">
        <input value={key} onChange={e=>setKey(e.target.value)} placeholder="Owner key" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"/>
        <button className="px-4 py-2 rounded-lg bg-white text-black font-semibold">Seed base categories</button>
      </form>

      {seeded && <p className="text-green-400">Seed complete. Reload the homepage to see categories.</p>}

      <div className="mt-10 space-y-4 text-gray-400">
        <p>Image uploads: In this preview, paste public image URLs via the API using a REST client, or extend with Cloudinary/S3.</p>
      </div>
    </section>
  )
}
