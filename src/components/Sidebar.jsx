import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Settings,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { visibleGroups, settingsGroups, HR_ROLES } from '../config/navigation'
import { Avatar, cx } from './ui'

const roleLabels = {
  super_admin: 'CEO',
  hr: 'HR',
  admin: 'Admin',
  employee: 'Employee',
}

const NavItem = ({ item, collapsed, onNavigate }) => (
  <NavLink
    to={item.to}
    onClick={onNavigate}
    title={collapsed ? item.label : undefined}
    className={({ isActive }) =>
      cx(
        'group relative flex items-center gap-3 rounded-lg py-2.5 text-sm transition-all duration-200',
        collapsed ? 'justify-center px-0' : 'px-3',
        isActive
          ? 'bg-white/[0.08] font-medium text-white'
          : 'text-primary-100/65 hover:bg-white/[0.05] hover:text-white'
      )
    }
  >
    {({ isActive }) => (
      <>
        {/* Brass mark on the active rail */}
        <span
          className={cx(
            'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brass-400 transition-all duration-300',
            isActive ? 'opacity-100' : 'opacity-0'
          )}
        />
        <item.icon
          className={cx(
            'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
            isActive ? 'text-brass-300' : 'text-primary-200/55 group-hover:text-brass-200/80'
          )}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}

        {/* Tooltip for the collapsed rail */}
        {collapsed && (
          <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-primary-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100 lg:block">
            {item.label}
          </span>
        )}
      </>
    )}
  </NavLink>
)

const Sidebar = ({ open, setOpen, collapsed, setCollapsed }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const userRole = user?.role || 'employee'
  const isHRorAdmin = HR_ROLES.includes(userRole)

  const groups = visibleGroups(userRole)
  const settingsPaths = settingsGroups.flatMap((group) => group.items.map((item) => item.to))
  const [settingsOpen, setSettingsOpen] = useState(() => settingsPaths.includes(location.pathname))

  // Keep the disclosure open while the user is inside a settings screen.
  useEffect(() => {
    if (settingsPaths.includes(location.pathname)) setSettingsOpen(true)
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const closeOnMobile = () => setOpen(false)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnMobile}
            className="fixed inset-0 z-40 bg-primary-950/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.06] shadow-rail',
          'bg-primary-950 transition-[width,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          collapsed ? 'w-[76px]' : 'w-64',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{
          backgroundImage:
            'linear-gradient(180deg, #142338 0%, #0C1626 55%, #0A121F 100%)',
        }}
      >
        {/* Brass filament down the trailing edge */}
        <span className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brass-400/25 to-transparent" />

        {/* ---------------- Brand ---------------- */}
        <div
          className={cx(
            'flex h-16 shrink-0 items-center border-b border-white/[0.06]',
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          {collapsed ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] p-1.5 shadow-sm ring-1 ring-white/10" title="TruckMit">
              <img src="/hrms/truckmit-logo-white.png" alt="TruckMit" className="h-6 w-auto object-contain" />
            </div>
          ) : (
            <div className="flex min-w-0 items-center gap-2">
              <img src="/hrms/truckmit-logo-white.png" alt="TruckMit" className="h-9 w-auto max-w-[190px] object-contain drop-shadow-xs" />
            </div>
          )}

          <button
            onClick={closeOnMobile}
            className="rounded-lg p-1.5 text-primary-200/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ---------------- Navigation ---------------- */}
        <nav className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {groups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-eyebrow text-primary-200/40">
                  {group.label}
                </p>
              )}
              {collapsed && <div className="mx-auto mb-2 h-px w-6 bg-white/[0.08]" />}
              {group.items.map((item) => (
                <NavItem key={item.to} item={item} collapsed={collapsed} onNavigate={closeOnMobile} />
              ))}
            </div>
          ))}

          {/* ---------------- Settings disclosure ---------------- */}
          {isHRorAdmin && (
            <div className="space-y-1 pt-1">
              {!collapsed && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-eyebrow text-primary-200/40">
                  Configuration
                </p>
              )}
              <button
                onClick={() => {
                  if (collapsed) {
                    setCollapsed(false)
                    setSettingsOpen(true)
                  } else {
                    setSettingsOpen((prev) => !prev)
                  }
                }}
                title={collapsed ? 'Settings' : undefined}
                className={cx(
                  'group relative flex w-full items-center gap-3 rounded-lg py-2.5 text-sm text-primary-100/65',
                  'transition-all duration-200 hover:bg-white/[0.05] hover:text-white',
                  collapsed ? 'justify-center px-0' : 'px-3'
                )}
              >
                <Settings className="h-[18px] w-[18px] shrink-0 text-primary-200/55 group-hover:text-brass-200/80" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">Settings</span>
                    <ChevronDown
                      className={cx('h-4 w-4 transition-transform duration-200', settingsOpen && 'rotate-180')}
                    />
                  </>
                )}
              </button>

              <AnimatePresence initial={false}>
                {settingsOpen && !collapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-[22px] space-y-3 border-l border-white/[0.08] pl-3 pt-1">
                      {settingsGroups.map((group) => (
                        <div key={group.label} className="space-y-0.5">
                          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-eyebrow text-primary-200/35">
                            {group.label}
                          </p>
                          {group.items.map((item) => (
                            <NavLink
                              key={item.to}
                              to={item.to}
                              onClick={closeOnMobile}
                              className={({ isActive }) =>
                                cx(
                                  'flex items-center gap-2.5 rounded-md px-2 py-2 text-[13px] transition-all duration-200',
                                  isActive
                                    ? 'bg-white/[0.07] font-medium text-brass-200'
                                    : 'text-primary-100/55 hover:bg-white/[0.04] hover:text-white'
                                )
                              }
                            >
                              <item.icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{item.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* ---------------- Footer: identity + collapse ---------------- */}
        <div className="shrink-0 border-t border-white/[0.06] p-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Avatar name={user?.full_name || user?.name} src={user?.photo_path} size="sm" />
              <button
                onClick={() => setCollapsed(false)}
                className="hidden rounded-lg p-2 text-primary-200/60 transition-colors hover:bg-white/10 hover:text-white lg:block"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-2.5 ring-1 ring-inset ring-white/[0.06]">
                <Avatar name={user?.full_name || user?.name} src={user?.photo_path} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-white">
                    {user?.full_name || user?.name || 'Team Member'}
                  </p>
                  <p className="truncate text-[11px] text-primary-200/55">
                    {user?.designation || roleLabels[userRole] || 'Employee'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="rounded-md p-1.5 text-primary-200/50 transition-colors hover:bg-red-500/15 hover:text-red-300"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2.5 flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-eyebrow text-primary-200/35">
                  <Sparkles className="h-3 w-3 text-brass-400/70" />
                  Manavsetu
                </span>
                <button
                  onClick={() => setCollapsed(true)}
                  className="hidden rounded-md p-1.5 text-primary-200/50 transition-colors hover:bg-white/10 hover:text-white lg:block"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
