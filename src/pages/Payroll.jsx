import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Download, DollarSign, Users, TrendingUp, Eye, X, IndianRupee } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { usePayroll, useEmployeePayroll } from '../hooks/usePayroll'
import { useDepartments } from '../hooks/useEmployees'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

const Payroll = () => {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'))
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const { data: payrollData, isLoading: loading } = usePayroll({
    start_date: startDate,
    end_date: endDate,
    ...(selectedDepartment && { department: selectedDepartment }),
    ...(selectedEmployeeId && { employee_id: selectedEmployeeId })
  })

  const { data: departments = [] } = useDepartments()
  
  const { data: employeeDetails } = useEmployeePayroll(
    selectedEmployee?.employee_id,
    startDate,
    endDate
  )

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee)
    setShowDetailsModal(true)
  }

  const handleExportCSV = () => {
    if (!payrollData?.employees) {
      toast.error('No payroll data to export')
      return
    }

    // Create CSV content
    const headers = [
      'Employee ID', 'Name', 'Department', 'Designation', 'CTC', 
      'Total Working Days', 'Present Days', 'Full Days', 'Half Days', 'WFH Days', 'Absent Days',
      'Per Day Salary', 'Deduction Amount', 'Net Payable'
    ]
    
    const rows = payrollData.employees.map(emp => [
      emp.employee_id,
      emp.full_name,
      emp.department,
      emp.designation,
      emp.ctc,
      emp.total_working_days,
      emp.present_days,
      emp.full_days,
      emp.half_days,
      emp.wfh_days,
      emp.absent_days,
      emp.per_day_salary,
      emp.deduction_amount,
      emp.net_payable
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payroll_${startDate}_to_${endDate}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success('Payroll exported successfully!')
  }

  const handleDownloadSlip = (employee) => {
    const doc = new jsPDF()
    
    // Helper function to format currency without symbol for PDF
    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount || 0)
    }
    
    // Get department name
    const deptName = departments.find(d => d.id === parseInt(employee.department))?.name || employee.department || 'N/A'
    
    // Company Header with border
    doc.setFillColor(41, 128, 185)
    doc.rect(0, 0, 210, 45, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(26)
    doc.setFont('helvetica', 'bold')
    doc.text('TruckMitr Pvt. Ltd', 105, 22, { align: 'center' })
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('SALARY SLIP', 105, 32, { align: 'center' })
    doc.text(`For the period: ${format(new Date(startDate), 'dd MMM yyyy')} to ${format(new Date(endDate), 'dd MMM yyyy')}`, 105, 40, { align: 'center' })
    
    // Reset text color
    doc.setTextColor(0, 0, 0)
    
    // Employee Details - Two columns
    let y = 58
    doc.setFillColor(230, 230, 230)
    doc.rect(10, y, 190, 7, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('EMPLOYEE INFORMATION', 15, y + 5)
    
    y += 12
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    
    // Left column
    doc.text('Employee Name:', 15, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(employee.full_name), 55, y)
    
    // Right column
    doc.setFont('helvetica', 'bold')
    doc.text('Employee ID:', 110, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(employee.employee_id), 145, y)
    
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.text('Designation:', 15, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(employee.designation), 55, y)
    
    doc.setFont('helvetica', 'bold')
    doc.text('Department:', 110, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(deptName), 145, y)
    
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.text('Email:', 15, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(employee.email), 55, y)
    
    doc.setFont('helvetica', 'bold')
    doc.text('Mobile:', 110, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(employee.mobile), 145, y)
    
    // Attendance Summary
    y += 12
    doc.setFillColor(230, 230, 230)
    doc.rect(10, y, 190, 7, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('ATTENDANCE DETAILS', 15, y + 5)
    
    y += 12
    doc.setFontSize(9)
    
    // Attendance table
    const attData = [
      ['Working Days in Period:', String(employee.total_working_days), 'Present Days:', String(employee.present_days)],
      ['Full Days:', String(employee.full_days), 'Half Days:', String(employee.half_days)],
      ['WFH Days:', String(employee.wfh_days), 'Absent Days:', String(employee.absent_days)]
    ]
    
    attData.forEach(([label1, value1, label2, value2]) => {
      doc.setFont('helvetica', 'bold')
      doc.text(label1, 15, y)
      doc.setFont('helvetica', 'normal')
      doc.text(value1, 70, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text(label2, 110, y)
      doc.setFont('helvetica', 'normal')
      doc.text(value2, 165, y)
      y += 6
    })
    
    // Salary Breakdown
    y += 8
    doc.setFillColor(230, 230, 230)
    doc.rect(10, y, 190, 7, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('SALARY BREAKDOWN', 15, y + 5)
    
    y += 12
    doc.setFontSize(9)
    
    // Salary table with borders
    const salaryData = [
      ['Monthly CTC', 'Rs. ' + formatAmount(employee.ctc)],
      ['Monthly Working Days', String(employee.monthly_working_days) + ' days'],
      ['Per Day Salary', 'Rs. ' + formatAmount(employee.per_day_salary)],
      ['', ''],
      ['Present Days', String(employee.present_days)],
      ['Calculation', 'Rs. ' + formatAmount(employee.per_day_salary) + ' x ' + String(employee.present_days) + ' days']
    ]
    
    salaryData.forEach(([label, value]) => {
      if (label) {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 15, y)
        doc.setFont('helvetica', 'normal')
        doc.text(value, 110, y)
      }
      y += 6
    })
    
    // Net Payable - Highlighted box
    y += 5
    doc.setFillColor(46, 204, 113)
    doc.rect(10, y - 3, 190, 14, 'F')
    doc.setDrawColor(46, 204, 113)
    doc.setLineWidth(0.5)
    doc.rect(10, y - 3, 190, 14)
    
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('NET PAYABLE AMOUNT:', 15, y + 6)
    doc.text('Rs. ' + formatAmount(employee.net_payable), 195, y + 6, { align: 'right' })
    
    // Reset color
    doc.setTextColor(0, 0, 0)
    y += 20
    
    // Bank Details (if available)
    if (employee.bank_name || employee.bank_account_number) {
      doc.setFillColor(230, 230, 230)
      doc.rect(10, y, 190, 7, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('BANK DETAILS', 15, y + 5)
      
      y += 12
      doc.setFontSize(9)
      
      if (employee.bank_name) {
        doc.setFont('helvetica', 'bold')
        doc.text('Bank Name:', 15, y)
        doc.setFont('helvetica', 'normal')
        doc.text(String(employee.bank_name), 55, y)
        y += 6
      }
      
      if (employee.bank_account_number) {
        doc.setFont('helvetica', 'bold')
        doc.text('Account Number:', 15, y)
        doc.setFont('helvetica', 'normal')
        doc.text(String(employee.bank_account_number), 55, y)
        y += 6
      }
      
      if (employee.ifsc) {
        doc.setFont('helvetica', 'bold')
        doc.text('IFSC Code:', 15, y)
        doc.setFont('helvetica', 'normal')
        doc.text(String(employee.ifsc), 55, y)
        y += 6
      }
      
      if (employee.upi_id) {
        doc.setFont('helvetica', 'bold')
        doc.text('UPI ID:', 15, y)
        doc.setFont('helvetica', 'normal')
        doc.text(String(employee.upi_id), 55, y)
      }
    }
    
    // Footer - Fixed at bottom
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, 105, 280, { align: 'center' })
    doc.text('This is a computer-generated document and does not require a signature', 105, 286, { align: 'center' })
    
    // Border around entire document
    doc.setDrawColor(41, 128, 185)
    doc.setLineWidth(1)
    doc.rect(5, 5, 200, 287)
    
    // Save PDF
    doc.save(`salary_slip_${employee.employee_id}_${startDate}_to_${endDate}.pdf`)
    
    toast.success(`Salary slip downloaded for ${employee.full_name}`)
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value)
                setSelectedEmployeeId('') // Reset employee when department changes
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Employees</option>
              {payrollData?.employees?.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            {payrollData && (
              <button
                onClick={handleExportCSV}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {payrollData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
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
                  <TrendingUp className="w-6 h-6 text-green-600" />
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Salary</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(payrollData.total_employees > 0 ? payrollData.total_payable / payrollData.total_employees : 0)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Employee Payroll Details</h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing {payrollData.employees?.length || 0} employees for {format(new Date(startDate), 'MMM dd, yyyy')} to {format(new Date(endDate), 'MMM dd, yyyy')}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly CTC</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Full</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Half</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">WFH</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earned</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payrollData.employees?.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                        No payroll data found for the selected period
                      </td>
                    </tr>
                  ) : (
                    payrollData.employees?.map((employee) => (
                      <motion.tr
                        key={employee.employee_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                            <div className="text-xs text-gray-500">{employee.employee_id}</div>
                            <div className="text-xs text-gray-500">{employee.designation}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{formatCurrency(employee.ctc)}</div>
                          <div className="text-xs text-gray-500">Monthly CTC</div>
                          <div className="text-xs text-gray-500">₹{parseFloat(employee.per_day_salary).toFixed(0)}/day</div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {employee.present_days}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-600">
                          {employee.full_days}
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-600">
                          {employee.half_days}
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-600">
                          {employee.wfh_days}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            {employee.absent_days}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-semibold text-green-600">{formatCurrency(employee.net_payable)}</div>
                          <div className="text-xs text-gray-500">for {employee.present_days} days</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewDetails(employee)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDownloadSlip(employee)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                              title="Download Salary Slip"
                            >
                              <Download className="w-3 h-3" />
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
        </>
      )}

      {/* Employee Details Modal */}
      <AnimatePresence>
        {showDetailsModal && employeeDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{employeeDetails.employee.full_name}</h3>
                  <p className="text-sm text-gray-600">{employeeDetails.employee.employee_id} • {employeeDetails.employee.designation}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {/* Salary Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">CTC</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(employeeDetails.salary_structure.ctc)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-1">Earned Salary</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(employeeDetails.salary_calculation.earned_salary)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 mb-1">Net Payable</p>
                    <p className="text-2xl font-bold text-purple-900">{formatCurrency(employeeDetails.salary_calculation.net_payable)}</p>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Attendance Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Present Days</p>
                      <p className="text-xl font-bold text-green-600">{employeeDetails.attendance_summary.present_days}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Full Days</p>
                      <p className="text-xl font-bold text-gray-900">{employeeDetails.attendance_summary.full_days}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Half Days</p>
                      <p className="text-xl font-bold text-yellow-600">{employeeDetails.attendance_summary.half_days}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">WFH Days</p>
                      <p className="text-xl font-bold text-blue-600">{employeeDetails.attendance_summary.wfh_days}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Absent Days</p>
                      <p className="text-xl font-bold text-red-600">{employeeDetails.attendance_summary.absent_days}</p>
                    </div>
                  </div>
                </div>

                {/* Salary Calculation */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Salary Calculation</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Working Days:</span>
                      <span className="font-medium text-gray-900">{employeeDetails.period.total_working_days}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Per Day Salary:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(employeeDetails.salary_calculation.per_day_salary)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Present Days:</span>
                      <span className="font-medium text-gray-900">{employeeDetails.attendance_summary.present_days}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                      <span className="text-gray-600">Earned Salary:</span>
                      <span className="font-medium text-green-600">{formatCurrency(employeeDetails.salary_calculation.earned_salary)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deduction (Absent Days):</span>
                      <span className="font-medium text-red-600">-{formatCurrency(employeeDetails.salary_calculation.deduction_amount)}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t-2 border-gray-300 pt-2">
                      <span className="text-gray-900">Net Payable:</span>
                      <span className="text-primary-600">{formatCurrency(employeeDetails.salary_calculation.net_payable)}</span>
                    </div>
                  </div>
                </div>

                {/* Attendance Records */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Daily Attendance Records</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Day</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Check In</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Check Out</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Hours</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {employeeDetails.attendance_records.map((record, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-900">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                              <td className="px-3 py-2 text-gray-600">{record.day}</td>
                              <td className="px-3 py-2 text-gray-600">{record.checkin_time || '-'}</td>
                              <td className="px-3 py-2 text-gray-600">{record.checkout_time || '-'}</td>
                              <td className="px-3 py-2 text-gray-600">{record.work_hours || '-'}</td>
                              <td className="px-3 py-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  record.attendance_status === 'Present' ? 'bg-green-100 text-green-700' :
                                  record.attendance_status === 'Half Day' ? 'bg-yellow-100 text-yellow-700' :
                                  record.attendance_status === 'Work From Home' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {record.attendance_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Payroll
