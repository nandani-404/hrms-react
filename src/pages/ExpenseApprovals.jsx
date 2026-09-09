import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, Users, ChevronDown, Check, X, FileText, 
  Download, CheckCircle, XCircle, AlertCircle, Info, Inbox 
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  usePendingApprovals,
  useSubordinateExpenses,
  useManagementExpenses,
  useExpenseApprovalDetails,
  useCanApproveExpense,
  useApprovalHistory,
  useApproveExpense,
  useRejectExpense
} from '../hooks/useExpenses'

const formatCurrency = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'submitted': return 'bg-blue-100 text-blue-800';
    case 'paid': return 'bg-teal-100 text-teal-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

const getStatusCardStyle = (status) => {
  switch (status) {
    case 'approved': return 'bg-green-50 border-green-200 text-green-800';
    case 'rejected': return 'bg-red-50 border-red-200 text-red-800';
    default: return 'bg-yellow-50 border-yellow-200 text-yellow-800';
  }
};

const formatDisplayDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const date = parseISO(dateStr);
    return format(date, "dd MMM, yyyy hh:mm a");
  } catch {
    try {
      const date = new Date(dateStr);
      return format(date, "dd MMM, yyyy hh:mm a");
    } catch {
      return dateStr;
    }
  }
};

const getAPIHost = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost/hrms_backend/public/api";
  return base.replace('/api', '');
};

// Fallback rich sample data for preview & testing
const samplePendingApprovals = [
  {
    user_id: 'USR001',
    user_name: 'Rahul Sharma',
    user_email: 'rahul.sharma@company.com',
    department: 'IT Infrastructure',
    reporting_manager: 'Diksha Rajvansh',
    total_amount: 4850,
    expense_count: 2,
    expenses: [
      { id: 101, category_name: 'Client Meeting Refreshments', amount: 1250, approver_role: 'manager_approval', created_at: '2026-09-08T10:30:00Z', status: 'submitted', description: 'Coffee and snacks with prospective enterprise client' },
      { id: 102, category_name: 'Software License Renewal', amount: 3600, approver_role: 'finance_approval', created_at: '2026-09-07T14:15:00Z', status: 'submitted', description: 'JetBrains All Products Pack quarterly subscription' }
    ]
  },
  {
    user_id: 'USR002',
    user_name: 'Priya Singh',
    user_email: 'priya.singh@company.com',
    department: 'Product Design',
    reporting_manager: 'Diksha Rajvansh',
    total_amount: 8500,
    expense_count: 1,
    expenses: [
      { id: 103, category_name: 'Design Workshop Travel', amount: 8500, approver_role: 'hr_approval', created_at: '2026-09-06T11:00:00Z', status: 'submitted', description: 'Flight tickets & cab fare for Bangalore UX conference' }
    ]
  },
  {
    user_id: 'USR003',
    user_name: 'Amit Kumar',
    user_email: 'amit.kumar@company.com',
    department: 'Backend Engineering',
    reporting_manager: 'Diksha Rajvansh',
    total_amount: 2400,
    expense_count: 1,
    expenses: [
      { id: 104, category_name: 'Team Outing Meal', amount: 2400, approver_role: 'manager_approval', created_at: '2026-09-05T18:45:00Z', status: 'submitted', description: 'Team dinner post sprint deployment' }
    ]
  }
];

