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
  BarChart3,
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
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border', cfg.bg, cfg.text, cfg.border)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', cfg.dot)} />
      {status}
    </span>
  )
}

/* ─── Interactive Loan Summary Component ─── */
function InteractiveLoanSummaryCard({ totalTaken = 300000, principalPaid = 120000, interestPaid = 22500, outstanding = 180000, onViewHistory }) {
  const [activeHover, setActiveHover] = useState(null)
  const [viewFormat, setViewFormat] = useState('donut') // 'donut' | 'bars'

  const totalSum = (principalPaid + interestPaid + outstanding) || 1
  const principalPct = Math.round((principalPaid / totalSum) * 100) || 37
  const interestPct = Math.round((interestPaid / totalSum) * 100) || 7
  const outstandingPct = Math.max(0, 100 - principalPct - interestPct) || 56

  const items = [
    {
      label: 'Principal Paid',
      value: principalPaid,
      formatted: `₹${principalPaid.toLocaleString('en-IN')}`,
      pct: principalPct,
      color: '#10b981',
      bgCls: 'bg-emerald-500',
      textCls: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      label: 'Interest Paid',
      value: interestPaid,
      formatted: `₹${interestPaid.toLocaleString('en-IN')}`,
      pct: interestPct,
      color: '#3b82f6',
      bgCls: 'bg-blue-500',
      textCls: 'text-blue-700',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      label: 'Outstanding',
      value: outstanding,
      formatted: `₹${outstanding.toLocaleString('en-IN')}`,
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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all">
      {/* Card Header + Toggle */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <h3 className="text-base font-bold text-gray-900">Loan Summary</h3>
        <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
          <button
            onClick={() => setViewFormat('donut')}
            className={cx(
              'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
              viewFormat === 'donut' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-400 hover:text-gray-700'
            )}
          >
            Donut
          </button>
          <button
            onClick={() => setViewFormat('bars')}
            className={cx(
              'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
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
              
              {/* Principal segment */}
              {principalPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#10b981"
                  strokeWidth={activeHover === 'Principal Paid' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${principalDash} ${C}`}
                  strokeDashoffset="0"
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Principal Paid' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Principal Paid')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}

              {/* Interest segment */}
              {interestPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#3b82f6"
                  strokeWidth={activeHover === 'Interest Paid' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${interestDash} ${C}`}
                  strokeDashoffset={`-${principalDash}`}
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Interest Paid' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Interest Paid')}
                  onMouseLeave={() => setActiveHover(null)}
                />
              )}

              {/* Outstanding segment */}
              {outstandingPct > 0 && (
                <circle
                  cx="60" cy="60" r="46"
                  stroke="#f59e0b"
                  strokeWidth={activeHover === 'Outstanding' ? '16' : '13'}
                  fill="none"
                  strokeDasharray={`${outstandingDash} ${C}`}
                  strokeDashoffset={`-${principalDash + interestDash}`}
                  strokeLinecap="butt"
                  className={cx(
                    'transition-all duration-150 cursor-pointer',
                    activeHover && activeHover !== 'Outstanding' ? 'opacity-40' : 'opacity-100'
                  )}
                  onMouseEnter={() => setActiveHover('Outstanding')}
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
                    <p className={cx('text-base font-extrabold leading-none', activeItem.textCls)}>{activeItem.formatted}</p>
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mt-1.5">{activeItem.label}</p>
                    <p className="text-xs text-gray-500 font-medium">{activeItem.pct}%</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="total"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                  >
                    <p className="text-lg font-extrabold text-gray-950 leading-none">₹{outstanding.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-1.5">Outstanding</p>
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
                <span className="text-xs font-semibold text-gray-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-950">{item.formatted}</span>
                <span className={cx('text-xs font-semibold', item.textCls)}>({item.pct}%)</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* View Loan History Link */}
      <button
        onClick={onViewHistory}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-4 transition-colors pt-2 border-t border-gray-50"
      >
        View Loan History
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

/* ─── Demo Loan Data for Employee ─── */
const myLoans = [
  {
    id: 'LOAN-2024-001',
    loanType: 'Personal Loan',
    loanTypeDesc: 'For personal use',
    approvedAmount: 200000,
    disbursedAmount: 200000,
    disbursedDate: '20 Jan 2024',
    outstanding: 120000,
    outstandingPct: 60,
    emiAmount: 6667,
    nextEmiDate: '05 Jun 2024',
    daysLeft: '16 Days Left',
    tenure: '24 Months',
    interestRate: '8.5%',
    status: 'Active',
    approvedBy: { name: 'Amit Kumar', role: 'HR', avatar: '/storage/avatars/amit.jpg' },
  },
  {
    id: 'LOAN-2023-002',
    loanType: 'Home Renovation',
    loanTypeDesc: 'Home improvement',
    approvedAmount: 100000,
    disbursedAmount: 100000,
    disbursedDate: '10 Aug 2023',
    outstanding: 60000,
    outstandingPct: 60,
    emiAmount: 3333,
    nextEmiDate: '05 Jun 2024',
    daysLeft: '16 Days Left',
    tenure: '18 Months',
    interestRate: '8.5%',
    status: 'Active',
    approvedBy: { name: 'Neha Verma', role: 'HR', avatar: '/storage/avatars/neha.jpg' },
  },
]

const closedLoansData = [
  {
    id: 'LOAN-2022-005',
    loanType: 'Emergency Medical',
    loanTypeDesc: 'Medical expenses',
    approvedAmount: 50000,
    disbursedAmount: 50000,
    disbursedDate: '15 Mar 2022',
    closedDate: '15 Mar 2023',
    emiAmount: 4166,
    tenure: '12 Months',
    interestRate: '8.0%',
    status: 'Closed',
    approvedBy: { name: 'Amit Kumar', role: 'HR', avatar: '/storage/avatars/amit.jpg' },
  },
]

const loanTransactions = [
  { date: '05 May 2024', description: 'EMI Deducted', amount: 10000, type: 'Debit', balance: 180000 },
  { date: '05 Apr 2024', description: 'EMI Deducted', amount: 10000, type: 'Debit', balance: 190000 },
  { date: '05 Mar 2024', description: 'EMI Deducted', amount: 10000, type: 'Debit', balance: 200000 },
  { date: '20 Jan 2024', description: 'Loan Disbursed', amount: 200000, type: 'Credit', balance: 200000 },
]

const loanEmiSchedule = [
  { month: 'Jun 2024', amount: 10000, principal: 8725, interest: 1275, status: 'Upcoming', paidDate: null },
  { month: 'Jul 2024', amount: 10000, principal: 8787, interest: 1213, status: 'Upcoming', paidDate: null },
  { month: 'Aug 2024', amount: 10000, principal: 8849, interest: 1151, status: 'Upcoming', paidDate: null },
  { month: 'May 2024', amount: 10000, principal: 8663, interest: 1337, status: 'Paid', paidDate: '05 May 2024' },
  { month: 'Apr 2024', amount: 10000, principal: 8602, interest: 1398, status: 'Paid', paidDate: '05 Apr 2024' },
  { month: 'Mar 2024', amount: 10000, principal: 8541, interest: 1459, status: 'Paid', paidDate: '05 Mar 2024' },
]

const loanProcessSteps = [
  { step: 1, title: 'Apply for Loan', desc: 'Fill loan application form', status: 'Completed', color: 'bg-emerald-600' },
  { step: 2, title: 'Manager Approval', desc: 'Your request will be sent to your manager', status: 'Completed', color: 'bg-emerald-600' },
  { step: 3, title: 'HR Approval', desc: 'HR team will review your application', status: 'Completed', color: 'bg-emerald-600' },
  { step: 4, title: 'Finance Approval', desc: 'Final approval from finance team', status: 'Completed', color: 'bg-emerald-600' },
  { step: 5, title: 'Disbursement', desc: 'Loan amount will be disbursed', status: 'In Progress', color: 'bg-blue-600' },
]

/* ─── Apply for Loan Modal ─── */
function ApplyLoanModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    loanType: '',
    customType: '',
    amount: '',
    tenure: '12',
    purpose: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.loanType || (formData.loanType === 'Other' && !formData.customType.trim())) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success(`Loan application for ₹${Number(formData.amount).toLocaleString('en-IN')} submitted successfully!`)
    onClose()
  }

  const interestRate = 8.5
  const monthlyRate = interestRate / (12 * 100)
  const n = Number(formData.tenure) || 12
  const p = Number(formData.amount) || 0
  const estimatedEmi = p > 0 ? Math.round((p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-950">Apply for Employee Loan</h2>
              <p className="text-xs text-gray-500">Interest rate: 8.5% p.a. (Reducing balance)</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Loan Type <span className="text-rose-500">*</span></label>
              <select
                value={formData.loanType}
                onChange={(e) => setFormData(prev => ({ ...prev, loanType: e.target.value, customType: '' }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Home Renovation">Home Renovation</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Vehicle Purchase">Vehicle Purchase</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Repayment Tenure <span className="text-rose-500">*</span></label>
              <select
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
              </select>
            </div>
          </div>

          {formData.loanType === 'Other' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Specify Loan Type <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="Enter loan type"
                value={formData.customType}
                onChange={(e) => setFormData(prev => ({ ...prev, customType: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Loan Amount (₹) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              placeholder="e.g. 100000"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Purpose / Remarks</label>
            <textarea
              placeholder="Brief description of why you need this loan"
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {p > 0 && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Estimated EMI Preview</p>
              <p className="text-xl font-extrabold text-blue-950 mt-1">₹{estimatedEmi.toLocaleString('en-IN')} <span className="text-xs font-medium text-blue-700">/ month for {formData.tenure} months @ 8.5% p.a.</span></p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm active:scale-[0.98] transition-all"
            >
              Submit Loan Application
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function EmployeeLoan() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Active Loans')
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  // Calculations
  const totalLoanTaken = myLoans.reduce((acc, l) => acc + l.approvedAmount, 0)
  const totalOutstanding = myLoans.reduce((acc, l) => acc + l.outstanding, 0)
  const totalMonthlyEmi = myLoans.reduce((acc, l) => acc + l.emiAmount, 0)
  const principalPaid = totalLoanTaken - totalOutstanding
  const interestPaid = 22500

  const tabs = ['Active Loans', 'Loan Application Process', 'Closed Loans', 'Loan History', 'EMI Schedule']

  return (
    <div className="space-y-6 pb-12">
      {/* ── Apply Modal ── */}
      <AnimatePresence>
        {isApplyModalOpen && <ApplyLoanModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />}
      </AnimatePresence>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedLoan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedLoan(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/70">
                <h2 className="text-base font-bold text-gray-950">Loan Details · {selectedLoan.id}</h2>
                <button onClick={() => setSelectedLoan(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Loan Type', selectedLoan.loanType],
                    ['Approved Amount', `₹${selectedLoan.approvedAmount?.toLocaleString('en-IN')}`],
                    ['Disbursed Date', selectedLoan.disbursedDate],
                    ['Outstanding', `₹${selectedLoan.outstanding?.toLocaleString('en-IN')}`],
                    ['Monthly EMI', `₹${selectedLoan.emiAmount?.toLocaleString('en-IN')}`],
                    ['Tenure', selectedLoan.tenure],
                    ['Interest Rate', selectedLoan.interestRate],
                    ['Next EMI Date', selectedLoan.nextEmiDate],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                    <StatusPill status={selectedLoan.status} />
                  </div>
                  {selectedLoan.approvedBy && (
                    <div className="flex items-center gap-2.5">
                      <Avatar name={selectedLoan.approvedBy.name} src={selectedLoan.approvedBy.avatar} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedLoan.approvedBy.name}</p>
                        <p className="text-xs text-gray-500">HR</p>
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
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
            <span className="hover:text-gray-800 cursor-pointer">Home</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="hover:text-gray-800 cursor-pointer">Employee Loan</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-800 font-semibold">My Loans</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-950">Employee Loan</h1>
          <p className="mt-1 text-sm text-gray-500">View your active company loans, repayment progress, EMI schedules, and apply for new loans.</p>
        </div>
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          Apply for Loan
        </button>
      </div>

      {/* ── 5 Balanced KPI Cards ── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: 'Total Loan Taken',
            value: `₹${totalLoanTaken.toLocaleString('en-IN')}`,
            sub: 'Overall Approved',
            icon: <Wallet className="h-4 w-4" />,
            iconBg: 'bg-slate-900 text-white',
            badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          },
          {
            label: 'Outstanding Balance',
            value: `₹${totalOutstanding.toLocaleString('en-IN')}`,
            sub: 'As on 20 May 2024',
            icon: <Landmark className="h-4 w-4" />,
            iconBg: 'bg-emerald-600 text-white',
            badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          },
          {
            label: 'Monthly EMI',
            value: `₹${totalMonthlyEmi.toLocaleString('en-IN')}`,
            sub: 'Deducted from Salary',
            icon: <CreditCard className="h-4 w-4" />,
            iconBg: 'bg-amber-500 text-white',
            badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
          },
          {
            label: 'Interest Rate',
            value: '8.5%',
            sub: 'Reducing Balance',
            icon: <Percent className="h-4 w-4" />,
            iconBg: 'bg-indigo-600 text-white',
            badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          },
          {
            label: 'Next EMI Date',
            value: '05 Jun 2024',
            sub: 'In 16 Days',
            icon: <CalendarDays className="h-4 w-4" />,
            iconBg: 'bg-purple-600 text-white',
            badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 min-h-[115px] shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-700 transition-colors">
                {card.label}
              </span>
              <span className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-transform group-hover:scale-105', card.iconBg)}>
                {card.icon}
              </span>
            </div>
            <div className="my-1">
              <h2 className="text-xl sm:text-[22px] font-extrabold text-gray-950 tracking-tight leading-tight">
                {card.value}
              </h2>
            </div>
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
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1) }}
              className={cx(
                'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* ─── Tab: Active Loans ─── */}
      {activeTab === 'Active Loans' && (
        <div className="space-y-6">
          {/* Full-width Active Loan Details Table */}
          <div className="w-full">
            <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/60">
                <h2 className="text-base font-bold text-gray-900">Active Loan Details</h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                  {myLoans.length} Active Loans
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                    <tr>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Loan ID</th>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Loan Type</th>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Approved Amount</th>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Disbursed Amount</th>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Outstanding</th>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">EMI Amount</th>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Next EMI Date</th>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Status</th>
                      <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs text-center whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {myLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100/80 px-2.5 py-1 rounded border border-gray-200/80">
                            {loan.id}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <p className="text-sm font-bold text-gray-900">{loan.loanType}</p>
                          <p className="text-xs text-gray-500">{loan.loanTypeDesc}</p>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-bold text-gray-950 text-sm">₹{loan.approvedAmount.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <p className="text-sm font-bold text-gray-900">₹{loan.disbursedAmount.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-500">{loan.disbursedDate}</p>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <p className="text-sm font-bold text-gray-900">₹{loan.outstanding.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-500">({loan.outstandingPct}%)</p>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-bold text-gray-950 text-sm">₹{loan.emiAmount.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-900">{loan.nextEmiDate}</p>
                          <p className="text-xs text-blue-600 font-medium">{loan.daysLeft}</p>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <StatusPill status={loan.status} />
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-center">
                          <button
                            onClick={() => setSelectedLoan(loan)}
                            title="View Details"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-2xs"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/60 text-xs text-gray-500">
                Showing 1 to {myLoans.length} of {myLoans.length} loans
              </div>
            </div>
          </div>

          {/* Bottom 3 Cards: Loan Summary + EMI Overview + Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Loan Summary */}
            <InteractiveLoanSummaryCard
              totalTaken={totalLoanTaken}
              principalPaid={principalPaid}
              interestPaid={interestPaid}
              outstanding={totalOutstanding}
              onViewHistory={() => setActiveTab('Loan History')}
            />

            {/* EMI Overview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">EMI Overview</h3>
                <div className="space-y-3.5">
                  {[
                    { label: 'Total EMI', value: '₹96,000', icon: Receipt, iconBg: 'bg-slate-100', iconColor: 'text-slate-700' },
                    { label: 'EMI Paid', value: '₹38,000', icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
                    { label: 'EMI Remaining', value: '₹58,000', icon: Clock, iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
                    { label: 'Total Tenure', value: '24 Months', icon: Calendar, iconBg: 'bg-blue-100', iconColor: 'text-blue-700' },
                    { label: 'Completed Tenure', value: '10 Months', icon: CalendarDays, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-700' },
                    { label: 'Remaining Tenure', value: '14 Months', icon: Clock, iconBg: 'bg-purple-100', iconColor: 'text-purple-700' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', item.iconBg, item.iconColor)}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 flex items-center justify-between">
                          <p className="text-xs text-gray-600 font-medium">{item.label}</p>
                          <p className="text-sm font-bold text-gray-950">{item.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500">
                      <th className="pb-2.5 font-semibold uppercase tracking-wider text-xs">Date</th>
                      <th className="pb-2.5 font-semibold uppercase tracking-wider text-xs">Description</th>
                      <th className="pb-2.5 font-semibold uppercase tracking-wider text-right text-xs">Amount</th>
                      <th className="pb-2.5 font-semibold uppercase tracking-wider text-center text-xs">Type</th>
                      <th className="pb-2.5 font-semibold uppercase tracking-wider text-right text-xs">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loanTransactions.map((txn, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 text-xs text-gray-600 whitespace-nowrap">{txn.date}</td>
                        <td className="py-2.5 text-xs text-gray-800 font-semibold whitespace-nowrap">{txn.description}</td>
                        <td className="py-2.5 text-xs text-right font-bold text-gray-950 whitespace-nowrap">₹{txn.amount.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 text-center whitespace-nowrap">
                          <span className={cx(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border',
                            txn.type === 'Credit'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          )}>
                            {txn.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">₹{txn.balance.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setActiveTab('EMI Schedule')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-4 transition-colors"
              >
                View Full EMI Schedule
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Need a new loan? Banner */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Info className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-blue-950">Need a new loan?</h4>
                <p className="text-xs text-blue-700 mt-0.5">You can apply for a new loan if you have repaid at least 50% of your current loan.</p>
              </div>
            </div>
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-blue-300 px-4 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100/60 shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              Apply for New Loan
            </button>
          </div>
        </div>
      )}

      {/* ─── Tab: Loan Application Process ─── */}
      {activeTab === 'Loan Application Process' && (
        <div className="space-y-6">
          {/* Main Process Workflow Box */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-gray-950 mb-6">Company Loan Approval & Disbursement Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {loanProcessSteps.map((step, idx) => (
                <div key={step.step} className="flex flex-col items-center text-center relative">
                  <span className={cx('flex h-13 w-13 items-center justify-center rounded-full text-white text-xl font-bold shadow-sm mb-3.5', step.color)}>
                    {step.status === 'Completed' ? <Check className="h-6 w-6" /> : step.step}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[180px]">{step.desc}</p>
                  <span className={cx(
                    'mt-2.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                    step.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  )}>
                    {step.status}
                  </span>
                  {idx < loanProcessSteps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[calc(50%+36px)] w-[calc(100%-72px)]">
                      <div className="border-t-2 border-dashed border-gray-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Policy Highlights for Loan */}
            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-6">
              <h3 className="text-base font-bold text-blue-950 mb-4">Loan Eligibility & Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['Eligibility', 'Minimum 1 year of continuous service required'],
                  ['Loan Amount Cap', 'Up to 3x monthly gross salary or ₹3,00,000 (whichever is lower)'],
                  ['Interest Rate', 'Subsidized 8.5% p.a. on reducing balance'],
                  ['Repayment Tenure', 'Flexible tenure from 6 to 36 months deducted via payroll'],
                  ['Processing Time', '5 to 7 working days upon manager & HR approval'],
                  ['Prepayment', 'Zero foreclosure or prepayment penalty charges'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Closed Loans ─── */}
      {activeTab === 'Closed Loans' && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Closed Loans</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
              {closedLoansData.length} Fully Repaid
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                <tr>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Loan ID</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Loan Type</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Total Amount</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Disbursed Date</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Closed Date</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {closedLoansData.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{loan.id}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{loan.loanType}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-950">₹{loan.approvedAmount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{loan.disbursedDate}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{loan.closedDate}</td>
                    <td className="py-4 px-6">
                      <StatusPill status={loan.status} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toast.success(`Downloading closure certificate for ${loan.id}`)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Tab: Loan History ─── */}
      {activeTab === 'Loan History' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-gray-950 mb-4">Complete Loan Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                  <tr>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Date</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Description</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Amount</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs text-center">Type</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs text-right">Balance Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loanTransactions.map((txn, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-600">{txn.date}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">{txn.description}</td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-950">₹{txn.amount.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={cx(
                          'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border',
                          txn.type === 'Credit'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        )}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-gray-950">₹{txn.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: EMI Schedule ─── */}
      {activeTab === 'EMI Schedule' && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Upcoming & Past EMI Deductions</h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              Salary Payroll Auto-Debit
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                <tr>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Month</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">EMI Amount</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Principal Portion</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Interest Portion</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Paid Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loanEmiSchedule.map((emi) => (
                  <tr key={emi.month} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{emi.month}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-950">₹{emi.amount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">₹{emi.principal.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">₹{emi.interest.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      <span className={cx(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border',
                        emi.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      )}>
                        <span className={cx('h-1.5 w-1.5 rounded-full', emi.status === 'Paid' ? 'bg-emerald-500' : 'bg-gray-400')} />
                        {emi.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{emi.paidDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
