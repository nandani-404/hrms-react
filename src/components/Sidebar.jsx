import { useState } from 'react'
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
  IndianRupeeIcon,
  Settings,
  Laptop,
  FolderSync,
  Tag,
  Receipt,
  CheckSquare,
  ChevronDown,
  CalendarDays
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const allNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['hr', 'super_admin', 'admin'] },
  { to: '/my-attendance', icon: ClipboardCheck, label: 'My Attendance', roles: ['all'] },
  { to: '/today-attendance', icon: Clock, label: "Today's Attendance", roles: ['hr', 'super_admin', 'admin'] },
  { to: '/employees', icon: Users, label: 'Employees', roles: ['hr', 'super_admin', 'admin'] },
  // { to: '/tasks', icon: CheckSquare, label: 'Tasks', roles: ['hr', 'super_admin', 'admin'] },
  { to: '/wfh-requests', icon: Home, label: 'WFH Requests', roles: ['all'] },
  { to: '/leave-requests', icon: Calendar, label: 'Leave Requests', roles: ['all'] },
  { to: '/short-leave', icon: Clock, label: 'Short Leave', roles: ['hr', 'super_admin', 'admin'] },
  { to: '/payroll', icon: IndianRupeeIcon, label: 'Payroll', roles: ['hr', 'super_admin', 'admin'] },
  { to: '/expenses', icon: Receipt, label: 'Expenses', roles: ['all'] },
  { to: '/expense-approvals', icon: ClipboardCheck, label: 'Reimbursement', roles: ['all'] },
  { to: '/assets-management', icon: Laptop, label: 'Assets Management', roles: ['hr', 'super_admin', 'admin'] },
]

const Sidebar = ({ open, setOpen }) => {
  const { user } = useAuth()
  const userRole = user?.role || 'employee'

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [assetsOpen, setAssetsOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)

  // Filter main nav items based on user role
  const navItems = allNavItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(userRole)
  )

  const isHRorAdmin = userRole === 'hr' || userRole === 'super_admin' || userRole === 'admin'

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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 flex flex-col lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src="https://truckmitr.com/public/front/assets/images/logotrick.png" alt="Logo" width={120}/>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
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

          {isHRorAdmin && (
            <>
              <div className="my-4 border-t border-gray-200" />
              
              {/* Settings Dropdown */}
              <div>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left"
                >
                  <Settings className="w-5 h-5" />
                  <span className="flex-1">Settings</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {settingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-gray-50/50 rounded-lg mt-1"
                    >
                      <div className="pl-4 py-1 space-y-1">
                        
                        {/* Collapsible Assets */}
                        <div>
                          <button
                            onClick={() => setAssetsOpen(!assetsOpen)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-left"
                          >
                            <Laptop className="w-4 h-4 text-gray-400" />
                            <span className="flex-1">Assets Settings</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${assetsOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {assetsOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pl-4 overflow-hidden"
                              >
                                <NavLink
                                  to="/assets-category"
                                  onClick={() => setOpen(false)}
                                  className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all ${
                                      isActive ? 'text-primary-700 font-semibold' : 'text-gray-500 hover:text-gray-900'
                                    }`
                                  }
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                  <span>Assets Category</span>
                                </NavLink>
                                <NavLink
                                  to="/assets-sub-category"
                                  onClick={() => setOpen(false)}
                                  className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all ${
                                      isActive ? 'text-primary-700 font-semibold' : 'text-gray-500 hover:text-gray-900'
                                    }`
                                  }
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                  <span>Assets Items</span>
                                </NavLink>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Collapsible Expense */}
                        <div>
                          <button
                            onClick={() => setExpenseOpen(!expenseOpen)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-left"
                          >
                            <Receipt className="w-4 h-4 text-gray-400" />
                            <span className="flex-1">Expense Settings</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expenseOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {expenseOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pl-4 overflow-hidden"
                              >
                                <NavLink
                                  to="/expense-category"
                                  onClick={() => setOpen(false)}
                                  className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all ${
                                      isActive ? 'text-primary-700 font-semibold' : 'text-gray-500 hover:text-gray-900'
                                    }`
                                  }
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                  <span>Expense Category</span>
                                </NavLink>
                                <NavLink
                                  to="/expense-sub-category"
                                  onClick={() => setOpen(false)}
                                  className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all ${
                                      isActive ? 'text-primary-700 font-semibold' : 'text-gray-500 hover:text-gray-900'
                                    }`
                                  }
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                  <span>Expense Items</span>
                                </NavLink>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Office Calendar */}
                        <NavLink
                          to="/office-calendar"
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                              isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                          }
                        >
                          <CalendarDays className="w-4 h-4 text-gray-400" />
                          <span>Office Calendar</span>
                        </NavLink>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
