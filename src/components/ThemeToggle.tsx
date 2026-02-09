'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    const nextTheme: Theme = savedTheme === 'dark' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    setMounted(true)
  }, [])

  const handleToggle = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem(STORAGE_KEY, nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-3 py-2 text-sm font-medium text-slate-700 shadow-md backdrop-blur transition-all hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      <span>{mounted && theme === 'dark' ? 'Dark' : 'Light'}</span>
      <span aria-hidden="true">{mounted && theme === 'dark' ? '🌙' : '☀️'}</span>
    </button>
  )
}
