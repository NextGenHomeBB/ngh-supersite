'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase, api, ApiError, type Article, type Session } from '../../lib/adminClient'
import Dashboard from './Dashboard'
import ArticleEditor from './ArticleEditor'

// The whole CMS is a single client-rendered surface layered over the site
// (the public site is a static export, so there's no server here). Auth is
// Supabase Auth; every read/write goes through the insights-admin edge function.

type View = { name: 'list' } | { name: 'edit'; article: Article | null }

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#1F1F1F] text-[#F5F3EE]">
      {!authReady ? (
        <div className="h-full flex items-center justify-center text-[#6B6F66] text-sm">Loading…</div>
      ) : session ? (
        <Authed
          email={session.user.email || ''}
          onSignOut={() => supabase.auth.signOut()}
        />
      ) : (
        <Login />
      )}
    </div>
  )
}

// ── Signed-in shell ──────────────────────────────────────────────────────────
function Authed({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [view, setView] = useState<View>({ name: 'list' })
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const out = await api<{ articles: Article[] }>('list')
      setArticles(out.articles)
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setLoadError('Your account is not authorised for the CMS. Ask an admin to add you.')
      } else {
        setLoadError('Could not load articles. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const backToList = () => {
    setView({ name: 'list' })
    load()
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1F1F1F]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="text-[#C6A96C] text-lg tracking-tight"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              NGH
            </span>
            <span className="text-[#6B6F66] text-sm">Content Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[#6B6F66]">{email}</span>
            <a
              href="/insights"
              target="_blank"
              className="text-xs text-[#8A8F83] hover:text-[#F5F3EE]"
            >
              View site ↗
            </a>
            <button
              onClick={onSignOut}
              className="text-xs text-[#8A8F83] hover:text-[#F5F3EE] border border-white/10 rounded-lg px-3 py-1.5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {loadError ? (
          <div className="max-w-md mx-auto mt-20 text-center px-6">
            <p className="text-sm text-[#D4D0C8]">{loadError}</p>
            <button
              onClick={load}
              className="mt-4 px-4 py-2 rounded-lg text-sm border border-white/10 text-[#D4D0C8] hover:border-[#C6A96C]/40"
            >
              Retry
            </button>
          </div>
        ) : view.name === 'list' ? (
          <Dashboard
            articles={articles}
            loading={loading}
            onNew={() => setView({ name: 'edit', article: null })}
            onOpen={(a) => setView({ name: 'edit', article: a })}
            onRefresh={load}
          />
        ) : (
          <ArticleEditor
            article={view.article}
            onSaved={(a) =>
              setArticles((prev) => {
                const i = prev.findIndex((x) => x.id === a.id)
                if (i === -1) return [a, ...prev]
                const copy = prev.slice()
                copy[i] = a
                return copy
              })
            }
            onCancel={backToList}
            onDeleted={backToList}
          />
        )}
      </main>
    </div>
  )
}

// ── Login ────────────────────────────────────────────────────────────────────
function Login() {
  const [emailV, setEmailV] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: emailV.trim(),
      password,
    })
    if (error) setError('Incorrect email or password.')
    setBusy(false)
  }

  return (
    <div className="min-h-full flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="text-[#C6A96C] text-3xl tracking-tight"
            style={{ fontFamily: 'var(--font-playfair, serif)' }}
          >
            NGH
          </div>
          <p className="text-[#8A8F83] text-sm mt-1">Content Studio</p>
        </div>
        <div className="space-y-3">
          <input
            type="email"
            autoComplete="username"
            value={emailV}
            onChange={(e) => setEmailV(e.target.value)}
            placeholder="Email"
            required
            className="w-full bg-black/25 border border-white/10 rounded-lg px-4 py-3 text-[#F5F3EE] outline-none focus:border-[#C6A96C] placeholder:text-[#5C6057]"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-black/25 border border-white/10 rounded-lg px-4 py-3 text-[#F5F3EE] outline-none focus:border-[#C6A96C] placeholder:text-[#5C6057]"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-lg font-medium bg-[#C6A96C] text-[#1F1F1F] hover:opacity-90 disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}