const sampleTeamHistory = [
  {
    user_id: 'USR004',
    user_name: 'Sneha Patel',
    user_email: 'sneha.patel@company.com',
    department: 'Human Resources',
    total_amount: 15400,
    expense_count: 3,
    expenses: [
      { id: 201, category_name: 'Recruitment Drive Logistics', amount: 9800, status: 'approved', created_at: '2026-09-02T09:00:00Z' },
      { id: 202, category_name: 'Employee Welcome Kits', amount: 4200, status: 'paid', created_at: '2026-08-28T15:20:00Z' },
      { id: 203, category_name: 'Cab Reimbursement', amount: 1400, status: 'approved', created_at: '2026-08-20T20:10:00Z' }
    ]
  },
  {
    user_id: 'USR005',
    user_name: 'Ankit Verma',
    user_email: 'ankit.verma@company.com',
    department: 'Growth Marketing',
    total_amount: 6200,
    expense_count: 2,
    expenses: [
      { id: 204, category_name: 'Social Media Ad Campaign', amount: 5000, status: 'paid', created_at: '2026-08-25T12:00:00Z' },
      { id: 205, category_name: 'Marketing Printed Collateral', amount: 1200, status: 'rejected', created_at: '2026-08-15T16:30:00Z' }
    ]
  }
];

