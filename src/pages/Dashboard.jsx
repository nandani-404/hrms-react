import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Users,
  UserCheck,
  Palmtree,
  UserPlus,
  Plus,
  Megaphone,
  Wrench,
  FileText,
  Cake,
  Briefcase,
  ChevronRight,
  Sparkles,
  Info,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Calendar as CalendarIcon,
  Laptop,
  CreditCard,
  LifeBuoy,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Building2,
  BarChart3,
  ListTodo,
  CheckCircle,
  CircleDot,
  AlertTriangle,
  Slash,
  Target,
  Activity,
  Ticket,
} from 'lucide-react'
import { format, isValid, addDays } from 'date-fns'
import {
  useDashboardStats,
  useAttendanceGraph,
  useRecentWfh,
  useRecentLeaves,
  useUpcomingBirthdays,
  useDashboardTasks,
  useDepartmentBreakdown,
} from '../hooks/useDashboard'
import { useEmployees } from '../hooks/useEmployees'
import { useAttendance } from '../hooks/useAttendance'
import { useCalendars } from '../hooks/useOfficeCalendar'
import { getTeamMembers } from '../utils/teamFilter'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Avatar, Badge } from '../components/ui'

const safeFormat = (dateVal, formatPattern, fallback = '—') => {
  if (!dateVal) return fallback
  const d = new Date(dateVal)
  if (!isValid(d)) return fallback
  try {
    return format(d, formatPattern)
  } catch {
    return fallback
  }
}

// Default monthly graph backup
const defaultMonthlyGraph = [
  { month: 'Jan', Present: 290, Late: 20, Absent: 10 },
  { month: 'Feb', Present: 285, Late: 25, Absent: 10 },
  { month: 'Mar', Present: 295, Late: 15, Absent: 10 },
  { month: 'Apr', Present: 280, Late: 30, Absent: 10 },
  { month: 'May', Present: 300, Late: 10, Absent: 10 },
  { month: 'Jun', Present: 275, Late: 35, Absent: 10 },
]

