import { useState } from 'react'
import { CATEGORIES, getCompanies } from '../data'
import BackButton from '../components/ui/BackButton'
import ImgF from '../components/ui/ImgF'

function CompanyCard({ company, catColor, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="w-full bg-white rounded-2xl p-5 flex flex-col items-center gap-2.5 cursor-pointer transition-all duration-200 border-none"
      style={{
        border:    hov ? `2px solid ${catColor}` : '2px solid #e2e8f0',
        boxShadow: hov ? `0 8px 24px ${catColor}20` : '0 2px 6px rgba(0,0,0,0.05)',
        transform: hov ? 'translateY(-4px)' : 'none',
      }}>
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
        <ImgF src={company.logo} alt={company.name}
          style={{ width:48, height:48, objectFit:'contain' }}
          fallback={<span className="text-3xl">{company.emoji}</span>} />
      </div>
      <div className="text-center">
        <p className="font-poppins font-bold text-[0.95rem] transition-colors"
          style={{ color: hov ? catColor : '#1e293b' }}>{company.name}</p>
        <p className="text-slate-400 text-[11px] mt-0.5 font-inter">{company.tagline}</p>
      </div>
    </button>
  )
}

export default function CompaniesPage({ nav, go, goBack, canGoBack }) {
  const cat       = CATEGORIES.find((c) => c.id === nav.category)
  const companies = getCompanies(nav.category)

  return (
    <div>
      <div className="px-5 py-12 relative overflow-hidden"
        style={{ background:`linear-gradient(135deg,${cat?.color}dd,${cat?.color}99)` }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background:'#fff', opacity:0.06, filter:'blur(40px)' }} />
        <div className="max-w-[1200px] mx-auto relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0">{cat?.emoji}</div>
          <div>
            <p className="text-white/70 text-sm font-inter font-semibold mb-1 uppercase tracking-widest">Select Brand</p>
            <h1 className="font-poppins font-extrabold text-white text-3xl">{cat?.name} Brands</h1>
            <p className="text-white/70 font-inter text-sm mt-1">{cat?.count} available</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-5 pt-7 pb-20">
        <BackButton goBack={goBack} canGoBack={canGoBack} label={cat?.name || 'Back'} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} catColor={cat?.color}
              onClick={() => go('models', { company: company.id })} />
          ))}
        </div>
      </div>
    </div>
  )
}
