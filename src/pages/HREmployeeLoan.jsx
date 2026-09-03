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
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  CreditCard,
  Check,
  UserCheck,
  Plus,
  IndianRupee,
  ArrowRight,
  CalendarDays,
  Receipt,
  Building2,
  Percent,
  Landmark,
  BadgeAlert,
  Info,
  Users,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar, cx } from '../components/ui'

/* ─── Status Config ─── */
const statusConfig = {
  Active:    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500'  },
  Closed:    { bg: 'bg-slate-100',  text: 'text-slate-700',   border: 'border-slate-200',   dot: 'bg-slate-500'  },
  Approved:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Rejected:  { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    dot: 'bg-rose-500'   },
}

function StatusPill({ status }) {
  const cfg = statusConfig[status] || statusConfig.Active
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold border', cfg.bg, cfg.text, cfg.border)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', cfg.dot)} />
      {status}
    </span>
  )
}

/* ─── HR Interactive Company Loan Portfolio Summary Card ─── */
function HRInteractiveLoanPortfolioCard({
  totalPortfolio = 900000,
  principalRecovered = 480000,
  interestCollected = 58500,
  outstandingBalance = 361500,
  onViewHistory,
}) {
  const [activeHover, setActiveHover] = useState(null)
  const [viewFormat, setViewFormat] = useState('donut') // 'donut' | 'bars'

  const totalSum = (principalRecovered + interestCollected + outstandingBalance) || 1
  const principalPct = Math.round((principalRecovered / totalSum) * 100) || 53
  const interestPct = Math.round((interestCollected / totalSum) * 100) || 7
  const outstandingPct = Math.max(0, 100 - principalPct - interestPct) || 40

  const items = [
    {
      label: 'Principal Recovered',
      value: principalRecovered,
      formatted: `₹${principalRecovered.toLocaleString('en-IN')}`,
      pct: principalPct,
      color: '#10b981',
      bgCls: 'bg-emerald-500',
      textCls: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      label: 'Interest Earned',
      value: interestCollected,
      formatted: `₹${interestCollected.toLocaleString('en-IN')}`,
      pct: interestPct,
      color: '#3b82f6',
      bgCls: 'bg-blue-500',
      textCls: 'text-blue-700',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      label: 'Active Outstanding',
      value: outstandingBalance,
      formatted: `₹${outstandingBalance.toLocaleString('en-IN')}`,
      pct: outstandingPct,
      color: '#f59e0b',
      bgCls: 'bg-amber-500',
      textCls: 'text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ]

  const activeItem = items.find((i) => i.label === activeHover)
  const C = 289.02 // 2 * PI * 46
  const principalDash = (principalPct / 100) * C
  const interestDash = (interestPct / 100) * C
  const outstandingDash = (outstandingPct / 100) * C

  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
      {/* Card Header + Toggle */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Company Loan Portfolio</h3>
          <p className="text-xs text-gray-500">Overall recovery & outstanding balance</p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
          <button
            onClick={() => setViewFormat('donut')}
            className={cx(
              'px-2.5 py-1 text-sm font-semibold rounded-md transition-all',
              viewFormat === 'donut' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-400 hover:text-gray-700'
            )}
          >
            Donut
          </button>
          <button
            onClick={() => setViewFormat('bars')}
            className={cx(
              'px-2.5 py-1 text-sm font-semibold rounded-md transition-all',
              viewFormat === 'bars' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-400 hover:text-gray-700'
            )}
          >
            Bars
          </button>
        </div>
      </div>

      {/* Visual Chart View */}
      {viewFormat === 'donut' ? (
        <div className="flex items-center justify-center my-3">
          <div className="relative flex items-center justify-center cursor-pointer">
            <svg className="w-40 h-40 -rotate-90 transition-transform duration-200" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="46" stroke="#f3f4f6" strokeWidth="13" fill="none" />

              {/* Principal Recovered segment */}
              {principalPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#10b981"
                  strokeWidth={activeHover === 'Principal Recovered' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${principalDash} ${C}`}
                  strokeDashoffset="0"
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Principal Recovered' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Principal Recovered')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}

              {/* Interest Earned segment */}
              {interestPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#3b82f6"
                  strokeWidth={activeHover === 'Interest Earned' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${interestDash} ${C}`}
                  strokeDashoffset={`-${principalDash}`}
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Interest Earned' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Interest Earned')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}

              {/* Outstanding segment */}
              {outstandingPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#f59e0b"
                  strokeWidth={activeHover === 'Active Outstanding' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${outstandingDash} ${C}`}
                  strokeDashoffset={`-${principalDash + interestDash}`}
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Active Outstanding' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Active Outstanding')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}
            </svg>

            {/* Center Dynamic Label */}
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
                    <p className={cx('text-lg font-extrabold leading-none', activeItem.textCls)}>{activeItem.formatted}</p>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mt-1.5">{activeItem.label}</p>
                    <p className="text-sm text-gray-500 font-medium">{activeItem.pct}%</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="total"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                  >
                    <p className="text-xl font-extrabold text-gray-950 leading-none">₹{outstandingBalance.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1.5">Total Outstanding</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* Progress Bars View */
        <div className="my-4 space-y-3.5">
          {items.map((item) => (
            <div
              key={item.label}
              onMouseEnter={() => setActiveHover(item.label)}
              onMouseLeave={() => setActiveHover(null)}
              className="space-y-1.5 cursor-pointer"
            >
              <div className="flex items-center justify-between text-sm">
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

      {/* Legend List */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        {items.map((item) => {
          const isHovered = activeHover === item.label
          return (
            <div
              key={item.label}
              onMouseEnter={() => setActiveHover(item.label)}
              onMouseLeave={() => setActiveHover(null)}
              className={cx(
                'flex items-center justify-between px-3 py-2 rounded-lg border transition-colors duration-150 cursor-pointer bg-white',
                isHovered ? 'border-gray-400 bg-gray-50/80 shadow-2xs' : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cx('h-2.5 w-2.5 rounded-sm shrink-0', item.bgCls)} />
                <span className="text-sm font-semibold text-gray-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-950">{item.formatted}</span>
                <span className={cx('text-sm font-semibold', item.textCls)}>({item.pct}%)</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* View Full Portfolio Audit */}
      <button
        onClick={onViewHistory}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-4 transition-colors pt-2 border-t border-gray-50"
      >
        View Recovery Breakdown
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ─── Company-wide Loan Requests for HR Management ─── */
const initialLoanRequests = [
  {
    id: 'LOAN-2024-006',
    date: '18 Aug 2026',
    amount: 150000,
    loanType: 'Personal Loan',
    tenure: '18 Months',
    interestRate: '8.5%',
    monthlyEmi: 8900,
    status: 'Pending',
    employee: { name: 'Rohan Mehra', dept: 'Engineering', empId: 'EMP-1042', avatar: '/storage/avatars/amit.jpg' },
    approvedBy: null,
    purpose: 'Home relocation & personal emergency',
  },
  {
    id: 'LOAN-2024-005',
    date: '18 Aug 2026',
    amount: 250000,
    loanType: 'Education Loan',
    tenure: '24 Months',
    interestRate: '8.0%',
    monthlyEmi: 11300,
    status: 'Pending',
    employee: { name: 'Pooja Sharma', dept: 'Marketing', empId: 'EMP-1018', avatar: '/storage/avatars/neha.jpg' },
    approvedBy: null,
    purpose: 'Higher education executive certificate',
  },
  {
    id: 'LOAN-2024-001',
    date: '20 Jan 2024',
    amount: 200000,
    loanType: 'Personal Loan',
    tenure: '24 Months',
    interestRate: '8.5%',
    monthlyEmi: 6667,
    status: 'Approved',
    employee: { name: 'Aditya Tiwari', dept: 'Operations', empId: 'EMP-1002', avatar: '/storage/avatars/amit.jpg' },
    approvedBy: { name: 'Amit Kumar', role: 'HR', avatar: '/storage/avatars/amit.jpg' },
    purpose: 'For personal use',
  },
  {
    id: 'LOAN-2023-002',
    date: '10 Aug 2023',
    amount: 100000,
    loanType: 'Home Renovation',
    tenure: '18 Months',
    interestRate: '8.5%',
    monthlyEmi: 3333,
    status: 'Approved',
    employee: { name: 'Sunita Rao', dept: 'Operations', empId: 'EMP-1012', avatar: '/storage/avatars/neha.jpg' },
    approvedBy: { name: 'Neha Verma', role: 'HR', avatar: '/storage/avatars/neha.jpg' },
    purpose: 'Home improvement & repairs',
  },
  {
    id: 'LOAN-2024-003',
    date: '02 Mar 2024',
    amount: 120000,
    loanType: 'Vehicle Purchase',
    tenure: '12 Months',
    interestRate: '8.5%',
    monthlyEmi: 10465,
    status: 'Rejected',
    employee: { name: 'Karan Singh', dept: 'Engineering', empId: 'EMP-1065', avatar: '/storage/avatars/amit.jpg' },
    approvedBy: { name: 'Amit Kumar', role: 'HR', avatar: '/storage/avatars/amit.jpg' },
    purpose: 'Two wheeler purchase',
  },
  {
    id: 'LOAN-2024-004',
    date: '15 Jan 2024',
    amount: 80000,
    loanType: 'Medical Emergency',
    tenure: '12 Months',
    interestRate: '8.0%',
    monthlyEmi: 6950,
    status: 'Approved',
    employee: { name: 'Manish Joshi', dept: 'Finance', empId: 'EMP-1019', avatar: '/storage/avatars/amit.jpg' },
    approvedBy: { name: 'Neha Verma', role: 'HR', avatar: '/storage/avatars/neha.jpg' },
    purpose: 'Hospitalization coverage',
  },
]

/* ─── Company-wide Recent Loan Transactions for HR ─── */
const companyLoanTransactions = [
  {
    date: '05 May 2024',
    employee: 'Aditya Tiwari',
    empId: 'EMP-1002',
    description: 'Payroll EMI Deduction',
    amount: 6667,
    type: 'Deduction',
    balance: 113333,
    status: 'Processed',
  },
  {
    date: '05 May 2024',
    employee: 'Sunita Rao',
    empId: 'EMP-1012',
    description: 'Payroll EMI Deduction',
    amount: 3333,
    type: 'Deduction',
    balance: 56667,
    status: 'Processed',
  },
  {
    date: '05 May 2024',
    employee: 'Manish Joshi',
    empId: 'EMP-1019',
    description: 'Payroll EMI Deduction',
    amount: 6950,
    type: 'Deduction',
    balance: 73050,
    status: 'Processed',
  },
  {
    date: '20 Jan 2024',
    employee: 'Aditya Tiwari',
    empId: 'EMP-1002',
    description: 'Loan Disbursed via Bank Transfer',
    amount: 200000,
    type: 'Disbursed',
    balance: 200000,
    status: 'Completed',
  },
  {
    date: '10 Aug 2023',
    employee: 'Sunita Rao',
    empId: 'EMP-1012',
    description: 'Loan Disbursed via Bank Transfer',
    amount: 100000,
    type: 'Disbursed',
    balance: 100000,
    status: 'Completed',
  },
]

export default function HREmployeeLoan() {
  const { user } = useAuth()
  const [loans, setLoans] = useState(initialLoanRequests)
  const [activeTab, setActiveTab] = useState('All Loans')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const ITEMS_PER_PAGE = 6

  // HR KPI & Portfolio Calculations
  const approvedLoans = loans.filter(l => l.status === 'Approved')
  const pendingLoans = loans.filter(l => l.status === 'Pending')
  const rejectedLoans = loans.filter(l => l.status === 'Rejected')

  const totalDisbursed = approvedLoans.reduce((acc, l) => acc + l.amount, 0)
  const pendingAmount = pendingLoans.reduce((acc, l) => acc + l.amount, 0)
  const activeMonthlyRecovery = approvedLoans.reduce((acc, l) => acc + l.monthlyEmi, 0)

  // Overall Company Portfolio stats for the 3 Cards
  const companyPrincipalRecovered = 480000
  const companyInterestEarned = 58500
  const companyOutstanding = 361500
  const totalCompanyPortfolio = companyPrincipalRecovered + companyOutstanding

  const filteredLoans = loans.filter((loan) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      loan.id.toLowerCase().includes(query) ||
      loan.loanType.toLowerCase().includes(query) ||
      (loan.employee?.name && loan.employee.name.toLowerCase().includes(query)) ||
      (loan.employee?.dept && loan.employee.dept.toLowerCase().includes(query)) ||
      (loan.employee?.empId && loan.employee.empId.toLowerCase().includes(query))

    if (activeTab === 'Pending Approvals') return matchesSearch && loan.status === 'Pending'
    if (activeTab === 'Approved Loans') return matchesSearch && loan.status === 'Approved'
    if (activeTab === 'Rejected Requests') return matchesSearch && loan.status === 'Rejected'

    const matchesStatus = statusFilter === 'All' || loan.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredLoans.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedLoans = filteredLoans.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleApprove = (loanId) => {
    const approverName = user?.full_name || 'Diksha Rajvansh'
    const approverAvatar = user?.profile_photo || '/storage/avatars/neha.jpg'
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'Approved', approvedBy: { name: approverName, role: 'HR', avatar: approverAvatar } } : l))
    toast.success(`Loan application ${loanId} approved successfully by HR!`)
  }

  const handleReject = (loanId) => {
    const approverName = user?.full_name || 'Diksha Rajvansh'
    const approverAvatar = user?.profile_photo || '/storage/avatars/neha.jpg'
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'Rejected', approvedBy: { name: approverName, role: 'HR', avatar: approverAvatar } } : l))
    toast.error(`Loan application ${loanId} rejected by HR.`)
  }

  return (
    <div className="w-full min-w-0 space-y-6 pb-12">
      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedLoan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedLoan(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <h2 className="text-lg font-bold text-gray-950">Loan Application · {selectedLoan.id}</h2>
                <button onClick={() => setSelectedLoan(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <Avatar name={selectedLoan.employee?.name} src={selectedLoan.employee?.avatar} size="lg" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-950">{selectedLoan.employee?.name}</h3>
                    <p className="text-sm text-gray-500">{selectedLoan.employee?.dept} · {selectedLoan.employee?.empId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Loan Type', selectedLoan.loanType],
                    ['Requested Amount', `₹${selectedLoan.amount?.toLocaleString('en-IN')}`],
                    ['Tenure', selectedLoan.tenure],
                    ['Interest Rate', selectedLoan.interestRate],
                    ['Monthly EMI', `₹${selectedLoan.monthlyEmi?.toLocaleString('en-IN')}`],
                    ['Application Date', selectedLoan.date],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                      <p className="text-base font-bold text-gray-900 mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
                {selectedLoan.purpose && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Purpose</p>
                    <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200">{selectedLoan.purpose}</p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                    <StatusPill status={selectedLoan.status} />
                  </div>
                  {selectedLoan.approvedBy && (
                    <div className="flex items-center gap-2.5">
                      <Avatar name={selectedLoan.approvedBy.name} src={selectedLoan.approvedBy.avatar} size="md" />
                      <div>
                        <p className="text-base font-semibold text-gray-900">{selectedLoan.approvedBy.name}</p>
                        <p className="text-sm text-gray-500">HR</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
            <span className="hover:text-gray-800 cursor-pointer">Home</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="hover:text-gray-800 cursor-pointer">Finance</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-800 font-semibold">Employee Loan Management</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">Employee Loan Management</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white text-sm font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              HR Portal
            </span>
          </div>
          <p className="mt-1 text-base text-gray-500">Review employee loan applications, approve/reject requests, monitor recovery portfolio, and manage EMI schedules.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toast.success('Exporting Employee Loan Master Sheet...')}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-xs hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            <Download className="h-4 w-4" />
            Export Loan Sheet
          </button>
        </div>
      </div>

      {/* ── 4 HR Quick Summary KPI Cards ── */}
      <div className="grid grid-cols-1 gap-3.5 min-w-0 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Loan Disbursed',
            value: `₹${totalDisbursed.toLocaleString('en-IN')}`,
            sub: `${approvedLoans.length} Approved Loans`,
            icon: <Wallet className="h-4 w-4" />,
            iconBg: 'bg-slate-900 text-white',
            badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
            tab: 'Approved Loans',
          },
          {
            label: 'Pending HR Review',
            value: `₹${pendingAmount.toLocaleString('en-IN')}`,
            sub: `${pendingLoans.length} Awaiting Decision`,
            icon: <Clock className="h-4 w-4" />,
            iconBg: 'bg-amber-500 text-white',
            badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
            tab: 'Pending Approvals',
          },
          {
            label: 'Total Applications',
            value: `${loans.length} Loans`,
            sub: `${approvedLoans.length} Approved · ${rejectedLoans.length} Rejected`,
            icon: <Users className="h-4 w-4" />,
            iconBg: 'bg-emerald-600 text-white',
            badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            tab: 'All Loans',
          },
          {
            label: 'Active Monthly Recovery',
            value: `₹${activeMonthlyRecovery.toLocaleString('en-IN')}`,
            sub: `Payroll EMI Deductions`,
            icon: <CreditCard className="h-4 w-4" />,
            iconBg: 'bg-blue-600 text-white',
            badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
            tab: 'Approved Loans',
          },
        ].map((card) => (
          <div
            key={card.label}
            onClick={() => { setActiveTab(card.tab); setCurrentPage(1) }}
            className={cx(
              'flex flex-col justify-between rounded-xl border p-4 min-h-[130px] shadow-2xs hover:shadow-xs hover:border-gray-300 cursor-pointer transition-all group bg-white',
              activeTab === card.tab ? 'border-gray-950 ring-1 ring-gray-950/15' : 'border-gray-200'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-700 transition-colors">
                {card.label}
              </span>
              <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-transform group-hover:scale-105', card.iconBg)}>
                {card.icon}
              </span>
            </div>
            <div className="my-1">
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-gray-950 tracking-tight leading-tight">
                {card.value}
              </h2>
            </div>
            <div className="flex items-center">
              <span className={cx('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border leading-normal', card.badgeBg)}>
                <span className="h-1 w-1 rounded-full bg-current opacity-70" />
                {card.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto overscroll-x-contain">
          {['All Loans', 'Pending Approvals', 'Approved Loans', 'Disbursements & Deductions', 'Rejected Requests', 'Loan Policy Guidelines'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
              className={cx(
                'whitespace-nowrap border-b-2 px-4 py-3 text-base font-semibold transition-colors flex items-center gap-2',
                activeTab === tab
                  ? 'border-gray-950 text-gray-950'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              )}
            >
              {tab}
              {tab === 'Pending Approvals' && pendingLoans.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-sm font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {pendingLoans.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ─── Tab Content (All Loans, Pending Approvals, Approved Loans, Rejected Requests) ─── */}
      {(activeTab === 'All Loans' || activeTab === 'Pending Approvals' || activeTab === 'Approved Loans' || activeTab === 'Rejected Requests') && (
        <div className="w-full min-w-0 space-y-6">
          {/* Main All Employee Loan Applications Table Card */}
          <div className="w-full min-w-0">
            <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden max-w-full">
              {/* Table Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50/60">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-gray-900">
                    {activeTab === 'Pending Approvals' ? 'Pending Loan Applications' :
                     activeTab === 'Approved Loans' ? 'Approved Employee Loans' :
                     activeTab === 'Rejected Requests' ? 'Rejected Applications' : 'All Employee Loan Applications'}
                  </h2>
                  <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-sm font-bold text-gray-700">
                    {filteredLoans.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employee, ID, type..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                      className="w-72 rounded-lg border border-gray-300 bg-white pl-9 pr-8 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-600 focus:outline-none shadow-2xs"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="w-full max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain">
                <table className="w-full min-w-[1200px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                    <tr>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Loan ID</th>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Employee</th>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Loan Type</th>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Amount</th>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Tenure & EMI</th>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Date</th>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Status</th>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Approved By</th>
                      <th className="py-3 px-3.5 font-semibold uppercase tracking-wider text-xs text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100/90 px-2 py-0.5 rounded border border-gray-200">
                            {loan.id}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={loan.employee?.name} src={loan.employee?.avatar} size="sm" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-tight">{loan.employee?.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{loan.employee?.dept} · {loan.employee?.empId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3.5 text-sm text-gray-800 font-semibold whitespace-nowrap">{loan.loanType}</td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="font-bold text-gray-950 text-base">₹{loan.amount.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <p className="text-sm font-bold text-gray-900">₹{loan.monthlyEmi.toLocaleString('en-IN')}/mo</p>
                          <p className="text-xs text-gray-500">{loan.tenure} @ {loan.interestRate}</p>
                        </td>
                        <td className="py-3 px-3.5 text-sm text-gray-600 whitespace-nowrap">{loan.date}</td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <StatusPill status={loan.status} />
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {loan.approvedBy ? (
                            <div className="flex items-center gap-1.5">
                              <Avatar name={loan.approvedBy.name} src={loan.approvedBy.avatar} size="sm" />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{loan.approvedBy.name}</p>
                                <p className="text-xs text-gray-400">HR</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-sm pl-2">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {loan.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleApprove(loan.id)}
                                  title="Approve Loan Application"
                                  className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-2xs active:scale-95 transition-all"
                                >
                                  <Check className="h-3.5 w-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => handleReject(loan.id)}
                                  title="Reject Loan Application"
                                  className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-md bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-sm font-bold shadow-2xs active:scale-95 transition-all"
                                >
                                  <X className="h-3.5 w-3.5" /> Reject
                                </button>
                              </>
                            ) : (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => setSelectedLoan(loan)}
                                  title="View Details"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-2xs"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                {loan.status === 'Approved' ? (
                                  <button
                                    onClick={() => toast.success(`Downloading sanction letter for ${loan.id}`)}
                                    title="Download Sanction Letter"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-2xs"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <span className="inline-block w-8 h-8" aria-hidden="true" />
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredLoans.length === 0 && (
                      <tr>
                        <td colSpan="9" className="py-12 text-center text-gray-400">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm font-medium">No loan records found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {filteredLoans.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
                  <span className="text-base text-gray-500">
                    Showing <strong className="text-gray-800 font-semibold">{(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to <strong className="text-gray-800 font-semibold">{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredLoans.length)}</strong> of <strong className="text-gray-800 font-semibold">{filteredLoans.length}</strong> loans
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={safeCurrentPage === 1}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cx(
                            'inline-flex h-8 w-8 items-center justify-center rounded-lg text-base font-semibold transition-colors',
                            page === safeCurrentPage
                              ? 'bg-gray-950 text-white border border-gray-950'
                              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                          )}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={safeCurrentPage === totalPages}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─── 3 HR Analytics Cards Under All Employee Loan Card ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
            {/* Card 1: Company Loan Portfolio Interactive Donut/Bars Card */}
            <HRInteractiveLoanPortfolioCard
              totalPortfolio={totalCompanyPortfolio}
              principalRecovered={companyPrincipalRecovered}
              interestCollected={companyInterestEarned}
              outstandingBalance={companyOutstanding}
              onViewHistory={() => setActiveTab('Disbursements & Deductions')}
            />

            {/* Card 2: Company Recovery Overview */}
            <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Company Recovery Overview</h3>
                    <p className="text-xs text-gray-500">Corporate EMI and deduction stats</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { label: 'Total Disbursed Capital', value: '₹9,00,000', icon: Landmark, iconBg: 'bg-slate-100', iconColor: 'text-slate-700' },
                    { label: 'Total Monthly Recovery', value: '₹48,615', icon: Receipt, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
                    { label: 'Recovered This Cycle', value: '₹41,665', icon: CheckCircle2, iconBg: 'bg-blue-100', iconColor: 'text-blue-700' },
                    { label: 'Pending Cycle Recovery', value: '₹6,950', icon: Clock, iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
                    { label: 'Active Loan Accounts', value: `${approvedLoans.length} Active Accounts`, icon: Users, iconBg: 'bg-purple-100', iconColor: 'text-purple-700' },
                    { label: 'Avg. Repayment Tenure', value: '18.5 Months', icon: CalendarDays, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-700' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', item.iconBg, item.iconColor)}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 flex items-center justify-between">
                          <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                          <p className="text-base font-bold text-gray-950">{item.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> 98.4% On-time Recovery Rate
                </span>
                <span className="font-mono text-xs text-gray-400">Auto-Payroll Synced</span>
              </div>
            </div>

            {/* Card 3: Recent Company Loan Transactions */}
            <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Disbursements & Recoveries</h3>
                    <p className="text-xs text-gray-500">Latest company payroll deductions</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    <Activity className="h-4 w-4" />
                  </span>
                </div>

                {/* Modern Responsive Transaction List without Scrollbar */}
                <div className="space-y-2.5">
                  {companyLoanTransactions.slice(0, 5).map((txn, idx) => {
                    const isDisbursed = txn.type === 'Disbursed'
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={cx(
                            'flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-transform group-hover:scale-105',
                            isDisbursed
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          )}>
                            {isDisbursed ? (
                              <ArrowDownLeft className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-bold text-gray-900 truncate">{txn.employee}</p>
                              <span className={cx(
                                'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold border leading-tight shrink-0',
                                isDisbursed
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              )}>
                                {isDisbursed ? 'Disbursed' : 'EMI Deduction'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {txn.date} · <span className="font-mono text-gray-400">{txn.empId}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <p className={cx('text-sm font-extrabold tracking-tight', isDisbursed ? 'text-emerald-700' : 'text-gray-950')}>
                            {isDisbursed ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs font-medium text-gray-400 mt-0.5">
                            Bal: ₹{txn.balance.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('Disbursements & Deductions')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-4 transition-colors pt-2 border-t border-gray-50"
              >
                View Full Deduction Log
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Disbursements & Deductions Log ─── */}
      {activeTab === 'Disbursements & Deductions' && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden max-w-full space-y-4">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Disbursements & Payroll Deduction Ledger</h2>
              <p className="text-sm text-gray-500">Chronological transaction logs across all employee loans</p>
            </div>
            <button
              onClick={() => toast.success('Exporting Deduction Ledger to CSV...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Ledger
            </button>
          </div>
          <div className="w-full max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                <tr>
                  <th className="py-3 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Date</th>
                  <th className="py-3 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Employee</th>
                  <th className="py-3 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Description</th>
                  <th className="py-3 px-6 font-semibold uppercase tracking-wider text-right text-xs whitespace-nowrap">Amount</th>
                  <th className="py-3 px-6 font-semibold uppercase tracking-wider text-center text-xs whitespace-nowrap">Type</th>
                  <th className="py-3 px-6 font-semibold uppercase tracking-wider text-right text-xs whitespace-nowrap">Outstanding Balance</th>
                  <th className="py-3 px-6 font-semibold uppercase tracking-wider text-center text-xs whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companyLoanTransactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-6 text-sm text-gray-700 whitespace-nowrap font-medium">{txn.date}</td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <p className="text-sm font-bold text-gray-900">{txn.employee}</p>
                      <p className="text-xs text-gray-400 font-mono">{txn.empId}</p>
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-800 whitespace-nowrap">{txn.description}</td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap font-bold text-gray-950 text-sm">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <span className={cx(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold border',
                        txn.type === 'Disbursed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      )}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-sm font-semibold text-gray-800 whitespace-nowrap">
                      ₹{txn.balance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Tab: Policy Guidelines ─── */}
      {activeTab === 'Loan Policy Guidelines' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-gray-950">Organizational Employee Loan Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['1. Eligibility Criteria', 'Employees must have completed a minimum of 1 year of continuous service.'],
              ['2. Maximum Loan Limit', 'Maximum loan eligible is up to 3x monthly gross salary or ₹3,00,000 (whichever is lower).'],
              ['3. Repayment & Tenure', 'Repayment tenure is from 6 to 36 months, automatically deducted via payroll.'],
              ['4. Rate of Interest', 'Company subsidized rate of 8.5% p.a. on reducing balance method.'],
              ['5. Re-application Rule', 'An employee can apply for a new loan after repaying at least 50% of an existing active loan.'],
              ['6. Foreclosure', 'No prepayment penalty or foreclosure charges for early repayment.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
                <p className="text-base font-bold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
