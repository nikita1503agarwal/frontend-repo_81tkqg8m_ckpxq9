import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Contact(){
  const [form, setForm] = useState({name:'', email:'', message:'', budget:'', shoot_type:''})
  const [status, setStatus] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try{
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if(res.ok){
        setStatus('sent')
        setForm({name:'', email:'', message:'', budget:'', shoot_type:''})
      } else {
        setStatus(data.detail || 'error')
      }
    } catch(err){
      setStatus('error')
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Contact</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input required placeholder="Name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input required type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input placeholder="Budget (optional)" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} />
          <input placeholder="Shoot Type (optional)" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3" value={form.shoot_type} onChange={e=>setForm({...form,shoot_type:e.target.value})} />
        </div>
        <textarea required placeholder="Your message" rows={6} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
        <button disabled={status==='sending'} className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">{status==='sending'?'Sending...':'Send'}</button>
        {status==='sent' && <p className="text-green-400">Thanks! I'll get back to you soon.</p>}
        {status && status!=='sent' && status!=='sending' && <p className="text-red-400">{String(status)}</p>}
      </form>
      <div className="mt-8 flex flex-wrap gap-6 text-gray-300">
        <a href="mailto:perspectivebyadi@gmail.com" className="hover:text-white">Email</a>
        <a href="https://wa.me/919768312541" className="hover:text-white" target="_blank" rel="noreferrer">WhatsApp</a>
        <a href="https://instagram.com/perspective_by_adi" className="hover:text-white" target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </main>
  )
}
