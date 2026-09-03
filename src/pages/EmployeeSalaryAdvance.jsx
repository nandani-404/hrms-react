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
  Plus,
  IndianRupee,
  CircleDollarSign,
  ArrowRight,
  CalendarDays,
  Receipt,
  Building2,
  PiggyBank,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar, cx } from '../components/ui'

/* ─── Status Config ─── */
const statusConfig = {
  Approved:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500'  },
  Rejected:  { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    dot: 'bg-rose-500'   },
}

function StatusPill({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border', cfg.bg, cfg.text, cfg.border)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', cfg.dot)} />
      {status}
    </span>
  )
}

/* ─── Employee's own advance requests (demo data) ─── */
const myAdvanceRequests = [
  {
    id: 'ADV-2024-001',
    date: '20 May 2024',
    amount: 15000,
    reason: 'Medical Emergency',
    status: 'Approved',
    approvedBy: { name: 'Amit Kumar', role: 'HR', avatar: '/storage/avatars/amit.jpg' },
    tenure: '3 Months',
    emi: 5000,
    disbursedDate: '22 May 2024',
  },
  {
    id: 'ADV-2024-002',
    date: '10 Apr 2024',
    amount: 30000,
    reason: 'Home Renovation',
    status: 'Approved',
    approvedBy: { name: 'Neha Verma', role: 'HR', avatar: '/storage/avatars/neha.jpg' },
    tenure: '6 Months',
    emi: 5000,
    disbursedDate: '12 Apr 2024',
  },
  {
    id: 'ADV-2024-003',
    date: '02 Mar 2024',
    amount: 20000,
    reason: 'Personal Requirement',
    status: 'Rejected',
    approvedBy: { name: 'Amit Kumar', role: 'HR', avatar: '/storage/avatars/amit.jpg' },
    tenure: '4 Months',
    emi: 5000,
    disbursedDate: null,
  },
  {
    id: 'ADV-2024-004',
    date: '25 Feb 2024',
    amount: 10000,
    reason: 'Travel',
    status: 'Rejected',
    approvedBy: { name: 'Amit Kumar', role: 'HR', avatar: '/storage/avatars/amit.jpg' },
    tenure: '2 Months',
    emi: 5000,
    disbursedDate: null,
  },
  {
    id: 'ADV-2024-005',
    date: '15 Jan 2024',
    amount: 10000,
    reason: 'Other',
    status: 'Approved',
    approvedBy: { name: 'Neha Verma', role: 'HR', avatar: '/storage/avatars/neha.jpg' },
    tenure: '2 Months',
    emi: 5000,
    disbursedDate: '18 Jan 2024',
  },
]

const myTransactions = [
  { date: '20 May 2024', description: 'Advance Disbursed', amount: 15000, type: 'Credit', status: 'Completed' },
  { date: '05 May 2024', description: 'EMI Deducted', amount: 6250, type: 'Debit', status: 'Completed' },
  { date: '05 Apr 2024', description: 'EMI Deducted', amount: 6250, type: 'Debit', status: 'Completed' },
  { date: '05 Mar 2024', description: 'EMI Deducted', amount: 6250, type: 'Debit', status: 'Completed' },
]

const approvalWorkflow = [
  { step: 1, title: 'Apply Advance', desc: 'Fill in advance request form with amount and reason.', icon: FileText, color: 'bg-blue-600' },
  { step: 2, title: 'Manager Approval', desc: 'Your request will be sent to your manager.', icon: UserCheck, color: 'bg-indigo-600' },
  { step: 3, title: 'HR Approval', desc: 'After manager approves, HR will review.', icon: ShieldCheck, color: 'bg-purple-600' },
  { step: 4, title: 'Finance Approval', desc: 'Final approval from finance team.', icon: Building2, color: 'bg-orange-600' },
  { step: 5, title: 'Amount Disbursed', desc: 'Amount will be credited to your account.', icon: CheckCircle2, color: 'bg-emerald-600' },
]

