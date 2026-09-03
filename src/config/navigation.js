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
      { to: '/wfh-requests', icon: Home, label: 'WFH Requests', roles: ['all'], hint: 'Work-from-home approvals' },
      { to: '/leave-requests', icon: Calendar, label: 'Leave Requests', roles: ['all'], hint: 'Leave applications and balances' },
      { to: '/short-leave', icon: Timer, label: 'Short Leave', roles: HR_ROLES, hint: 'Part-day permissions' },
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
    label: 'Recruitment',
    items: [
      { to: '/offer-letter', icon: FileBadge, label: 'Offer Letter', roles: HR_ROLES, hint: 'Generate and manage candidate offer letters' },
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
    ],
  },
]

/** Configuration screens, tucked behind the Settings disclosure. */
export const settingsGroups = [
  {
    label: 'Assets',
    icon: Laptop,
    items: [
      { to: '/assets-category', icon: FolderTree, label: 'Asset Categories' },
      { to: '/assets-sub-category', icon: Boxes, label: 'Asset Items' },
    ],
  },
  {
    label: 'Expenses',
    icon: Receipt,
    items: [
      { to: '/expense-category', icon: Tag, label: 'Expense Categories' },
      { to: '/expense-sub-category', icon: ListChecks, label: 'Expense Items' },
    ],
  },
]

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
