import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider, useAuth } from './AuthContext'
import './style.css'

function App() {
  const { session, loading, failure, login, logout } = useAuth()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function submit(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    setBusy(true)
    setMessage('')
    try {
      const { error } = session ? await logout() : await login(fields.get('email').trim(), fields.get('password'))
      if (error) setMessage(error.code === 'invalid_credentials' ? 'E-mail ou senha incorretos.' : 'Não foi possível concluir. Verifique sua conexão e tente novamente.')
    } catch { setMessage('Falha na comunicação. Tente novamente.') }
    finally { setBusy(false) }
  }
  return <main><header><span aria-hidden="true">◈</span> Minha sessão</header><section>
    {loading ? <h1 role="status">Recuperando sessão…</h1> : failure ? <><h1>Sessão indisponível</h1><p role="alert">{failure}</p><button onClick={() => location.reload()}>Tentar novamente</button></> :
    <form onSubmit={submit}><h1>{session ? 'Área interna' : 'Acesse sua conta'}</h1>
      {session ? <><p>Você entrou com</p><strong>{session.user.email}</strong></> : <>
        <label>E-mail<input name="email" type="email" autoComplete="username" required /></label>
        <label>Senha<input name="password" type="password" autoComplete="current-password" required /></label></>}
      {message && <p role="alert">{message}</p>}
      <button disabled={busy}>{busy ? 'Aguarde…' : session ? 'Sair da conta' : 'Entrar'}</button>
    </form>}</section></main>
}
createRoot(document.getElementById('root')).render(<AuthProvider><App /></AuthProvider>)
