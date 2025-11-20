import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Admin(){
  const [ownerKey, setOwnerKey] = useState('')
  const [seedResult, setSeedResult] = useState(null)

  // Create Folder
  const [folder, setFolder] = useState({ name:'', slug:'', category_slug:'', parent_id:'', description:'' })
  const [folderStatus, setFolderStatus] = useState(null)

  // Add Image by URL
  const [image, setImage] = useState({url:'', alt:'', category_slug:'', folder_id:''})
  const [createStatus, setCreateStatus] = useState(null)

  // Upload from local machine
  const [file, setFile] = useState(null)
  const [uploadMeta, setUploadMeta] = useState({ alt:'', category_slug:'', folder_id:'' })
  const [uploadStatus, setUploadStatus] = useState(null)
  const [uploadedPreview, setUploadedPreview] = useState(null)

  const [categories, setCategories] = useState([])
  const [folders, setFolders] = useState([])
  const [catForFolders, setCatForFolders] = useState('')

  // Site settings
  const [settings, setSettings] = useState({})
  const [heroFile, setHeroFile] = useState(null)
  const [heroUrlInput, setHeroUrlInput] = useState('')
  const [heroStatus, setHeroStatus] = useState(null)

  // Library
  const [recentImages, setRecentImages] = useState([])
  const [libraryStatus, setLibraryStatus] = useState('')

  useEffect(()=>{
    fetch(`${API}/categories`).then(r=>r.json()).then(setCategories).catch(()=>{})
    fetch(`${API}/settings`).then(r=>r.json()).then((s)=>{ setSettings(s||{}); setHeroUrlInput(s?.hero_url||'') }).catch(()=>{})
    refreshLibrary()
  },[])

  const refreshLibrary = () => {
    setLibraryStatus('loading')
    fetch(`${API}/images?limit=30`).then(r=>r.json()).then(d=>{ setRecentImages(Array.isArray(d)? d : []); setLibraryStatus('') }).catch(()=>{ setRecentImages([]); setLibraryStatus('') })
  }

  useEffect(()=>{
    if(catForFolders){
      fetch(`${API}/folders?category_slug=${catForFolders}`).then(r=>r.json()).then(setFolders).catch(()=>{})
    } else {
      setFolders([])
    }
  },[catForFolders])

  const seed = async () => {
    const fd = new FormData()
    fd.append('owner_key', ownerKey)
    const res = await fetch(`${API}/admin/seed`, { method: 'POST', body: fd })
    const data = await res.json()
    setSeedResult(data)
  }

  const createFolder = async (e) => {
    e.preventDefault()
    setFolderStatus('creating')
    try{
      const payload = { ...folder, parent_id: folder.parent_id || null, description: folder.description || null }
      const res = await fetch(`${API}/folders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      setFolderStatus(res.ok ? 'created' : data.detail || 'error')
      if(res.ok){
        setFolder({ name:'', slug:'', category_slug:'', parent_id:'', description:'' })
        if(catForFolders){
          fetch(`${API}/folders?category_slug=${catForFolders}`).then(r=>r.json()).then(setFolders).catch(()=>{})
        }
      }
    } catch(err){
      setFolderStatus('error')
    }
  }

  const addImage = async (e) => {
    e.preventDefault()
    setCreateStatus('creating')
    try{
      const body = { ...image, folder_id: image.folder_id || null, alt: image.alt || null }
      const res = await fetch(`${API}/images`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      const data = await res.json()
      setCreateStatus(res.ok ? 'created' : data.detail || 'error')
      if(res.ok){ setImage({url:'', alt:'', category_slug:'', folder_id:''}); refreshLibrary() }
    } catch(err){
      setCreateStatus('error')
    }
  }

  const uploadAndCreate = async (e) => {
    e.preventDefault()
    if(!file){ setUploadStatus('Please choose an image file'); return }
    if(!uploadMeta.category_slug){ setUploadStatus('Please select a category'); return }
    setUploadStatus('uploading')
    setUploadedPreview(null)
    try{
      // 1) Upload file
      const fd = new FormData()
      fd.append('file', file)
      const upRes = await fetch(`${API}/upload`, { method:'POST', body: fd })
      const upData = await upRes.json()
      if(!upRes.ok){ setUploadStatus(upData.detail || 'Upload failed'); return }

      // 2) Create image document
      const payload = {
        url: upData.url,
        alt: uploadMeta.alt || null,
        category_slug: uploadMeta.category_slug,
        folder_id: uploadMeta.folder_id || null
      }
      const res = await fetch(`${API}/images`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(!res.ok){ setUploadStatus(data.detail || 'Failed to save image'); return }
      setUploadStatus('uploaded')
      setUploadedPreview(upData.url)
      setFile(null)
      setUploadMeta({ alt:'', category_slug: uploadMeta.category_slug, folder_id: uploadMeta.folder_id || '' })
      refreshLibrary()
    } catch(err){
      setUploadStatus('error')
    }
  }

  const afterHeroSaved = (data) => {
    setSettings(data || {})
    setHeroUrlInput(data?.hero_url || '')
    // Notify same-tab components immediately
    try { window.dispatchEvent(new Event('pb.hero.updated')) } catch {}
    // Notify other tabs/components to refresh hero
    try { localStorage.setItem('pb_hero_updated', String(Date.now())) } catch {}
  }

  const setHeroFromFile = async (e) => {
    e.preventDefault()
    if(!heroFile){ setHeroStatus('Choose a file'); return }
    setHeroStatus('uploading')
    try{
      const fd = new FormData()
      fd.append('file', heroFile)
      const upRes = await fetch(`${API}/upload`, { method:'POST', body: fd })
      const upData = await upRes.json()
      if(!upRes.ok){ setHeroStatus(upData.detail || 'Upload failed'); return }
      const res = await fetch(`${API}/settings`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ hero_url: upData.url }) })
      const data = await res.json()
      if(!res.ok){ setHeroStatus(data.detail || 'Save failed'); return }
      afterHeroSaved(data)
      setHeroStatus('saved')
    } catch(err){
      setHeroStatus('error')
    }
  }

  const saveHeroFromUrl = async (e) => {
    e.preventDefault()
    if(!heroUrlInput){ setHeroStatus('Enter a URL'); return }
    setHeroStatus('saving')
    try{
      const res = await fetch(`${API}/settings`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ hero_url: heroUrlInput }) })
      const data = await res.json()
      if(!res.ok){ setHeroStatus(data.detail || 'Save failed'); return }
      afterHeroSaved(data)
      setHeroStatus('saved')
    } catch(err){
      setHeroStatus('error')
    }
  }

  const setHeroFromExisting = async (url) => {
    try{
      setHeroStatus('saving')
      const res = await fetch(`${API}/settings`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ hero_url: url }) })
      const data = await res.json()
      if(!res.ok){ setHeroStatus(data.detail || 'Save failed'); return }
      afterHeroSaved(data)
      setHeroStatus('saved')
    } catch(err){
      setHeroStatus('error')
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Admin</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Seed Base Categories</h2>
          <div className="flex gap-3">
            <input placeholder="Owner Key" className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-2" value={ownerKey} onChange={e=>setOwnerKey(e.target.value)} />
            <button onClick={seed} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Seed</button>
          </div>
          {seedResult && <pre className="mt-3 text-sm text-gray-300">{JSON.stringify(seedResult,null,2)}</pre>}
        </section>

        <section className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Create Folder</h2>
          <form onSubmit={createFolder} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Name" className="bg-transparent border border-white/10 rounded-lg px-4 py-2" value={folder.name} onChange={e=>setFolder({...folder,name:e.target.value})} />
              <input required placeholder="Slug (unique)" className="bg-transparent border border-white/10 rounded-lg px-4 py-2" value={folder.slug} onChange={e=>setFolder({...folder,slug:e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select required className="bg-transparent border border-white/10 rounded-lg px-4 py-2" value={folder.category_slug} onChange={e=>setFolder({...folder,category_slug:e.target.value})}>
                <option value="">Select category</option>
                {categories.map(c => (<option key={c.id || c.slug} value={c.slug} className="bg-[#0a0a0a]">{c.name}</option>))}
              </select>
              <input placeholder="Parent folder ID (optional)" className="bg-transparent border border-white/10 rounded-lg px-4 py-2" value={folder.parent_id} onChange={e=>setFolder({...folder,parent_id:e.target.value})} />
            </div>
            <textarea placeholder="Description (optional)" className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2" rows={2} value={folder.description} onChange={e=>setFolder({...folder,description:e.target.value})} />
            <button disabled={folderStatus==='creating'} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">{folderStatus==='creating'?'Creating...':'Create Folder'}</button>
            {folderStatus && folderStatus!=='creating' && <p className="text-sm text-gray-300">{String(folderStatus)}</p>}
          </form>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-xl p-6 md:col-span-2">
          <h2 className="text-xl font-medium mb-4">Add Image by URL</h2>
          <form onSubmit={addImage} className="grid md:grid-cols-2 gap-3">
            <input required placeholder="Image URL" className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2" value={image.url} onChange={e=>setImage({...image,url:e.target.value})} />
            <input placeholder="Alt" className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2" value={image.alt} onChange={e=>setImage({...image,alt:e.target.value})} />
            <select required className="bg-transparent border border-white/10 rounded-lg px-4 py-2" value={image.category_slug} onChange={e=>setImage({...image,category_slug:e.target.value})}>
              <option value="">Select category</option>
              {categories.map(c => (<option key={c.id || c.slug} value={c.slug} className="bg-[#0a0a0a]">{c.name}</option>))}
            </select>
            <input placeholder="Folder ID (optional)" className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2" value={image.folder_id} onChange={e=>setImage({...image,folder_id:e.target.value})} />
            <div className="md:col-span-2 flex items-center gap-3">
              <button disabled={createStatus==='creating'} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">{createStatus==='creating'?'Creating...':'Create'}</button>
              {createStatus && createStatus!=='creating' && <p className="text-sm text-gray-300">{String(createStatus)}</p>}
            </div>
          </form>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-xl p-6 md:col-span-2">
          <h2 className="text-xl font-medium mb-4">Upload Image from Computer</h2>
          <form onSubmit={uploadAndCreate} className="grid md:grid-cols-2 gap-3">
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2 file:mr-3 file:rounded file:border-0 file:bg:white/10 file:bg-white/10 file:text-white" />
            <input placeholder="Alt (optional)" className="bg-transparent border border-white/10 rounded-lg px-4 py-2" value={uploadMeta.alt} onChange={e=>setUploadMeta({...uploadMeta,alt:e.target.value})} />
            <select required className="bg-transparent border border-white/10 rounded-lg px-4 py-2" value={uploadMeta.category_slug} onChange={e=>setUploadMeta({...uploadMeta,category_slug:e.target.value})}>
              <option value="">Select category</option>
              {categories.map(c => (<option key={c.id || c.slug} value={c.slug} className="bg-[#0a0a0a]">{c.name}</option>))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Folder ID (optional)" className="bg-transparent border border-white/10 rounded-lg px-4 py-2" value={uploadMeta.folder_id} onChange={e=>setUploadMeta({...uploadMeta,folder_id:e.target.value})} />
              <div className="flex items-center gap-2">
                <select className="flex-1 bg-transparent border border-white/10 rounded-lg px-2 py-2" value={catForFolders} onChange={e=>setCatForFolders(e.target.value)}>
                  <option value="">Browse folders by category</option>
                  {categories.map(c => (<option key={c.id || c.slug} value={c.slug} className="bg-[#0a0a0a]">{c.name}</option>))}
                </select>
              </div>
            </div>
            {folders.length>0 && (
              <div className="md:col-span-2 flex flex-wrap gap-2">
                {folders.map(f => (
                  <button type="button" key={f.id} onClick={()=>setUploadMeta({...uploadMeta, folder_id: f.id})} className={`px-3 py-1 rounded-full border text-sm ${uploadMeta.folder_id===f.id? 'bg-white text-black' : 'border-white/20 text-white/80'}`}>
                    {f.name}
                  </button>
                ))}
              </div>
            )}
            <div className="md:col-span-2 flex items-center gap-3">
              <button disabled={uploadStatus==='uploading'} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">{uploadStatus==='uploading'?'Uploading...':'Upload & Save'}</button>
              {uploadStatus && uploadStatus!=='uploading' && <p className="text-sm text-gray-300">{String(uploadStatus)}</p>}
            </div>
            {uploadedPreview && (
              <div className="md:col-span-2">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white/5 relative">
                  <img src={uploadedPreview} alt="Uploaded preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3">
                    <button type="button" onClick={()=>setHeroFromExisting(uploadedPreview)} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow">
                      Set as Hero Background
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </section>

        {/* Site settings: custom homepage hero */}
        <section className="bg-white/5 border border-white/10 rounded-xl p-6 md:col-span-2">
          <h2 className="text-xl font-medium mb-4">Site Settings</h2>
          <div className="grid md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2 space-y-3">
              <form onSubmit={saveHeroFromUrl} className="flex gap-3">
                <input placeholder="Hero image URL" className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-2" value={heroUrlInput} onChange={e=>setHeroUrlInput(e.target.value)} />
                <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Save URL</button>
              </form>
              <form onSubmit={setHeroFromFile} className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={e=>setHeroFile(e.target.files?.[0]||null)} className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-2 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:text-white" />
                <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Upload as Hero</button>
              </form>
              {heroStatus && <p className="text-sm text-gray-300">{String(heroStatus)}</p>}
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 aspect-video">
              {settings?.hero_url ? (
                <img src={settings.hero_url} alt="Hero preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No hero set</div>
              )}
            </div>
          </div>
        </section>

        {/* Library with Set as Hero buttons */}
        <section className="bg-white/5 border border-white/10 rounded-xl p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Library</h2>
            <button onClick={refreshLibrary} className="text-sm px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10">Refresh</button>
          </div>
          {libraryStatus==='loading' && <p className="text-sm text-gray-300">Loading images...</p>}
          {recentImages.length===0 && libraryStatus!=="loading" && (
            <p className="text-sm text-gray-300">No images yet. Upload above to get started.</p>
          )}
          {recentImages.length>0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentImages.map(img => (
                <div key={img.id || img._id || img.url} className="relative group rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <div className="aspect-square overflow-hidden">
                    <img src={img.url} alt={img.alt || 'Image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-2 flex items-center justify-between gap-2">
                    <button type="button" onClick={()=>setHeroFromExisting(img.url)} className="w-full text-xs px-2 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white">
                      Set as Hero Background
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
