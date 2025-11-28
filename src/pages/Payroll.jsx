import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Download, DollarSign } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { usePayroll } from '../hooks/usePayroll'
import toast from 'react-hot-toast'

const Payroll = () => {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'))
  const [shouldFetch, setShouldFetch] = useState(true)

  const { data: payrollData, isLoading: loading, refetch } = usePayroll(
    shouldFetch ? { start_date: startDate, end_date: endDate } : {}
  )

  const fetchPayroll = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates')
      return
    }
    setShouldFetch(true)
    refetch()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
        <p className="text-gray-600 mt-1">Manage employee payroll</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchPayroll}
              disabled={loading}
              className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Generate Payroll'}
            </button>
          </div>
        </div>
      </div>

      {payrollData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                  <h3 className="text-2xl font-bold text-gray-900">{payrollData.total_employees || 0}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Payable</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(payrollData.total_payable)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Working Days</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {payrollData.date_range?.total_working_days || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Employee Payroll Details</h2>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Per Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payrollData.employees?.map((employee) => (
                    <motion.tr
                      key={employee.employee_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                          <div className="text-xs text-gray-500">{employee.employee_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatCurrency(employee.ctc)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.present_days}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.absent_days}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatCurrency(employee.per_day_salary)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(employee.net_payable)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Payroll
