'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Users, Disc3, Banknote, Radio, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', Icon: LayoutGrid },
  { href: '/artists', label: 'Artists', Icon: Users },
  { href: '/releases', label: 'Releases', Icon: Disc3 },
  { href: '/royalties', label: 'Royalties', Icon: Banknote },
  { href: '/distribution', label: 'Distro', Icon: Radio },
  { href: '/analytics', label: 'Analytics', Icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile: bottom nav bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden"
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          height: '60px',
        }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5"
              style={{ color: active ? 'var(--primary)' : 'rgba(255,255,255,0.4)' }}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.6} />
              <span className="text-[9px] leading-none font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop: left sidebar */}
      <aside
        className="hidden md:flex md:flex-col md:w-60 md:flex-shrink-0 min-h-screen"
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Brand mark */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
              color: 'var(--accent)',
            }}
          >
            B
          </div>
          <span className="text-sm font-semibold text-white/90 truncate">
            Barzini Publishing
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-3 pt-2 flex-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  color: active ? 'var(--primary)' : 'rgba(255,255,255,0.55)',
                  background: active
                    ? 'color-mix(in oklch, var(--primary) 10%, transparent)'
                    : 'transparent',
                  borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                }}
              >
                <Icon size={16} strokeWidth={active ? 2.2 : 1.6} />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
