import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, LogOut, Search, ChevronDown, CalendarDays, UserRound } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import NotificationDrawer from './NotificationDrawer'
import { notificationService } from '../services/notifications'
import { titleForPath } from '../config/navigation'
import { Avatar, cx } from './ui'

const roleBadges = {
  super_admin: { label: 'CEO', className: 'bg-brass-50 text-brass-700 ring-brass-200' },
  hr: { label: 'HR', className: 'bg-primary-50 text-primary-700 ring-primary-200' },
  admin: { label: 'Admin', className: 'bg-primary-50 text-primary-700 ring-primary-200' },
}

const Header = ({ onMenuClick, onOpenSearch }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const profileRef = useRef(null)

  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { title, section } = titleForPath(location.pathname)
  const badge = roleBadges[user?.role]

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications(1, 20)
      setNotifications(res?.data?.data || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount()
      setUnreadCount(res?.unread_count || 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    fetchNotifications()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [showNotifications])

  // Keep the browser tab in step with the screen the user is on.
  useEffect(() => {
    document.title = `${title} · TM-Manavsetu`
  }, [title])

  // Dismiss the profile menu on any outside click.
  useEffect(() => {
    if (!showProfile) return
    const handler = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showProfile])

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-gray-50/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
        {/* -------- Left: menu + contextual title -------- */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="-ml-1 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200/60 hover:text-gray-900 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            {section && <p className="hidden text-[10px] uppercase tracking-eyebrow text-gray-400 sm:block">{section}</p>}
            <div className="flex items-center gap-2.5">
              <h2 className="truncate font-display text-lg font-semibold leading-tight text-gray-900 md:text-xl">
                {title}
              </h2>
              {badge && (
                <span
                  className={cx(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset',
                    badge.className
                  )}
                >
                  {badge.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* -------- Right: search, date, notifications, profile -------- */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={onOpenSearch}
            className="group hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-xs transition-all hover:border-gray-300 hover:text-gray-700 md:flex"
            title="Search screens (⌘K)"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search…</span>
            <kbd className="ml-2 hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-gray-500 lg:inline">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenSearch}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200/60 hover:text-gray-900 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <span className="mx-1 hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-xs xl:flex">
            <CalendarDays className="h-4 w-4 text-brass-500" />
            {format(new Date(), 'EEE, dd MMM yyyy')}
          </span>

          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200/60 hover:text-gray-900"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white ring-2 ring-gray-50">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-gray-200/60"
            >
              <Avatar name={user?.full_name || user?.name} src={user?.photo_path} size="sm" />
              <span className="hidden max-w-[140px] flex-col items-start md:flex">
                <span className="truncate text-sm font-medium leading-tight text-gray-800">
                  {user?.full_name || user?.name || 'Team Member'}
                </span>
                <span className="truncate text-[11px] leading-tight text-gray-500">
                  {user?.designation || 'Employee'}
                </span>
              </span>
              <ChevronDown
                className={cx('hidden h-4 w-4 text-gray-400 transition-transform md:block', showProfile && 'rotate-180')}
              />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                >
                  <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50/70 px-4 py-3.5">
                    <Avatar name={user?.full_name || user?.name} src={user?.photo_path} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user?.full_name || user?.name || 'Team Member'}
                      </p>
                      <p className="truncate text-xs text-gray-500">{user?.email || user?.official_email || '—'}</p>
                    </div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowProfile(false)
                        navigate('/profile')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 font-medium"
                    >
                      <UserRound className="h-4 w-4 text-blue-600" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowProfile(false)
                        navigate('/my-attendance')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      My Attendance
                    </button>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onRefresh={() => {
          fetchNotifications()
          fetchUnreadCount()
        }}
      />
    </header>
  )
}

export default Header
