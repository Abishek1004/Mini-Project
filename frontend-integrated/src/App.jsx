import { useState, useCallback, useEffect } from 'react'
import { api } from './utils/api'

import Navbar    from './components/layout/Navbar'
import CartModal from './components/ui/CartModal'

import HomePage      from './pages/HomePage'
import AboutPage     from './pages/AboutPage'
import ProcessPage   from './pages/ProcessPage'
import SearchPage    from './pages/SearchPage'
import CategoryPage  from './pages/CategoryPage'
import ModelsPage    from './pages/ModelsPage'
import VariantsPage  from './pages/VariantsPage'
import DetailsPage   from './pages/DetailsPage'
import EstimatePage  from './pages/EstimatePage'
import SignInPage    from './pages/SignInPage'
import SignUpPage    from './pages/SignUpPage'

// ─── ROUTE MAP ───────────────────────────────────────────────────────────────
const ROUTES = {
  '/':         'home',
  '/about':    'about',
  '/process':  'process',
  '/search':   'search',
  '/login':    'signin',
  '/signup':   'signup',
  '/mobile':   'category',
  '/laptop':   'category',
  '/tablet':   'category',
  '/models':   'models',
  '/variants': 'variants',
  '/details':  'details',
  '/estimate': 'estimate',
}

function pageToPath(page, nav = {}) {
  if (page === 'category') return `/${nav.category || 'mobile'}`
  const map = {
    home: '/', about: '/about', process: '/process', search: '/search',
    signin: '/login', signup: '/signup', models: '/models',
    variants: '/variants', details: '/details', estimate: '/estimate',
  }
  return map[page] || '/'
}

