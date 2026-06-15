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

const PendingApprovalsList = ({ data, onViewDetails }) => {
  const [expandedUsers, setExpandedUsers] = useState({});

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
        <p className="text-gray-500 mt-1">No pending approvals found.</p>
      </div>
    );
  }

  const toggleUserExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="space-y-4">
      {data.map((userGroup) => (
        <motion.div
          key={userGroup.user_id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggleUserExpand(userGroup.user_id)}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-50 border-b border-gray-100 flex justify-between items-center hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1 text-left">
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedUsers[userGroup.user_id] ? "rotate-180" : ""
                }`}
              />
              <div>
                <h3 className="font-semibold text-gray-900">{userGroup.user_name}</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {userGroup.department} • {userGroup.user_email}
                </p>
                {userGroup.reporting_manager && (
                  <p className="text-xs text-gray-500 mt-1">
                    Manager: {userGroup.reporting_manager}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Requested</p>
              <p className="font-bold text-lg text-gray-900">{formatCurrency(userGroup.total_amount)}</p>
              <p className="text-xs text-gray-500 mt-1">{userGroup.expense_count} expense(s)</p>
            </div>
          </button>

          <AnimatePresence>
            {expandedUsers[userGroup.user_id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="divide-y divide-gray-100 overflow-hidden bg-gray-50/50"
              >
                {userGroup.expenses?.map((expense) => (
                  <div
                    key={expense.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">{expense.category_name}</span>
                        <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium capitalize">
                          {expense.approver_role?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDisplayDateTime(expense.created_at || new Date().toISOString())}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          Amount: {formatCurrency(expense.amount)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewDetails(expense.id)}
                      className="ml-4 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      Review
                    </button>
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
  const [expandedUsers, setExpandedUsers] = useState({});

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
        <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No team expenses found.</p>
      </div>
    );
  }

  const toggleUserExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="space-y-4">
      {data.map((userGroup) => (
        <motion.div
          key={userGroup.user_id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggleUserExpand(userGroup.user_id)}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-50 border-b border-gray-100 flex justify-between items-center hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1 text-left">
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedUsers[userGroup.user_id] ? "rotate-180" : ""
                }`}
              />
              <div>
                <h3 className="font-semibold text-gray-900">{userGroup.user_name}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{userGroup.expense_count} Expenses</p>
              </div>
            </div>
            <p className="font-bold text-lg text-gray-900">
              {formatCurrency(userGroup.total_amount)}
            </p>
          </button>

          <AnimatePresence>
            {expandedUsers[userGroup.user_id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="divide-y divide-gray-100 overflow-hidden bg-gray-50/50"
              >
                {userGroup.expenses?.map((expense) => (
                  <div
                    key={expense.id}
                    onClick={() => onViewDetails(expense.id)}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{expense.category_name}</p>
                      <div className="flex gap-2 text-xs mt-2">
                        <span className={`px-2.5 py-1 rounded-full font-medium ${getStatusBadgeStyle(expense.status)}`}>
                          {expense.status}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(parseISO(expense.created_at || new Date().toISOString()), "dd MMM yyyy")}
                        </span>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 ml-4">
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

  const expense = detailsResponse?.data;
  const approvalFlow = expense?.approval_flow;

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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Expense Details</h2>
            <p className="text-sm text-gray-500 mt-1">ID: #{expense?.id}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Status Alert Banner */}
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusCardStyle(expense?.status)}`}>
            <div className="p-2 rounded-full bg-white/60">
              {expense?.status === "approved" ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : expense?.status === "rejected" ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <Clock className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 capitalize">{expense?.status}</p>
              {expense?.status === "rejected" && (
                <p className="text-sm text-red-600 mt-0.5">This expense has been rejected</p>
              )}
            </div>
          </div>

          {/* Amount and Dates Info Card */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</label>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(expense?.amount)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
              <p className="text-lg font-medium text-gray-900 mt-2">
                {expense?.expense_date ? format(parseISO(expense.expense_date), "dd MMM, yyyy") : "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
              <p className="text-lg font-medium text-gray-900 mt-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded capitalize ${getStatusBadgeStyle(expense?.status)}`}>
                  {expense?.status}
                </span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Description</label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-wrap">
              {expense?.description}
            </div>
          </div>

          {/* Parallel Approval Flow Panel */}
          {approvalFlow && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Approval Flow</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-medium text-gray-900">
                    {approvalFlow.employee?.name} ({approvalFlow.employee?.department})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(approvalFlow.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approval Type:</span>
                  <span className="font-medium text-blue-600">Parallel (All must approve)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Required Approvers:</span>
                  <span className="font-medium text-gray-900">{approvalFlow.total_levels}</span>
                </div>
                {approvalFlow.requires_hr_approval && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">HR Approval:</span>
                    <span className="font-medium text-red-600">Required</span>
                  </div>
                )}
                {approvalFlow.approvers && approvalFlow.approvers.length > 0 && (
                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Approvers List:</p>
                    <div className="space-y-1">
                      {approvalFlow.approvers.map((approver, index) => (
                        <div key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span>{approver.name || approver.role?.replace(/_/g, " ")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Attachments */}
          {expense?.attachments && expense.attachments.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Attachments</label>
              <div className="space-y-2">
                {expense.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={`${getAPIHost()}/storage/${file.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group w-max"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded group-hover:bg-blue-200">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 overflow-hidden pr-4">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {file.file_path.split("/").pop()}
                      </p>
                      <p className="text-xs text-gray-500 uppercase">{file.file_type}</p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Approval History */}
          {historyResponse?.approvals && historyResponse.approvals.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
                Approval History
              </label>
              <div className="space-y-3">
                {historyResponse.approvals.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          item.status === "approved" 
                            ? "bg-green-100 text-green-600" 
                            : item.status === "rejected" 
                            ? "bg-red-100 text-red-600" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {item.status === "approved" ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : item.status === "rejected" ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.approver_name || item.approver_role?.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.approver_role?.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded capitalize ${getStatusBadgeStyle(item.status)}`}>
                          {item.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.approved_at ? formatDisplayDateTime(item.approved_at) : "Pending"}
                        </p>
                      </div>
                    </div>
                    {item.remarks && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <p className="text-sm text-gray-700 italic">
                          <span className="font-semibold">Remarks:</span> "{item.remarks}"
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Action Box */}
          {canApproveResponse?.can_approve_reject ? (
            <div className="pt-6 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 px-6 py-6 rounded-b-xl">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Your turn to approve.</span> {canApproveResponse.reason}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    This is a parallel approval flow - all approvers can approve simultaneously.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Remarks (Optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="2"
                    placeholder="Add remarks for approval..."
                    value={approvalRemarks}
                    onChange={e => setApprovalRemarks(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Remarks (Required if rejecting)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="2"
                    placeholder="Provide reason for rejection..."
                    value={rejectionRemarks}
                    onChange={e => setRejectionRemarks(e.target.value)}
                  />
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ One rejection rejects the entire expense request.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReject}
                    disabled={rejectMutation.isPending || approveMutation.isPending}
                    className="flex-1 py-2.5 border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 rounded-lg font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                You cannot approve or reject this expense at this moment.
              </p>
            </div>
          )}
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
    { id: "pending", label: "Pending Approvals", icon: Clock, count: pendingResponse?.data?.reduce((sum, g) => sum + (g.expenses?.length || 0), 0) || 0 },
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
