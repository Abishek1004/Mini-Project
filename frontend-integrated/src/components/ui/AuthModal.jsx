import { useState, useRef } from 'react'
import ImgF from './ImgF'

function AuthField({ label, type, value, onChange, placeholder, error }) {
  return (
    <div className="mb-4">
      <label className="block font-inter font-semibold text-[13px] text-slate-800 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-3 rounded-xl border-[1.5px] outline-none text-sm text-slate-800 font-inter bg-slate-50 transition-colors
        ${error ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-eco-500'}`}
      />
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  )
}

export default function AuthModal({ mode, onClose, onSwitch, onSuccess }) {

  const API = "http://localhost:8081/api/auth"

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: ''
  })

  const [step, setStep] = useState("form") // form or otp

  const [errs, setErrs] = useState({})
  const [apiErr, setApiErr] = useState('')
  const [loading, setLoading] = useState(false)

  const overlayRef = useRef(null)

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setApiErr('')
  }

  const validate = () => {

    const e = {}

    if (mode === 'signup' && !form.name.trim()) e.name = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Min 6 characters'
    if (mode === 'signup' && !/^\d{10}$/.test(form.phone)) e.phone = '10-digit number required'

    setErrs(e)

    return !Object.keys(e).length
  }

  const submit = async () => {

    if (!validate()) return

    setLoading(true)
    setApiErr('')

    try {

      if (mode === 'login') {

        const response = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        })

        const text = await response.text()

        if (!response.ok) throw new Error(text)

        alert(text)

        onSuccess({ email: form.email }, "token")

      }

      else {

        const response = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone
          })
        })

        const text = await response.text()

        if (!response.ok) throw new Error(text)

        alert("OTP sent to email")

        setStep("otp")

      }

    }

    catch (err) {

      setApiErr(err.message)

    }

    finally {

      setLoading(false)

    }

  }

  const verifyOtp = async () => {

    if (form.otp.length !== 6) {
      setApiErr("Enter 6 digit OTP")
      return
    }

    setLoading(true)

    try {

      const response = await fetch(`${API}/verify-otp?email=${form.email}&otp=${form.otp}`, {
        method: "POST"
      })

      const text = await response.text()

      if (!response.ok) throw new Error(text)

      alert(text)

      setStep("form")
      onSwitch("login")

    }

    catch (err) {

      setApiErr(err.message)

    }

    finally {

      setLoading(false)

    }

  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[440px] overflow-hidden">

        <div
          className="px-7 pt-7 pb-6 relative"
          style={{ background: 'linear-gradient(135deg, #064e3b, #059669)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer text-white text-lg"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            ×
          </button>

          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <ImgF src="/images/logo.png" fallback="♻️" alt="logo" style={{ width: 28, height: 28 }} />
            </div>
            <span className="font-montserrat font-extrabold text-white text-lg">EcoRecycle</span>
          </div>

          <h2 className="font-poppins font-extrabold text-white text-2xl mb-1">
            {step === "otp" ? "Verify OTP" : mode === 'login' ? 'Welcome back!' : 'Create Account'}
          </h2>

          <p className="text-white/70 text-sm">
            {step === "otp" ? "Enter the 6 digit OTP sent to email" :
              mode === 'login' ? 'Sign in to continue' : 'Join thousands of eco-conscious users'}
          </p>
        </div>

        <div className="px-7 py-6">

          {apiErr &&
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3.5 py-2.5 text-sm mb-4">
              {apiErr}
            </div>
          }

          {step === "form" && (
            <>
              {mode === 'signup' &&
                <AuthField label="Full Name" type="text" value={form.name} onChange={(v) => set('name', v)} placeholder="Name" error={errs.name} />
              }

              <AuthField label="Email Address" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="you@example.com" error={errs.email} />

              <AuthField label="Password" type="password" value={form.password} onChange={(v) => set('password', v)} placeholder="Minimum 6 characters" error={errs.password} />

              {mode === 'signup' &&
                <AuthField label="Phone Number" type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="10-digit mobile number" error={errs.phone} />
              }

              <button
                onClick={submit}
                disabled={loading}
                className="w-full mt-1 bg-eco-600 text-white font-poppins font-bold text-base py-3.5 rounded-xl"
              >
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <AuthField
                label="Enter OTP"
                type="text"
                value={form.otp}
                onChange={(v) => set('otp', v)}
                placeholder="6 digit OTP"
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full mt-1 bg-eco-600 text-white font-poppins font-bold text-base py-3.5 rounded-xl"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === "form" &&
            <p className="text-center text-slate-500 text-[13px] mt-3.5">
              {mode === 'login' ? 'New to EcoRecycle? ' : 'Already have an account? '}
              <button
                onClick={() => onSwitch(mode === 'login' ? 'signup' : 'login')}
                className="text-eco-600 font-bold underline"
              >
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          }

        </div>
      </div>
    </div>
  )
}