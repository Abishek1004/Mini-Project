import { STEPS } from '../data'
import Footer from '../components/layout/Footer'
import PageHeader from '../components/ui/PageHeader'
import ImgF from '../components/ui/ImgF'

export default function ProcessPage({ go }) {
  return (
    <div>
      <PageHeader
        badge="How It Works"
        title="The E-Waste Recycling Process"
        subtitle="From your doorstep to certified safe disposal — a transparent 4-step journey that protects people and the planet."
      />

      {/* Steps summary strip */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1100px] mx-auto px-5 grid grid-cols-2 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`py-4 px-3 text-center ${i < 3 ? 'border-r border-slate-100' : ''}`}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="font-poppins font-bold text-[11px] tracking-wider" style={{ color: s.color }}>
                STEP {s.num}
              </p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5 font-inter">{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps detail */}
      <div className="max-w-[1100px] mx-auto px-5 py-16">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 ${i % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}
          >
            {/* Image */}
            <div
              className="rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center relative"
              style={{ background: step.light, border: `2px solid ${step.border}` }}
            >
              <span
                className="absolute top-3 left-5 font-montserrat font-black text-[5rem] leading-none select-none pointer-events-none"
                style={{ color: step.color, opacity: 0.1 }}
              >
                {step.num}
              </span>
              <ImgF
                src={step.img}
                alt={step.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 300 }}
                fallback={
                  <div className="text-center p-8 direction-ltr" style={{ direction: 'ltr' }}>
                    <div className="text-8xl leading-none mb-4">{step.icon}</div>
                    <p className="text-slate-500 font-semibold text-sm">Step {step.num} image</p>
                    <p className="text-slate-400 text-xs mt-1.5">{step.img}</p>
                  </div>
                }
              />
            </div>

            {/* Content */}
            <div style={{ direction: 'ltr' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <span
                  className="font-poppins font-bold text-[11px] tracking-wider uppercase px-3.5 py-1.5 rounded-full"
                  style={{ background: step.light, color: step.color, border: `1.5px solid ${step.border}` }}
                >
                  Step {step.num}
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <h2 className="font-poppins font-extrabold text-slate-800 text-2xl leading-tight mb-4">
                {step.title}
              </h2>
              <p className="text-slate-600 text-[0.95rem] leading-[1.8] mb-6 font-inter">{step.desc}</p>
              {step.points.map((pt) => (
                <div key={pt} className="flex items-center gap-3 mb-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: step.light, border: `1.5px solid ${step.border}` }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5L4.5 9L10 3" stroke={step.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-slate-600 text-[0.9rem] font-medium font-inter">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Environmental impact */}
        <div className="bg-slate-50 rounded-2xl px-8 py-12 mb-16">
          <h2 className="font-poppins font-extrabold text-slate-800 text-2xl text-center mb-9">
            Our Environmental Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              ['🌲', '12,000+', 'Trees Equivalent Saved', '#059669'],
              ['💧', '8M L',    'Water Saved',            '#0891b2'],
              ['⚗️', '4.2T',   'Toxic Materials Diverted','#7c3aed'],
              ['🔋', '2.1 GWh','Energy Recovered',        '#65a30d'],
            ].map(([ic, val, label, color]) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm"
              >
                <div className="text-3xl mb-2">{ic}</div>
                <div className="font-poppins font-extrabold text-2xl mb-1" style={{ color }}>{val}</div>
                <p className="text-slate-500 text-xs font-inter">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl px-10 py-14 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #064e3b, #0d9488)' }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{ background: '#6ee7b7', opacity: 0.08, filter: 'blur(40px)' }} />
          <h2 className="font-poppins font-extrabold text-white text-3xl mb-3 relative">
            Start Your Recycling Journey
          </h2>
          <p className="text-white/70 font-inter mb-7 relative">Get your instant price quote — under 2 minutes.</p>
          <button
            onClick={() => go('home')}
            className="bg-white text-eco-800 font-poppins font-bold text-base px-9 py-3.5 rounded-xl border-none cursor-pointer shadow-xl transition-transform hover:scale-105 relative"
          >
            Get My Price Now →
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
