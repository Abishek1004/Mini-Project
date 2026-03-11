import { useState } from 'react'
import { CATEGORIES, getCompany } from '../data'
import { calcPrice, getConditionLabel } from '../utils/pricing'
import BackButton from '../components/ui/BackButton'

export default function EstimatePage({ nav, go, goBack, canGoBack, addToCart }) {
  const d     = nav.deviceDetails
  const price = calcPrice(nav.variantBase || 10000, d)
  const [added, setAdded] = useState(false)

  const cat   = CATEGORIES.find((c) => c.id === nav.category)
  const brand = getCompany(nav.category, nav.company)
  const cond  = getConditionLabel(d)
  const catColor = cat?.color || '#059669'

  return (
    <div className="max-w-[640px] mx-auto px-5 pt-10 pb-20">
      <BackButton goBack={goBack} canGoBack={canGoBack} label="Device Details" />

      {/* Price hero card */}
      <div
        className="rounded-2xl px-8 py-11 text-center mb-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${catColor}ee, ${catColor}99)`,
          boxShadow: `0 8px 32px ${catColor}40`,
        }}
      >
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: '#fff', opacity: 0.08, filter: 'blur(30px)' }}
        />
        <div className="text-6xl mb-2 relative">💰</div>
        <p className="text-white/75 text-sm mb-1 relative">Estimated Recycle Value for</p>
        <p className="font-poppins font-bold text-white text-xl mb-4 relative">{nav.variant}</p>
        <div className="font-poppins font-black text-white leading-none mb-2.5 relative" style={{ fontSize: '3.5rem' }}>
          ₹{price.toLocaleString()}
        </div>
        <p className="text-white/65 text-sm relative">Free pickup · Payment within 24 hours</p>
      </div>

      {/* Device summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <h3 className="font-poppins font-bold text-slate-800 mb-4">Device Summary</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            ['Device',       nav.variant],
            ['Brand',        brand?.name || '—'],
            ['RAM',          d.ram],
            ['Storage',      d.storage],
            ['Battery',      d.batteryCondition],
            ['Physical',     d.physicalCondition],
            ['Working',      d.isWorking === 'Yes' ? '✅ Yes' : '❌ No'],
            ['Overall',
              <span key="cond" className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: cond.bg, color: cond.c, border: `1px solid ${cond.bd}` }}>
                {cond.l}
              </span>
            ],
          ].map(([k, v], i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 text-[11px] mb-1 font-inter">{k}</p>
              <div className="font-semibold text-sm text-slate-800 font-inter">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {!added ? (
        <button
          onClick={async () => {
            await addToCart({
              category: cat?.name,
              company:  brand?.name,
              variant:  nav.variant,
              details:  d,
              price,
              modelId:  nav.modelId,
            })
            setAdded(true)
          }}
          className="w-full text-white font-poppins font-bold text-[1.05rem] py-4 rounded-2xl border-none cursor-pointer flex items-center justify-center gap-2 transition-all mb-3"
          style={{ background: catColor, boxShadow: `0 4px 16px ${catColor}40` }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          🛒 Add to Cart
        </button>
      ) : (
        <div
          className="w-full rounded-2xl p-4 text-center font-poppins font-bold text-[1.05rem] mb-3 border-2"
          style={{ background: `${catColor}10`, borderColor: `${catColor}40`, color: catColor }}
        >
          ✅ Added to Cart!
        </div>
      )}

      <button
        onClick={() => go('home')}
        className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 text-slate-500 font-semibold text-[0.95rem] cursor-pointer font-inter transition-colors"
      >
        Sell Another Device
      </button>
    </div>
  )
}