const emiSchedule = [
  { month: 'Jun 2024', amount: 5000, status: 'Paid', paidDate: '05 Jun 2024' },
  { month: 'Jul 2024', amount: 5000, status: 'Paid', paidDate: '05 Jul 2024' },
  { month: 'Aug 2024', amount: 5000, status: 'Upcoming', paidDate: null },
  { month: 'Sep 2024', amount: 5000, status: 'Upcoming', paidDate: null },
  { month: 'Oct 2024', amount: 5000, status: 'Upcoming', paidDate: null },
  { month: 'Nov 2024', amount: 5000, status: 'Upcoming', paidDate: null },
]

/* ─── Apply Modal ─── */
function ApplyAdvanceModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ amount: '', reason: '', customReason: '', tenure: '3', remarks: '' })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalReason = formData.reason === 'Other' ? formData.customReason : formData.reason
    if (!formData.amount || !formData.reason || (formData.reason === 'Other' && !formData.customReason.trim())) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success(`Advance request for ₹${Number(formData.amount).toLocaleString('en-IN')} submitted successfully!`)
    setFormData({ amount: '', reason: '', customReason: '', tenure: '3', remarks: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-950">Apply for Salary Advance</h2>
              <p className="text-xs text-gray-500">Maximum limit: 80% of Basic Salary</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Amount (₹) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Repayment Tenure <span className="text-rose-500">*</span></label>
              <select
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reason <span className="text-rose-500">*</span></label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value, customReason: '' }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Reason</option>
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Home Renovation">Home Renovation</option>
              <option value="Education">Education</option>
              <option value="Vehicle Repair">Vehicle Repair</option>
              <option value="Travel">Travel</option>
              <option value="Personal Requirement">Personal Requirement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {formData.reason === 'Other' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Specify Reason <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="Enter your reason"
                value={formData.customReason}
                onChange={(e) => setFormData(prev => ({ ...prev, customReason: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Additional Remarks</label>
            <textarea
              placeholder="Brief description (optional)"
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {formData.amount && formData.tenure && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3.5">
              <p className="text-xs font-semibold text-blue-800">EMI Calculation Preview</p>
              <p className="text-lg font-bold text-blue-900 mt-1">₹{Math.round(Number(formData.amount) / Number(formData.tenure)).toLocaleString('en-IN')} <span className="text-xs font-medium text-blue-600">/ month for {formData.tenure} months</span></p>
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
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function EmployeeSalaryAdvance() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('My Requests')
  const [currentPage, setCurrentPage] = useState(1)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const ITEMS_PER_PAGE = 5

  const empName = user?.full_name || 'Aditya Tiwari'

  // ── KPI Calculations ──
  const approvedReqs = myAdvanceRequests.filter(r => r.status === 'Approved')
  const pendingReqs = myAdvanceRequests.filter(r => r.status === 'Pending')
  const rejectedReqs = myAdvanceRequests.filter(r => r.status === 'Rejected')

  const totalAdvanceTaken = approvedReqs.reduce((acc, r) => acc + r.amount, 0) + pendingReqs.reduce((acc, r) => acc + r.amount, 0)
  const approvedAmount = approvedReqs.reduce((acc, r) => acc + r.amount, 0)
  const pendingAmount = pendingReqs.reduce((acc, r) => acc + r.amount, 0)
  const pendingCount = pendingReqs.length
  const availableLimit = 30000 // 80% of Basic Salary

  // Repayment calc
  const totalEmiAmount = 6250 * 6 // Total EMI
  const emiPaid = 18750
  const emiRemaining = totalEmiAmount - emiPaid

  // Donut chart data
  const approvedSum = approvedReqs.reduce((acc, r) => acc + r.amount, 0)
  const pendingSum = pendingReqs.reduce((acc, r) => acc + r.amount, 0)
  const rejectedSum = rejectedReqs.reduce((acc, r) => acc + r.amount, 0)
  const chartTotal = (approvedSum + pendingSum + rejectedSum) || 1
  const approvedPct = Math.round((approvedSum / chartTotal) * 100)
  const pendingPct = Math.round((pendingSum / chartTotal) * 100)
  const rejectedPct = Math.max(0, 100 - approvedPct - pendingPct)

  // Pagination
  const filteredRequests = myAdvanceRequests
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedRequests = filteredRequests.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const tabs = ['My Requests', 'Approval Process', 'Repayment Schedule', 'Advance History']

  return (
    <div className="space-y-6 pb-12">
      {/* ── Apply Modal ── */}
      <AnimatePresence>
        {isApplyModalOpen && <ApplyAdvanceModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />}
      </AnimatePresence>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-base font-bold text-gray-950">Request Details</h2>
                <button onClick={() => setSelectedRequest(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Request ID', selectedRequest.id],
                    ['Date', selectedRequest.date],
                    ['Amount', `₹${selectedRequest.amount?.toLocaleString('en-IN')}`],
                    ['Reason', selectedRequest.reason],
                    ['Tenure', selectedRequest.tenure],
                    ['Monthly EMI', `₹${selectedRequest.emi?.toLocaleString('en-IN')}`],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                    <StatusPill status={selectedRequest.status} />
                  </div>
                  {selectedRequest.approvedBy && (
                    <div className="flex items-center gap-2">
                      <Avatar name={selectedRequest.approvedBy.name} src={selectedRequest.approvedBy.avatar} size="xs" />
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{selectedRequest.approvedBy.name}</p>
                        <p className="text-[11px] text-gray-500">HR</p>
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
            <span className="hover:text-gray-800 cursor-pointer">Salary Advance</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-800 font-semibold">My Requests</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-950">Salary Advance</h1>
          <p className="mt-1 text-sm text-gray-500">Track your advance requests, repayments, and apply for new advances.</p>
        </div>
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          Apply for Advance
        </button>
      </div>

      {/* ── KPI Cards Row (Balanced, Clean Design) ── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: 'Total Advance Taken',
            value: `₹${totalAdvanceTaken.toLocaleString('en-IN')}`,
            sub: 'This Year',
            icon: <Wallet className="h-4 w-4" />,
            iconBg: 'bg-slate-900 text-white',
            badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          },
          {
            label: 'Pending Requests',
            value: `₹${pendingAmount.toLocaleString('en-IN')}`,
            sub: `${pendingCount} ${pendingCount === 1 ? 'Request' : 'Requests'}`,
            icon: <Clock className="h-4 w-4" />,
            iconBg: 'bg-amber-500 text-white',
            badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
          },
          {
            label: 'Approved Amount',
            value: `₹${approvedAmount.toLocaleString('en-IN')}`,
            sub: `${approvedReqs.length} Approved Requests`,
            icon: <CheckCircle2 className="h-4 w-4" />,
            iconBg: 'bg-emerald-600 text-white',
            badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          },
          {
            label: 'Available Limit',
            value: `₹${availableLimit.toLocaleString('en-IN')}`,
            sub: '80% of Basic Salary',
            icon: <PiggyBank className="h-4 w-4" />,
            iconBg: 'bg-indigo-600 text-white',
            badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          },
          {
            label: 'Next EMI Date',
            value: '05 Jun 2024',
            sub: '12 Days Left',
            icon: <CalendarDays className="h-4 w-4" />,
            iconBg: 'bg-purple-600 text-white',
            badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 min-h-[115px] shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all group"
          >
            {/* Top row: Label + Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-700 transition-colors">
                {card.label}
              </span>
              <span className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-transform group-hover:scale-105', card.iconBg)}>
                {card.icon}
              </span>
            </div>

            {/* Middle: Prominent Value */}
            <div className="my-1">
              <h2 className="text-xl sm:text-[22px] font-extrabold text-gray-950 tracking-tight leading-tight">
                {card.value}
              </h2>
            </div>

            {/* Bottom: Context Badge */}
            <div className="flex items-center">
              <span className={cx('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border leading-normal', card.badgeBg)}>
                <span className="h-1 w-1 rounded-full bg-current opacity-70" />
                {card.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
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

      {/* ─── Tab: My Requests ─── */}
      {activeTab === 'My Requests' && (
        <div className="w-full">
          <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/60">
              <h2 className="text-base font-bold text-gray-900">My Advance Requests</h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                {filteredRequests.length} Total Requests
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                  <tr>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Request ID</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Request Date</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Amount</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Reason</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">Approved By</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100/80 px-2.5 py-1 rounded border border-gray-200/80">
                          {req.id}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">{req.date}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-bold text-gray-950 text-base">₹{req.amount.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 whitespace-nowrap">{req.reason}</td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <StatusPill status={req.status} />
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {req.approvedBy ? (
                          <div className="flex items-center gap-2.5">
                            <Avatar name={req.approvedBy.name} src={req.approvedBy.avatar} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 leading-tight">{req.approvedBy.name}</p>
                              <p className="text-xs text-gray-500 font-medium">HR</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-sm pl-2">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            title="View Details"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-2xs"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {req.status === 'Approved' && (
                            <button
                              onClick={() => toast.success(`Downloading slip for ${req.id}`)}
                              title="Download Slip"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <AlertCircle className="h-9 w-9 text-gray-300" />
                          <p className="text-sm font-medium text-gray-500">No advance requests found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredRequests.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
                <span className="text-sm text-gray-500">
                  Showing <strong className="text-gray-800 font-semibold">{(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to <strong className="text-gray-800 font-semibold">{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredRequests.length)}</strong> of <strong className="text-gray-800 font-semibold">{filteredRequests.length}</strong> requests
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
                          'inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
                          page === safeCurrentPage
                            ? 'bg-blue-600 text-white border border-blue-600'
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
      )}

      {/* ─── Tab: Approval Process ─── */}
      {activeTab === 'Approval Process' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-950 mb-6">Salary Advance Approval Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {approvalWorkflow.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="flex flex-col items-center text-center relative">
                  <span className={cx('flex h-13 w-13 items-center justify-center rounded-full text-white text-xl font-bold shadow-sm mb-3.5', step.color)}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[180px]">{step.desc}</p>
                  {idx < approvalWorkflow.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[calc(50%+36px)] w-[calc(100%-72px)]">
                      <div className="border-t-2 border-dashed border-gray-200" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Policy Info */}
          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-6">
            <h3 className="text-base font-bold text-blue-950 mb-4">Key Policy Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['Eligibility', 'Minimum 6 months of continuous service required'],
                ['Maximum Limit', 'Up to 80% of current basic salary'],
                ['Repayment', 'EMI deducted from monthly salary, 1-6 months tenure'],
                ['Frequency', 'Maximum 2 advances per financial year'],
                ['Processing Time', '3-5 business days after all approvals'],
                ['Interest', 'Zero interest on salary advances'],
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
      )}

      {/* ─── Tab: Repayment Schedule ─── */}
      {activeTab === 'Repayment Schedule' && (
        <div className="space-y-6">
          {/* Repayment Summary Cards */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Total EMI Amount',
                value: `₹${totalEmiAmount.toLocaleString('en-IN')}`,
                sub: '6 Monthly Deductions',
                icon: <IndianRupee className="h-4 w-4" />,
                iconBg: 'bg-slate-900 text-white',
                badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
              },
              {
                label: 'EMI Paid',
                value: `₹${emiPaid.toLocaleString('en-IN')}`,
                sub: '3 Installments Completed',
                icon: <CheckCircle2 className="h-4 w-4" />,
                iconBg: 'bg-emerald-600 text-white',
                badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              },
              {
                label: 'EMI Remaining',
                value: `₹${emiRemaining.toLocaleString('en-IN')}`,
                sub: '3 Installments Pending',
                icon: <Clock className="h-4 w-4" />,
                iconBg: 'bg-amber-500 text-white',
                badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
              },
              {
                label: 'Next EMI Date',
                value: '05 Jun 2024',
                sub: '12 Days Left',
                icon: <CalendarDays className="h-4 w-4" />,
                iconBg: 'bg-purple-600 text-white',
                badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
              },
            ].map((card) => (
              <div
                key={card.label}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 min-h-[115px] shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all group"
              >
                {/* Top row: Label + Icon */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-700 transition-colors">
                    {card.label}
                  </span>
                  <span className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-transform group-hover:scale-105', card.iconBg)}>
                    {card.icon}
                  </span>
                </div>

                {/* Middle: Prominent Value */}
                <div className="my-1">
                  <h2 className="text-xl sm:text-[22px] font-extrabold text-gray-950 tracking-tight leading-tight">
                    {card.value}
                  </h2>
                </div>

                {/* Bottom: Context Badge */}
                <div className="flex items-center">
                  <span className={cx('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border leading-normal', card.badgeBg)}>
                    <span className="h-1 w-1 rounded-full bg-current opacity-70" />
                    {card.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* EMI Schedule Table */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">EMI Schedule</h2>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                Monthly Payroll Deduction
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50/70 text-gray-600">
                  <tr>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Month</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">EMI Amount</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Status</th>
                    <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-xs">Paid Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {emiSchedule.map((emi) => (
                    <tr key={emi.month} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">{emi.month}</td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-950">₹{emi.amount.toLocaleString('en-IN')}</td>
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
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/60">
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View Full EMI Schedule
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Advance History ─── */}
      {activeTab === 'Advance History' && (
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Advance Summary Donut */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4">Advance Summary</h3>
              <div className="flex items-center gap-6">
                {/* Donut Chart */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="46" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                    {approvedPct > 0 && (
                      <circle
                        cx="60" cy="60" r="46"
                        stroke="#10b981" strokeWidth="12" fill="none"
                        strokeDasharray={`${(approvedPct / 100) * 289.02} 289.02`}
                        strokeDashoffset="0" strokeLinecap="butt"
                      />
                    )}
                    {pendingPct > 0 && (
                      <circle
                        cx="60" cy="60" r="46"
                        stroke="#f59e0b" strokeWidth="12" fill="none"
                        strokeDasharray={`${(pendingPct / 100) * 289.02} 289.02`}
                        strokeDashoffset={`-${(approvedPct / 100) * 289.02}`}
                        strokeLinecap="butt"
                      />
                    )}
                    {rejectedPct > 0 && (
                      <circle
                        cx="60" cy="60" r="46"
                        stroke="#ef4444" strokeWidth="12" fill="none"
                        strokeDasharray={`${(rejectedPct / 100) * 289.02} 289.02`}
                        strokeDashoffset={`-${((approvedPct + pendingPct) / 100) * 289.02}`}
                        strokeLinecap="butt"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-xl font-bold text-gray-950">₹{totalAdvanceTaken.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Taken</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-3.5">
                  {[
                    { label: 'Approved', amount: approvedSum, pct: `${approvedPct}%`, color: 'bg-emerald-500' },
                    { label: 'Pending', amount: pendingSum, pct: `${pendingPct}%`, color: 'bg-amber-500' },
                    { label: 'Rejected', amount: rejectedSum, pct: `${rejectedPct}%`, color: 'bg-rose-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <span className={cx('h-3 w-3 rounded-sm shrink-0', item.color)} />
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">{item.label}</p>
                        <p className="text-xs text-gray-500">₹{item.amount.toLocaleString('en-IN')} ({item.pct})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Repayment Overview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4">Repayment Overview</h3>
              <div className="space-y-4">
                {[
                  { label: 'Total EMI Amount', value: `₹${totalEmiAmount.toLocaleString('en-IN')}`, icon: Receipt, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
                  { label: 'EMI Paid', value: `₹${emiPaid.toLocaleString('en-IN')}`, icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
                  { label: 'EMI Remaining', value: `₹${emiRemaining.toLocaleString('en-IN')}`, icon: Clock, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
                  { label: 'Next EMI Date', value: '05 Jun 2024', icon: CalendarDays, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3.5">
                      <span className={cx('flex h-9 w-9 items-center justify-center rounded-lg shrink-0', item.iconBg, item.iconColor)}>
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
                      <th className="pb-2.5 font-semibold uppercase tracking-wider text-center text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myTransactions.map((txn, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 text-xs text-gray-600 whitespace-nowrap">{txn.date}</td>
                        <td className="py-3 text-xs text-gray-800 font-semibold whitespace-nowrap">{txn.description}</td>
                        <td className="py-3 text-xs text-right font-bold text-gray-950 whitespace-nowrap">₹{txn.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-center whitespace-nowrap">
                          <span className={cx(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border',
                            txn.type === 'Credit'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          )}>
                            {txn.type}
                          </span>
                        </td>
                        <td className="py-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-4 transition-colors">
                View Full EMI Schedule
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
