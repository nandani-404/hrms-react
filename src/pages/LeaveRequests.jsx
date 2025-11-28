import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, X, Eye, Ban } from 'lucide-react'
import { useLeaveRequests, useCreateLeaveRequest, useApproveLeaveRequest, useRejectLeaveRequest, useCancelLeaveRequest, useLeaveBalance } from '../hooks/useLeaveRequests'
import { useEmployees } from '../hooks/useEmployees'
import { format } from 'date-fns'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const LeaveRequests = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: '',
  })

  const { data: requests = [], isLoading, error, refetch } = useLeaveRequests()
  const { data: employees = [] } = useEmployees()
  const { data: balance } = useLeaveBalance()
  const createMutation = useCreateLeaveRequest()
  const approveMutation = useApproveLeaveRequest()
  const rejectMutation = useRejectLeaveRequest()
  const cancelMutation = useCancelLeaveRequest()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync(formData)
      setShowModal(false)
      setFormData({ employee_id: '', leave_type: 'sick', start_date: '', end_date: '', reason: '' })
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create request')
    }
  }

  const handleApprove = async (id) => {
    if (!confirm('Approve this leave request?')) return
    try {
      await approveMutation.mutateAsync({ id, remarks: 'Approved' })
    } catch (error) {
      alert('Failed to approve request')
    }
  }

  const handleReject = async (id) => {
    const remarks = prompt('Reason for rejection:')
    if (!remarks) return
    try {
      await rejectMutation.mutateAsync({ id, remarks })
    } catch (error) {
      alert('Failed to reject request')
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this leave request?')) return
    try {
      await cancelMutation.mutateAsync(id)
    } catch (error) {
      alert('Failed to cancel request')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getLeaveTypeColor = (type) => {
    const colors = {
      sick: 'bg-red-100 text-red-700',
      casual: 'bg-blue-100 text-blue-700',
      earned: 'bg-green-100 text-green-700',
      unpaid: 'bg-gray-100 text-gray-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-gray-600 mt-1">{requests.length} total requests</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Sick Leave</p>
            <p className="text-2xl font-bold text-gray-900">{balance.sick_leave || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Casual Leave</p>
            <p className="text-2xl font-bold text-gray-900">{balance.casual_leave || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Earned Leave</p>
            <p className="text-2xl font-bold text-gray-900">{balance.earned_leave || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Total Available</p>
            <p className="text-2xl font-bold text-gray-900">
              {(balance.sick_leave || 0) + (balance.casual_leave || 0) + (balance.earned_leave || 0)}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.employee?.full_name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {request.employee?.emp_id || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLeaveTypeColor(request.leave_type)}`}>
                        {request.leave_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.start_date && request.end_date ? (
                        <>
                          {format(new Date(request.start_date), 'MMM dd')} - {format(new Date(request.end_date), 'MMM dd, yyyy')}
                        </>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.total_days || 0} days
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(request.id)}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                              title="Cancel"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">New Leave Request</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                  <select
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.emp_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                  <select
                    value={formData.leave_type}
                    onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                    <option value="earned">Earned Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Leave Request Details</h2>
                <button onClick={() => setSelectedRequest(null)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee</label>
                  <p className="text-gray-900">{selectedRequest.employee?.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Leave Type</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLeaveTypeColor(selectedRequest.leave_type)}`}>
                    {selectedRequest.leave_type}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900">
                    {selectedRequest.start_date && selectedRequest.end_date ? (
                      <>
                        {format(new Date(selectedRequest.start_date), 'MMMM dd, yyyy')} - {format(new Date(selectedRequest.end_date), 'MMMM dd, yyyy')}
                      </>
                    ) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">{selectedRequest.total_days || 0} days</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reason</label>
                  <p className="text-gray-900">{selectedRequest.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                {selectedRequest.remarks && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Remarks</label>
                    <p className="text-gray-900">{selectedRequest.remarks}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LeaveRequests
