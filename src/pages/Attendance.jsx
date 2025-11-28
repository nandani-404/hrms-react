import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Filter, Camera, LogIn, LogOut, Clock, CheckCircle, XCircle, User } from 'lucide-react'
import { format } from 'date-fns'
import { useAttendance, useCheckIn, useCheckOut, useEmployeeTodayStatus } from '../hooks/useAttendance'
import { useEmployees } from '../hooks/useEmployees'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Attendance = () => {
  const { user } = useAuth()
  console.log(user)
  const isHR = user?.role === 'hr' || user?.role === 'admin'
  
  // Check-in/out states
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isCheckingIn, setIsCheckingIn] = useState(true)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // HR filters
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedEmployee, setSelectedEmployee] = useState('')

  // Queries
  const { data: todayStatus, refetch: refetchStatus } = useEmployeeTodayStatus(user?.emp_id)
  const checkInMutation = useCheckIn()
  const checkOutMutation = useCheckOut()

  const params = isHR ? {
    date: selectedDate,
    ...(selectedEmployee && { employee_id: selectedEmployee })
  } : {}

  const { data: attendanceData, isLoading: loading } = useAttendance(params)
  const { data: employeesData } = useEmployees()
  
  const attendance = Array.isArray(attendanceData) ? attendanceData : []
  const employees = Array.isArray(employeesData) ? employeesData : []

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
    if (!capturedImage) {
      toast.error('Please capture a selfie first')
      return
    }

    const formData = new FormData()
    formData.append('employee_id', user.emp_id)
    formData.append('selfie', capturedImage, 'selfie.jpg')

    try {
      if (isCheckingIn) {
        await checkInMutation.mutateAsync(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Checked in successfully!')
      } else {
        await checkOutMutation.mutateAsync({ employee_id: user.emp_id })
        toast.success('Checked out successfully!')
      }
      
      setCapturedImage(null)
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

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          {isHR ? 'Manage employee attendance' : 'Mark your attendance'}
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

        {/* Status Display */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`p-3 md:p-4 rounded-lg ${checkedIn ? 'bg-green-100' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2 mb-1">
              {checkedIn ? (
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              )}
              <span className="text-xs md:text-sm font-medium text-gray-700">Check In</span>
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
              <span className="text-xs md:text-sm font-medium text-gray-700">Check Out</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              {todayStatus?.attendance?.checkout_time 
                ? format(new Date(todayStatus.attendance.checkout_time), 'hh:mm a')
                : 'Not marked'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!checkedIn && (
            <button
              onClick={() => startCamera(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogIn className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Check In</span>
            </button>
          )}
          
          {checkedIn && !checkedOut && (
            <button
              onClick={() => startCamera(false)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Check Out</span>
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
              Work Hours: <span className="font-semibold text-gray-900">{todayStatus.attendance.work_hours.toFixed(2)} hrs</span>
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
                  {isCheckingIn ? 'Check In' : 'Check Out'} - Capture Selfie
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

      {/* HR Section - Only visible to HR */}
      {isHR && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Attendance Records</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                  >
                    <option value="">All Employees</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.emp_id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-600 py-2">
                  {attendance.length} records found
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendance.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
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
                                {record.employee?.full_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {record.employee?.emp_id}
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
                            {record.work_hours ? `${record.work_hours.toFixed(2)} hrs` : '-'}
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.attendance_status)}`}>
                              {record.attendance_status?.replace('_', ' ')}
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Attendance