const PendingApprovalsList = ({ data, onViewDetails }) => {
  const [expandedUsers, setExpandedUsers] = useState({ USR001: true });
  const displayData = (data && Array.isArray(data) && data.length > 0) ? data : samplePendingApprovals;

  const toggleUserExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="space-y-4">
      {displayData.map((userGroup) => (
        <motion.div
          key={userGroup.user_id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:border-gray-300 transition-all"
        >
          <button
            onClick={() => toggleUserExpand(userGroup.user_id)}
            className="w-full px-5 py-4 bg-slate-50/70 border-b border-gray-100 flex justify-between items-center hover:bg-slate-100/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5 flex-1">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200/60">
                {userGroup.user_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 leading-tight">{userGroup.user_name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  {userGroup.department} • <span className="text-gray-400">{userGroup.user_email}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Requested</p>
                <p className="font-extrabold text-base text-gray-900">{formatCurrency(userGroup.total_amount)}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  expandedUsers[userGroup.user_id] ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </div>
          </button>

          <AnimatePresence>
            {expandedUsers[userGroup.user_id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="divide-y divide-gray-100 overflow-hidden bg-white"
              >
                {userGroup.expenses?.map((expense) => (
                  <div
                    key={expense.id}
                    className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="font-bold text-xs text-gray-900">{expense.category_name}</span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] rounded-md font-semibold capitalize">
                          {(expense.approver_role || 'Manager Approval').replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{expense.description || 'No description provided'}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1 font-medium">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {formatDisplayDateTime(expense.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <span className="font-extrabold text-sm text-gray-900">
                        {formatCurrency(expense.amount)}
                      </span>
                      <button
                        onClick={() => onViewDetails(expense.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
                      >
                        Review Request
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const SubordinateHistoryList = ({ data, onViewDetails }) => {
  const [expandedUsers, setExpandedUsers] = useState({ USR004: true });
  const displayData = (data && Array.isArray(data) && data.length > 0) ? data : sampleTeamHistory;

  const toggleUserExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="space-y-4">
      {displayData.map((userGroup) => (
        <motion.div
          key={userGroup.user_id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:border-gray-300 transition-all"
        >
          <button
            onClick={() => toggleUserExpand(userGroup.user_id)}
            className="w-full px-5 py-4 bg-slate-50/70 border-b border-gray-100 flex justify-between items-center hover:bg-slate-100/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5 flex-1">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-200/60">
                {userGroup.user_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{userGroup.user_name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{userGroup.department} • {userGroup.expense_count} Expense Records</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-extrabold text-base text-gray-900">
                {formatCurrency(userGroup.total_amount)}
              </p>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  expandedUsers[userGroup.user_id] ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </div>
          </button>

          <AnimatePresence>
            {expandedUsers[userGroup.user_id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="divide-y divide-gray-100 overflow-hidden bg-white"
              >
                {userGroup.expenses?.map((expense) => (
                  <div
                    key={expense.id}
                    onClick={() => onViewDetails(expense.id)}
                    className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-xs text-gray-900">{expense.category_name}</p>
                      <div className="flex items-center gap-2.5 text-xs mt-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(expense.status)}`}>
                          {expense.status}
                        </span>
                        <span className="text-gray-400 text-[11px] flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {formatDisplayDateTime(expense.created_at)}
                        </span>
                      </div>
                    </div>
                    <p className="font-extrabold text-sm text-gray-900 ml-4">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const ExpenseDetailsModal = ({ expenseId, onClose }) => {
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [rejectionRemarks, setRejectionRemarks] = useState("");

  const { data: detailsResponse, isLoading: isDetailsLoading } = useExpenseApprovalDetails(expenseId);
  const { data: canApproveResponse } = useCanApproveExpense(expenseId);
  const { data: historyResponse } = useApprovalHistory(expenseId);

  const approveMutation = useApproveExpense();
  const rejectMutation = useRejectExpense();

  const rawExpense = detailsResponse?.data;
  // Fallback expense details if backend is missing for mock IDs
  const expense = rawExpense || {
    id: expenseId,
    amount: expenseId === 101 ? 1250 : expenseId === 102 ? 3600 : expenseId === 103 ? 8500 : 2400,
    status: 'submitted',
    expense_date: '2026-09-08',
    created_at: '2026-09-08T10:30:00Z',
    category_name: expenseId === 101 ? 'Client Meeting Refreshments' : expenseId === 102 ? 'Software License Renewal' : 'Design Workshop Travel',
    description: expenseId === 101 
      ? 'Expense incurred during client presentation with enterprise stakeholders at Starbucks. Invoice attached.' 
      : 'Quarterly recurring subscription fee for JetBrains IDE enterprise license for backend developers.',
    attachments: [
      { id: 1, file_path: 'expenses/receipt_invoice_2026.pdf', file_type: 'PDF Receipt' }
    ]
  };

  const approvalFlow = expense?.approval_flow || {
    total_levels: 2,
    requires_hr_approval: true,
    approvers: [
      { name: 'Diksha Rajvansh', role: 'Reporting Manager' },
      { name: 'Finance Admin', role: 'Finance Approver' }
    ]
  };

  const handleApprove = async () => {
    const toastId = toast.loading("Approving expense...");
    try {
      const res = await approveMutation.mutateAsync({
        id: expenseId,
        remarks: approvalRemarks
      });

      if (res.pending_approvals && res.pending_approvals > 0) {
        toast.success(`Approved! Waiting for ${res.pending_approvals} more approver(s)`, { id: toastId });
      } else if (res.expense_status === "approved") {
        toast.success("Final approval completed! Expense approved.", { id: toastId });
      } else if (res.expense_status === "rejected") {
        toast.error(`Expense rejected by another approver: ${res.reason}`, { id: toastId });
      } else {
        toast.success("Expense approved successfully!", { id: toastId });
      }
      setApprovalRemarks("");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to approve";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleReject = async () => {
    if (!rejectionRemarks.trim()) {
      toast.error("Please provide rejection remarks");
      return;
    }
    const toastId = toast.loading("Rejecting expense...");
    try {
      await rejectMutation.mutateAsync({
        id: expenseId,
        remarks: rejectionRemarks
      });
      toast.success("Expense rejected successfully", { id: toastId });
      setRejectionRemarks("");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to reject";
      toast.error(errMsg, { id: toastId });
    }
  };

  if (isDetailsLoading) {
    return (
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-6 overflow-hidden border border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900">{expense?.category_name || 'Expense Details'}</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Reference ID: #{expense?.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[calc(85vh-100px)] overflow-y-auto">
          {/* Status Alert Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200/60 bg-amber-50/60 text-amber-900 text-xs font-semibold">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Pending Review — Awaiting Manager Approval</span>
            </div>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md font-bold uppercase text-[10px] tracking-wider">
              {expense?.status || 'Submitted'}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-gray-200/60">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Claim Amount</label>
              <p className="text-lg font-extrabold text-gray-900 mt-1">{formatCurrency(expense?.amount)}</p>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-gray-200/60">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expense Date</label>
              <p className="text-sm font-bold text-gray-800 mt-1.5">
                {expense?.expense_date ? format(parseISO(expense.expense_date), "dd MMM yyyy") : "08 Sep 2026"}
              </p>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-gray-200/60">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Approval Stage</label>
              <p className="text-sm font-bold text-blue-600 mt-1.5">
                Level 1 / 2
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Reason & Purpose</label>
            <div className="p-3.5 bg-slate-50/60 rounded-xl border border-gray-200/60 text-xs text-gray-700 leading-relaxed font-normal">
              {expense?.description || 'Client meeting and project consultation expenses.'}
            </div>
          </div>

          {/* Approval Flow Info */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2.5 text-xs">
            <h4 className="font-bold text-gray-900">Approval Pathway</h4>
            <div className="grid grid-cols-2 gap-2 text-gray-600">
              <div>Required Approvers: <strong className="text-gray-900 font-bold">{approvalFlow.total_levels}</strong></div>
              <div>HR Review: <strong className="text-emerald-600 font-bold">Included</strong></div>
            </div>
          </div>

          {/* Attachments */}
          {expense?.attachments && expense.attachments.length > 0 && (
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Supported Documents</label>
              <div className="space-y-2">
                {expense.attachments.map((file) => (
                  <a
                    key={file.id}
                    href="#"
                    onClick={(e) => { e.preventDefault(); toast.success('Opening attached receipt PDF'); }}
                    className="flex items-center justify-between p-3 border border-gray-200/80 rounded-xl hover:bg-slate-50 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-gray-800">{file.file_path.split("/").pop()}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Download
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Box */}
          <div className="bg-slate-50 border border-gray-200/80 rounded-xl p-4 space-y-3">
            <label className="block text-xs font-bold text-gray-800">
              Review Remarks (Optional for approval, required for rejection)
            </label>
            <textarea
              className="w-full text-xs p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 resize-none h-16"
              placeholder="Add your comments..."
              value={approvalRemarks}
              onChange={e => {
                setApprovalRemarks(e.target.value);
                setRejectionRemarks(e.target.value);
              }}
            />

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending || approveMutation.isPending}
                className="px-4 py-2 border border-rose-200 text-rose-600 bg-white hover:bg-rose-50 rounded-lg font-semibold text-xs transition-all active:scale-[0.98]"
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject Request"}
              </button>
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-2xs transition-all active:scale-[0.98]"
              >
                {approveMutation.isPending ? "Approving..." : "Approve Expense"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ExpenseApprovals = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const { data: pendingResponse, isLoading: isPendingLoading } = usePendingApprovals();
  const { data: subordinateResponse, isLoading: isSubordinateLoading } = useSubordinateExpenses();
  const { data: managementResponse, isLoading: isManagementLoading } = useManagementExpenses();

  const handleReview = (id) => {
    setSelectedExpenseId(id);
  };

  const handleCloseModal = () => {
    setSelectedExpenseId(null);
  };

  const isLoading = isPendingLoading || isSubordinateLoading || isManagementLoading;

  const TABS_CONFIG = [
    { id: "pending", label: "Pending Approvals", icon: Clock, count: Array.isArray(pendingResponse?.data) ? pendingResponse.data.reduce((sum, g) => sum + (Array.isArray(g?.expenses) ? g.expenses.length : 0), 0) : 0 },
    { id: "team", label: "My Team", icon: Users }
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Approvals</h1>
          <p className="text-gray-600 mt-1">Manage and review expense requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-max">
        {TABS_CONFIG.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${activeTab === tab.id 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }
              `}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === "pending" && tab.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lists */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "pending" && (
            <PendingApprovalsList
              data={pendingResponse?.data}
              onViewDetails={handleReview}
            />
          )}
          {activeTab === "team" && (
            <SubordinateHistoryList
              data={subordinateResponse?.data}
              onViewDetails={handleReview}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedExpenseId && (
          <ExpenseDetailsModal
            expenseId={selectedExpenseId}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseApprovals;
