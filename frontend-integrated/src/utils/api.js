const API_BASE = 'http://localhost:8081/api'

const request = async (url, options = {}) => {
  const res = await fetch(API_BASE + url, options)
  const data = await res.json().catch(() => ({ message: 'Request failed' }))
  if (!res.ok) return Promise.reject(data)
  return data
}

export const api = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, email, password, mobileNo) =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, mobileNo }),
    }),

  verifyOtp: (email, otp) =>
    request(`/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
      method: 'POST',
    }),

  getCart: (token) =>
    request('/cart', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  addToCart: (item, token) =>
    request('/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(item),
    }),

  removeFromCart: (id, token) =>
    request(`/cart/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
}
