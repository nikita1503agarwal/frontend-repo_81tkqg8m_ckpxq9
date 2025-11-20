import React from 'react'

export default function About(){
  return (
    <section className="container-default py-14">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <img src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1200&auto=format&fit=crop" alt="Adi portrait" className="w-full aspect-square object-cover rounded-xl border border-white/10"/>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">About Adi</h1>
          <p className="text-gray-300 leading-relaxed">I’m Adi, a Berlin-based photographer with a cinematic eye for authentic, unscripted moments. Over the past years I’ve collaborated with individuals, families, and brands to craft images that feel intimate and alive. My work spans portrait sessions, events, and street life — always driven by story, mood, and connection.</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-1">Experience</h3>
              <p className="text-sm text-gray-400">5+ years shooting portraits, events, and editorial features.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-1">Areas Served</h3>
              <p className="text-sm text-gray-400">Berlin and across the EU by request.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
