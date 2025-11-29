import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, LogIn, LogOut, Clock, CheckCircle, XCircle, User, ArrowUpDown, X, Download, Upload, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { useAttendance, useCheckIn, useCheckOut, useEmployeeTodayStatus } from '../hooks/useAttendance'
import { useEmployees, useDepartments } from '../hooks/useEmployees'
import { useAuth } from '../context/AuthContext'
import { formatWorkHours } from '../utils/timeFormat'
import toast from 'react-hot-toast'
import { getTeamMembers, getTeamMemberIds, canManageTeam } from '../utils/teamFilter'
import axios from 'axios'

const Attendance = () => {
  const { user } = useAuth()
  console.log(user)
  const isHR = user?.role === 'hr' || user?.role === 'admin'
  const canManage = canManageTeam(user)
  
  // Check-in/out states
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isCheckingIn, setIsCheckingIn] = useState(true)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // HR filters
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedShift, setSelectedShift] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [showSelfie, setShowSelfie] = useState(null)
  const [exportMonth, setExportMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [exportDepartment, setExportDepartment] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  
  // CSV Upload states
  const [uploadMonth, setUploadMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [uploadFile, setUploadFile] = useState(null)
  const [replaceExisting, setReplaceExisting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Queries
  const { data: todayStatus, refetch: refetchStatus } = useEmployeeTodayStatus(user?.emp_id)
  const checkInMutation = useCheckIn()
  const checkOutMutation = useCheckOut()

  // Get all employees and filter by team
  const { data: employeesData } = useEmployees()
  const { data: departments = [], isLoading: departmentsLoading } = useDepartments()
  const allEmployees = employeesData?.data || employeesData || []
  const teamMembers = getTeamMembers(allEmployees, user)
  const teamMemberIds = getTeamMemberIds(allEmployees, user)

  const params = canManage ? {
    ...(selectedDate && !startDate && !endDate && { date: selectedDate }),
    ...(startDate && { start_date: startDate }),
    ...(endDate && { end_date: endDate }),
    ...(selectedEmployee && { employee_id: selectedEmployee }),
    ...(selectedStatus && { status: selectedStatus }),
    ...(selectedShift && { shift_id: selectedShift }),
    ...(selectedType && { is_manual: selectedType === 'manual' ? '1' : '0' }),
    sort_by: sortBy,
    sort_order: sortOrder,
    page: currentPage,
    per_page: perPage
  } : {}

  const { data: attendanceResponse, isLoading: loading } = useAttendance(params)
  
  const attendanceData = attendanceResponse?.data || attendanceResponse || {}
  const allAttendance = Array.isArray(attendanceData) ? attendanceData : (attendanceData.data || [])
  // Filter attendance by team if user is a team manager (not admin/HR)
  const attendance = (canManage && !isHR) 
    ? allAttendance.filter(record => teamMemberIds.includes(record.employee_id))
    : allAttendance
  const pagination = attendanceData.data ? attendanceData : null
  const employees = teamMembers

  const checkedIn = todayStatus?.checked_in || false
  const checkedOut = todayStatus?.checked_out || false

  // Camera functions
  const startCamera = async (checkIn = true) => {
    setIsCheckingIn(checkIn)
    setShowCamera(true)
    setCapturedImage(null)
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      toast.error('Camera access denied')
      setShowCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
    setCapturedImage(null)
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        setCapturedImage(blob)
        stopCamera()
      }, 'image/jpeg', 0.8)
    }
  }

  const submitAttendance = async () => {
    // For check-in, selfie is required
    if (isCheckingIn && !capturedImage) {
      toast.error('Please capture a selfie first')
      return
    }

    try {
      if (isCheckingIn) {
        const formData = new FormData()
        formData.append('employee_id', user.emp_id)
        formData.append('selfie', capturedImage, 'selfie.jpg')
        
        await checkInMutation.mutateAsync(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Checked in successfully!')
      } else {
        // For check-out, no selfie needed
        await checkOutMutation.mutateAsync({ employee_id: user.emp_id })
        toast.success('Checked out successfully!')
      }
      
      setCapturedImage(null)
      setShowCamera(false)
      refetchStatus()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit attendance')
    }
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      half_day: 'bg-yellow-100 text-yellow-700',
      late: 'bg-orange-100 text-orange-700',
      on_leave: 'bg-blue-100 text-blue-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  // const handleExportCSV = async () => {
  //   if (!exportMonth) {
  //     toast.error('Please select a month to export')
  //     return
  //   }

  //   setIsExporting(true)
  //   try {
  //     const token = localStorage.getItem('token')
  //     const params = new URLSearchParams({
  //       month: exportMonth,
  //       ...(exportDepartment && { department_id: exportDepartment })
  //     })

  //     const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/attendance/hr-export-csv?${params.toString()}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       },
  //       responseType: 'blob'
  //     })

  //     // Create download link
  //     const blob = new Blob([response.data], { type: 'text/csv' })
  //     const url = window.URL.createObjectURL(blob)
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.download = `attendance_${exportMonth}_dept_${exportDepartment || 'all'}.csv`
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //     window.URL.revokeObjectURL(url)

  //     toast.success('Attendance exported successfully!')
  //   } catch (error) {
  //     console.error('Export error:', error)
  //     toast.error(error.response?.data?.message || 'Failed to export attendance')
  //   } finally {
  //     setIsExporting(false)
  //   }
  // }

const handleDetailedExport = async () => {
  if (!exportMonth) {
    toast.error('Please select a month to export')
    return
  }

  setIsExporting(true)
  try {
    // Convert month to start and end dates
    const monthStart = format(new Date(exportMonth + '-01'), 'yyyy-MM-dd')
    const monthEnd = format(new Date(new Date(exportMonth + '-01').getFullYear(), new Date(exportMonth + '-01').getMonth() + 1, 0), 'yyyy-MM-dd')

    const token = localStorage.getItem('token')
    const params = new URLSearchParams({
      start_date: monthStart,
      end_date: monthEnd,
      ...(exportDepartment && { department_id: exportDepartment })
    })

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/attendance/detailed-export?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      }
    )

    // Create download link
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `detailed_attendance_${exportMonth}_dept_${exportDepartment || 'all'}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success('Detailed attendance report exported successfully!')
  } catch (error) {
console.error('Export error:', error)
toast.error(error.response?.data?.message || 'Failed to export detailed report')
} finally {
setIsExporting(false)
}
}

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file')
        return
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setUploadFile(file)
    }
  }

  const handleUploadCSV = async () => {
    if (!uploadMonth) {
      toast.error('Please select a month')
      return
    }
    if (!uploadFile) {
      toast.error('Please select a CSV file')
      return
    }

    setIsUploading(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('month', uploadMonth)
      formData.append('uploaded_by', user?.full_name || 'HR')
      formData.append('approved_by', user?.full_name || 'HR')
      formData.append('replace_existing', replaceExisting ? '1' : '0')

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/approved-attendance/upload-csv`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.success) {
        const data = response.data.data
        toast.success(
          `Upload successful! Created: ${data.created}, Updated: ${data.updated}, Errors: ${data.errors}`,
          { duration: 5000 }
        )
        
        // Reset form
        setUploadFile(null)
        setReplaceExisting(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload CSV')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          {isHR ? 'Manage employee attendance' : canManage ? 'Manage team attendance' : 'Mark your attendance'}
        </p>
      </div>

      {/* User Check-in/out Section */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm border border-primary-200 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-600 flex items-center justify-center">
            <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">{user?.full_name}</h2>
            <p className="text-xs md:text-sm text-gray-600">{user?.emp_id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`p-3 md:p-4 rounded-lg ${checkedIn ? 'bg-green-100' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2 mb-1">
              {checkedIn ? (
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              )}
              <span className="text-xs md:text-sm font-medium text-gray-700">Punch In</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              {todayStatus?.attendance?.checkin_time 
                ? format(new Date(todayStatus.attendance.checkin_time), 'hh:mm a')
                : 'Not marked'}
            </p>
          </div>

          <div className={`p-3 md:p-4 rounded-lg ${checkedOut ? 'bg-green-100' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2 mb-1">
              {checkedOut ? (
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              )}
              <span className="text-xs md:text-sm font-medium text-gray-700">Punch Out</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              {todayStatus?.attendance?.checkout_time 
                ? format(new Date(todayStatus.attendance.checkout_time), 'hh:mm a')
                : 'Not marked'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {!checkedIn && (
            <button
              onClick={() => startCamera(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogIn className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Punch In</span>
            </button>
          )}
          
          {checkedIn && !checkedOut && (
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to punch out?')) {
                  try {
                    await checkOutMutation.mutateAsync({ employee_id: user.emp_id })
                    toast.success('Checked out successfully!')
                    refetchStatus()
                  } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to check out')
                  }
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Punch Out</span>
            </button>
          )}

          {checkedIn && checkedOut && (
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-600 rounded-lg font-medium">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Attendance Marked</span>
            </div>
          )}
        </div>

        {todayStatus?.attendance?.work_hours && (
          <div className="mt-3 p-3 bg-white rounded-lg">
            <p className="text-xs md:text-sm text-gray-600">
              Work Hours: <span className="font-semibold text-gray-900">{formatWorkHours(todayStatus.attendance.work_hours)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isCheckingIn ? 'Punch In' : 'Punch Out'} - Capture Selfie
                </h3>
              </div>

              <div className="relative bg-black aspect-video">
                {!capturedImage ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(capturedImage)}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="p-4 flex gap-3">
                {!capturedImage ? (
                  <>
                    <button
                      onClick={capturePhoto}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={submitAttendance}
                      disabled={checkInMutation.isPending || checkOutMutation.isPending}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {checkInMutation.isPending || checkOutMutation.isPending ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Retake
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HR/Manager Section - Only visible to HR and Team Managers */}
      {canManage && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              {isHR ? 'Attendance Records' : 'Team Attendance Records'}
            </h3>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Single Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setStartDate('')
                    setEndDate('')
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    setSelectedDate('')
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    setSelectedDate('')
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => {
                    setSelectedEmployee(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">{isHR ? 'All Employees' : 'All Team Members'}</option>
                  {employees.map((emp) => (
                    <option key={emp.emp_id} value={emp.emp_id}>
                      {emp.full_name} ({emp.emp_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="half_day">Half Day</option>
                  <option value="late">Late</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
                <select
                  value={selectedShift}
                  onChange={(e) => {
                    setSelectedShift(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Shifts</option>
                  <option value="1">Shift 1</option>
                  <option value="2">Shift 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="auto">Auto</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Per Page</label>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                {pagination?.total || attendance.length} records found
              </div>
              <button
                onClick={() => {
                  setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
                  setStartDate('')
                  setEndDate('')
                  setSelectedEmployee('')
                  setSelectedStatus('')
                  setSelectedShift('')
                  setSelectedType('')
                  setSortBy('date')
                  setSortOrder('desc')
                  setCurrentPage(1)
                }}
                className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Export CSV Section */}
          {isHR && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">Export Monthly Attendance</h3>
                  <p className="text-xs md:text-sm text-gray-600">Download attendance data in CSV format</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <input
                    type="month"
                    value={exportMonth}
                    onChange={(e) => setExportMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department (Optional)</label>
                  <select
                    value={exportDepartment}
                    onChange={(e) => setExportDepartment(e.target.value)}
                    disabled={departmentsLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">
                      {departmentsLoading ? 'Loading departments...' : 'All Departments'}
                    </option>
                    {departments && departments.length > 0 ? (
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))
                    ) : (
                      !departmentsLoading && <option disabled>No departments found</option>
                    )}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleDetailedExport}
                    disabled={isExporting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Revised Attendance CSV Section */}
          {isHR && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">Upload Revised Attendance</h3>
                  <p className="text-xs md:text-sm text-gray-600">Upload approved/revised attendance CSV for a month</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <input
                    type="month"
                    value={uploadMonth}
                    onChange={(e) => setUploadMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">CSV File</label>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {uploadFile ? uploadFile.name : 'Choose CSV file'}
                      </span>
                    </label>
                    {uploadFile && (
                      <button
                        onClick={() => {
                          setUploadFile(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Replace existing records for this month</span>
                </label>

                <button
                  onClick={handleUploadCSV}
                  disabled={isUploading || !uploadFile}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Upload CSV'}
                </button>
              </div>

              <div className="mt-3 p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> The CSV file should match the exported format with columns: Employee ID, Employee Name, Department, Email, Mobile, Designation, Date, Check In, Check Out, Work Hours, Status, Shift, Manual Entry, Remark
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setSortBy('employee_id')
                            setSortOrder(sortBy === 'employee_id' && sortOrder === 'asc' ? 'desc' : 'asc')
                          }}
                        >
                          <div className="flex items-center gap-1">
                            Employee
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setSortBy('date')
                            setSortOrder(sortBy === 'date' && sortOrder === 'asc' ? 'desc' : 'asc')
                          }}
                        >
                          <div className="flex items-center gap-1">
                            Date
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Punch In</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Punch Out</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setSortBy('attendance_status')
                            setSortOrder(sortBy === 'attendance_status' && sortOrder === 'asc' ? 'desc' : 'asc')
                          }}
                        >
                          <div className="flex items-center gap-1">
                            Status
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selfie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {attendance.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                            No attendance records found
                          </td>
                        </tr>
                      ) : (
                        attendance.map((record) => (
                          <motion.tr
                            key={record.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 md:px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {record.employee?.full_name || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {record.employee_id}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 text-sm text-gray-600">
                              {format(new Date(record.date), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-sm text-gray-600">
                              {record.checkin_time ? format(new Date(record.checkin_time), 'hh:mm a') : '-'}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-sm text-gray-600">
                              {record.checkout_time ? format(new Date(record.checkout_time), 'hh:mm a') : '-'}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-sm text-gray-600">
                              {record.work_hours ? formatWorkHours(record.work_hours) : '-'}
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.attendance_status)}`}>
                                {record.attendance_status?.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                record.is_manual ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {record.is_manual ? 'Manual' : 'Auto'}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              {record.selfie ? (
                                <img
                                  src={`${import.meta.env.VITE_BASE_SELFIE_FILE_PATH}/${record.selfie}`}
                                  alt="selfie"
                                  onClick={() => setShowSelfie(record.selfie)}
                                  className="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">No selfie</span>
                              )}
                            </td>

                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {pagination.from} to {pagination.to} of {pagination.total} records
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                        let pageNum
                        if (pagination.last_page <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= pagination.last_page - 2) {
                          pageNum = pagination.last_page - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.last_page}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Selfie Modal */}
      <AnimatePresence>
        {showSelfie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSelfie(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Selfie Preview</h3>
                <button
                  onClick={() => setShowSelfie(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_BASE_SELFIE_FILE_PATH}/${showSelfie}`}
                  alt="Selfie"
                  className="rounded-lg w-full object-contain max-h-[300px]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Attendance
