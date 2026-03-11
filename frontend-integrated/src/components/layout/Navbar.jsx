import { useState, useRef, useEffect } from 'react'
import ImgF from '../ui/ImgF'
import ecologo from "../../assets/img/logo.png";
export default function Navbar({ user, cart, page, go, onSignIn, onLogout, onCart, onSearch, searchQuery }) {
  const [dropOpen,   setDropOpen]   = useState(false)
  const [mobOpen,    setMobOpen]    = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState('')
  const dropRef   = useRef(null)
  const searchRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current   && !dropRef.current.contains(e.target))   setDropOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (page === 'search') setLocalQuery(searchQuery || '')
  }, [page, searchQuery])

  const handleSearchOpen = () => {
    setSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleSearchSubmit = (q) => {
    setSearchOpen(false)
    onSearch(q.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  handleSearchSubmit(localQuery)
    if (e.key === 'Escape') setSearchOpen(false)
  }

  const links = [
    { label: 'Home',    page: 'home'    },
    { label: 'About',   page: 'about'   },
    { label: 'Process', page: 'process' },
  ]

  // Avatar initials — first letter of first & last name
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .dropdown-enter { animation: dropIn 0.18s cubic-bezier(.22,.68,0,1.2) forwards; }
      `}</style>

      <nav className="sticky top-0 z-50 bg-white/97 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer flex-shrink-0">
            {/* <div className=" rounded-xl bg-eco border border-eco flex items-center justify-center overflow-hidden"> */}
              <ImgF src={ecologo} fallback="♻️" alt="logo" style={{ width:50, height:35, objectFit:'contain', fontSize:'1.2rem' }} />
            {/* </div>   */}
            <span className="font-montserrat font-extrabold text-xl tracking-tight">
              <span className="text-eco-600">Eco</span><span className="text-slate-800">Loop</span>
            </span>
          </button>

          {/* Centre nav */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            {links.map(({ label, page: p }) => (
              <button key={p} onClick={() => go(p)}
                className={`px-4 py-2 rounded-lg border-none cursor-pointer font-inter font-semibold text-sm transition-all duration-150
                  ${page === p ? 'bg-eco-50 text-eco-600' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-eco-600'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Search bar — desktop */}
          <div ref={searchRef} className="hidden md:flex items-center flex-1 max-w-[340px] relative">
            {searchOpen ? (
              <div className="flex items-center w-full bg-slate-50 border-2 border-eco-400 rounded-xl overflow-hidden">
                <svg className="ml-3 flex-shrink-0" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
                </svg>
                <input ref={inputRef} value={localQuery} onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={handleKeyDown} placeholder="Search — iPhone 15, MacBook Air…"
                  className="flex-1 px-3 py-2.5 text-sm font-inter bg-transparent outline-none text-slate-800 placeholder-slate-400" />
                {localQuery && (
                  <button onClick={() => setLocalQuery('')}
                    className="mr-1 w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center border-none cursor-pointer hover:bg-slate-300 flex-shrink-0">×</button>
                )}
                <button onClick={() => handleSearchSubmit(localQuery)}
                  className="bg-eco-600 hover:bg-eco-700  rounded-xl text-white text-xs font-bold font-inter px-3 py-2.5 border-none cursor-pointer flex-shrink-0 transition-colors">
                  Go
                </button>
              </div>
            ) : (
              <button onClick={handleSearchOpen}
                className="flex items-center gap-2 w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm font-inter cursor-pointer hover:border-eco-300 hover:bg-eco-50 transition-colors">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
                </svg>
                Search all devices…
                <span className="ml-auto text-[11px] bg-slate-200 text-slate-400 px-1.5 py-0.5 rounded font-mono">Go</span>
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Mobile search */}
            <button onClick={() => { go('search'); setMobOpen(false) }}
              className="md:hidden p-2 rounded-lg bg-transparent border-none cursor-pointer" aria-label="Search">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Cart */}
            <button onClick={onCart} className="relative p-2 rounded-lg bg-transparent border-none cursor-pointer" aria-label="Open cart">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-eco-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{width:18, height:18}}>
                  {cart.length}
                </span>
              )}
            </button>

            {/* Auth — signed in */}
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="flex items-center gap-2 bg-eco-50 border border-eco-200 rounded-xl py-1.5 pl-1.5 pr-3 cursor-pointer transition-all duration-150 hover:border-eco-400 hover:bg-eco-100"
                  style={{ boxShadow: dropOpen ? '0 0 0 3px #d1fae5' : 'none' }}
                >
                  {/* Avatar circle */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm font-poppins flex-shrink-0 select-none"
                    style={{ background: 'linear-gradient(135deg,#059669,#0d9488)' }}>
                    {initials}
                  </div>
                  <span className="font-semibold text-sm text-slate-800 max-w-[80px] truncate font-inter hidden sm:block">
                    {user.name?.split(' ')[0]}
                  </span>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2.5"
                    style={{ transition: 'transform 0.2s ease', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <div className="dropdown-enter absolute right-0 top-[calc(100%+10px)] w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">

                    {/* Profile header */}
                    <div className="px-4 py-4 bg-gradient-to-br from-eco-50 to-teal-50 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 font-poppins select-none"
                          style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', boxShadow: '0 4px 12px #05966940' }}>
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-slate-800 truncate font-poppins">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate font-inter mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* User details */}
                    <div className="px-4 py-3 border-b border-slate-100 space-y-2">
                      {/* Email row */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 font-inter uppercase tracking-wide">Email</p>
                          <p className="text-xs text-slate-700 font-inter font-medium truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Mobile no row — only if present */}
                      {user.mobileNo && (
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-inter uppercase tracking-wide">Mobile</p>
                            <p className="text-xs text-slate-700 font-inter font-medium">{user.mobileNo}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sign out */}
                    <button
                      onClick={() => { setDropOpen(false); onLogout() }}
                      className="w-full text-left px-4 py-3 bg-transparent border-none cursor-pointer text-sm font-semibold font-inter flex items-center gap-2.5 transition-colors duration-100 hover:bg-red-50 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span className="text-red-600">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth — signed out */
              <button onClick={onSignIn}
                className="bg-eco-600 hover:bg-eco-700 text-white font-poppins font-bold text-sm px-5 py-2.5 rounded-xl border-none cursor-pointer transition-all duration-150 hover:shadow-md">
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobOpen(v => !v)} className="md:hidden p-2 rounded-lg bg-transparent border-none cursor-pointer">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth="2">
                {mobOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 flex flex-col gap-1 bg-white">
            {links.map(({ label, page: p }) => (
              <button key={p} onClick={() => { go(p); setMobOpen(false) }}
                className={`w-full text-left px-4 py-2.5 rounded-lg border-none cursor-pointer font-inter font-semibold text-sm transition-colors
                  ${page === p ? 'bg-eco-50 text-eco-600' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
            {user && (
              <button onClick={() => { setMobOpen(false); onLogout() }}
                className="w-full text-left px-4 py-2.5 rounded-lg border-none cursor-pointer font-inter font-semibold text-sm text-red-600 hover:bg-red-50 transition-colors mt-1">
                Sign Out
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
