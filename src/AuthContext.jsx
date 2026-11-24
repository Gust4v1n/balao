import React, { createContext, useContext, useEffect, useState } from 'react'
import { Preferences } from '@capacitor/preferences'
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const client = url && key ? createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false }
}) : null
const slot = { key: 'supabase_session' }
const Context = createContext(null)
export const useAuth = () => useContext(Context)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failure, setFailure] = useState('')
  useEffect(() => {
    if (!client) {
      setFailure('Configure a URL e a chave pública do Supabase no arquivo .env e gere o aplicativo novamente.')
      setLoading(false)
      return
    }
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, current) => {
      if (event === 'INITIAL_SESSION') return
      try {
        if (event === 'SIGNED_OUT') await Preferences.remove(slot)
        else if (current) await Preferences.set({ ...slot, value: JSON.stringify(current) })
        setSession(current)
      } catch {
        setFailure('O dispositivo não conseguiu atualizar a sessão salva.')
      }
    })
    async function restore() {
      try {
        const { value } = await Preferences.get(slot)
        if (!value) return
        let saved
        try { saved = JSON.parse(value) } catch { saved = null }
        if (!saved?.access_token || !saved?.refresh_token) {
          await Preferences.remove(slot)
          return
        }
        const { data, error } = await client.auth.setSession(saved)
        if (error) {
          if ([400, 401, 403].includes(error.status)) await Preferences.remove(slot)
          else throw error
        } else setSession(data.session)
      } catch {
        setFailure('Não foi possível recuperar a sessão. Verifique a conexão e tente novamente.')
      } finally { setLoading(false) }
    }
    restore()
    return () => subscription.unsubscribe()
  }, [])
  return <Context.Provider value={{ session, loading, failure,
    login: (email, password) => client.auth.signInWithPassword({ email, password }),
    logout: () => client.auth.signOut({ scope: 'local' })
  }}>{children}</Context.Provider>
}
