import { useState } from 'react'
import {
  FileText,
  Send,
  UserCheck,
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  Calendar,
  DollarSign,
  HelpCircle,
  Mail,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  FileCheck,
  History,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  XCircle,
  Check,
  User,
  Users,
  Building2,
  BadgeCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/ui'

export default function Resignation() {
  const { user } = useAuth()
  const userRole = user?.role || 'employee'
  const isHRorAdmin = ['hr', 'super_admin', 'admin'].includes(userRole)

  // Active top tab state ('my-resignation' vs 'approvals')
  const [activeTab, setActiveTab] = useState(isHRorAdmin ? 'approvals' : 'my-resignation')

  // ---------------- My Resignation State ----------------
  const [hasResignation, setHasResignation] = useState(true)
  const [resignationData, setResignationData] = useState({
    id: 'RES-2024-0012',
    status: 'In Progress',
    submittedDate: '20 May 2024',
    submittedTime: '10:30 AM',
    noticePeriodDays: 30,
    noticePeriodRange: '20 May 2024 - 20 Jun 2024',
    lastWorkingDay: '20 Jun 2024',
    daysRemaining: '31 Days',
    reason: 'Better career opportunity',
    comments:
      'I have learned a lot during my tenure here. I am thankful for the opportunities and support provided by the organization.',
    attachment: {
      name: 'Resignation_Letter.pdf',
      size: '245 KB',
    },
  })

  // History log for My Resignation
  const [history, setHistory] = useState([
    {
      id: 1,
      date: '20 May 2024, 10:30 AM',
      action: 'Resignation Submitted',
      by: 'Aditya Tiwari',
      remarks: 'Resignation request submitted',
    },
    {
      id: 2,
      date: '20 May 2024, 10:35 AM',
      action: 'Acknowledged',
      by: 'System',
      remarks: 'Your resignation request has been received',
    },
  ])

  // ---------------- HR Approvals State (All Requests) ----------------
  const [allRequests, setAllRequests] = useState([
    {
      id: 'RES-2024-0012',
      empId: 'EMP001',
      name: 'Aditya Tiwari',
      role: 'HR Manager',
      department: 'Human Resources',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      submittedDate: '20 May 2024, 10:30 AM',
      noticePeriodDays: 30,
      lastWorkingDay: '20 Jun 2024',
      reason: 'Better career opportunity',
      comments: 'Relocating to another city for career growth and advanced opportunities.',
      status: 'Pending HR Review',
      attachment: 'Resignation_Letter.pdf',
      attachmentSize: '245 KB',
    },
    {
      id: 'RES-2024-0011',
      empId: 'EMP004',
      name: 'Sneha Patel',
      role: 'Frontend Developer',
      department: 'Engineering',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      submittedDate: '18 May 2024, 02:15 PM',
      noticePeriodDays: 30,
      lastWorkingDay: '18 Jun 2024',
      reason: 'Higher studies',
      comments: 'Pursuing Master Degree abroad. Requesting early release if possible.',
      status: 'Pending HR Review',
      attachment: 'Resignation_Sneha.pdf',
      attachmentSize: '310 KB',
    },
    {
      id: 'RES-2024-0009',
      empId: 'EMP008',
      name: 'Rohan Sharma',
      role: 'Product Designer',
      department: 'Design',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      submittedDate: '10 May 2024, 11:00 AM',
      noticePeriodDays: 60,
      lastWorkingDay: '10 Jul 2024',
      reason: 'Personal / Family reasons',
      comments: 'Need time off for family commitments.',
      status: 'Approved',
      attachment: 'Resignation_Rohan.pdf',
      attachmentSize: '190 KB',
    },
    {
      id: 'RES-2024-0005',
      empId: 'EMP012',
      name: 'Vikram Singh',
      role: 'QA Engineer',
      department: 'Engineering',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      submittedDate: '02 May 2024, 04:45 PM',
      noticePeriodDays: 30,
      lastWorkingDay: '02 Jun 2024',
      reason: 'Relocation',
      comments: 'Moving out of state.',
      status: 'Approved',
      attachment: 'Resignation_Vikram.pdf',
      attachmentSize: '215 KB',
    },
    {
      id: 'RES-2024-0002',
      empId: 'EMP015',
      name: 'Pooja Verma',
      role: 'Marketing Specialist',
      department: 'Marketing',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      submittedDate: '25 Apr 2024, 09:30 AM',
      noticePeriodDays: 30,
      lastWorkingDay: '25 May 2024',
      reason: 'Health concerns',
      comments: 'Medical leave transition.',
      status: 'Rejected',
      attachment: 'Resignation_Pooja.pdf',
      attachmentSize: '280 KB',
    },
  ])

  // HR Approvals Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  // Modals state
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  // HR Action Modals State
  const [selectedReq, setSelectedReq] = useState(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [hrRemarks, setHrRemarks] = useState('')
  const [approvedLwd, setApprovedLwd] = useState('')

  // Form State for new resignation submission
  const [formData, setFormData] = useState({
    reason: 'Better career opportunity',
    customReason: '',
    noticePeriod: 30,
    lastWorkingDay: '2024-06-20',
    comments: '',
    attachment: null,
  })

  // Handlers for My Resignation
  const handleSubmitResignation = (e) => {
    e.preventDefault()
    if (!formData.comments && formData.reason === 'Other' && !formData.customReason) {
      toast.error('Please provide a reason or comments for leaving.')
      return
    }

    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    const nowTimeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const newId = `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    const newRes = {
      id: newId,
      status: 'In Progress',
      submittedDate: todayStr,
      submittedTime: nowTimeStr,
      noticePeriodDays: Number(formData.noticePeriod) || 30,
      noticePeriodRange: `${todayStr} - ${formData.lastWorkingDay || '20 Jun 2024'}`,
      lastWorkingDay: formData.lastWorkingDay || '20 Jun 2024',
      daysRemaining: `${formData.noticePeriod || 30} Days`,
      reason: formData.reason === 'Other' ? formData.customReason : formData.reason,
      comments: formData.comments || 'No additional comments provided.',
      attachment: formData.attachment
        ? { name: formData.attachment.name, size: `${Math.round(formData.attachment.size / 1024)} KB` }
        : { name: 'Resignation_Letter.pdf', size: '245 KB' },
    }

    setResignationData(newRes)
    setHasResignation(true)
    setHistory((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        date: `${todayStr}, ${nowTimeStr}`,
        action: 'Resignation Submitted',
        by: user?.full_name || 'Aditya Tiwari',
        remarks: `Reason: ${newRes.reason}`,
      },
    ])

    // Add to HR list as well
    setAllRequests((prev) => [
      {
        id: newId,
        empId: user?.employee_id || 'EMP001',
        name: user?.full_name || 'Aditya Tiwari',
        role: user?.designation || 'HR Manager',
        department: user?.department || 'Human Resources',
        photo: user?.photo_path || '',
        submittedDate: `${todayStr}, ${nowTimeStr}`,
        noticePeriodDays: Number(formData.noticePeriod) || 30,
        lastWorkingDay: formData.lastWorkingDay || '20 Jun 2024',
        reason: newRes.reason,
        comments: newRes.comments,
        status: 'Pending HR Review',
        attachment: newRes.attachment.name,
        attachmentSize: newRes.attachment.size,
      },
      ...prev,
    ])

    setShowSubmitModal(false)
    toast.success('Resignation request submitted successfully!')
  }

  const handleWithdrawResignation = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    const nowTimeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    setHasResignation(false)
    setHistory((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        date: `${todayStr}, ${nowTimeStr}`,
        action: 'Resignation Withdrawn',
        by: user?.full_name || 'Aditya Tiwari',
        remarks: 'Employee requested withdrawal of resignation',
      },
    ])

    setAllRequests((prev) =>
      prev.map((req) =>
        req.id === resignationData.id ? { ...req, status: 'Withdrawn' } : req
      )
    )

    setShowWithdrawModal(false)
    toast.success('Resignation request withdrawn successfully.')
  }

  // ---------------- HR Approve & Reject Handlers ----------------
  const handleOpenApproveModal = (req) => {
    setSelectedReq(req)
    setApprovedLwd(req.lastWorkingDay)
    setHrRemarks('')
    setShowApproveModal(true)
  }

  const handleConfirmApprove = () => {
    if (!selectedReq) return
    setAllRequests((prev) =>
      prev.map((item) =>
        item.id === selectedReq.id
          ? { ...item, status: 'Approved', lastWorkingDay: approvedLwd || item.lastWorkingDay }
          : item
      )
    )
    if (selectedReq.id === resignationData.id) {
      setResignationData((prev) => ({ ...prev, status: 'Approved' }))
    }
    setShowApproveModal(false)
    toast.success(`Resignation for ${selectedReq.name} approved successfully!`)
  }

  const handleOpenRejectModal = (req) => {
    setSelectedReq(req)
    setHrRemarks('')
    setShowRejectModal(true)
  }

  const handleConfirmReject = () => {
    if (!selectedReq) return
    if (!hrRemarks.trim()) {
      toast.error('Please provide a reason for rejecting the resignation.')
      return
    }

    setAllRequests((prev) =>
      prev.map((item) =>
        item.id === selectedReq.id ? { ...item, status: 'Rejected' } : item
      )
    )
    if (selectedReq.id === resignationData.id) {
      setResignationData((prev) => ({ ...prev, status: 'Rejected' }))
    }
    setShowRejectModal(false)
    toast.error(`Resignation for ${selectedReq.name} rejected.`)
  }

  // Filtered requests for HR view
  const filteredHRRequests = allRequests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'All Status' ||
      (statusFilter === 'Pending Review' && req.status.includes('Pending')) ||
      req.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pending count for badge
  const pendingCount = allRequests.filter((r) => r.status.includes('Pending')).length
  const approvedCount = allRequests.filter((r) => r.status === 'Approved').length
  const rejectedCount = allRequests.filter((r) => r.status === 'Rejected' || r.status === 'Withdrawn').length

  return (
    <div className="space-y-6 pb-12">
      {/* ---------------- Header Section & Navigation ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resignation</h1>
          <nav className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-500">
            <span>Home</span>
            <span>&gt;</span>
            <span>Resignation</span>
            <span>&gt;</span>
            <span className="text-gray-700 font-semibold">
              {activeTab === 'approvals' ? 'Resignation Approvals' : 'My Resignation'}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Resignation</span>
          </button>
        </div>
      </div>

      {/* ---------------- Top View Toggle Tabs (My Resignation vs HR Approvals) ---------------- */}
      <div className="flex border-b border-gray-200 bg-white px-3 pt-2 rounded-xl shadow-2xs">
        <button
          onClick={() => setActiveTab('my-resignation')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
            activeTab === 'my-resignation'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="h-4 w-4" />
          <span>My Resignation</span>
        </button>

        {isHRorAdmin && (
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2.5 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === 'approvals'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <BadgeCheck className="h-4 w-4" />
            <span>Resignation Approvals</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-200">
                {pendingCount} Pending
              </span>
            )}
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HR APPROVALS VIEW (Displayed for HR/Admin when 'approvals' active) */}
      {/* ========================================================================= */}
      {activeTab === 'approvals' && isHRorAdmin && (
        <div className="space-y-6">
          {/* Stat Overview Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Total Requests</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{allRequests.length}</p>
              <p className="mt-1 text-[11px] text-gray-500">All submitted exit requests</p>
            </div>

            <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800">Pending Review</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-900">{pendingCount}</p>
              <p className="mt-1 text-[11px] text-amber-700">Awaiting HR decision</p>
            </div>

            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">Approved Exits</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-900">{approvedCount}</p>
              <p className="mt-1 text-[11px] text-emerald-700">Exit clearance active</p>
            </div>

            <div className="rounded-xl border border-rose-200/80 bg-rose-50/30 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-800">Rejected / Withdrawn</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                  <XCircle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-rose-900">{rejectedCount}</p>
              <p className="mt-1 text-[11px] text-rose-700">Cancelled exit processes</p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employee, ID, reason..."
                className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-xs font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="All Status">All Status</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resignations Requests Table */}
          <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-base font-bold text-gray-900">Employee Resignation Requests</h2>
              </div>
              <span className="text-xs text-gray-500">Showing {filteredHRRequests.length} requests</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Req ID &amp; Date</th>
                    <th className="px-4 py-3">Notice &amp; LWD</th>
                    <th className="px-4 py-3">Reason for Leaving</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredHRRequests.map((req) => {
                    const isPending = req.status.includes('Pending')
                    const isApproved = req.status === 'Approved'
                    const isRejected = req.status === 'Rejected'

                    return (
                      <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Employee Details */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={req.name} src={req.photo} size="sm" />
                            <div>
                              <p className="font-bold text-gray-900">{req.name}</p>
                              <p className="text-[11px] text-gray-500">
                                {req.empId} • {req.role}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Req ID & Date */}
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-gray-900">{req.id}</p>
                          <p className="text-[11px] text-gray-500">{req.submittedDate}</p>
                        </td>

                        {/* Notice & LWD */}
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-gray-900">{req.lastWorkingDay}</p>
                          <p className="text-[11px] text-gray-500">{req.noticePeriodDays} Days Notice</p>
                        </td>

                        {/* Reason */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="font-medium text-gray-900 truncate" title={req.reason}>
                            {req.reason}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate" title={req.comments}>
                            {req.comments}
                          </p>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                              <Clock className="h-3 w-3" />
                              {req.status}
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" />
                              Approved
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                              <XCircle className="h-3 w-3" />
                              Rejected
                            </span>
                          )}
                          {req.status === 'Withdrawn' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 border border-gray-200">
                              Withdrawn
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedReq(req)
                                setShowDetailModal(true)
                              }}
                              className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleOpenApproveModal(req)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-[0.98] transition-all"
                                  title="Approve Resignation"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Approve</span>
                                </button>

                                <button
                                  onClick={() => handleOpenRejectModal(req)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 active:scale-[0.98] transition-all"
                                  title="Reject Resignation"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY RESIGNATION VIEW (Displayed when 'my-resignation' active)        */}
      {/* ========================================================================= */}
      {activeTab === 'my-resignation' && (
        <div className="space-y-6">
          {/* Stepper Progress Banner */}
          {hasResignation ? (
            <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Document Badge & ID */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-medium text-gray-500">Resignation Progress</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3">
                      <span className="text-base font-bold text-gray-900 tracking-tight">{resignationData.id}</span>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/70">
                        {resignationData.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Submitted on <span className="font-semibold text-gray-700">{resignationData.submittedDate}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Stepper Timeline Bar */}
                <div className="flex-1 lg:max-w-3xl">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-6 right-6 top-4 -z-0 h-0.5 bg-gray-200" />

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm ring-4 ring-white">
                        <Send className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-xs font-bold text-gray-900">1. Submitted</span>
                      <span className="text-[11px] text-gray-500">{resignationData.submittedDate}</span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber-500 bg-white text-amber-500 shadow-sm ring-4 ring-white">
                        <UserCheck className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-xs font-bold text-gray-900">2. Manager Review</span>
                      <span className="text-[11px] font-medium text-amber-600">Pending</span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-purple-400 bg-white text-purple-600 shadow-sm ring-4 ring-white">
                        <span className="text-xs font-bold">HR</span>
                      </div>
                      <span className="mt-2 text-xs font-bold text-gray-900">3. HR Review</span>
                      <span className="text-[11px] font-medium text-gray-400">Pending</span>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber-300 bg-white text-amber-600 shadow-sm ring-4 ring-white">
                        <FileCheck className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-xs font-bold text-gray-900">4. Clearance</span>
                      <span className="text-[11px] font-medium text-gray-400">Pending</span>
                    </div>

                    {/* Step 5 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400 shadow-sm ring-4 ring-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-xs font-bold text-gray-900">5. Completed</span>
                      <span className="text-[11px] font-medium text-gray-400">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">No Active Resignation Request</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-md mx-auto">
                You currently have no active resignation request in the system. If you wish to initiate an exit process, click the button below.
              </p>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Submit Resignation Request
              </button>
            </div>
          )}

          {/* Main Content Grid */}
          {hasResignation && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Card: Resignation Details (Span 4) */}
              <div className="flex flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm lg:col-span-4">
                <div className="space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-bold text-gray-900">Resignation Details</h2>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between border-b border-gray-100/80 pb-2.5">
                      <span className="text-xs font-semibold text-gray-500">Notice Period</span>
                      <span className="font-bold text-gray-900">{resignationData.noticePeriodDays} Days</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100/80 pb-2.5">
                      <span className="text-xs font-semibold text-gray-500">Last Working Day</span>
                      <span className="font-bold text-gray-900">{resignationData.lastWorkingDay}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100/80 pb-2.5">
                      <span className="text-xs font-semibold text-gray-500">Reason for Leaving</span>
                      <span className="font-semibold text-gray-800 text-right">{resignationData.reason}</span>
                    </div>

                    <div className="space-y-1.5 border-b border-gray-100/80 pb-3">
                      <span className="text-xs font-semibold text-gray-500">Additional Comments</span>
                      <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                        {resignationData.comments}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500">Attachments</span>
                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{resignationData.attachment.name}</p>
                            <p className="text-[11px] text-gray-500">{resignationData.attachment.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toast.success(`Downloading ${resignationData.attachment.name}`)}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                          title="Download Attachment"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50/50 px-4 py-2.5 text-xs font-bold text-red-600 shadow-2xs transition-all hover:bg-red-100 hover:border-red-300 active:scale-[0.99]"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Withdraw Resignation</span>
                  </button>
                </div>
              </div>

              {/* Middle Card: Approval Workflow (Span 4) */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm lg:col-span-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-bold text-gray-900">Approval Workflow</h2>
                </div>

                <div className="relative mt-5 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-gray-900">Resignation Submitted</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">{resignationData.submittedDate}, {resignationData.submittedTime}</p>
                      <p className="text-xs font-medium text-gray-700 mt-1">Aditya Tiwari (You)</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs ring-4 ring-white">
                      <span>2</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-900">Manager Review</h3>
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 mt-1">Rahul Sharma</p>
                      <p className="text-[11px] text-gray-500">HR Manager</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white font-bold text-xs text-gray-400 ring-4 ring-white">
                      <span>3</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-900">HR Review</h3>
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 mt-1">Neha Verma</p>
                      <p className="text-[11px] text-gray-500">HR Executive</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white font-bold text-xs text-gray-400 ring-4 ring-white">
                      <span>4</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-900">Clearance Process</h3>
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Multiple Departments</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white font-bold text-xs text-gray-400 ring-4 ring-white">
                      <span>5</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-900">Exit Process Complete</h3>
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Important Info + Help (Span 4) */}
              <div className="space-y-6 lg:col-span-4">
                <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-bold text-gray-900">Important Information</h2>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">Notice Period</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">{resignationData.noticePeriodRange}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        {resignationData.noticePeriodDays} Days
                      </span>
                    </div>

                    <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">Last Working Day</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">{resignationData.lastWorkingDay}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        In {resignationData.daysRemaining}
                      </span>
                    </div>

                    <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">Exit Process</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">Will start after approval</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
                        Upcoming
                      </span>
                    </div>

                    <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">Full &amp; Final Settlement</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">Will be processed after last working day</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
                        Upcoming
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-bold text-gray-900">Need Help?</h2>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    If you have any questions regarding your resignation process, please contact HR.
                  </p>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-xs font-bold text-blue-600 shadow-2xs transition-all hover:bg-blue-50 focus:outline-none"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact HR Department</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resignation History Card */}
          <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <History className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-gray-900">Resignation History</h2>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">By</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{row.action}</td>
                      <td className="px-4 py-3 text-gray-700">{row.by}</td>
                      <td className="px-4 py-3 text-gray-600">{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
              <span>Showing 1 to {history.length} of {history.length} records</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: HR Approve Resignation Modal ---------------- */}
      {showApproveModal && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Approve Resignation</h3>
                  <p className="text-[11px] text-gray-500">{selectedReq.id} • {selectedReq.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowApproveModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700">Confirmed Last Working Day *</label>
                <input
                  type="date"
                  value={approvedLwd}
                  onChange={(e) => setApprovedLwd(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">HR Remarks / Exit Instructions (Optional)</label>
                <textarea
                  rows={3}
                  value={hrRemarks}
                  onChange={(e) => setHrRemarks(e.target.value)}
                  placeholder="Enter HR approval remarks, handover instructions..."
                  className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 font-medium text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowApproveModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: HR Reject Resignation Modal ---------------- */}
      {showRejectModal && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Reject Resignation</h3>
                  <p className="text-[11px] text-gray-500">{selectedReq.id} • {selectedReq.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700">Reason for Rejection *</label>
                <textarea
                  rows={3}
                  required
                  value={hrRemarks}
                  onChange={(e) => setHrRemarks(e.target.value)}
                  placeholder="Provide reason for rejecting this resignation request..."
                  className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 font-medium text-gray-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: HR View Details Modal ---------------- */}
      {showDetailModal && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <Avatar name={selectedReq.name} src={selectedReq.photo} size="md" />
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedReq.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedReq.empId} • {selectedReq.role} ({selectedReq.department})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <div>
                  <span className="text-gray-500 font-semibold">Resignation ID:</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedReq.id}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold">Submission Date:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedReq.submittedDate}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold">Notice Period:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedReq.noticePeriodDays} Days</p>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold">Requested Last Working Day:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedReq.lastWorkingDay}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 font-bold">Reason for Leaving:</span>
                <p className="font-semibold text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                  {selectedReq.reason}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 font-bold">Employee Comments:</span>
                <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 leading-relaxed">
                  {selectedReq.comments}
                </p>
              </div>

              {selectedReq.attachment && (
                <div className="space-y-1">
                  <span className="text-gray-500 font-bold">Attached Resignation Letter:</span>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-bold text-gray-900">{selectedReq.attachment}</p>
                        <p className="text-[11px] text-gray-500">{selectedReq.attachmentSize}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success(`Downloading ${selectedReq.attachment}`)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold text-gray-500">
                Status: <span className="font-bold text-gray-900">{selectedReq.status}</span>
              </span>
              <div className="flex items-center gap-3">
                {selectedReq.status.includes('Pending') && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailModal(false)
                        handleOpenRejectModal(selectedReq)
                      }}
                      className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false)
                        handleOpenApproveModal(selectedReq)
                      }}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 1: Submit Resignation Modal ---------------- */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Submit Resignation</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResignation} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700">Reason for Leaving *</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Better career opportunity">Better career opportunity</option>
                  <option value="Personal / Family reasons">Personal / Family reasons</option>
                  <option value="Relocation">Relocation</option>
                  <option value="Higher studies">Higher studies</option>
                  <option value="Health concerns">Health concerns</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.reason === 'Other' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700">Specify Reason *</label>
                  <input
                    type="text"
                    required
                    value={formData.customReason}
                    onChange={(e) => setFormData({ ...formData, customReason: e.target.value })}
                    placeholder="Enter custom reason..."
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Notice Period (Days)</label>
                  <input
                    type="number"
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Last Working Day *</label>
                  <input
                    type="date"
                    required
                    value={formData.lastWorkingDay}
                    onChange={(e) => setFormData({ ...formData, lastWorkingDay: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Additional Comments</label>
                <textarea
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Share details or feedback regarding your resignation..."
                  className="mt-1.5 w-full rounded-lg border border-gray-300 p-3 text-xs font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Upload Resignation Letter (PDF)</label>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
                    className="block w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Submit Resignation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: Withdraw Resignation Modal ---------------- */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Withdraw Resignation?</h3>
            </div>
            <p className="mt-3 text-xs text-gray-600 leading-relaxed">
              Are you sure you want to withdraw your active resignation request (<span className="font-bold text-gray-900">{resignationData.id}</span>)? This will cancel the exit process and notify HR.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                No, Keep Request
              </button>
              <button
                onClick={handleWithdrawResignation}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
              >
                Yes, Withdraw Resignation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: Contact HR Modal ---------------- */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Contact HR Department</h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-gray-600">
                You can reach the HR Helpdesk directly regarding your resignation or exit formalities:
              </p>

              <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-500">HR Helpdesk Email:</span>
                  <span className="font-bold text-blue-600">hr@truckmit.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Contact Phone:</span>
                  <span className="font-bold text-gray-900">+91 98765 43210</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Office Hours:</span>
                  <span className="font-medium text-gray-800">Mon - Fri (9:00 AM - 6:00 PM)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  setShowContactModal(false)
                  toast.success('HR Support request logged!')
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
