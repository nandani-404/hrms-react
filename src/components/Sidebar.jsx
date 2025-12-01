import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  FileText, 
  Home,
  Calendar,
  Headphones,
  X,
  ClipboardCheck,
  IndianRupeeIcon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const allNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['all'] },
  { to: '/my-attendance', icon: ClipboardCheck, label: 'My Attendance', roles: ['all'] },
  { to: '/attendance', icon: Clock, label: 'Attendance', roles: ['all'] },
  { to: '/employees', icon: Users, label: 'Employees', roles: ['hr', 'admin'] },
  { to: '/wfh-requests', icon: Home, label: 'WFH Requests', roles: ['all'] },
  { to: '/leave-requests', icon: Calendar, label: 'Leave Requests', roles: ['all'] },
  // { to: '/helpdesk', icon: Headphones, label: 'Helpdesk', roles: ['hr', 'admin'] },
  { to: '/payroll', icon: IndianRupeeIcon, label: 'Payroll', roles: ['hr', 'admin'] },
  // { to: '/reports', icon: FileText, label: 'Reports', roles: ['hr', 'admin'] },
]

const Sidebar = ({ open, setOpen }) => {
  const { user } = useAuth()
  const userRole = user?.role || 'employee'

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(userRole)
  )

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src="https://truckmitr.com/public/front/assets/images/logotrick.png" alt="" width={100}/>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Role Badge */}
        {/* <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Logged in as</p>
            <p className="text-sm font-medium text-gray-900 capitalize">{userRole}</p>
          </div>
        </div> */}
      </aside>
    </>
  )
}

export default Sidebar
