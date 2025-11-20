import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Admin(){
  const [ownerKey, setOwnerKey] = useState('')
  const [seedResult, setSeedResult] = useState(null)
  const [image, setImage] = useState({url:'', alt:'', category_slug:'', folder_id:''})
  const [createStatus, setCreateStatus] = useState(null)

  const seed = async () => {
    const fd = new FormData()
    fd.append('owner_key', ownerKey)
    const res = await fetch(`${API}/admin/seed`, { method: 'POST', body: fd })
    const data = await res.json()
    setSeedResult(data)
  }

  const addImage = async (e) => {
    e.preventDefault()
    setCreateStatus('creating')
    try{
      const res = await fetch(`${API}/images`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(image) })
      const data = await res.json()
      setCreateStatus(res.ok ? 'created' : data.detail || 'error')
      if(res.ok){ setImage({url:'', alt:'', category_slug:'', folder_id:''}) }
    } catch(err){
      setCreateStatus('error')
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Admin</h1>

      <div className="space-y-6">
        <section className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Seed Base Categories</h2>
          <div className="flex gap-3">
            <input placeholder="Owner Key" className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-2" value={ownerKey} onChange={e=>setOwnerKey(e.target.value)} />
            <button onClick={seed} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Seed</button>
          </div>
          {seedResult && <pre className="mt-3 text-sm text-gray-300">{JSON.stringify(seedResult,null,2)}</pre>}
        </section>

        <section className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Add Image by URL</h2>
          <form onSubmit={addImage} className="space-y-3">
            <input required placeholder="Image URL" className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2" value={image.url} onChange={e=>setImage({...image,url:e.target.value})} />
            <input placeholder="Alt" className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2" value={image.alt} onChange={e=>setImage({...image,alt:e.target.value})} />
            <input required placeholder="Category slug (e.g., weddings)" className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2" value={image.category_slug} onChange={e=>setImage({...image,category_slug:e.target.value})} />
            <input placeholder="Folder ID (optional)" className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2" value={image.folder_id} onChange={e=>setImage({...image,folder_id:e.target.value})} />
            <button disabled={createStatus==='creating'} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">{createStatus==='creating'?'Creating...':'Create'}</button>
            {createStatus && createStatus!=='creating' && <p className="text-sm text-gray-300">{String(createStatus)}</p>}
          </form>
        </section>
      </div>
    </main>
  )
}
