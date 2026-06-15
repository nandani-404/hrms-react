import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, XCircle, User, TrendingUp, LogIn, LogOut, MapPin, Camera } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useMyAttendance } from '../hooks/useMyAttendance'
import { useAuth } from '../context/AuthContext'
import { formatWorkHours, formatWorkHoursShort } from '../utils/timeFormat'
import { useCheckIn, useCheckOut, useEmployeeTodayStatus } from '../hooks/useAttendance'
import toast from 'react-hot-toast'

const PunchInOutCard = () => {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [selfieFile, setSelfieFile] = useState(null)
  const [isPunchIn, setIsPunchIn] = useState(true)
  const [remark, setRemark] = useState('')
  const [locationData, setLocationData] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [isLocationLoading, setIsLocationLoading] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const mediaStreamRef = useRef(null)

  const { data: todayStatus, refetch: refetchStatus } = useEmployeeTodayStatus(user?.emp_id)
  const checkInMutation = useCheckIn()
  const checkOutMutation = useCheckOut()

  const isCheckedIn = todayStatus?.checked_in || false
  const isCheckedOut = todayStatus?.checked_out || false

  // Validations
  const validateImage = (file) => {
    if (file.size > 5242880) {
      toast.error('Image size exceeds 5MB limit')
      return false
    }
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('Only JPEG and PNG images are allowed')
      return false
    }
    return true
  }

  const validateRemark = (text) => {
    if (text && text.length > 500) {
      toast.error('Remark cannot exceed 500 characters')
      return false
    }
    return true
  }

  const validateLocation = (lat, lng) => {
    if (lat < -90 || lat > 90) {
      toast.error('Invalid latitude')
      return false
    }
    if (lng < -180 || lng > 180) {
      toast.error('Invalid longitude')
      return false
    }
    return true
  }

  // Geolocation
  const captureLocation = async () => {
    setIsLocationLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setIsLocationLoading(false)
      toast.error('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        if (!validateLocation(latitude, longitude)) {
          setIsLocationLoading(false)
          return
        }

        let address = null
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          address =
            data.address?.road ||
            data.address?.city ||
            data.display_name ||
            null
        } catch (error) {
          console.log('Could not fetch address:', error)
        }

        setLocationData({
          latitude,
          longitude,
          accuracy,
          address
        })
        setIsLocationLoading(false)
        toast.success('Location captured successfully')
      },
      (error) => {
        setIsLocationLoading(false)
        const errMsg = error.code === 1 ? 'Location permission denied' : 'Failed to get location'
        setLocationError(errMsg)
        toast.error(errMsg)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Camera Control
  const startCamera = async (punchIn = true) => {
    setIsPunchIn(punchIn)
    setRemark('')
    setLocationData(null)
    setLocationError(null)
    
    // Trigger location capture immediately when punching in/out
    await captureLocation()
    
    setShowModal(true)
    setSelfieFile(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: 1280,
          height: 720
        }
      })
      mediaStreamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      toast.error('Camera access denied')
      setShowModal(false)
    }
  }

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
    setShowModal(false)
    setSelfieFile(null)
  }

  // Selfie capture
  const captureSelfie = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) {
      toast.error('Camera not ready.')
      return
    }

    if (!mediaStreamRef.current || mediaStreamRef.current.getTracks().length === 0) {
      toast.error('Camera not active. Please try again.')
      return
    }

    if (video.readyState < video.HAVE_CURRENT_DATA || video.videoWidth === 0) {
      toast.error('Camera not loaded yet. Please wait a moment.')
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error('Failed to capture image.')
          return
        }
        setSelfieFile(blob)
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop())
          mediaStreamRef.current = null
        }
        toast.success('Selfie captured! Click Submit to Punch In.')
      },
      'image/jpeg',
      0.8
    )
  }

  // Form submission
  const handleSubmit = async () => {
    if (!locationData) {
      toast.error('Location is required. Please enable location services.')
      return
    }

    if (!validateRemark(remark)) return

    try {
      if (isPunchIn) {
        if (!selfieFile) {
          toast.error('Please capture a selfie first')
          return
        }
        if (!validateImage(selfieFile)) return

        const formData = new FormData()
        formData.append('employee_id', user.emp_id)
        formData.append('selfie', selfieFile, 'selfie.jpg')
        formData.append('latitude', locationData.latitude)
        formData.append('longitude', locationData.longitude)
        if (locationData.accuracy) {
          formData.append('location_accuracy', locationData.accuracy)
        }
        if (locationData.address) {
          formData.append('address', locationData.address)
        }
        if (remark) {
          formData.append('remark', remark)
        }

        await checkInMutation.mutateAsync(formData)
        toast.success('Checked in successfully!')
      } else {
        const data = {
          employee_id: user.emp_id,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        }
        if (locationData.accuracy) data.location_accuracy = locationData.accuracy
        if (locationData.address) data.address = locationData.address
        if (remark) data.remark = remark

        await checkOutMutation.mutateAsync(data)
        toast.success('Checked out successfully!')
      }

      setSelfieFile(null)
      setShowModal(false)
      setRemark('')
      setLocationData(null)
      refetchStatus()
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit attendance')
    }
  }

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <>
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
          <div className={`p-3 md:p-4 rounded-lg ${isCheckedIn ? 'bg-green-100' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2 mb-1">
              {isCheckedIn ? (
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

          <div className={`p-3 md:p-4 rounded-lg ${isCheckedOut ? 'bg-green-100' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2 mb-1">
              {isCheckedOut ? (
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
          {!isCheckedIn && (
            <button
              onClick={() => startCamera(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogIn className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Punch In</span>
            </button>
          )}

          {isCheckedIn && !isCheckedOut && (
            <button
              onClick={() => startCamera(false)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Punch Out</span>
            </button>
          )}

          {isCheckedIn && isCheckedOut && (
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-600 rounded-lg font-medium">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Attendance Marked</span>
            </div>
          )}
        </div>

        {todayStatus?.attendance?.work_hours && (
          <div className="mt-3 p-3 bg-white rounded-lg">
            <p className="text-xs md:text-sm text-gray-600">
              Work Hours:{' '}
              <span className="font-semibold text-gray-900">
                {formatWorkHours(todayStatus.attendance.work_hours)}
              </span>
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                {isPunchIn ? 'Punch In' : 'Punch Out'}
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Location capture box */}
              <div className={`p-3 rounded-lg border ${locationData ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2">
                  <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${locationData ? 'text-green-600' : 'text-red-600'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {locationData ? 'Location Captured' : 'Location Required'}
                    </p>
                    {locationData ? (
                      <div className="text-xs text-gray-600 mt-1">
                        Lat: {locationData.latitude.toFixed(4)}, Lon: {locationData.longitude.toFixed(4)}
                        {locationData.address && (
                          <div className="mt-1 font-medium">{locationData.address}</div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 mt-1">
                        {locationError || 'Getting your location...'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Camera for Punch In */}
              {isPunchIn && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selfie <span className="text-red-500">*</span>
                  </label>
                  <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
                    {selfieFile ? (
                      <img
                        src={URL.createObjectURL(selfieFile)}
                        alt="Captured"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remark <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value.slice(0, 500))}
                  placeholder="Add any remarks (max 500 characters)"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {remark.length}/500 characters
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              {isPunchIn && !selfieFile ? (
                <>
                  <button
                    onClick={captureSelfie}
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
                    onClick={handleSubmit}
                    disabled={checkInMutation.isPending || checkOutMutation.isPending || !locationData}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkInMutation.isPending || checkOutMutation.isPending ? 'Submitting...' : 'Submit'}
                  </button>
                  {isPunchIn && selfieFile && (
                    <button
                      onClick={async () => {
                        setSelfieFile(null)
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({
                            video: {
                              facingMode: 'user',
                              width: 1280,
                              height: 720
                            }
                          })
                          mediaStreamRef.current = stream
                          if (videoRef.current) {
                            videoRef.current.srcObject = stream
                          }
                        } catch {
                          toast.error('Camera access denied')
                        }
                      }}
                      className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Retake
                    </button>
                  )}
                  <button
                    onClick={stopCamera}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const MyAttendance = () => {
  const { user } = useAuth()
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const { data: attendanceData, isLoading, error } = useMyAttendance(currentMonth, currentYear)

  const formatTime = (timeStr) => {
    if (!timeStr) return '-'
    try {
      if (timeStr.includes('-')) {
        return format(parseISO(timeStr), 'hh:mm a')
      }
      const parts = timeStr.split(':')
      if (parts.length >= 2) {
        const hours = parseInt(parts[0], 10)
        const minutes = parseInt(parts[1], 10)
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`
      }
      return timeStr
    } catch {
      return timeStr
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy')
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading attendance data</p>
      </div>
    )
  }

  const summary = attendanceData?.data?.summary || {}
  const records = attendanceData?.data?.records || []
  const dates = attendanceData?.data?.dates || []

  // Sorting records newest first
  const sortedRecords = [...records].sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'wfh':
        return 'bg-purple-100 text-purple-800'
      case 'on_leave':
        return 'bg-blue-100 text-blue-800'
      case 'week_off':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'wfh':
        return 'WFH'
      case 'on_leave':
        return 'On Leave'
      case 'week_off':
        return 'Week Off'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600 mt-1">
            {user?.full_name} ({user?.emp_id})
          </p>
        </div>
      </div>

      {/* Main Grid: Punch in Card + Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <PunchInOutCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Days</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total_days || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatWorkHoursShort(summary.total_work_hours || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Hours/Day</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatWorkHoursShort(summary.average_work_hours || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Row of 5 columns metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-xl font-semibold text-green-600 mt-1">{summary.present || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-xl font-semibold text-red-600 mt-1">{summary.absent || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Work From Home</p>
          <p className="text-xl font-semibold text-purple-600 mt-1">{summary.wfh || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-xl font-semibold text-blue-600 mt-1">{summary.on_leave || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Week Off</p>
          <p className="text-xl font-semibold text-gray-600 mt-1">{summary.week_off || 0}</p>
        </div>
      </div>

      {/* Daily Attendance Calendar cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daily Attendance Overview</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="flex lg:grid lg:grid-cols-7 gap-2 min-w-max lg:min-w-0 pb-2">
              {dates.map((item, index) => (
                <div key={index} className="text-center w-24 lg:w-auto flex-shrink-0">
                  <div className={`p-3 rounded-lg ${getStatusBadgeClass(item.status)} mb-2`}>
                    <p className="text-xs font-semibold">{item.day.slice(0, 3)}</p>
                    <p className="text-lg font-bold">{new Date(item.date).getDate()}</p>
                    {item.checkin_time && item.checkout_time ? (
                      <p className="text-xs mt-1">
                        {formatTime(item.checkin_time)} - {formatTime(item.checkout_time)}
                      </p>
                    ) : item.checkin_time ? (
                      <p className="text-xs mt-1">{formatTime(item.checkin_time)}</p>
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{getStatusLabel(item.status)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Attendance Records</h2>
        </div>

        {sortedRecords.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No attendance records found for this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Punch In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Punch Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatDate(record.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(record.checkin_time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(record.checkout_time)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {record.work_hours ? formatWorkHours(record.work_hours) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.attendance_status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : record.attendance_status === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : record.attendance_status === 'wfh'
                            ? 'bg-purple-100 text-purple-800'
                            : record.attendance_status === 'on_leave'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {record.attendance_status === 'wfh' ? 'WFH' : record.attendance_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.is_manual ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {record.is_manual ? 'Manual' : 'Auto'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MyAttendance
