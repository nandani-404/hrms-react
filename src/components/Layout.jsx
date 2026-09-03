import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import CommandPalette from './CommandPalette'

const COLLAPSE_KEY = 'manavsetu.sidebar.collapsed'

const Layout = () => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1')
  const [paletteOpen, setPaletteOpen] = useState(false)

  const updateCollapsed = useCallback((value) => {
    setCollapsed(value)
    localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0')
  }, [])

  // Global shortcut: Cmd/Ctrl+K opens the jump bar from anywhere in the app.
  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Scroll back to the top whenever the route changes.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} collapsed={collapsed} setCollapsed={updateCollapsed} />

      <div
        className={`transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
        }`}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} onOpenSearch={() => setPaletteOpen(true)} />

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6 md:py-8 lg:px-8"
        >
          <Outlet />
        </motion.main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}

export default Layout
