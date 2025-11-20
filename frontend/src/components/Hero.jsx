import React from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero(){
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black pointer-events-none" />
      <div className="relative z-10 h-full container-default flex items-end pb-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight">Berlin-based cinematic professional photographer</h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-300">capturing raw, candid moments and authentic stories across portraits, events, and street life.</p>
        </div>
      </div>
    </section>
  )
}
