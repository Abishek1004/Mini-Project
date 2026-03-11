import { useRef } from 'react'
import { CATEGORIES } from '../data'
import Footer from '../components/layout/Footer'
import ImgF from '../components/ui/ImgF'

function CategoryCard({ cat, onClick }) {
  return (
    <>
      <style>{`
        .eco-cat-card { transition: border-color 0.22s, box-shadow 0.22s, transform 0.22s; }
        .eco-cat-card:hover, .eco-cat-card:focus {
          border-color: var(--cat-color) !important;
          box-shadow: 0 14px 36px rgba(0,0,0,0.11) !important;
          transform: translateY(-5px) !important;
          outline: none;
        }
        .eco-cat-card:active { transform: translateY(-2px) !important; }
      `}</style>
      <div
        className="eco-cat-card flex flex-col bg-white rounded-2xl border-2 border-slate-200 shadow cursor-pointer text-left overflow-hidden w-full select-none"
        style={{ '--cat-color': cat.color }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      >
        {/* Image area */}
        <div
          className="min-h-[190px] flex items-center justify-center relative p-6 pointer-events-none"
          style={{ background: cat.light }}
        >
          <span
            className="absolute top-3 right-3 text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full font-inter pointer-events-none"
            style={{ background: cat.color }}
          >
            {cat.badge}
          </span>
          <ImgF
            src={cat.img}
            alt={cat.name}
            style={{ maxWidth: 150, maxHeight: 150, objectFit: 'contain' }}
            fallback={
              <div className="text-center pointer-events-none">
                <div className="text-8xl leading-none">{cat.emoji}</div>
                <p className="text-xs text-slate-400 mt-2">📁 /images/categories/{cat.id}.png</p>
              </div>
            }
          />
        </div>

        {/* Text area */}
        <div className="p-5 pb-6 pointer-events-none">
          <h3 className="font-poppins font-extrabold text-2xl text-slate-800 mb-1.5">{cat.name}</h3>
          <p className="text-slate-500 text-sm mb-4 leading-relaxed font-inter">{cat.sub}</p>
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full font-inter"
              style={{ background: cat.light, color: cat.color, border: `1px solid ${cat.color}30` }}
            >
              {cat.count}
            </span>
            <span className="text-xl font-bold" style={{ color: cat.color }}>→</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function HomePage({ go }) {
  const catRef = useRef(null)

  const stats = [
    { val: '50,000+', label: 'Happy Customers' },
    { val: '15',      label: 'Cities Served' },
    { val: '₹2 Cr+',  label: 'Paid to Users' },
    { val: '99%',     label: 'Recycled Safely' },
  ]

  const features = [
    { icon: '⚡', title: 'Instant Price Quote',    desc: 'Get a fair market price in under 2 minutes with our smart dynamic pricing engine.' },
    { icon: '🚚', title: 'Free Doorstep Pickup',   desc: 'Schedule a free pickup at your convenience — no travel, no hassle.' },
    { icon: '🔒', title: 'Certified Data Wiping',   desc: 'All personal data is permanently wiped using certified software before processing.' },
    // { icon: '💳', title: 'Fast Payment',             desc: 'Get paid within 24 hours via UPI, bank transfer, or your preferred method.' },
    // { icon: '♻️', title: 'Eco-Certified Recycling', desc: 'ISO 14001 certified zero-landfill disposal. Every component is responsibly processed.' },
    // { icon: '📊', title: 'Transparent Process',     desc: 'Track your device journey from pickup to recycling. No surprises, ever.' },
  ]

  return (
    <div>
      {/* HERO */}
      <section
        className="relative overflow-hidden px-5 pt-20 pb-24"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0d9488 100%)' }}
      >
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: '#6ee7b7', opacity: 0.06, filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: '#34d399', opacity: 0.05, filter: 'blur(40px)' }} />

        <div className="max-w-[1200px] mx-auto relative">
          <div className="max-w-2xl">
            <span
              className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase font-inter"
              style={{ background: 'rgba(110,231,183,0.15)', border: '1px solid rgba(110,231,183,0.3)', color: '#6ee7b7' }}
            >
              🍃 India's #1 E-Waste Recycling Platform
            </span>
            <h1 className="font-poppins font-black text-white leading-tight mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
              Turn Your Old <br /> or Damage Devices 
              <span style={{ color: '#34d399' }}> Into Cash</span>  
            </h1>
            <p className="font-inter text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Get instant price quotes for old phones, laptops &amp; Enjoy free pickup and fair prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => catRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="font-poppins font-bold text-eco-800 bg-white px-8 py-4 rounded-xl border-none cursor-pointer text-base transition-all hover:scale-105 shadow-xl"
              >
                Get My Price Now →
              </button>
              <button
                onClick={() => go('process')}
                className="font-poppins font-semibold text-white/80 px-4 py-4 rounded-xl cursor-pointer text-sm transition-all bg-transparent border-none hover:text-white"
              >
                How It Works ↗
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`py-8 px-6 text-center ${i < stats.length - 1 ? 'border-r border-slate-100' : ''}`}
            >
              <div className="font-poppins font-extrabold text-eco-600 text-3xl mb-1">{s.val}</div>
              <div className="text-slate-500 text-sm font-inter">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="cat-section" ref={catRef} className="px-5 py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="font-inter font-bold text-eco-600 text-xs tracking-widest uppercase">Step 1 of 5</span>
            <h2 className="font-poppins font-extrabold text-slate-800 mt-3 mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
              What Do You Want to Recycle?
            </h2>
            <p className="text-slate-500 font-inter text-base max-w-lg mx-auto">
              Select a device category to get your instant price estimate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                onClick={() => go('category', { category: cat.id })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 py-20 bg-slate-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-extrabold text-slate-800 mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)' }}>
              Why Choose EcoLoop?
            </h2>
            <p className="text-slate-500 font-inter text-base max-w-lg mx-auto">
              We make recycling easy, profitable, and responsible.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-7 rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-eco-200 hover:bg-eco-50 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-4xl mb-3.5">{icon}</div>
                <h3 className="font-poppins font-bold text-slate-800 text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-inter">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="rounded-3xl px-10 py-16 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #064e3b, #0d9488)' }}
          >
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none" style={{ background: '#6ee7b7', opacity: 0.08, filter: 'blur(40px)' }} />
            <h2 className="font-poppins font-extrabold text-white mb-3.5 relative" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
              Ready to Recycle &amp; Earn?
            </h2>
            <p className="text-white/72 font-inter text-lg mb-8 relative">
              Join 50,000+ users who've already turned e-waste into value.
            </p>
            <button
              onClick={() => catRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-eco-800 font-poppins font-bold text-base px-9 py-3.5 rounded-xl border-none cursor-pointer shadow-xl transition-transform hover:scale-105 relative"
            >
              Get My Price Now →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
