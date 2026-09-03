import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Users,
  TrendingUp,
  Home,
  FileText,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Mail,
  UserX,
  ArrowRight,
  Cake,
  CheckCircle2,
  ListChecks,
  Sparkles,
} from 'lucide-react'
import { format, subMonths, addMonths } from 'date-fns'
import {
  useDashboardStats,
  useAttendanceGraph,
  useRecentWfh,
  useRecentLeaves,
  useUpcomingBirthdays,
} from '../hooks/useDashboard'
import { useEmployees } from '../hooks/useEmployees'
import { useAttendance } from '../hooks/useAttendance'
import { useWfhRequests } from '../hooks/useWfhRequests'
import { useLeaveRequests } from '../hooks/useLeaveRequests'
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
} from 'recharts'
import api from '../services/api'
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Empty,
  Segmented,
  Skeleton,
  StatTile,
  StatusPill,
  cx,
} from '../components/ui'

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // showHRView checks roles or specific reporting managers to display HR elements
  const showHRView =
    user?.role === 'hr' ||
    user?.role === 'super_admin' ||
    (user?.department === 'IT' && user?.designation === 'CTO') ||
    (user?.department === 'Telecalling' && user?.designation === 'Head - Telecalling') ||
    user?.is_reporting_manager === 1

  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const selectedMonthStr = format(selectedMonth, 'yyyy-MM')

  const [isProcessingMarkAbsent, setIsProcessingMarkAbsent] = useState(false)
  const [confirmMarkAbsent, setConfirmMarkAbsent] = useState(false)
  const [markAbsentMessage, setMarkAbsentMessage] = useState('')
  const [birthdayDays, setBirthdayDays] = useState(30)

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

  // Hook calls
  const { data: stats, isLoading: statsLoading } = useDashboardStats(filterParams)
  const { data: graphData, isLoading: graphLoading } = useAttendanceGraph(selectedMonthStr, filterParams)
  const { data: recentWfh, isLoading: wfhLoading } = useRecentWfh(5, filterParams)
  const { data: recentLeaves, isLoading: leavesLoading } = useRecentLeaves(5, filterParams)
  const { data: birthdaysData, isLoading: birthdaysLoading } = useUpcomingBirthdays(birthdayDays, 10)

  const { data: employeesData } = useEmployees()
  const allEmployees = employeesData || []
  const teamMembers = getTeamMembers(allEmployees, user)

  // totalEmployeesCount:
  const totalEmployeesCount =
    user?.role !== 'super_admin' && user?.role !== 'hr'
      ? teamMembers.length
      : stats?.total_employees || 0

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const { data: attendanceData } = useAttendance({ date: todayStr })
  const { data: wfhRequestsData } = useWfhRequests(filterParams)
  const { data: leaveRequestsData } = useLeaveRequests(filterParams)

  const wfhRequests = Array.isArray(wfhRequestsData) ? wfhRequestsData : wfhRequestsData?.data || []
  const leaveRequests = Array.isArray(leaveRequestsData) ? leaveRequestsData : leaveRequestsData?.data || []
  const todayAttendance = Array.isArray(attendanceData) ? attendanceData : attendanceData?.data || []

  // Deduplicate attendance records (latest by ID for employee_id on this date)
  const latestAttendanceMap = new Map()
  todayAttendance.forEach(record => {
    const key = `${record.employee_id}-${record.date}`
    if (!latestAttendanceMap.has(key) || record.id > latestAttendanceMap.get(key).id) {
      latestAttendanceMap.set(key, record)
    }
  })

  // Filter present today:
  const presentEmployees = Array.from(latestAttendanceMap.values()).filter(record =>
    teamMembers.some(member => member.emp_id === record.employee_id) && record.attendance_status === 'present'
  ) || []

  const presentCount =
    user?.role !== 'super_admin' && user?.role !== 'hr'
      ? presentEmployees.length
      : stats?.present_today || 0

  // Filter WFH today:
  const wfhTodayCount =
    user?.role !== 'super_admin' && user?.role !== 'hr'
      ? wfhRequests.filter(req =>
          teamMembers.some(member => member.emp_id === req.employee_id) &&
          req.status === 'Approved' &&
          req.start_date <= todayStr &&
          req.end_date >= todayStr
        ).length
      : stats?.wfh_today || 0

  // Absent today:
  const absentCount =
    user?.role !== 'super_admin' && user?.role !== 'hr'
      ? totalEmployeesCount - presentEmployees.length - wfhTodayCount
      : stats?.absent_today || 0

  // Pending requests:
  const pendingWfhCount = wfhRequests.filter(req => req.status === 'Pending' || req.status === 'pending').length
  const pendingLeavesCount = leaveRequests.filter(req => req.status === 'Pending' || req.status === 'pending').length

  // Filter recent requests lists if not admin/hr
  let finalRecentWfh = recentWfh || []
  let finalRecentLeaves = recentLeaves || []
  if (user?.role !== 'super_admin' && user?.role !== 'hr') {
    const teamWfh = wfhRequests
      .filter(req => teamMembers.some(member => member.emp_id === req.employee_id))
      .sort((a, b) => b.id - a.id)
      .slice(0, 5)
    if (teamWfh.length > 0 || wfhRequests.length > 0) {
      finalRecentWfh = teamWfh
    }

    const teamLeaves = leaveRequests
      .filter(req => teamMembers.some(member => member.emp_id === req.employee_id))
      .sort((a, b) => b.id - a.id)
      .slice(0, 5)
    if (teamLeaves.length > 0 || leaveRequests.length > 0) {
      finalRecentLeaves = teamLeaves
    }
  }

  // Month navigation:
  const handlePrevMonth = () => setSelectedMonth(prev => subMonths(prev, 1))
  const handleNextMonth = () => setSelectedMonth(prev => addMonths(prev, 1))
  const handleCurrentMonth = () => setSelectedMonth(new Date())

  const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')

  // Mark Absent handler
  const handleMarkAbsent = async () => {
    setConfirmMarkAbsent(false)
    setIsProcessingMarkAbsent(true)
    setMarkAbsentMessage('')
    try {
      const { data } = await api.get('/attendance/mark-absent-deadline')
      if (data.success) {
        setMarkAbsentMessage(`${data.message} — ${data.data.total_processed} employees processed`)
        setTimeout(() => setMarkAbsentMessage(''), 5000)
      } else {
        setMarkAbsentMessage('Error marking absent')
      }
    } catch {
      setMarkAbsentMessage('Failed to mark absent')
    } finally {
      setIsProcessingMarkAbsent(false)
    }
  }

  // Month summary derived from the graph series — context HR would otherwise
  // have to eyeball off the bars.
  const monthSummary = (() => {
    if (!graphData || graphData.length === 0) return null
    const daysWithData = graphData.filter(day => (day.present_count || 0) + (day.absent_count || 0) > 0)
    if (daysWithData.length === 0) return null
    const totalPresent = daysWithData.reduce((sum, day) => sum + (day.present_count || 0), 0)
    const totalAbsent = daysWithData.reduce((sum, day) => sum + (day.absent_count || 0), 0)
    const best = daysWithData.reduce((top, day) => ((day.present_count || 0) > (top.present_count || 0) ? day : top))
    return {
      avgPresent: Math.round(totalPresent / daysWithData.length),
      totalAbsent,
      workingDays: daysWithData.length,
      bestDay: best,
      rate: totalPresent + totalAbsent > 0 ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0,
    }
  })()

  const displayName = (user?.full_name || user?.name || 'there').split(' ')[0]

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ *
       * Hero — greeting, date, and the two actions HR reaches for first
       * ------------------------------------------------------------------ */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-primary-900/40 shadow-lift"
        style={{ backgroundImage: 'linear-gradient(120deg, #142338 0%, #0C1626 60%, #10203A 100%)' }}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass-400/60 to-transparent" />
        <span className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brass-400/10 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-primary-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-brass-300/80">
              <Sparkles className="h-3 w-3" />
              {format(new Date(), 'EEEE, dd MMMM yyyy')}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold leading-tight text-white md:text-[32px]">
              {greeting()}, {displayName}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-primary-100/60">
              Centralizing People, Powering Performance.
            </p>
          </div>

          {showHRView && (
            <div className="flex flex-col items-start gap-2.5 md:items-end">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => navigate('/today-attendance')}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.07] px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-white/25 hover:bg-white/[0.12]"
                >
                  <ListChecks className="h-4 w-4 text-brass-300" />
                  Today's Register
                </button>

                {confirmMarkAbsent ? (
                  <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 p-1 pl-3">
                    <span className="text-xs text-red-100">Mark all non-punched as absent?</span>
                    <button
                      onClick={handleMarkAbsent}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmMarkAbsent(false)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary-100/70 transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmMarkAbsent(true)}
                    disabled={isProcessingMarkAbsent}
                    className="inline-flex items-center gap-2 rounded-lg border border-brass-400/30 bg-gradient-to-b from-brass-300 to-brass-500 px-4 py-2.5 text-sm font-semibold text-primary-950 shadow-sm transition-all hover:from-brass-400 hover:to-brass-600 disabled:opacity-60"
                  >
                    <UserX className="h-4 w-4" />
                    {isProcessingMarkAbsent ? 'Processing…' : 'Mark Absent'}
                  </button>
                )}
              </div>

              {markAbsentMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-green-300"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {markAbsentMessage}
                </motion.p>
              )}
            </div>
          )}
        </div>
      </motion.section>

      {showHRView && (
        <>
          {/* ---------------------------------------------------------- *
           * Key figures
           * ---------------------------------------------------------- */}
          <section>
            <div className="mb-3 flex items-center gap-3">
              <p className="eyebrow">Today at a glance</p>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {statsLoading ? (
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-[124px] rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
                <StatTile
                  index={0}
                  icon={Users}
                  label="Total Employees"
                  value={totalEmployeesCount}
                  caption="On the active roster"
                  accent="ink"
                  onClick={() => navigate('/employees')}
                />
                <StatTile
                  index={1}
                  icon={TrendingUp}
                  label="Today's Attendance"
                  value={presentCount}
                  secondValue={absentCount}
                  caption="Present / Absent"
                  accent="green"
                  onClick={() => navigate('/today-attendance')}
                />
                <StatTile
                  index={2}
                  icon={Home}
                  label="WFH Pending"
                  value={pendingWfhCount}
                  caption={pendingWfhCount ? 'Awaiting your decision' : 'Nothing waiting'}
                  accent="ink"
                  onClick={() => navigate('/wfh-requests', { state: { filterStatus: 'Pending' } })}
                />
                <StatTile
                  index={3}
                  icon={FileText}
                  label="Leave Pending"
                  value={pendingLeavesCount}
                  caption={pendingLeavesCount ? 'Awaiting your decision' : 'Nothing waiting'}
                  accent="purple"
                  onClick={() => navigate('/leave-requests', { state: { filterStatus: 'Pending' } })}
                />
                <StatTile
                  index={4}
                  icon={Clock}
                  label="Short Leave Today"
                  value={stats?.short_leave_today || 0}
                  caption="Part-day permissions"
                  accent="orange"
                  onClick={() => navigate('/short-leave')}
                />
              </div>
            )}
          </section>

          {/* ---------------------------------------------------------- *
           * Attendance chart
           * ---------------------------------------------------------- */}
          <Card>
            <CardHeader
              icon={Calendar}
              title="Daily Attendance Overview"
              subtitle="Employee presence, day by day"
              action={
                <div className="flex items-center gap-1.5">
                  {!isCurrentMonth && (
                    <button
                      onClick={handleCurrentMonth}
                      className="mr-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50"
                    >
                      Today
                    </button>
                  )}
                  <button
                    onClick={handlePrevMonth}
                    className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 shadow-xs transition-colors hover:bg-gray-50 hover:text-gray-900"
                    title="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-[126px] rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-center text-sm font-medium text-gray-800 shadow-xs">
                    {format(selectedMonth, 'MMMM yyyy')}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    disabled={isCurrentMonth}
                    className={cx(
                      'rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 shadow-xs transition-colors',
                      isCurrentMonth ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-50 hover:text-gray-900'
                    )}
                    title="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              }
            />

            {/* Month summary strip */}
            {monthSummary && !graphLoading && (
              <div className="mt-5 grid grid-cols-2 gap-px border-y border-gray-200 bg-gray-200 md:grid-cols-4">
                {[
                  { label: 'Avg. present', value: monthSummary.avgPresent, sub: 'per working day' },
                  { label: 'Attendance rate', value: `${monthSummary.rate}%`, sub: 'across the month' },
                  { label: 'Working days', value: monthSummary.workingDays, sub: 'with records' },
                  {
                    label: 'Strongest day',
                    value: monthSummary.bestDay?.present_count ?? 0,
                    sub: monthSummary.bestDay?.date ? format(new Date(monthSummary.bestDay.date), 'dd MMM') : '—',
                  },
                ].map(item => (
                  <div key={item.label} className="bg-white px-5 py-3.5">
                    <p className="text-[10px] uppercase tracking-eyebrow text-gray-400">{item.label}</p>
                    <p className="numeral mt-1 text-xl font-semibold text-gray-900">{item.value}</p>
                    <p className="text-[11px] text-gray-500">{item.sub}</p>
                  </div>
                ))}
              </div>
            )}

            <CardBody className={monthSummary && !graphLoading ? 'pt-5' : ''}>
              {graphLoading ? (
                <div className="flex h-80 items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-[3px] border-gray-200 border-t-brass-500" />
                    <p className="text-sm text-gray-500">Loading attendance data…</p>
                  </div>
                </div>
              ) : graphData && graphData.length > 0 ? (
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={graphData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }} barCategoryGap="22%">
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2F8256" />
                        <stop offset="100%" stopColor="#226845" />
                      </linearGradient>
                      <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C4453C" />
                        <stop offset="100%" stopColor="#A83128" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 6" stroke="#E6E3DB" vertical={false} />
                    <XAxis
                      dataKey="day"
                      type="number"
                      domain={[0.5, graphData.length + 0.5]}
                      ticks={graphData.map(d => d.day)}
                      tick={{ fontSize: 11, fill: '#7B7568' }}
                      interval={0}
                      height={44}
                      tickLine={false}
                      axisLine={{ stroke: '#E6E3DB' }}
                      label={{
                        value: 'Date of month',
                        position: 'insideBottom',
                        offset: -2,
                        style: { fontSize: 11, fill: '#A8A296', letterSpacing: '0.08em', textTransform: 'uppercase' },
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#7B7568' }}
                      allowDecimals={false}
                      domain={[0, 'auto']}
                      tickLine={false}
                      axisLine={false}
                      width={44}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(44, 78, 126, 0.05)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl">
                              <p className="mb-2.5 font-display text-sm font-semibold text-gray-900">
                                {format(new Date(data.date), 'EEEE, dd MMM yyyy')}
                              </p>
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-6">
                                  <span className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="h-2 w-2 rounded-full bg-green-600" />
                                    Present
                                  </span>
                                  <span className="numeral text-sm font-semibold text-green-700">
                                    {data.present_count || 0}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-6">
                                  <span className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="h-2 w-2 rounded-full bg-red-600" />
                                    Absent
                                  </span>
                                  <span className="numeral text-sm font-semibold text-red-700">
                                    {data.absent_count || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
                      iconType="circle"
                      iconSize={8}
                      formatter={value => <span style={{ color: '#5B564B' }}>{value}</span>}
                    />
                    <Bar
                      dataKey="present_count"
                      fill="url(#colorPresent)"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={26}
                      animationDuration={700}
                      name="Present"
                    />
                    <Bar
                      dataKey="absent_count"
                      fill="url(#colorAbsent)"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={26}
                      animationDuration={700}
                      name="Absent"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty
                  icon={Calendar}
                  title="No attendance recorded"
                  description={`Nothing has been logged for ${format(selectedMonth, 'MMMM yyyy')} yet.`}
                />
              )}
            </CardBody>
          </Card>

          {/* ---------------------------------------------------------- *
           * Birthdays
           * ---------------------------------------------------------- */}
          <Card>
            <CardHeader
              icon={Cake}
              title="Upcoming Birthdays"
              subtitle={
                birthdaysData?.period
                  ? `${format(new Date(birthdaysData.period.start_date), 'dd MMM')} – ${format(
                      new Date(birthdaysData.period.end_date),
                      'dd MMM yyyy'
                    )}`
                  : 'A little goodwill goes a long way'
              }
              action={
                <Segmented
                  value={birthdayDays}
                  onChange={setBirthdayDays}
                  options={[
                    { value: 1, label: 'Today' },
                    { value: 30, label: '30 days' },
                    { value: 60, label: '60 days' },
                    { value: 90, label: '90 days' },
                  ]}
                />
              }
            />

            <CardBody>
              {birthdaysLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              ) : birthdaysData?.birthdays && birthdaysData.birthdays.length > 0 ? (
                <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200">
                  {birthdaysData.birthdays.map(birthday => (
                    <li
                      key={birthday.emp_id}
                      className="group flex flex-wrap items-center gap-4 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50"
                    >
                      <Avatar name={birthday.full_name} src={birthday.photo_path} size="md" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{birthday.full_name}</p>
                        <p className="truncate text-xs text-gray-500">{birthday.designation}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          Turning <span className="font-semibold text-gray-800">{birthday.age_on_birthday}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="numeral text-sm font-semibold text-gray-900">
                            {format(new Date(birthday.birthday_date), 'dd MMM')}
                          </p>
                          <p className="text-[11px] text-gray-500">{birthday.birthday_day}</p>
                        </div>

                        <Badge tone={birthday.days_until_birthday === 0 ? 'brass' : 'info'}>
                          {birthday.days_until_birthday === 0
                            ? 'Today'
                            : `${birthday.days_until_birthday} days`}
                        </Badge>

                        <div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                          <a
                            href={`https://wa.me/${String(birthday.mobile || '').replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-gray-200 p-2 text-green-700 transition-colors hover:border-green-200 hover:bg-green-50"
                            title="Send a WhatsApp wish"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                          <a
                            href={`mailto:${birthday.email}?subject=Happy%20Birthday!&body=Hi%20${birthday.full_name},%0D%0A%0D%0AWishing%20you%20a%20very%20happy%20birthday!%20🎉%0D%0A%0D%0ABest%20wishes`}
                            className="rounded-lg border border-gray-200 p-2 text-primary-700 transition-colors hover:border-primary-200 hover:bg-primary-50"
                            title="Send an email wish"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty
                  icon={Cake}
                  title="No birthdays coming up"
                  description={`Nobody is celebrating in the next ${birthdayDays} days.`}
                />
              )}
            </CardBody>
          </Card>

          {/* ---------------------------------------------------------- *
           * Recent requests
           * ---------------------------------------------------------- */}
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            <RequestPanel
              icon={Home}
              title="Recent WFH Requests"
              subtitle="Latest five submissions"
              loading={wfhLoading}
              requests={finalRecentWfh}
              emptyText="No work-from-home requests yet"
              onViewAll={() => navigate('/wfh-requests')}
              renderMeta={request =>
                `${format(new Date(request.start_date), 'dd MMM')} – ${format(new Date(request.end_date), 'dd MMM yyyy')}`
              }
            />
            <RequestPanel
              icon={FileText}
              title="Recent Leave Requests"
              subtitle="Latest five submissions"
              loading={leavesLoading}
              requests={finalRecentLeaves}
              emptyText="No leave requests yet"
              onViewAll={() => navigate('/leave-requests')}
              renderMeta={request =>
                `${request.leave_type} · ${format(new Date(request.start_date), 'dd MMM')} – ${format(
                  new Date(request.end_date),
                  'dd MMM yyyy'
                )}`
              }
            />
          </div>
        </>
      )}
    </div>
  )
}

/** Shared shell for the two "recent requests" panels. */
const RequestPanel = ({ icon, title, subtitle, loading, requests, emptyText, onViewAll, renderMeta }) => (
  <Card>
    <CardHeader
      icon={icon}
      title={title}
      subtitle={subtitle}
      action={
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      }
    />
    <CardBody>
      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : requests && requests.length > 0 ? (
        <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200">
          {requests.map(request => (
            <li
              key={request.id}
              onClick={onViewAll}
              className="flex cursor-pointer items-center gap-3 bg-white px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <Avatar name={request.employee?.full_name || 'Unknown'} src={request.employee?.photo_path} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {request.employee?.full_name || 'Unknown'}
                </p>
                <p className="truncate text-xs text-gray-500">{renderMeta(request)}</p>
              </div>
              <StatusPill status={request.status} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={icon} title={emptyText} description="New submissions will appear here." />
      )}
    </CardBody>
  </Card>
)

export default Dashboard
