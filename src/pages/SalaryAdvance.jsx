import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Download,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Wallet,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  TrendingUp,
  CreditCard,
  BarChart3,
  Check,
  UserCheck,
  Users,
  Building2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar, cx } from '../components/ui'

const statusConfig = {
  Approved: { bg: 'bg-emerald-50/90', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  Pending:  { bg: 'bg-amber-50/90',   text: 'text-amber-700',   border: 'border-amber-300',   dot: 'bg-amber-500'  },
  Rejected: { bg: 'bg-rose-50/90',    text: 'text-rose-700',    border: 'border-rose-300',    dot: 'bg-rose-500'   },
}

function LocalStatusPill({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border', cfg.bg, cfg.text, cfg.border)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', cfg.dot)} />
      {status}
    </span>
  )
}

function InteractiveAdvanceSummaryCard({ requests = [] }) {
  const [activeHover, setActiveHover] = useState(null)
  const [viewFormat, setViewFormat] = useState('donut') // 'donut' | 'bar'

  // Dynamic calculations based on live requests
  const approvedReqs = requests.filter(r => r.status === 'Approved')
  const pendingReqs = requests.filter(r => r.status === 'Pending')
  const rejectedReqs = requests.filter(r => r.status === 'Rejected')

  const approvedSum = approvedReqs.reduce((acc, r) => acc + (r.amount || 0), 0)
  const pendingSum = pendingReqs.reduce((acc, r) => acc + (r.amount || 0), 0)
  const rejectedSum = rejectedReqs.reduce((acc, r) => acc + (r.amount || 0), 0)
  const totalSum = (approvedSum + pendingSum + rejectedSum) || 1

  const approvedPct = Math.round((approvedSum / totalSum) * 100) || 0
  const pendingPct = Math.round((pendingSum / totalSum) * 100) || 0
  const rejectedPct = Math.max(0, 100 - approvedPct - pendingPct)

  const items = [
    {
      label: 'Approved',
      value: approvedSum,
      formatted: `₹${approvedSum.toLocaleString('en-IN')}`,
      pct: approvedPct,
      count: `${approvedReqs.length} ${approvedReqs.length === 1 ? 'Request' : 'Requests'}`,
      color: '#10b981',
      bgCls: 'bg-emerald-500',
      borderCls: 'border-emerald-500',
      textCls: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      label: 'Pending',
      value: pendingSum,
      formatted: `₹${pendingSum.toLocaleString('en-IN')}`,
      pct: pendingPct,
      count: `${pendingReqs.length} ${pendingReqs.length === 1 ? 'Request' : 'Requests'}`,
      color: '#f59e0b',
      bgCls: 'bg-amber-400',
      borderCls: 'border-amber-400',
      textCls: 'text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      label: 'Rejected',
      value: rejectedSum,
      formatted: `₹${rejectedSum.toLocaleString('en-IN')}`,
      pct: rejectedPct,
      count: `${rejectedReqs.length} ${rejectedReqs.length === 1 ? 'Request' : 'Requests'}`,
      color: '#ef4444',
      bgCls: 'bg-rose-500',
      borderCls: 'border-rose-400',
      textCls: 'text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    },
  ]

  const activeItem = items.find((i) => i.label === activeHover)

  // Circumference = 2 * PI * 46 ≈ 289.02
  const C = 289.02
  const approvedDash = (approvedPct / 100) * C
  const pendingDash = (pendingPct / 100) * C
  const rejectedDash = (rejectedPct / 100) * C

  return (
    <div className="rounded border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-colors">
      {/* Header with View Format Toggle */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded bg-slate-900 text-white">
            <BarChart3 className="h-4 w-4" />
          </span>
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Advance Summary</h3>
        </div>

        {/* Donut vs Bar View Switcher */}
        <div className="inline-flex rounded border border-gray-200 p-0.5 bg-gray-50">
          <button
            onClick={() => setViewFormat('donut')}
            className={cx(
              'px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded transition-all',
              viewFormat === 'donut' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-400 hover:text-gray-700'
            )}
          >
            Donut
          </button>
          <button
            onClick={() => setViewFormat('bar')}
            className={cx(
              'px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded transition-all',
              viewFormat === 'bar' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-400 hover:text-gray-700'
            )}
          >
            Bars
          </button>
        </div>
      </div>

      {/* Visual Representation */}
      {viewFormat === 'donut' ? (
        <div className="flex items-center justify-center my-3">
          <div className="relative flex items-center justify-center cursor-pointer">
            <svg className="w-40 h-40 -rotate-90 transition-transform duration-200" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle cx="60" cy="60" r="46" stroke="#f3f4f6" strokeWidth="13" fill="none" />
              
              {/* Approved segment */}
              {approvedPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#10b981"
                  strokeWidth={activeHover === 'Approved' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${approvedDash} ${C}`}
                  strokeDashoffset="0"
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Approved' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Approved')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}

              {/* Pending segment */}
              {pendingPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#f59e0b"
                  strokeWidth={activeHover === 'Pending' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${pendingDash} ${C}`}
                  strokeDashoffset={`-${approvedDash}`}
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Pending' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Pending')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}

              {/* Rejected segment */}
              {rejectedPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#ef4444"
                  strokeWidth={activeHover === 'Rejected' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${rejectedDash} ${C}`}
                  strokeDashoffset={`-${approvedDash + pendingDash}`}
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Rejected' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Rejected')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}
            </svg>

            {/* Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
              <AnimatePresence mode="wait">
                {activeItem ? (
                  <motion.div
                    key={activeItem.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                  >
                    <p className={cx('text-base font-extrabold leading-none', activeItem.textCls)}>{activeItem.formatted}</p>
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mt-1.5">{activeItem.label}</p>
                    <p className="text-xs text-gray-500 font-medium">{activeItem.pct}% ({activeItem.count})</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="total"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                  >
                    <p className="text-lg font-extrabold text-gray-950 leading-none">₹{totalSum.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1.5">Total Advance</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* Bar Progress Representation */
        <div className="my-4 space-y-3.5">
          {items.map((item) => (
            <div
              key={item.label}
              onMouseEnter={() => setActiveHover(item.label)}
              onMouseLeave={() => setActiveHover(null)}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">{item.label}</span>
                <span className="font-bold text-gray-950">{item.formatted} ({item.pct}%)</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cx('h-full transition-all duration-200 rounded-full', item.bgCls)}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend Items */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        {items.map((item) => {
          const isHovered = activeHover === item.label
          return (
            <div
              key={item.label}
              onMouseEnter={() => setActiveHover(item.label)}
              onMouseLeave={() => setActiveHover(null)}
              onClick={() => toast.info(`Filter applied: ${item.label} Advance Requests (${item.formatted})`)}
              className={cx(
                'flex items-center justify-between px-3.5 py-2.5 rounded border transition-colors duration-150 cursor-pointer bg-white',
                isHovered ? 'border-gray-400 bg-gray-50/80' : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cx('h-2.5 w-2.5 rounded-sm shrink-0', item.bgCls)} />
                <span className="text-xs font-semibold text-gray-800">{item.label}</span>
                <span className="text-xs text-gray-400">({item.count})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-950">{item.formatted}</span>
                <span className={cx('text-xs font-semibold', item.textCls)}>
                  ({item.pct}%)
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Company-wide Employee Advance Requests for HR Portal
const initialRequests = [
  {
    id: 'ADV-2024-007',
    date: '18 Aug 2026',
    amount: 15000,
    reason: 'Medical Emergency',
    status: 'Pending',
    employee: {
      name: 'Rohan Mehra',
      dept: 'Engineering',
      empId: 'EMP-1042',
      avatar: '/storage/avatars/amit.jpg',
    },
    approvedBy: null,
    tenure: '3 Months',
    emi: 5000,
  },
  {
    id: 'ADV-2024-006',
    date: '18 Aug 2026',
    amount: 15000,
    reason: 'Vehicle Repair',
    status: 'Pending',
    employee: {
      name: 'Pooja Sharma',
      dept: 'Marketing',
      empId: 'EMP-1018',
      avatar: '/storage/avatars/neha.jpg',
    },
    approvedBy: null,
    tenure: '3 Months',
    emi: 5000,
  },
  {
    id: 'ADV-2024-002',
    date: '10 Apr 2024',
    amount: 20000,
    reason: 'Home Renovation',
    status: 'Pending',
    employee: {
      name: 'Vikas Gupta',
      dept: 'Product',
      empId: 'EMP-1025',
      avatar: '/storage/avatars/amit.jpg',
    },
    approvedBy: null,
    tenure: '4 Months',
    emi: 5000,
  },
  {
    id: 'ADV-2024-001',
    date: '20 May 2024',
    amount: 15000,
    reason: 'Medical Emergency',
    status: 'Approved',
    employee: {
      name: 'Aakash Verma',
      dept: 'Sales',
      empId: 'EMP-1033',
      avatar: '/storage/avatars/amit.jpg',
    },
    approvedBy: {
      name: 'Amit Kumar',
      role: 'HR',
      avatar: '/storage/avatars/amit.jpg',
    },
    tenure: '3 Months',
    emi: 5000,
  },
  {
    id: 'ADV-2024-008',
    date: '18 Aug 2026',
    amount: 25000,
    reason: 'Education',
    status: 'Approved',
    employee: {
      name: 'Sunita Rao',
      dept: 'Operations',
      empId: 'EMP-1012',
      avatar: '/storage/avatars/neha.jpg',
    },
    approvedBy: {
      name: 'Diksha Rajvansh',
      role: 'HR',
      avatar: '/storage/avatars/neha.jpg',
    },
    tenure: '5 Months',
    emi: 5000,
  },
  {
    id: 'ADV-2024-003',
    date: '02 Mar 2024',
    amount: 20000,
    reason: 'Personal Requirement',
    status: 'Rejected',
    employee: {
      name: 'Karan Singh',
      dept: 'Engineering',
      empId: 'EMP-1065',
      avatar: '/storage/avatars/amit.jpg',
    },
    approvedBy: {
      name: 'Amit Kumar',
      role: 'HR',
      avatar: '/storage/avatars/amit.jpg',
    },
    tenure: '4 Months',
    emi: 5000,
  },
  {
    id: 'ADV-2024-004',
    date: '25 Feb 2024',
    amount: 10000,
    reason: 'Travel',
    status: 'Rejected',
    employee: {
      name: 'Neha Patel',
      dept: 'Design',
      empId: 'EMP-1088',
      avatar: '/storage/avatars/neha.jpg',
    },
    approvedBy: {
      name: 'Amit Kumar',
      role: 'HR',
      avatar: '/storage/avatars/amit.jpg',
    },
    tenure: '2 Months',
    emi: 5000,
  },
  {
    id: 'ADV-2024-005',
    date: '15 Jan 2024',
    amount: 10000,
    reason: 'Other',
    status: 'Approved',
    employee: {
      name: 'Manish Joshi',
      dept: 'Finance',
      empId: 'EMP-1019',
      avatar: '/storage/avatars/amit.jpg',
    },
    approvedBy: {
      name: 'Neha Verma',
      role: 'HR',
      avatar: '/storage/avatars/neha.jpg',
    },
    tenure: '2 Months',
    emi: 5000,
  },
]

const recentTransactions = [
  {
    date: '18 Aug 2026',
    description: 'Advance Disbursed (Sunita Rao)',
    amount: 25000,
    type: 'Credit',
    status: 'Disbursed',
  },
  {
    date: '20 May 2024',
    description: 'Advance Disbursed (Aakash Verma)',
    amount: 15000,
    type: 'Credit',
    status: 'Disbursed',
  },
  {
    date: '05 May 2024',
    description: 'EMI Recovery (Payroll Direct)',
    amount: 15000,
    type: 'Debit',
    status: 'Recovered',
  },
  {
    date: '05 Apr 2024',
    description: 'EMI Recovery (Payroll Direct)',
    amount: 15000,
    type: 'Debit',
    status: 'Recovered',
  },
]

const approvalSteps = [
  {
    step: 1,
    title: 'Employee Application',
    desc: 'Employee submits advance request with reason and tenure.',
    completed: true,
  },
  {
    step: 2,
    title: 'Manager Verification',
    desc: 'Reporting manager reviews attendance & active performance.',
    completed: true,
  },
  {
    step: 3,
    title: 'HR Compliance Check',
    desc: 'HR verifies 80% salary cap, past repayment, and approves/rejects.',
    completed: true,
  },
  {
    step: 4,
    title: 'Finance Disbursal',
    desc: 'Finance desk schedules direct transfer to salary bank account.',
    completed: false,
  },
  {
    step: 5,
    title: 'Payroll EMI Deduction',
    desc: 'Automatic monthly payroll recovery via salary credit.',
    completed: false,
  },
]

export default function SalaryAdvance() {
  const { user } = useAuth()
  const [requests, setRequests] = useState(initialRequests)
  const [activeTab, setActiveTab] = useState('All Employee Requests')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  // Modal states
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Dynamic HR KPI calculations
  const approvedRequests = requests.filter(r => r.status === 'Approved')
  const pendingRequestsList = requests.filter(r => r.status === 'Pending')
  const rejectedRequests = requests.filter(r => r.status === 'Rejected')

  const approvedSum = approvedRequests.reduce((acc, r) => acc + (r.amount || 0), 0)
  const pendingSum = pendingRequestsList.reduce((acc, r) => acc + (r.amount || 0), 0)
  const rejectedSum = rejectedRequests.reduce((acc, r) => acc + (r.amount || 0), 0)
  
  const approvedCount = approvedRequests.length
  const pendingCount = pendingRequestsList.length
  const rejectedCount = rejectedRequests.length

  const avgAdvance = requests.length > 0 ? Math.round((approvedSum + pendingSum) / (approvedCount + pendingCount || 1)) : 0
  const activeRecoverySum = approvedRequests.reduce((acc, r) => acc + (r.emi || 0), 0)

  const filteredRequests = requests.filter((req) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      req.id.toLowerCase().includes(query) ||
      req.reason.toLowerCase().includes(query) ||
      (req.employee?.name && req.employee.name.toLowerCase().includes(query)) ||
      (req.employee?.dept && req.employee.dept.toLowerCase().includes(query)) ||
      (req.employee?.empId && req.employee.empId.toLowerCase().includes(query))
    
    if (activeTab === 'Pending Approvals') {
      return matchesSearch && req.status === 'Pending'
    }
    if (activeTab === 'Approved Advances') {
      return matchesSearch && req.status === 'Approved'
    }
    if (activeTab === 'Rejected Requests') {
      return matchesSearch && req.status === 'Rejected'
    }

    const matchesStatus = statusFilter === 'All' || req.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedRequests = filteredRequests.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleApproveRequest = (reqId) => {
    const approverName = user?.full_name || 'Diksha Rajvansh'
    const approverAvatar = user?.profile_photo || '/storage/avatars/neha.jpg'
    setRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'Approved',
          approvedBy: { name: approverName, role: 'HR', avatar: approverAvatar }
        }
      }
      return r
    }))
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest(prev => ({
        ...prev,
        status: 'Approved',
        approvedBy: { name: approverName, role: 'HR', avatar: approverAvatar }
      }))
    }
    toast.success(`Advance request ${reqId} approved successfully by HR!`)
  }

  const handleRejectRequest = (reqId) => {
    const approverName = user?.full_name || 'Diksha Rajvansh'
    const approverAvatar = user?.profile_photo || '/storage/avatars/neha.jpg'
    setRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'Rejected',
          approvedBy: { name: approverName, role: 'HR', avatar: approverAvatar }
        }
      }
      return r
    }))
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest(prev => ({
        ...prev,
        status: 'Rejected',
        approvedBy: { name: approverName, role: 'HR', avatar: approverAvatar }
      }))
    }
    toast.error(`Advance request ${reqId} rejected by HR.`)
  }

  const handleDownloadSlip = (req) => {
    toast.success(`Downloading advance approval slip for ${req.employee?.name || req.id}`)
  }

  const handleExportReport = () => {
    toast.success('Exporting Company Advance Report (Excel/CSV)...')
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
            <span className="hover:text-gray-800 cursor-pointer">Home</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="hover:text-gray-800 cursor-pointer">Finance & Payroll</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-800 font-semibold">Salary Advance Management</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-950">Salary Advance Management</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              HR Portal
            </span>
          </div>
          <p className="mt-1.5 text-sm text-gray-500">Manage employee advance applications, verify eligibility criteria, and process HR decisions.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPolicyModalOpen(true)}
            className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-gray-600" />
            Advance Policy
          </button>
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 rounded bg-gray-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            <Download className="h-4 w-4" />
            Export Advance Sheet
          </button>
        </div>
      </div>

      {/* ── Top 4 Clean HR KPI Cards (Company-Wide Metrics) ── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Advance Disbursed',
            value: `₹${approvedSum.toLocaleString('en-IN')}`,
            sub: `${approvedCount} Approved Requests YTD`,
            icon: <Wallet className="h-4 w-4" />,
            iconBg: 'bg-slate-900 text-white',
            badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
            tab: 'Approved Advances',
          },
          {
            label: 'Pending HR Review',
            value: `₹${pendingSum.toLocaleString('en-IN')}`,
            sub: `${pendingCount} Awaiting Decision`,
            icon: <Clock className="h-4 w-4" />,
            iconBg: 'bg-amber-500 text-white',
            badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
            tab: 'Pending Approvals',
          },
          {
            label: 'Total Requests Processed',
            value: `${requests.length} Requests`,
            sub: `${approvedCount} Done · ${rejectedCount} Rejected`,
            icon: <Users className="h-4 w-4" />,
            iconBg: 'bg-emerald-600 text-white',
            badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            tab: 'All Employee Requests',
          },
          {
            label: 'Active Monthly Recovery',
            value: `₹${activeRecoverySum.toLocaleString('en-IN')}`,
            sub: `Across ${approvedCount} Active Plans`,
            icon: <CreditCard className="h-4 w-4" />,
            iconBg: 'bg-blue-600 text-white',
            badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
            tab: 'Disbursal & Repayment Ledger',
          },
        ].map((card) => (
          <div
            key={card.label}
            onClick={() => {
              if (card.tab) {
                setActiveTab(card.tab)
                setCurrentPage(1)
              }
            }}
            className={cx(
              'flex flex-col justify-between rounded-lg border p-3.5 min-h-[110px] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer transition-all duration-150 group bg-white',
              activeTab === card.tab ? 'border-gray-950 ring-1 ring-gray-950/15' : 'border-gray-200 hover:border-gray-300'
            )}
          >
            {/* Top row: Label + Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-700 transition-colors">
                {card.label}
              </span>
              <span className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-transform group-hover:scale-105', card.iconBg)}>
                {card.icon}
              </span>
            </div>

            {/* Middle: Prominent Value */}
            <div className="my-1">
              <h2 className="text-xl sm:text-[22px] font-bold text-gray-950 tracking-tight leading-tight">
                {card.value}
              </h2>
            </div>

            {/* Bottom: Context Pill */}
            <div className="flex items-center">
              <span className={cx('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border leading-normal', card.badgeBg)}>
                <span className="h-1 w-1 rounded-full bg-current opacity-70" />
                {card.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4 overflow-x-auto">
          {['All Employee Requests', 'Pending Approvals', 'Approved Advances', 'Rejected Requests', 'Disbursal & Repayment Ledger', 'Policy Guidelines'].map((tab) => {
            let badge = null
            if (tab === 'Pending Approvals' && pendingCount > 0) {
              badge = <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">{pendingCount}</span>
            } else if (tab === 'All Employee Requests') {
              badge = <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">{requests.length}</span>
            }
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setCurrentPage(1)
                }}
                className={cx(
                  'whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center gap-2',
                  activeTab === tab
                    ? 'border-gray-950 text-gray-950'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                )}
              >
                {tab}
                {badge}
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Tab Content: Requests Management (Full Width Clean Layout) ── */}
      {(activeTab === 'All Employee Requests' || activeTab === 'Pending Approvals' || activeTab === 'Approved Advances' || activeTab === 'Rejected Requests') && (
        <>
          {/* HR Action Banner when in Pending Approvals */}
          {activeTab === 'Pending Approvals' && (
            <div className="rounded-lg border border-amber-300 bg-amber-50/80 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white font-bold shadow-xs">
                  <UserCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-amber-950">Pending Advance Applications Awaiting HR Action</h3>
                  <p className="text-xs text-amber-800">Review employee eligibility and click Approve or Reject to process the request directly.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-white px-3 py-1.5 rounded border border-amber-200 shadow-xs">
                {pendingCount} Pending Decisions Required
              </span>
            </div>
          )}

          {/* ── Main Full-Width Table Card ── */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-xs overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50/60">
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  {activeTab === 'Pending Approvals' ? 'Pending Requests Awaiting Decision' :
                   activeTab === 'Approved Advances' ? 'Approved Advance Disbursals' :
                   activeTab === 'Rejected Requests' ? 'Rejected Applications' : 'All Employee Advance Requests'}
                </h2>
                <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-bold text-gray-700">
                  {filteredRequests.length}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employee, dept, ID..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-64 rounded-md border border-gray-300 bg-white pl-9 pr-8 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-gray-600 focus:outline-none shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {activeTab === 'All Employee Requests' && (
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-gray-600 focus:outline-none shadow-2xs"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50/80 text-gray-500">
                  <tr>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Request ID</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Employee</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Date</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Amount</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Reason</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Approved By</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {req.id}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar name={req.employee?.name || 'Employee'} src={req.employee?.avatar} size="xs" />
                          <div>
                            <p className="text-xs font-bold text-gray-900 leading-none">{req.employee?.name || 'Employee'}</p>
                            <p className="text-[11px] text-gray-500 mt-1">{req.employee?.dept} · {req.employee?.empId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 whitespace-nowrap text-xs">{req.date}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-extrabold text-gray-950 text-sm">₹{req.amount.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-700 text-xs whitespace-nowrap">{req.reason}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <LocalStatusPill status={req.status} />
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {req.approvedBy ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={req.approvedBy.name} src={req.approvedBy.avatar} size="xs" />
                            <div>
                              <p className="text-xs font-semibold text-gray-900 leading-none">{req.approvedBy.name}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5">{req.approvedBy.role}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs pl-2">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* For Pending: Clean, Spacious Approve & Reject Buttons */}
                          {req.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleApproveRequest(req.id)}
                                title="HR Action: Approve Advance Request"
                                className="inline-flex h-8 px-3.5 items-center justify-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                              >
                                <Check className="h-3.5 w-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(req.id)}
                                title="HR Action: Reject Advance Request"
                                className="inline-flex h-8 px-3.5 items-center justify-center gap-1.5 rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold shadow-xs active:scale-95 transition-all"
                              >
                                <X className="h-3.5 w-3.5" /> Reject
                              </button>
                            </>
                          ) : (
                            /* After Approve or Reject: show Eye (View) and Download (if Approved) */
                            <>
                              <button
                                onClick={() => setSelectedRequest(req)}
                                title="View Details"
                                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-950 transition-all shadow-2xs"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {req.status === 'Approved' ? (
                                <button
                                  onClick={() => handleDownloadSlip(req)}
                                  title="Download Slip"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-2xs"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              ) : (
                                <span className="inline-block h-8 w-8 shrink-0" />
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan="8" className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          {activeTab === 'Pending Approvals' ? (
                            <>
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-7 w-7" />
                              </div>
                              <p className="text-sm font-bold text-gray-800">All Caught Up!</p>
                              <p className="text-xs text-gray-400 max-w-sm">There are no pending salary advance requests requiring HR decision.</p>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-9 w-9 text-gray-300" />
                              <p className="text-xs font-medium">No advance requests found</p>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {filteredRequests.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 border-t border-gray-100 bg-gray-50/60">
                <span className="text-xs text-gray-500">
                  Showing <strong className="text-gray-700 font-semibold">{(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to <strong className="text-gray-700 font-semibold">{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredRequests.length)}</strong> of <strong className="text-gray-700 font-semibold">{filteredRequests.length}</strong> requests
                </span>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={safeCurrentPage === 1}
                      title="Previous Page"
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-2xs"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cx(
                          'h-8 min-w-[32px] px-2 rounded text-xs font-bold transition-all shadow-2xs',
                          safeCurrentPage === pageNum
                            ? 'bg-gray-950 text-white'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={safeCurrentPage === totalPages}
                      title="Next Page"
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-2xs"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Bottom Row (HR Analytics & Ledgers) ── */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

            {/* 1. Interactive Advance Summary Card */}
            <InteractiveAdvanceSummaryCard requests={requests} />

            {/* 2. Company Recovery & EMI Health */}
            <div className="rounded border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
              <div>
                <div className="flex items-center justify-between mb-3.5 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-slate-900 text-white">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Payroll Recovery Health</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    100% On Schedule
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Monthly EMI Inflow',   value: `₹${activeRecoverySum.toLocaleString('en-IN')}`, sub: 'Automated salary payroll debit', icon: <Wallet className="h-4 w-4" />, accent: 'bg-gray-950 text-white', bg: 'bg-gray-50/80 border-gray-200' },
                    { label: 'Total Recovered YTD',  value: '₹30,000', sub: 'From past payroll runs', icon: <CheckCircle2 className="h-4 w-4" />, accent: 'bg-emerald-600 text-white', bg: 'bg-emerald-50/70 border-emerald-200' },
                    { label: 'Active Open Loans',    value: `${approvedCount} Employees`, sub: 'Active recovery plans', icon: <Users className="h-4 w-4" />, accent: 'bg-amber-500 text-white', bg: 'bg-amber-50/70 border-amber-200' },
                    { label: 'Next Payroll Deduction', value: '05 Sep 2026', sub: 'Next scheduled salary credit', icon: <Calendar className="h-4 w-4" />, accent: 'bg-blue-600 text-white', bg: 'bg-blue-50/70 border-blue-200', textCls: 'text-blue-700' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      onClick={() => toast.info(`${item.label}: ${item.value} (${item.sub})`)}
                      className={cx('group flex items-center gap-3.5 rounded border p-3 cursor-pointer hover:shadow-xs transition-all duration-150', item.bg)}
                    >
                      <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded transition-transform group-hover:scale-105', item.accent)}>
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider leading-none">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate">{item.sub}</p>
                        </div>
                        <span className={cx('text-sm font-bold text-gray-950 group-hover:underline', item.textCls)}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Disbursals & Deductions Log Card */}
            <div className="rounded border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
              <div>
                <div className="flex items-center justify-between mb-3.5 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-slate-900 text-white">
                      <CreditCard className="h-4 w-4" />
                    </span>
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Recent Disbursals</h3>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    Latest Activity
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {recentTransactions.map((tx, idx) => (
                    <div
                      key={idx}
                      onClick={() => toast.success(`Details: ${tx.description} of ₹${tx.amount.toLocaleString('en-IN')} on ${tx.date}`)}
                      className="flex items-center justify-between py-3 px-1 rounded hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cx(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded transition-transform group-hover:scale-110',
                          tx.type === 'Credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        )}>
                          <ArrowUpRight className={cx('h-4 w-4', tx.type === 'Debit' ? 'rotate-180' : '')} />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-900 leading-none group-hover:text-primary-800 transition-colors">{tx.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{tx.date} · via Bank NEFT</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cx('text-xs sm:text-sm font-bold', tx.type === 'Credit' ? 'text-emerald-700' : 'text-blue-700')}>
                          {tx.type === 'Credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-semibold uppercase mt-0.5">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toast.info('Exporting full company-wide disbursals ledger...')}
                className="mt-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gray-950 border-t border-gray-100 pt-3.5 transition-colors group"
              >
                View Disbursal Audit Log <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </>
      )}

      {/* ── DISBURSAL & REPAYMENT LEDGER TAB VIEW ── */}
      {activeTab === 'Disbursal & Repayment Ledger' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded border border-gray-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Total Company Disbursals</p>
              <h3 className="text-2xl font-bold text-gray-950">₹{approvedSum.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-gray-400 mt-1.5">Cumulative Across All Departments</p>
            </div>
            <div className="rounded border border-gray-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Recovered via Payroll</p>
              <h3 className="text-2xl font-bold text-emerald-700">₹30,000</h3>
              <p className="text-xs text-gray-400 mt-1.5">100% Payroll Deduction Compliance</p>
            </div>
            <div className="rounded border border-gray-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Active Monthly Recovery</p>
              <h3 className="text-2xl font-bold text-blue-700">₹{activeRecoverySum.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-gray-400 mt-1.5">Expected in Upcoming Payroll Cycle</p>
            </div>
          </div>

          {/* Full History Log Card */}
          <div className="rounded border border-gray-200 bg-white shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Company-Wide Advance Ledger</h3>
              <div className="flex items-center gap-2.5">
                <button onClick={handleExportReport} className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100">
                  <Download className="h-3.5 w-3.5" /> Export Ledger CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Request ID</th>
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Reason Category</th>
                    <th className="py-3.5 px-4">Tenure</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900 text-xs">{item.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-900">{item.employee?.name || 'Employee'}</span>
                        <span className="text-gray-400 text-[11px] block">{item.employee?.dept}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs">{item.date}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-950 text-sm">₹{item.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs">{item.reason}</td>
                      <td className="py-3.5 px-4 text-gray-500 text-xs">{item.tenure}</td>
                      <td className="py-3.5 px-4">
                        <LocalStatusPill status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.status === 'Approved' ? (
                          <button onClick={() => handleDownloadSlip(item)} className="inline-flex h-7 px-3 items-center justify-center gap-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                            <Download className="h-3.5 w-3.5 text-gray-400" /> Slip
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── POLICY GUIDELINES TAB VIEW ── */}
      {activeTab === 'Policy Guidelines' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Policy Details */}
          <div className="lg:col-span-7 rounded-lg border border-gray-200 bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-950">Organizational Salary Advance Policy</h3>
              <p className="text-xs text-gray-500 mt-1">HR Compliance Manual & Advance Disbursal Framework</p>
            </div>

            <div className="space-y-3.5 text-xs text-gray-700 leading-relaxed">
              {[
                ['1. Purpose & Eligibility', 'Salary advance is a short-term liquidity facility offered to permanent employees with at least 6 months of continuous service to meet sudden personal or medical emergencies.'],
                ['2. Advance Limits', "The maximum advance allowed is 80% of the employee's monthly basic salary, capped at ₹50,000 per application."],
                ['3. Repayment & Tenure', 'Deductions are scheduled automatically via salary payroll EMI across 2 to 6 monthly installments.'],
                ['4. HR Approval Authority', 'HR administrators must verify the employee tenure, pending dues, and reason documentation before providing final authorization.'],
                ['5. Disbursal SLA', 'Approved advances are transferred to the registered bank account via NEFT within 24 to 48 hours.'],
              ].map(([title, body]) => (
                <div key={title} className="p-4 rounded-md border border-gray-100 bg-gray-50/70">
                  <h4 className="font-bold text-gray-900 text-xs mb-1">{title}</h4>
                  <p className="text-gray-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 5-Stage Approval Workflow */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
                5-Stage Approval Workflow
              </h3>
              <div className="space-y-4">
                {approvalSteps.map((step, idx) => (
                  <div key={step.step} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <span className={cx(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors',
                        step.completed
                          ? 'bg-gray-950 text-white border-gray-950'
                          : step.step === 3
                          ? 'border-amber-500 text-amber-600 bg-amber-50'
                          : 'border-gray-200 text-gray-400 bg-white'
                      )}>
                        {step.step}
                      </span>
                      {idx < approvalSteps.length - 1 && (
                        <span className={cx('w-px my-1', step.completed ? 'bg-gray-800' : 'bg-gray-200')} style={{ minHeight: '20px' }} />
                      )}
                    </div>
                    <div className="min-w-0 pb-1">
                      <p className={cx('text-xs font-bold leading-tight', step.completed ? 'text-gray-900' : step.step === 3 ? 'text-amber-700' : 'text-gray-400')}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 leading-snug mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Compliance Metrics */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2.5">Key HR SLA Parameters</h3>
              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Interest Rate</span>
                  <span className="font-bold text-emerald-600">0% (Zero Interest)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Max Basic Salary Cap</span>
                  <span className="font-bold text-gray-900">80%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Max Annual Frequency</span>
                  <span className="font-bold text-gray-900">2 Times / Year</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Standard SLA</span>
                  <span className="font-bold text-gray-900">24–48 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Policy Modal ── */}
      <AnimatePresence>
        {isPolicyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md rounded border border-gray-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gray-700" />
                  <h3 className="text-base font-bold text-gray-950">Salary Advance Policy</h3>
                </div>
                <button onClick={() => setIsPolicyModalOpen(false)} className="rounded p-1 text-gray-400 hover:bg-gray-200 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-3.5 text-xs text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
                {[
                  ['1. Eligibility', 'Employees with at least 6 months of continuous service are eligible for salary advances.'],
                  ['2. Maximum Limit', "The maximum advance amount is capped at 80% of the employee's monthly basic salary."],
                  ['3. Repayment Tenure', 'Repayments are automatically deducted via salary EMI over a period of 2 to 6 months.'],
                  ['4. Approval Workflow', 'Requests must be approved sequentially by Reporting Manager, HR Manager, and Finance Team.'],
                  ['5. Disbursal', 'Once approved, the advance amount will be credited directly to the registered bank account within 24–48 hours.'],
                ].map(([title, body]) => (
                  <p key={title}><strong className="font-bold text-gray-900">{title}</strong> — {body}</p>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 text-right">
                <button onClick={() => setIsPolicyModalOpen(false)}
                  className="rounded bg-gray-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-gray-800 transition-colors">Got It</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Details Modal ── */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md rounded border border-gray-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div>
                  <h3 className="text-base font-bold text-gray-950">Employee Advance Details</h3>
                  <p className="text-xs font-mono text-gray-500 mt-0.5">{selectedRequest.id}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="rounded p-1 text-gray-400 hover:bg-gray-200 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 divide-y divide-gray-100 text-xs">
                {[
                  ['Employee', `${selectedRequest.employee?.name || 'Employee'} (${selectedRequest.employee?.dept || '—'})`],
                  ['Employee ID', selectedRequest.employee?.empId || '—'],
                  ['Request Date', selectedRequest.date],
                  ['Advance Amount', `₹${selectedRequest.amount.toLocaleString('en-IN')}`],
                  ['Reason', selectedRequest.reason],
                  ['Tenure', selectedRequest.tenure],
                  ['Monthly EMI', `₹${selectedRequest.emi?.toLocaleString('en-IN') || 0} / month`],
                  ...(selectedRequest.approvedBy ? [['Approver', `${selectedRequest.approvedBy.name} · ${selectedRequest.approvedBy.role}`]] : []),
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="text-gray-500 font-medium">{label}</span>
                    <span className="font-semibold text-gray-900 text-right">{val}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-medium">Status</span>
                  <LocalStatusPill status={selectedRequest.status} />
                </div>

                {/* HR Decision Authority Panel */}
                {selectedRequest.status === 'Pending' && (
                  <div className="pt-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-amber-800">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-bold uppercase tracking-wider text-xs">HR Decision Desk</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      As an authorized HR administrator, review employee eligibility and approve or reject this request.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApproveRequest(selectedRequest.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xs"
                      >
                        <Check className="h-4 w-4" /> Approve Advance
                      </button>
                      <button
                        onClick={() => handleRejectRequest(selectedRequest.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 active:scale-[0.98] transition-all shadow-xs"
                      >
                        <X className="h-4 w-4" /> Reject Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                {selectedRequest.status === 'Approved' && (
                  <button onClick={() => handleDownloadSlip(selectedRequest)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900">
                    <Download className="h-4 w-4" /> Download Slip
                  </button>
                )}
                <button onClick={() => setSelectedRequest(null)}
                  className="ml-auto rounded border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-100 transition-colors">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
