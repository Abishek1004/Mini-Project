import { useState } from 'react'
import { CATEGORIES, getCompany } from '../data'
import BackButton from '../components/ui/BackButton'

function FieldLabel({ label, error }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <label className="font-poppins font-semibold text-slate-800 text-[0.95rem]">{label}</label>
      {error && <span className="text-red-500 text-xs font-inter">{error}</span>}
    </div>
  )
}

export default function DetailsPage({ nav, go, goBack, canGoBack }) {
  const cat     = CATEGORIES.find((c) => c.id === nav.category)
  const company = getCompany(nav.category, nav.company)

  // Dynamic options come from the variant chosen in VariantsPage (via nav)
  const ramOptions     = nav.ramOptions     || ['4GB','6GB','8GB','12GB','16GB']
  const storageOptions = nav.storageOptions || ['64GB','128GB','256GB','512GB']

  const [form, setForm] = useState({ ram:'', storage:'', batteryCondition:'', physicalCondition:'', isWorking:'' })
  const [errs, setErrs] = useState({})
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.ram)               e.ram               = 'Select RAM'
    if (!form.storage)           e.storage           = 'Select storage'
    if (!form.batteryCondition)  e.batteryCondition  = 'Select battery condition'
    if (!form.physicalCondition) e.physicalCondition = 'Select condition'
    if (!form.isWorking)         e.isWorking         = 'Select working status'
    setErrs(e); return !Object.keys(e).length
  }

  const cc = cat?.color || '#059669'

  const chip = (sel) => ({
    padding:'8px 16px', borderRadius:10,
    border: sel ? `2px solid ${cc}` : '2px solid #e2e8f0',
    background: sel ? cc : '#fff',
    color: sel ? '#fff' : '#374151',
    cursor:'pointer', fontWeight:600, fontSize:13,
    transition:'all 0.15s', fontFamily:"'Inter',sans-serif",
  })

  const card = (sel) => ({
    padding:'12px 16px', borderRadius:12,
    border: sel ? `2px solid ${cc}` : '2px solid #e2e8f0',
    background: sel ? `${cc}12` : '#fff',
    cursor:'pointer', transition:'all 0.15s',
    textAlign:'center', outline:'none', fontFamily:"'Inter',sans-serif",
  })

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-20">
      <BackButton goBack={goBack} canGoBack={canGoBack} label="Variants" />

      {/* Device summary card */}
      <div className="rounded-2xl p-5 my-5 flex items-center gap-4"
        style={{ background: cat?.light || '#ecfdf5', border:`1.5px solid ${cc}30` }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background:`${cc}20` }}>{cat?.emoji}</div>
        <div className="min-w-0">
          <p className="text-slate-500 text-xs font-inter">Selected Device</p>
          <p className="font-poppins font-bold text-slate-800 text-lg truncate">{nav.variant}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs font-inter font-semibold" style={{ color: cc }}>
              {company?.name} · {cat?.name}
            </span>
            <span className="text-xs text-slate-400 font-inter">Base ₹{(nav.variantBase||0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-400 text-xs font-inter font-semibold uppercase tracking-widest mb-1">Device Details</p>
        <h1 className="font-poppins font-extrabold text-slate-800 text-2xl mb-1">Tell Us About Your Device</h1>
        <p className="text-slate-500 font-inter text-sm">These details determine your accurate recycle value.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">

        {/* DYNAMIC: RAM */}
        <FieldLabel label="RAM" error={errs.ram} />
        <div className="flex flex-wrap gap-2 mb-7">
          {ramOptions.map((v) => (
            <button key={v} onClick={() => set('ram', v)} style={chip(form.ram===v)}>{v}</button>
          ))}
        </div>

        {/* DYNAMIC: Storage */}
        <FieldLabel label="Storage" error={errs.storage} />
        <div className="flex flex-wrap gap-2 mb-7">
          {storageOptions.map((v) => (
            <button key={v} onClick={() => set('storage', v)} style={chip(form.storage===v)}>{v}</button>
          ))}
        </div>

        {/* STATIC: Battery */}
        <FieldLabel label="Battery Condition" error={errs.batteryCondition} />
        <div className="grid grid-cols-3 gap-2.5 mb-7">
          {[['Good','🟢','80%+ health'],['Average','🟡','60–80%'],['Poor','🔴','Below 60%']].map(([v,ic,de]) => (
            <button key={v} onClick={() => set('batteryCondition', v)} style={card(form.batteryCondition===v)}>
              <div className="text-2xl mb-1">{ic}</div>
              <p className="font-bold text-sm" style={{ color: form.batteryCondition===v ? cc : '#1e293b' }}>{v}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{de}</p>
            </button>
          ))}
        </div>

        {/* STATIC: Physical */}
        <FieldLabel label="Physical Condition" error={errs.physicalCondition} />
        <div className="grid grid-cols-3 gap-2.5 mb-7">
          {[['Good','✨','No scratches'],['Slight Damage','🔧','Minor marks'],['Heavy Damage','💔','Cracks/dents']].map(([v,ic,de]) => (
            <button key={v} onClick={() => set('physicalCondition', v)} style={card(form.physicalCondition===v)}>
              <div className="text-2xl mb-1">{ic}</div>
              <p className="font-bold text-sm" style={{ color: form.physicalCondition===v ? cc : '#1e293b' }}>{v}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{de}</p>
            </button>
          ))}
        </div>

        {/* STATIC: Working */}
        <FieldLabel label="Is the device working?" error={errs.isWorking} />
        <div className="grid grid-cols-2 gap-3 mb-9">
          {[['Yes','✅'],['No','❌']].map(([v,ic]) => (
            <button key={v} onClick={() => set('isWorking', v)} style={{ ...card(form.isWorking===v), padding:'18px 10px' }}>
              <div className="text-3xl mb-1.5">{ic}</div>
              <p className="font-bold text-[15px]" style={{ color: form.isWorking===v ? cc : '#1e293b' }}>{v}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => { if (validate()) go('estimate', { deviceDetails: form }) }}
          className="w-full text-white font-poppins font-bold text-[1.05rem] py-4 rounded-2xl border-none cursor-pointer transition-all hover:-translate-y-px"
          style={{ background: cc, boxShadow:`0 4px 16px ${cc}40` }}
        >
          Get My Price Estimate →
        </button>
      </div>
    </div>
  )
}
