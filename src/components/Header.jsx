import { Menu, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationDrawer from './NotificationDrawer'
import { notificationService } from '../services/notifications'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications(1, 20)
      setNotifications(res?.data?.data || [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount()
      setUnreadCount(res?.unread_count || 0)
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    fetchNotifications()

    // Poll for unread count every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [showNotifications])

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex flex-1 lg:flex-none gap-3 items-center">
          <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
            Welcome to TM-Manavsetu
          </h1>
          {(user?.role === 'hr' || user?.role === 'super_admin') && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              user?.role === 'super_admin' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role === 'super_admin' ? 'CEO' : 'HR'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'HR Admin'}
                </span>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
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

