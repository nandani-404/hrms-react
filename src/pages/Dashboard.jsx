import { motion } from 'framer-motion'
import { Users, Clock, DollarSign, TrendingUp, LogIn, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useEmployees } from '../hooks/useEmployees'
import { useAttendance, useEmployeeTodayStatus } from '../hooks/useAttendance'
import { useAuth } from '../context/AuthContext'

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs md:text-sm text-gray-600 mb-1">{label}</p>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className="text-xs md:text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            {trend}
          </p>
        )}
      </div>
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>
    </div>
  </motion.div>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isHR = user?.role === 'hr' || user?.role === 'admin'
  
  const today = format(new Date(), 'yyyy-MM-dd')
  const { data: employees = [], isLoading: employeesLoading } = useEmployees()
  const { data: attendance, isLoading: attendanceLoading } = useAttendance({ date: today })
  const { data: todayStatus } = useEmployeeTodayStatus(user?.emp_id)

  const loading = employeesLoading || attendanceLoading

  // Ensure attendance is an array
  const attendanceArray = Array.isArray(attendance) ? attendance : []

  const stats = {
    totalEmployees: employees.length,
    presentToday: attendanceArray.filter(a => a.attendance_status === 'present').length,
    monthlyPayroll: 0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Welcome back, {user?.full_name}
        </p>
      </div>

      {/* User Attendance Status - Always visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 md:p-6 shadow-sm border border-primary-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Today's Attendance</h2>
            <p className="text-xs md:text-sm text-gray-600">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
          </div>
          <Calendar className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`p-3 md:p-4 rounded-lg ${todayStatus?.checked_in ? 'bg-green-100' : 'bg-white'}`}>
            <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">Check In</p>
            <p className="text-sm md:text-base font-semibold text-gray-900">
              {todayStatus?.attendance?.checkin_time 
                ? format(new Date(todayStatus.attendance.checkin_time), 'hh:mm a')
                : 'Not marked'}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${todayStatus?.checked_out ? 'bg-green-100' : 'bg-white'}`}>
            <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">Check Out</p>
            <p className="text-sm md:text-base font-semibold text-gray-900">
              {todayStatus?.attendance?.checkout_time 
                ? format(new Date(todayStatus.attendance.checkout_time), 'hh:mm a')
                : 'Not marked'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/attendance')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <LogIn className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Go to Attendance</span>
        </button>
      </motion.div>

      {/* HR Stats - Only visible to HR */}
      {isHR && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatCard
            icon={Users}
            label="Total Employees"
            value={stats.totalEmployees}
            color="bg-primary-600"
          />
          <StatCard
            icon={Clock}
            label="Present Today"
            value={stats.presentToday}
            trend="+5% from yesterday"
            color="bg-green-600"
          />
          <StatCard
            icon={DollarSign}
            label="Monthly Payroll"
            value="₹0"
            color="bg-purple-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Attendance Rate"
            value={stats.totalEmployees > 0 ? `${Math.round((stats.presentToday / stats.totalEmployees) * 100)}%` : '0%'}
            trend="+2% this month"
            color="bg-orange-600"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/attendance')}
              className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm md:text-base"
            >
              Mark Attendance
            </button>
            {isHR && (
              <>
                <button 
                  onClick={() => navigate('/employees')}
                  className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
                >
                  Manage Employees
                </button>
                <button 
                  onClick={() => navigate('/payroll')}
                  className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
                >
                  View Payroll
                </button>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Your Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-600">This Month</span>
              <span className="text-sm md:text-base font-semibold text-gray-900">
                {todayStatus?.attendance ? '1 day' : '0 days'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-600">Work Hours Today</span>
              <span className="text-sm md:text-base font-semibold text-gray-900">
                {todayStatus?.attendance?.work_hours 
                  ? `${todayStatus.attendance.work_hours.toFixed(2)} hrs`
                  : '0 hrs'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-600">Status</span>
              <span className={`text-sm md:text-base font-semibold ${
                todayStatus?.checked_in ? 'text-green-600' : 'text-gray-400'
              }`}>
                {todayStatus?.checked_in ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
