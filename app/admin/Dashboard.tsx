'use client'

import { useMemo, useState } from 'react'
import type { Article } from '../../lib/adminClient'

type Props = {
  articles: Article[]
  loading: boolean
  onNew: () => void
  onOpen: (a: Article) => void
  onRefresh: () => void
}

function fmtDate(d: string | null): string {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d.slice(0, 10)
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Dashboard({ articles, loading, onNew, onOpen, onRefresh }: Props) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return articles.filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false
      if (!needle) return true
      return (
        a.title.toLowerCase().includes(needle) ||
        (a.category || '').toLowerCase().includes(needle)
      )
    })
  }, [articles, q, filter])

  const counts = useMemo(
    () => ({
      all: articles.length,
      published: articles.filter((a) => a.status === 'published').length,
      draft: articles.filter((a) => a.status === 'draft').length,
    }),
    [articles],
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl text-[#F5F3EE]" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
            Insights
          </h1>
          <p className="text-sm text-[#8A8F83] mt-0.5">
            {counts.published} live · {counts.draft} draft{counts.draft === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={onNew}
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#C6A96C] text-[#1F1F1F] hover:opacity-90"
        >
          + New article
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 text-sm capitalize transition-colors ${
                filter === f
                  ? 'bg-[#C6A96C]/15 text-[#C6A96C]'
                  : 'text-[#8A8F83] hover:text-[#F5F3EE]'
              }`}
            >
              {f} <span className="opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="flex-1 min-w-[160px] bg-black/25 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-[#F5F3EE] outline-none focus:border-[#C6A96C] placeholder:text-[#5C6057]"
        />
        <button
          onClick={onRefresh}
          className="px-3 py-2 rounded-lg text-sm border border-white/10 text-[#8A8F83] hover:text-[#F5F3EE]"
          title="Refresh"
        >
          ↻
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#6B6F66] text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#6B6F66] text-sm border border-dashed border-white/10 rounded-xl">
          {articles.length === 0 ? 'No articles yet. Create your first one.' : 'No matches.'}
        </div>
      ) : (
        <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => onOpen(a)}
              className="w-full text-left flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="w-16 h-11 rounded-md overflow-hidden bg-black/30 border border-white/10 flex-shrink-0">
                {a.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.cover_image} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[#F5F3EE] group-hover:text-white">
                    {a.title || 'Untitled'}
                  </span>
                  {a.external_page && (
                    <span className="text-[10px] uppercase tracking-wider text-[#6B6F66] border border-white/10 rounded px-1.5 py-0.5 flex-shrink-0">
                      Code
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#6B6F66] mt-0.5 truncate">
                  {a.category || 'Uncategorised'} · {fmtDate(a.sort_date)}
                </div>
              </div>
              <span
                className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border flex-shrink-0 ${
                  a.status === 'published'
                    ? 'border-[#C6A96C]/40 text-[#C6A96C] bg-[#C6A96C]/10'
                    : 'border-white/15 text-[#8A8F83]'
                }`}
              >
                {a.status === 'published' ? 'Live' : 'Draft'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