function pathToPage(path) {
  const catMap = { '/mobile': 'mobile', '/laptop': 'laptop', '/tablet': 'tablet' }
  if (catMap[path]) return { page: 'category', partialNav: { category: catMap[path] } }
  const page = ROUTES[path]
  if (page) return { page, partialNav: {} }
  return { page: 'home', partialNav: {} }
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const init = pathToPage(window.location.pathname)

  const [history,   setHistory]   = useState([{ page: init.page, nav: init.partialNav }])
  const [cartOpen,  setCartOpen]  = useState(false)
  const [pageKey,   setPageKey]   = useState(0)   // triggers transition
  const [visible,   setVisible]   = useState(true)

  // ── Persistent auth from localStorage ──────────────────────────────────────
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('eco_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('eco_token') || null)
  const [cart,  setCart]  = useState([])

  useEffect(() => {
    if (token && cart.length === 0) {
      api.getCart(token).then(setCart).catch(() => {})
    }
  }, [token])

  const current   = history[history.length - 1]
  const page      = current.page
  const nav       = current.nav
  const canGoBack = history.length > 1

  // Sync URL & title
  useEffect(() => {
    const url = pageToPath(page, nav)
    if (window.location.pathname !== url) window.history.pushState({ page, nav }, '', url)
    const titles = {
      home: 'EcoRecycle — Recycle Your Old Devices',
      about: 'About Us — EcoRecycle',
      process: 'How It Works — EcoRecycle',
      search: 'Search Devices — EcoRecycle',
      signin: 'Sign In — EcoRecycle',
      signup: 'Create Account — EcoRecycle',
      category: `${nav.category ? nav.category.charAt(0).toUpperCase() + nav.category.slice(1) : 'Category'} — EcoRecycle`,
      models: 'Models — EcoRecycle',
      variants: 'Variants — EcoRecycle',
      details: 'Device Details — EcoRecycle',
      estimate: 'Price Estimate — EcoRecycle',
    }
    document.title = titles[page] || 'EcoRecycle'
  }, [page, nav])

  useEffect(() => {
    const handlePop = (e) => {
      if (e.state?.page) setHistory((prev) => [...prev, { page: e.state.page, nav: e.state.nav || {} }])
      else {
        const { page: p, partialNav } = pathToPage(window.location.pathname)
        setHistory((prev) => [...prev, { page: p, nav: partialNav }])
      }
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // ── Navigation with fade transition ────────────────────────────────────────
  const go = useCallback((p, extra = {}) => {
    setVisible(false)
    setTimeout(() => {
      setHistory((prev) => {
        const prevNav = prev[prev.length - 1].nav
        const newNav = { ...prevNav, ...extra }
        window.history.pushState({ page: p, nav: newNav }, '', pageToPath(p, newNav))
        return [...prev, { page: p, nav: newNav }]
      })
      setPageKey(k => k + 1)
      setVisible(true)
      window.scrollTo(0, 0)
    }, 120)
  }, [])

  const goBack = useCallback(() => {
    if (history.length <= 1) return
    setVisible(false)
    setTimeout(() => {
      setHistory((prev) => {
        const next = prev.slice(0, -1)
        const last = next[next.length - 1]
        window.history.pushState({ page: last.page, nav: last.nav }, '', pageToPath(last.page, last.nav))
        return next
      })
      setPageKey(k => k + 1)
      setVisible(true)
      window.scrollTo(0, 0)
    }, 120)
  }, [history])

  // ── Auth ────────────────────────────────────────────────────────────────────
  const onLoginSuccess = (u, t) => {
    setUser(u)
    setToken(t)
    localStorage.setItem('eco_user', JSON.stringify(u))
    localStorage.setItem('eco_token', t)
    api.getCart(t).then(setCart).catch(() => {})
    goBack()
  }

  const onLogout = () => {
    setUser(null)
    setToken(null)
    setCart([])
    localStorage.removeItem('eco_user')
    localStorage.removeItem('eco_token')
    setHistory([{ page: 'home', nav: {} }])
    window.history.pushState({}, '', '/')
  }

  // ── Cart ────────────────────────────────────────────────────────────────────
  const addToCart = async (item) => {
    if (token) {
      try { const s = await api.addToCart(item, token); setCart((p) => [...p, s]); return } catch {}
    }
    setCart((p) => [...p, { ...item, id: Date.now() }])
  }

  const removeFromCart = async (id) => {
    if (token) { try { await api.removeFromCart(id, token) } catch {} }
    setCart((p) => p.filter((i) => i.id !== id))
  }

  const shared = { go, goBack, canGoBack, nav }

  // Auth pages — standalone full screen
  if (page === 'signin') return (
    <div key={pageKey} style={{ animation: 'ecoFadeIn 0.25s ease' }}>
      <SignInPage go={go} goBack={goBack} onSuccess={onLoginSuccess} />
    </div>
  )
  if (page === 'signup') return (
    <div key={pageKey} style={{ animation: 'ecoFadeIn 0.25s ease' }}>
      <SignUpPage go={go} goBack={goBack} onSuccess={onLoginSuccess} />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @keyframes ecoFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .eco-page {
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .eco-page-hidden {
          opacity: 0;
          transform: translateY(6px);
        }
        .eco-page-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <Navbar
        user={user} cart={cart} page={page}
        go={go} goBack={goBack} canGoBack={canGoBack}
        onSignIn={() => go('signin')}
        onLogout={onLogout}
        onCart={() => setCartOpen(true)}
        onSearch={(q) => go('search', { searchQuery: q || '' })}
      />

      <div
        key={pageKey}
        className="eco-page"
        style={{ animation: 'ecoFadeIn 0.22s ease' }}
      >
        {page === 'home'     && <HomePage     {...shared} />}
        {page === 'about'    && <AboutPage    {...shared} />}
        {page === 'process'  && <ProcessPage  {...shared} />}
        {page === 'search'   && <SearchPage   {...shared} />}
        {page === 'category' && <CategoryPage {...shared} />}
        {page === 'models'   && <ModelsPage   {...shared} />}
        {page === 'variants' && <VariantsPage {...shared} />}
        {page === 'details'  && <DetailsPage  {...shared} />}
        {page === 'estimate' && <EstimatePage {...shared} addToCart={addToCart} />}
      </div>

      {cartOpen && (
        <CartModal cart={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />
      )}
    </div>
  )
}
