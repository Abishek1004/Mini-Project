import Footer from '../components/layout/Footer'
import PageHeader from '../components/ui/PageHeader'
import ImgF from '../components/ui/ImgF'

function SectionDivider({ num, color, title, sub }) {
  return (
    <div className="flex items-center gap-3.5 pt-14 pb-7">
      <div className="w-1 h-10 rounded-sm flex-shrink-0" style={{ background: color }} />
      <div>
        <p className="font-bold font-inter text-[11px] tracking-wider uppercase" style={{ color }}>
          Section {num}
        </p>
        <h2 className="font-poppins font-extrabold text-slate-800 text-2xl leading-tight">{title}</h2>
        <p className="text-slate-500 text-sm mt-1">{sub}</p>
      </div>
    </div>
  )
}

function InfoCard({ icon, title, color, light, border, children }) {
  return (
    <div
      className="bg-white rounded-2xl p-6 mb-5"
      style={{ border: `1.5px solid ${border}` }}
    >
      <h3 className="font-poppins font-bold text-slate-800 text-lg mb-4 flex items-center gap-2.5">
        <span
          className="w-9 h-9 rounded-xl inline-flex items-center justify-center flex-shrink-0"
          style={{ background: light, border: `1px solid ${border}` }}
        >
          {icon}
        </span>
        {title}
      </h3>
      <div className="text-slate-600 text-[0.93rem] leading-[1.78] flex flex-col gap-3">{children}</div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div>
            <Footer />
    </div>
  )
}
