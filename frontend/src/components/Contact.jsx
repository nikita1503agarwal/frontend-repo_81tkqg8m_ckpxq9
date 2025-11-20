import React, { useState } from 'react'
import { Mail, Phone, Instagram } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Contact(){
  const [status, setStatus] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message'),
      budget: form.get('budget'),
      shoot_type: form.get('type')
    }
    const r = await fetch(`${API}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if(r.ok){ setStatus('sent'); (e.target).reset() } else { setStatus('error') }
  }

  return (
    <section className="container-default py-14">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Budget</label>
              <input name="budget" placeholder="€500 - €1500" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type of shoot</label>
              <select name="type" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <option>Portrait</option>
                <option>Event</option>
                <option>Street</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Message</label>
            <textarea name="message" rows="5" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2"></textarea>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white text-black font-semibold">Send</button>
          {status==='sent' && <p className="text-sm text-green-400">Thanks — I’ll be in touch soon.</p>}
          {status==='error' && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}
        </form>
        <div className="space-y-4">
          <a className="flex items-center gap-3 text-gray-300 hover:text-white" href="mailto:hello@perspectivebyadi.de"><Mail size={18}/> hello@perspectivebyadi.de</a>
          <a className="flex items-center gap-3 text-gray-300 hover:text-white" href="https://wa.me/491234567890" target="_blank" rel="noreferrer"><Phone size={18}/> WhatsApp</a>
          <a className="flex items-center gap-3 text-gray-300 hover:text-white" href="https://instagram.com/perspectivebyadi" target="_blank" rel="noreferrer"><Instagram size={18}/> @perspectivebyadi</a>
        </div>
      </div>
    </section>
  )
}
