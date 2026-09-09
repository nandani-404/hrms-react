import {
  LayoutDashboard,
  Users,
  Clock,
  Home,
  Calendar,
  ClipboardCheck,
  IndianRupee,
  Laptop,
  Receipt,
  CalendarDays,
  Timer,
  BadgeCheck,
  Tag,
  Boxes,
  FolderTree,
  ListChecks,
  Wallet,
  Landmark,
  Trophy,
  FileText,
  User,
  FileBadge,
  UserPlus,
  TrendingUp,
  GraduationCap,
  Settings,
  UserMinus,
} from 'lucide-react'

export const HR_ROLES = ['hr', 'super_admin', 'admin']

/**
 * The navigation is grouped by the question an HR user is actually asking
 * ("who is in today?", "what do I owe money on?") rather than by the module
 * that happens to own the screen. One flat list of 12 links is a scan; six
 * short labelled groups is a glance.
 */
export const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: HR_ROLES, hint: 'Company pulse at a glance' },
      { to: '/profile', icon: User, label: 'My Profile', roles: ['all'], hint: 'Personal and employment profile' },
      { to: '/my-attendance', icon: ClipboardCheck, label: 'My Attendance', roles: ['all'], hint: 'Your punch-ins and hours' },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/today-attendance', icon: Clock, label: "Today's Attendance", roles: HR_ROLES, hint: 'Who is present right now' },
      { to: '/employees', icon: Users, label: 'Employees', roles: HR_ROLES, hint: 'Directory and employee records' },
    ],
  },
  {
    label: 'Time & Leave',
    items: [
      { to: '/leave-management', icon: Calendar, label: 'Leave Management', roles: ['all'], hint: 'Leave applications, balances, WFH & calendar' },
      { to: '/resignation', icon: UserMinus, label: 'Resignation', roles: ['all'], hint: 'Submit and track resignation & exit workflow' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/payroll', icon: IndianRupee, label: 'Payroll', roles: HR_ROLES, hint: 'Salary runs and payslips' },
      { to: '/salary-advance', icon: Wallet, label: 'Salary Advance', roles: HR_ROLES, hint: 'Advance requests and repayment' },
      { to: '/my-salary-advance', icon: Wallet, label: 'My Salary Advance', roles: ['employee'], hint: 'Apply and track your salary advances' },
      { to: '/employee-loan', icon: Landmark, label: 'Employee Loan', roles: HR_ROLES, hint: 'Company loan management and approvals' },
      { to: '/my-loan', icon: Landmark, label: 'My Loan', roles: ['employee'], hint: 'Apply for loans and track repayments' },
      { to: '/expenses', icon: Receipt, label: 'Expenses', roles: ['all'], hint: 'Claims raised by employees' },
      { to: '/expense-approvals', icon: BadgeCheck, label: 'Reimbursement', roles: ['all'], hint: 'Approve and settle claims' },
    ],
  },
  {
    label: 'Recruitment & Performance',
    items: [
      { to: '/recruitment', icon: UserPlus, label: 'Recruitment', roles: HR_ROLES, hint: 'Job openings, candidates & recruitment funnel' },
      { to: '/offer-letter', icon: FileBadge, label: 'Offer Letter', roles: HR_ROLES, hint: 'Generate and manage candidate offer letters' },
      { to: '/performance', icon: TrendingUp, label: 'Performance', roles: ['all'], hint: 'Review cycles, goals & appraisals' },
      { to: '/training', icon: GraduationCap, label: 'Training', roles: ['all'], hint: 'Programs, enrollments & certifications' },
    ],
  },
  {
    label: 'Workplace',
    items: [
      { to: '/policies', icon: FileText, label: 'Policies', roles: HR_ROLES, hint: 'Company policy guidelines & compliance' },
      { to: '/my-policies', icon: FileText, label: 'My Policies', roles: ['employee'], hint: 'Read and acknowledge company policies' },
      { to: '/rewards-recognition', icon: Trophy, label: 'Rewards & Recognition', roles: HR_ROLES, hint: 'Manage company rewards & awards' },
      { to: '/my-rewards', icon: Trophy, label: 'My Rewards', roles: ['employee'], hint: 'Your badges, points & peer kudos' },
      { to: '/assets-management', icon: Laptop, label: 'Assets Management', roles: HR_ROLES, hint: 'Company hardware and issuance' },
      { to: '/my-assets', icon: Laptop, label: 'My Assets', roles: ['employee'], hint: 'View company hardware assigned to you' },
      { to: '/office-calendar', icon: CalendarDays, label: 'Office Calendar', roles: HR_ROLES, hint: 'Holidays and office events' },
      { to: '/settings', icon: Settings, label: 'Settings', roles: HR_ROLES, hint: 'System and company configuration' },
    ],
  },
]

/** Configuration screens (Settings menu removed). */
export const settingsGroups = []

/** Extra destinations that are reachable but not pinned in the rail. */
export const auxiliaryRoutes = [
  { to: '/attendance', label: 'Attendance Register', roles: HR_ROLES },
  { to: '/reports', label: 'Reports', roles: HR_ROLES },
  { to: '/helpdesk', label: 'Helpdesk', roles: ['all'] },
]

export const canSee = (item, role) =>
  !item.roles || item.roles.includes('all') || item.roles.includes(role)

export const visibleGroups = (role) =>
  navGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => canSee(item, role)) }))
    .filter((group) => group.items.length > 0)

/** Route path -> readable title, used by the header and browser tab. */
export const routeTitles = (() => {
  const map = {}
  navGroups.forEach((group) =>
    group.items.forEach((item) => {
      map[item.to] = { title: item.label, section: group.label }
    })
  )
  settingsGroups.forEach((group) =>
    group.items.forEach((item) => {
      map[item.to] = { title: item.label, section: `Settings · ${group.label}` }
    })
  )
  auxiliaryRoutes.forEach((item) => {
    map[item.to] = { title: item.label, section: 'More' }
  })
  map['/employee-monthly-attendance'] = { title: 'Monthly Attendance', section: 'People' }
  map['/profile'] = { title: 'Employee Profile', section: 'Overview' }
  map['/my-profile'] = { title: 'Employee Profile', section: 'Overview' }
  map['/tasks'] = { title: 'Tasks', section: 'More' }
  return map
})()

export const titleForPath = (pathname) => {
  if (routeTitles[pathname]) return routeTitles[pathname]
  const match = Object.keys(routeTitles)
    .filter((path) => pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0]
  return match ? routeTitles[match] : { title: 'TM-Manavsetu', section: '' }
}