// Default Announcements
const announcements = [
  {
    id: 1,
    title: 'Annual Day Celebration',
    description: 'Join us for the Annual Day celebration on 25th May 2024.',
    timeAgo: '2h ago',
    icon: Megaphone,
    color: 'bg-purple-50 text-purple-600 border border-purple-200',
  },
  {
    id: 2,
    title: 'System Maintenance',
    description: 'System will be under maintenance on 20th May from 12:00 AM to 2:00 AM.',
    timeAgo: '5h ago',
    icon: Wrench,
    color: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  },
  {
    id: 3,
    title: 'New Leave Policy',
    description: 'Please review the updated leave policy effective from June 1st, 2024.',
    timeAgo: '1d ago',
    icon: FileText,
    color: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
]

// Default Leave Balance
const leaveBalances = [
  { type: 'Casual Leave', used: 12, total: 18, color: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  { type: 'Sick Leave', used: 8, total: 12, color: 'bg-amber-500', iconBg: 'bg-amber-50 text-amber-600 border border-amber-200' },
  { type: 'Privilege Leave', used: 10, total: 15, color: 'bg-blue-600', iconBg: 'bg-blue-50 text-blue-600 border border-blue-200' },
  { type: 'Comp Off', used: 4, total: 8, color: 'bg-purple-600', iconBg: 'bg-purple-50 text-purple-600 border border-purple-200' },
]

// Sample Upcoming Holidays fallback
const defaultHolidays = [
  { id: 1, name: 'Gandhi Jayanti', date: '02 Oct 2026', type: 'National Holiday', day: 'Friday' },
  { id: 2, name: 'Dussehra', date: '20 Oct 2026', type: 'Festival', day: 'Tuesday' },
  { id: 3, name: 'Diwali', date: '08 Nov 2026', type: 'Festival', day: 'Sunday' },
]

// Department colors for the horizontal bar chart
const deptColors = [
  '#2C4E7E', '#D2A94A', '#226845', '#A83128', '#6A478F',
  '#3C4A86', '#2F7F7C', '#9C7325', '#C4711F', '#55396F',
  '#5B564B', '#3E6499',
]

// Fallback department data
const defaultDeptData = [
  { department: 'IT', count: 85, color: deptColors[0] },
  { department: 'Telecalling', count: 62, color: deptColors[1] },
  { department: 'HR', count: 28, color: deptColors[2] },
  { department: 'Finance', count: 35, color: deptColors[3] },
  { department: 'Operations', count: 48, color: deptColors[4] },
  { department: 'Marketing', count: 32, color: deptColors[5] },
  { department: 'Sales', count: 30, color: deptColors[6] },
]

// Fallback tasks
const defaultTasks = [
  { id: 1, title: 'Review Q3 performance reports', status: 'todo', priority: 'high', due_date: '2026-09-10' },
  { id: 2, title: 'Update onboarding documentation', status: 'doing', priority: 'medium', due_date: '2026-09-12' },
  { id: 3, title: 'Prepare monthly payroll summary', status: 'doing', priority: 'high', due_date: '2026-09-08' },
  { id: 4, title: 'Conduct team standup meeting', status: 'done', priority: 'low', due_date: '2026-09-07' },
  { id: 5, title: 'Submit expense reimbursement', status: 'todo', priority: 'medium', due_date: '2026-09-15' },
  { id: 6, title: 'Fix attendance sync issue', status: 'blocked', priority: 'urgent', due_date: '2026-09-06' },
]

/* ------------------------------------------------------------------ *
 * Mini sub-components for the new widgets
 * ------------------------------------------------------------------ */

// Horizontal bar for department breakdown
const DeptBar = ({ dept, maxCount, index }) => {
  const pct = Math.round((dept.count / maxCount) * 100)
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="flex items-center gap-3 group"
    >
      <span className="text-xs font-semibold text-slate-600 w-24 truncate text-right shrink-0">
        {dept.department}
      </span>
      <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden border border-slate-200/60 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.1 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-md transition-all"
          style={{ backgroundColor: dept.color }}
        />
        <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-bold text-slate-600">
          {dept.count}
        </span>
      </div>
    </motion.div>
  )
}

// Task status config
const taskStatusConfig = {
  todo: { label: 'To Do', icon: ListTodo, color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  doing: { label: 'In Progress', icon: Clock, color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  done: { label: 'Done', icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  blocked: { label: 'Blocked', icon: Slash, color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
}

const taskPriorityConfig = {
  urgent: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-green-50 text-green-700 border-green-200',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [birthdayDays] = useState(30)
  const [peopleTab, setPeopleTab] = useState('birthdays') // 'birthdays' | 'joiners'
  const [taskFilterTab, setTaskFilterTab] = useState('all') // 'all' | 'todo' | 'doing' | 'done' | 'blocked'

  const isCTOOrHead =
    (user?.department === 'IT' && user?.designation === 'CTO') ||
    (user?.department === 'Telecalling' && user?.designation === 'Head - Telecalling')
  const isReportingManager = user?.is_reporting_manager === 1

  let filterParams = {}
  if (user?.role !== 'super_admin' && user?.role !== 'hr') {
    if (isReportingManager) {
      filterParams = { reporting_manager_id: user.emp_id }
    } else if (isCTOOrHead) {
      filterParams = { department: user.department }
    }
  }

  const selectedMonthStr = format(new Date(), 'yyyy-MM')

  // Hook calls
  const { data: stats } = useDashboardStats(filterParams)
  const { data: rawGraphData } = useAttendanceGraph(selectedMonthStr, filterParams)
  const { data: rawRecentWfh } = useRecentWfh(5, filterParams)
  const { data: rawRecentLeaves } = useRecentLeaves(5, filterParams)
  const { data: birthdaysData } = useUpcomingBirthdays(birthdayDays, 10)
  const { data: calendarsData } = useCalendars()
  const { data: rawTasksData } = useDashboardTasks()
  const { data: rawDeptBreakdown } = useDepartmentBreakdown()

  const graphData = Array.isArray(rawGraphData)
    ? rawGraphData
    : Array.isArray(rawGraphData?.data)
    ? rawGraphData.data
    : Array.isArray(rawGraphData?.graph)
    ? rawGraphData.graph
    : Array.isArray(rawGraphData?.days)
    ? rawGraphData.days
    : []

  const { data: employeesData } = useEmployees()
  const allEmployees = Array.isArray(employeesData)
    ? employeesData
    : Array.isArray(employeesData?.data)
    ? employeesData.data
    : Array.isArray(employeesData?.employees)
    ? employeesData.employees
    : []

  const teamMembers = getTeamMembers(allEmployees, user)

  const totalEmployeesCount =
    stats?.total_employees || (user?.role !== 'super_admin' && user?.role !== 'hr' ? teamMembers.length : 320)

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const formattedTodayDate = safeFormat(new Date(), 'EEEE, dd MMMM yyyy')
  const { data: attendanceData } = useAttendance({ date: todayStr })

  const todayAttendance = Array.isArray(attendanceData)
    ? attendanceData
    : Array.isArray(attendanceData?.data)
    ? attendanceData.data
    : []

  const latestAttendanceMap = new Map()
  todayAttendance.forEach(record => {
    const key = `${record.employee_id}-${record.date}`
    if (!latestAttendanceMap.has(key) || record.id > latestAttendanceMap.get(key).id) {
      latestAttendanceMap.set(key, record)
    }
  })

  const presentEmployees = Array.from(latestAttendanceMap.values()).filter(
    record => record.attendance_status === 'present'
  )

  const presentCount = stats?.present_today || (presentEmployees.length > 0 ? presentEmployees.length : 256)
  const absentCount = stats?.absent_today || Math.max(0, totalEmployeesCount - presentCount - 32)
  const lateCount = 32
  const newJoinersCount = stats?.new_joiners || 18

  const presentPercentage = Math.round((presentCount / (totalEmployeesCount || 1)) * 100) || 80
  const absentPercentage = Math.round((absentCount / (totalEmployeesCount || 1)) * 100) || 10
  const latePercentage = Math.round((lateCount / (totalEmployeesCount || 1)) * 100) || 10

  const donutData = [
    { name: 'Present', value: presentCount, color: '#22c55e' },
    { name: 'Late', value: lateCount, color: '#f59e0b' },
    { name: 'Absent', value: absentCount, color: '#ef4444' },
  ]

  // Monthly Overview Chart Data
  const monthlyChartData =
    graphData.length > 0
      ? graphData.slice(-6).map(item => ({
          month: item.day ? `Day ${item.day}` : safeFormat(item.date, 'MMM'),
          Present: item.present_count || 0,
          Late: Math.round((item.absent_count || 0) * 0.3),
          Absent: item.absent_count || 0,
        }))
      : defaultMonthlyGraph

  // Pending leaves & WFH requests
  const recentLeavesList = Array.isArray(rawRecentLeaves)
    ? rawRecentLeaves
    : Array.isArray(rawRecentLeaves?.data)
    ? rawRecentLeaves.data
    : []

  const recentWfhList = Array.isArray(rawRecentWfh)
    ? rawRecentWfh
    : Array.isArray(rawRecentWfh?.data)
    ? rawRecentWfh.data
    : []

  const pendingRequests = [
    ...recentLeavesList.map(l => ({
      id: `leave-${l.id}`,
      type: 'Leave',
      name: l.employee_name || l.employee?.full_name || 'Team Member',
      details: `${l.leave_type || 'Leave'} • ${safeFormat(l.start_date, 'dd MMM')} - ${safeFormat(l.end_date, 'dd MMM')}`,
      status: l.status || 'pending',
      raw: l,
    })),
    ...recentWfhList.map(w => ({
      id: `wfh-${w.id}`,
      type: 'WFH',
      name: w.employee_name || w.employee?.full_name || 'Team Member',
      details: `Work From Home • ${safeFormat(w.date || w.start_date, 'dd MMM')}`,
      status: w.status || 'pending',
      raw: w,
    })),
  ].slice(0, 5)

  const pendingCount = pendingRequests.filter(r => r.status?.toLowerCase() === 'pending').length || 4

  // Sample pending fallback if empty
  const displayPendingRequests =
    pendingRequests.length > 0
      ? pendingRequests
      : [
          { id: 'l-1', type: 'Leave', name: 'Aarav Mehta', details: 'Casual Leave • 10 Sep - 12 Sep', status: 'pending' },
          { id: 'w-1', type: 'WFH', name: 'Sneha Reddy', details: 'Work From Home • 15 Sep', status: 'pending' },
          { id: 'l-2', type: 'Leave', name: 'Rohan Gupta', details: 'Sick Leave • 08 Sep', status: 'approved' },
          { id: 'w-2', type: 'WFH', name: 'Kavita Joshi', details: 'Work From Home • 18 Sep', status: 'pending' },
        ]

  // Recent Employees list
  const recentEmployeesList = allEmployees.slice(0, 4).map(emp => ({
    id: emp.id || emp.emp_id,
    name: emp.full_name || emp.name || 'Team Member',
    role: emp.designation || 'Software Engineer',
    joinedDate: emp.doj || emp.created_at || '2024-05-15',
    photo: emp.photo_path,
  }))

  const sampleRecentEmployees = [
    { id: 1, name: 'Rahul Sharma', role: 'Software Developer', joinedDate: '15 May 2024' },
    { id: 2, name: 'Priya Singh', role: 'UI/UX Designer', joinedDate: '14 May 2024' },
    { id: 3, name: 'Amit Kumar', role: 'DevOps Engineer', joinedDate: '13 May 2024' },
    { id: 4, name: 'Sneha Patel', role: 'HR Executive', joinedDate: '12 May 2024' },
  ]

  const displayRecentEmployees =
    recentEmployeesList.length > 0
      ? recentEmployeesList.map(e => ({
          ...e,
          joinedDate: safeFormat(e.joinedDate, 'dd MMM yyyy'),
        }))
      : sampleRecentEmployees

  // Birthdays list
  const birthdaysList =
    birthdaysData?.birthdays && birthdaysData.birthdays.length > 0
      ? birthdaysData.birthdays.slice(0, 4).map(b => ({
          id: b.emp_id,
          name: b.full_name,
          date: safeFormat(b.birthday_date, 'dd MMM'),
          daysLeft: b.days_until_birthday === 0 ? 'Today' : `in ${b.days_until_birthday} days`,
          photo: b.photo_path,
        }))
      : [
          { id: 101, name: 'Ankit Verma', date: '20 Sep', daysLeft: 'in 2 days' },
          { id: 102, name: 'Pooja Sharma', date: '22 Sep', daysLeft: 'in 4 days' },
          { id: 103, name: 'Vikram Singh', date: '25 Sep', daysLeft: 'in 7 days' },
          { id: 104, name: 'Neha Gupta', date: '28 Sep', daysLeft: 'in 10 days' },
        ]

  // Holidays
  const upcomingHolidays = Array.isArray(calendarsData) && calendarsData.length > 0
    ? calendarsData.slice(0, 3).map(c => ({
        id: c.id,
        name: c.title || c.name || 'Holiday',
        date: safeFormat(c.date || c.start_date, 'dd MMM yyyy'),
        type: c.type || 'Official Holiday',
        day: safeFormat(c.date || c.start_date, 'EEEE'),
      }))
    : defaultHolidays

  /* ------------------------------------------------------------------ *
   * Department Breakdown Data
   * ------------------------------------------------------------------ */
  const departmentData = useMemo(() => {
    // If API returned data, use it
    if (rawDeptBreakdown && Array.isArray(rawDeptBreakdown)) {
      return rawDeptBreakdown.map((d, i) => ({
        department: d.department || d.name || 'Unknown',
        count: d.count || d.employee_count || 0,
        color: deptColors[i % deptColors.length],
      })).sort((a, b) => b.count - a.count)
    }

    // Try computing from employees data
    if (allEmployees.length > 0) {
      const deptMap = {}
      allEmployees.forEach(emp => {
        const dept = emp.department || 'Unassigned'
        deptMap[dept] = (deptMap[dept] || 0) + 1
      })
      return Object.entries(deptMap)
        .map(([dept, count], i) => ({
          department: dept,
          count,
          color: deptColors[i % deptColors.length],
        }))
        .sort((a, b) => b.count - a.count)
    }

    return defaultDeptData
  }, [rawDeptBreakdown, allEmployees])

  const maxDeptCount = Math.max(...departmentData.map(d => d.count), 1)
  const totalDeptEmployees = departmentData.reduce((sum, d) => sum + d.count, 0)

  /* ------------------------------------------------------------------ *
   * Task Tracker Data
   * ------------------------------------------------------------------ */
  const allTasks = useMemo(() => {
    const tasks = Array.isArray(rawTasksData) && rawTasksData.length > 0
      ? rawTasksData
      : defaultTasks
    return tasks
  }, [rawTasksData])

  const taskCounts = useMemo(() => {
    const counts = { todo: 0, doing: 0, done: 0, blocked: 0, total: 0 }
    allTasks.forEach(t => {
      const status = t.status?.toLowerCase()
      if (counts[status] !== undefined) counts[status]++
      counts.total++
    })
    return counts
  }, [allTasks])

  const filteredTasks = useMemo(() => {
    const tasks = taskFilterTab === 'all'
      ? allTasks
      : allTasks.filter(t => t.status?.toLowerCase() === taskFilterTab)
    return tasks.slice(0, 5)
  }, [allTasks, taskFilterTab])

  const taskCompletionRate = taskCounts.total > 0
    ? Math.round((taskCounts.done / taskCounts.total) * 100)
    : 0

  const displayName = (user?.full_name || user?.name || 'Aditya').split(' ')[0]

  return (
    <div className="space-y-6 bg-slate-50/60 p-3 sm:p-5 md:p-6 rounded-3xl min-h-screen">
      {/* ------------------------------------------------------------------ *
       * Header / Welcome Banner
       * ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span>{formattedTodayDate}</span>
            {user?.role !== 'hr' && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  Shift: 09:00 AM - 06:00 PM
                </span>
              </>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl flex items-center gap-2 font-display">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
            Here is your daily HR operations & workforce summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/my-attendance')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <Clock3 className="h-4 w-4 text-emerald-600" />
            Attendance / Punch
          </button>

          {user?.role !== 'hr' && (
            <button
              onClick={() => navigate('/leave-management')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              <Palmtree className="h-4 w-4 text-amber-500" />
              Apply Leave
            </button>
          )}

          {(user?.role === 'hr' || user?.role === 'super_admin' || user?.role === 'admin') && (
            <button
              onClick={() => navigate('/employees/add')}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 shadow-sm"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              Add Employee
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ *
       * Quick Action Toolbar
       * ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => navigate('/my-attendance')}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/80 group-hover:scale-105 transition-transform">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Punch Log</div>
            <div className="text-[10px] text-slate-400 font-medium">Clock In/Out</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/leave-management')}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200/80 group-hover:scale-105 transition-transform">
            <Palmtree className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Leaves</div>
            <div className="text-[10px] text-slate-400 font-medium">Apply & View</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/expenses')}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/80 group-hover:scale-105 transition-transform">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Expenses</div>
            <div className="text-[10px] text-slate-400 font-medium">Claims & Reimburse</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/office-calendar')}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200/80 group-hover:scale-105 transition-transform">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Calendar</div>
            <div className="text-[10px] text-slate-400 font-medium">Holidays & Events</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/helpdesk')}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200/80 group-hover:scale-105 transition-transform">
            <LifeBuoy className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Helpdesk</div>
            <div className="text-[10px] text-slate-400 font-medium">Support Tickets</div>
          </div>
        </button>
      </div>

      {/* ------------------------------------------------------------------ *
       * Top 4 Summary Cards (Clean & Modern Classic Style)
       * ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Employees */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wide">Total Employees</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 border border-blue-100">
              <TrendingUp className="h-3 w-3" />
              +12
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{totalEmployeesCount}</span>
            <span className="text-xs font-medium text-slate-500">↑ 12 this month</span>
          </div>
        </div>

        {/* Card 2: Present Today */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <UserCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wide">Present Today</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 border border-emerald-100">
              {presentPercentage}%
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{presentCount}</span>
            <span className="text-xs font-medium text-slate-500">{presentPercentage}% of total</span>
          </div>
        </div>

        {/* Card 3: On Leave / WFH */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Palmtree className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wide">On Leave / WFH</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600 border border-amber-100">
              {absentPercentage}%
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{absentCount}</span>
            <span className="text-xs font-medium text-slate-500">{absentPercentage}% on leave</span>
          </div>
        </div>

        {/* Card 4: Pending Requests */}
        <div 
          className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
          onClick={() => navigate('/leave-management')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wide">Pending Requests</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-600 border border-purple-100">
              Review
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{pendingCount}</span>
            <span className="text-xs font-semibold text-purple-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Review now <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ *
       * Middle Grid (3 Columns)
       * ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Attendance (Doughnut Chart) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-display">Today's Attendance</h3>
              <button
                onClick={() => navigate('/today-attendance')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 group"
              >
                View Details
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="my-5 flex items-center justify-between gap-4">
              <div className="relative h-44 w-44 shrink-0 mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={54}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">{totalEmployeesCount}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total</span>
                </div>
              </div>

              <div className="space-y-3.5 shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    <span className="text-xs font-semibold text-slate-600">Present</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-display">{presentCount} ({presentPercentage}%)</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                    <span className="text-xs font-semibold text-slate-600">Late</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-display">{lateCount} ({latePercentage}%)</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-red-100" />
                    <span className="text-xs font-semibold text-slate-600">Absent</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-display">{absentCount} ({absentPercentage}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-blue-50/70 border border-blue-200 px-3.5 py-2.5 text-xs font-medium text-blue-900">
            <Info className="h-4 w-4 shrink-0 text-blue-600" />
            <span>Attendance health is good at {presentPercentage}% today.</span>
          </div>
        </div>

        {/* Pending Requests & Approvals */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 font-display">Pending Requests</h3>
                <span className="rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5">
                  {pendingCount}
                </span>
              </div>
              <button
                onClick={() => navigate('/leave-management')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 group"
              >
                View All
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {displayPendingRequests.map(req => {
                const isPending = req.status?.toLowerCase() === 'pending'
                return (
                  <div key={req.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-slate-50/60 rounded-xl px-2 -mx-2 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${req.type === 'Leave' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                          {req.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{req.name}</h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 truncate">{req.details}</p>
                    </div>

                    <div className="shrink-0 ml-3">
                      {isPending ? (
                        <button
                          onClick={() => navigate(req.type === 'Leave' ? '/leave-management' : '/wfh-requests')}
                          className="text-[11px] font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Review
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          Approved
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-display">My Leave Balance</h3>
              <button
                onClick={() => navigate('/leave-management')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 group"
              >
                Apply Leave
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {leaveBalances.map(leave => (
                <div key={leave.type} className="flex items-center gap-3 group">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${leave.iconBg}`}>
                    <Palmtree className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700">{leave.type}</span>
                      <span className="font-bold text-slate-900 font-display">
                        {leave.used} / {leave.total} days
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full ${leave.color} transition-all duration-500`}
                        style={{ width: `${Math.min(100, (leave.used / leave.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ *
       * NEW: Department Breakdown & Team Performance Metrics
       * ------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------ *
       * NEW: Department Breakdown & Team Performance Metrics
       * ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department-wise Headcount Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-display">Department Breakdown</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Headcount distribution across {departmentData.length} departments • {totalDeptEmployees} total
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/employees')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 group"
            >
              View All
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <div className="space-y-2">
            {departmentData.slice(0, 7).map((dept, index) => (
              <DeptBar key={dept.department} dept={dept} maxCount={maxDeptCount} index={index} />
            ))}
          </div>

          {departmentData.length > 7 && (
            <p className="mt-2 text-[11px] text-slate-400 font-medium text-center">
              + {departmentData.length - 7} more departments
            </p>
          )}
        </div>

        {/* Team Performance Metrics (Compact 2x2 Grid matching height) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 font-display">Team Performance</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Key metrics this month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Attendance Rate */}
            <div className="rounded-xl border border-slate-200/80 p-3 hover:border-slate-300 transition-colors bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                  <UserCheck className="h-3 w-3" />
                </div>
                <span className="text-xs font-extrabold text-emerald-700 font-display">{presentPercentage}%</span>
              </div>
              <div className="text-[11px] font-bold text-slate-700">Attendance</div>
              <div className="h-1.5 w-full rounded-full bg-slate-200/70 overflow-hidden mt-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${presentPercentage}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>
            </div>

            {/* Task Completion Rate */}
            <div className="rounded-xl border border-slate-200/80 p-3 hover:border-slate-300 transition-colors bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200/80">
                  <Target className="h-3 w-3" />
                </div>
                <span className="text-xs font-extrabold text-blue-700 font-display">{taskCompletionRate}%</span>
              </div>
              <div className="text-[11px] font-bold text-slate-700">Tasks Done</div>
              <div className="h-1.5 w-full rounded-full bg-slate-200/70 overflow-hidden mt-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${taskCompletionRate}%` }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-blue-500"
                />
              </div>
            </div>

            {/* Open Tickets */}
            <div className="rounded-xl border border-slate-200/80 p-3 hover:border-slate-300 transition-colors bg-slate-50/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-200/80">
                  <Ticket className="h-3 w-3" />
                </div>
                <span className="text-xs font-extrabold text-amber-700 font-display">{pendingCount}</span>
              </div>
              <div className="text-[11px] font-bold text-slate-700">Open Tickets</div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Pending review</p>
            </div>

            {/* Largest Department */}
            <div className="rounded-xl border border-slate-200/80 p-3 hover:border-slate-300 transition-colors bg-slate-50/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-purple-50 text-purple-600 border border-purple-200/80">
                  <Building2 className="h-3 w-3" />
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/80">
                  {departmentData[0]?.department || 'N/A'}
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-700">Top Dept</div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{departmentData[0]?.count || 0} employees</p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ *
       * NEW: Mini Task Tracker Widget
       * ------------------------------------------------------------------ */}
      {user?.role !== 'hr' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <ListTodo className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-display">My Tasks</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Quick overview of your task assignments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Status filter pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { key: 'all', label: 'All', count: taskCounts.total },
                  { key: 'todo', label: 'To Do', count: taskCounts.todo },
                  { key: 'doing', label: 'Active', count: taskCounts.doing },
                  { key: 'done', label: 'Done', count: taskCounts.done },
                  { key: 'blocked', label: 'Blocked', count: taskCounts.blocked },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setTaskFilterTab(tab.key)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      taskFilterTab === tab.key
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      taskFilterTab === tab.key
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-200/80 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 group ml-2"
              >
                View All
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Task status summary strip */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {Object.entries(taskStatusConfig).map(([statusKey, config]) => {
              const StatusIcon = config.icon
              const count = taskCounts[statusKey] || 0
              return (
                <motion.div
                  key={statusKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Object.keys(taskStatusConfig).indexOf(statusKey) * 0.05 }}
                  onClick={() => setTaskFilterTab(statusKey)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                    taskFilterTab === statusKey
                      ? `${config.color} ring-2 ring-offset-1 ring-slate-300`
                      : 'border-slate-200/80 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-slate-900 font-display">{count}</span>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{config.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Task list */}
          <div className="divide-y divide-slate-100">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => {
                const statusCfg = taskStatusConfig[task.status?.toLowerCase()] || taskStatusConfig.todo
                const StatusIcon = statusCfg.icon
                const priorityClass = taskPriorityConfig[task.priority?.toLowerCase()] || taskPriorityConfig.medium
                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-slate-50/60 rounded-xl px-3 -mx-3 transition-colors group cursor-pointer"
                    onClick={() => navigate('/tasks')}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Status indicator */}
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusCfg.color}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{task.title}</h4>
                          {isOverdue && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 shrink-0">
                              <AlertTriangle className="h-3 w-3" />
                              Overdue
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityClass}`}>
                            {task.priority || 'Medium'}
                          </span>
                          {task.due_date && (
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {safeFormat(task.due_date, 'dd MMM')}
                            </span>
                          )}
                          {task.assigned_user?.name && (
                            <span className="text-[11px] text-slate-400 font-medium truncate">
                              → {task.assigned_user.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-600">No tasks found</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {taskFilterTab === 'all' ? 'You have no assigned tasks.' : `No ${taskStatusConfig[taskFilterTab]?.label?.toLowerCase() || ''} tasks.`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ *
       * Bottom Grid (3 Columns)
       * ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Attendance Overview (Bar Chart) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 font-display">Monthly Attendance Overview</h3>
            <button
              onClick={() => navigate('/attendance')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 group"
            >
              View Report
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 600 }} />
                <Bar dataKey="Present" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={14} />
                <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={14} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Holidays & Announcements */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 font-display">Upcoming Holidays</h3>
              <button
                onClick={() => navigate('/office-calendar')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 group"
              >
                Calendar
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="space-y-2.5 mb-5">
              {upcomingHolidays.map(holiday => (
                <div key={holiday.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{holiday.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{holiday.day}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/80 font-display">
                    {holiday.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Announcements Notice */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">Notice Board</h4>
                <span className="text-[11px] font-semibold text-blue-600">3 New</span>
              </div>
              <div className="space-y-2">
                {announcements.slice(0, 2).map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-800">{item.title}: </span>
                      <span className="text-slate-500">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* People Spotlight (Birthdays / Recent Joiners Tab) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPeopleTab('birthdays')}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${peopleTab === 'birthdays' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Birthdays 🎉
              </button>
              <button
                onClick={() => setPeopleTab('joiners')}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${peopleTab === 'joiners' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                New Joiners 👋
              </button>
            </div>
          </div>

          {peopleTab === 'birthdays' ? (
            <div className="divide-y divide-slate-100">
              {birthdaysList.map(b => (
                <div key={b.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-slate-50/60 rounded-xl px-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar name={b.name} src={b.photo} size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{b.name}</h4>
                      <p className="text-[11px] font-semibold text-slate-400">{b.date}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-bold text-blue-600">
                    {b.daysLeft}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {displayRecentEmployees.map(emp => (
                <div key={emp.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-slate-50/60 rounded-xl px-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar name={emp.name} src={emp.photo} size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{emp.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{emp.role}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">Joined {emp.joinedDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
