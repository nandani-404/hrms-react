import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, Home, TrendingUp, ArrowRight, Calendar, FileText, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDashboardStats, useAttendanceGraph, useRecentWfh, useRecentLeaves } from '../hooks/useDashboard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
  
  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const selectedMonthStr = format(selectedMonth, 'yyyy-MM')
  
  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: graphData, isLoading: graphLoading } = useAttendanceGraph(selectedMonthStr)
  const { data: recentWfh, isLoading: wfhLoading } = useRecentWfh(5)
  const { data: recentLeaves, isLoading: leavesLoading } = useRecentLeaves(5)

  // Month navigation handlers
  const handlePrevMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1))
  }

  const handleCurrentMonth = () => {
    setSelectedMonth(new Date())
  }

  // Check if current month is selected
  const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')

  const loading = statsLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Welcome back, {user?.full_name}
        </p>
      </div>

      {/* Top Stats Cards */}
      {isHR && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            icon={Users}
            label="Total Employees"
            value={stats?.total_employees || 0}
            color="bg-primary-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Present Today"
            value={stats?.present_today || 0}
            color="bg-green-600"
          />
          <StatCard
            icon={Home}
            label="WFH Today"
            value={stats?.wfh_today || 0}
            color="bg-blue-600"
          />
          <StatCard
            icon={Clock}
            label="Avg Punch In"
            value={stats?.avg_punch_in_time || '--:--'}
            color="bg-orange-600"
          />
        </div>
      )}

      {/* Attendance Bar Graph */}
      {isHR && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          {/* Header with Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  Daily Attendance Overview
                </h2>
                <p className="text-xs text-gray-500">Track employee presence by date</p>
              </div>
            </div>
            
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <span className="text-sm font-semibold text-blue-900">
                  {format(selectedMonth, 'MMMM yyyy')}
                </span>
              </div>
              
              <button
                onClick={handleNextMonth}
                disabled={isCurrentMonth}
                className={`p-2 rounded-lg transition-colors ${
                  isCurrentMonth 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-100'
                }`}
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              
              {!isCurrentMonth && (
                <button
                  onClick={handleCurrentMonth}
                  className="ml-2 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Today
                </button>
              )}
            </div>
          </div>
          
          {graphLoading ? (
            <div className="flex items-center justify-center h-80">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-500">Loading attendance data...</p>
              </div>
            </div>
          ) : graphData && graphData.length > 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={graphData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  barCategoryGap="20%"
                >
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="day"
                    type="number"
                    domain={[0.5, graphData.length + 0.5]}
                    ticks={graphData.map(d => d.day)}
                    label={{ 
                      value: 'Date of Month', 
                      position: 'insideBottom', 
                      offset: 0, 
                      style: { fontWeight: 600, fill: '#374151', fontSize: 14 } 
                    }}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    interval={0}
                    angle={0}
                    height={50}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    label={{ 
                      value: 'Employees Present', 
                      angle: -90, 
                      position: 'center', 
                      style: { fontWeight: 600, fill: '#374151', fontSize: 14, textAnchor: 'middle' } 
                    }}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    allowDecimals={false}
                    domain={[0, 'auto']}
                    stroke="#9ca3af"
                    width={80}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-4 border-2 border-green-200 rounded-xl shadow-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-green-600" />
                              <p className="text-sm font-semibold text-gray-900">
                                {format(new Date(data.date), 'EEEE, MMM dd, yyyy')}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-xs text-gray-600">Employees Present:</span>
                              <span className="text-lg font-bold text-green-600">{payload[0].value}</span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                    cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  />
                  <Bar 
                    dataKey="present_count" 
                    fill="url(#colorPresent)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={35}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Summary Stats Below Graph */}
              {/* <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Total Days</p>
                  <p className="text-lg font-bold text-gray-900">{graphData.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Days with Data</p>
                  <p className="text-lg font-bold text-green-600">
                    {graphData.filter(d => d.present_count > 0).length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Avg Present/Day</p>
                  <p className="text-lg font-bold text-blue-600">
                    {graphData.length > 0 
                      ? Math.round(graphData.reduce((sum, d) => sum + d.present_count, 0) / graphData.filter(d => d.present_count > 0).length || 0)
                      : 0}
                  </p>
                </div>
              </div> */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-gray-500">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium">No attendance data available</p>
              <p className="text-sm text-gray-400 mt-1">for {format(selectedMonth, 'MMMM yyyy')}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Recent Requests Cards */}
      {isHR && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent WFH Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  Recent WFH Requests
                </h2>
              </div>
              <button
                onClick={() => navigate('/wfh-requests')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {wfhLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : recentWfh && recentWfh.length > 0 ? (
              <div className="space-y-3">
                {recentWfh.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/wfh-requests')}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {request.employee?.full_name || 'Unknown'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {format(new Date(request.start_date), 'MMM dd')} - {format(new Date(request.end_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                No WFH requests yet
              </div>
            )}
          </motion.div>

          {/* Recent Leave Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  Recent Leave Requests
                </h2>
              </div>
              <button
                onClick={() => navigate('/leave-requests')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {leavesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : recentLeaves && recentLeaves.length > 0 ? (
              <div className="space-y-3">
                {recentLeaves.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/leave-requests')}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {request.employee?.full_name || 'Unknown'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {request.leave_type} • {format(new Date(request.start_date), 'MMM dd')} - {format(new Date(request.end_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                No leave requests yet
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
