import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Upload,
  Trash2,
  Check,
  ChevronRight,
  User,
  Briefcase,
  FileText,
  CheckCircle2,
  X,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCreateEmployee, useDepartments, useEmployees } from '../hooks/useEmployees'

const AddEmployee = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const createEmployee = useCreateEmployee()

  const { data: departments = [] } = useDepartments()
  const { data: employeesData = [] } = useEmployees({ status: 'active' })
  const employees = employeesData?.data || employeesData || []

  // Current active step: 1 = Personal Info, 2 = Job Info, 3 = Additional Info, 4 = Review
  const [currentStep, setCurrentStep] = useState(1)

  // Form State initialized with realistic placeholder defaults matching design mockup
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@techcorp.com',
    mobile: '+91 98765 43210',
    dob: '1995-06-15',
    gender: 'Male',
    maritalStatus: 'Single',
    bloodGroup: 'O+',
    nationality: 'Indian',
    languages: ['English', 'Hindi'],
    newLanguage: '',
    address: 'B-12, Sector 62, Noida, Uttar Pradesh, India',
    password: 'Password@123',

    // Photo
    photoPreview: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    photoFile: null,

    // Job Info
    employeeId: 'EMP0121',
    department: 'IT',
    designation: 'Software Developer',
    doj: '2024-05-20',
    employmentType: 'Full Time',
    reportingManager: 'Amit Kumar (DevOps Engineer)',

    // Additional Info
    pfNumber: 'PF7845125896',
    esiNumber: 'ESI45879632',
    uanNumber: '100001234567',
    panNumber: 'ABCDE1234F',
  })

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Language Tags handling
  const handleAddLanguage = () => {
    if (formData.newLanguage.trim() && !formData.languages.includes(formData.newLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, prev.newLanguage.trim()],
        newLanguage: '',
      }))
    }
  }

  const handleRemoveLanguage = (langToRemove) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== langToRemove),
    }))
  }

  // Profile Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size exceeds 2MB limit')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photoPreview: reader.result,
          photoFile: file,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoPreview: null,
      photoFile: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Form Submit Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    const full_name = `${formData.firstName} ${formData.lastName}`.trim()
    if (!full_name || !formData.email || !formData.mobile) {
      toast.error('Please fill in all required fields (Name, Email, Mobile).')
      return
    }

    const toastId = toast.loading('Creating new employee...')
    try {
      const payload = {
        full_name: full_name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password || 'Password@123',
        department: formData.department,
        designation: formData.designation,
        doj: formData.doj,
        employment_type: formData.employmentType,
        gender: formData.gender,
        dob: formData.dob,
        current_address: formData.address,
        pan: formData.panNumber,
        employee_id: formData.employeeId,
      }

      await createEmployee.mutateAsync(payload)
      toast.success('Employee created successfully! 🎉', { id: toastId })
      navigate('/employees')
    } catch (err) {
      console.error('Failed to create employee:', err)
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to create employee'
      toast.error(errorMsg, { id: toastId })
    }
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const steps = [
    { id: 1, title: 'Personal Info', subtitle: 'Basic details', icon: User },
    { id: 2, title: 'Job Info', subtitle: 'Role & department', icon: Briefcase },
    { id: 3, title: 'Additional Info', subtitle: 'More details', icon: FileText },
    { id: 4, title: 'Review', subtitle: 'Confirm details', icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <Link to="/employees" className="hover:text-blue-600 transition-colors">
              Employee
            </Link>
            <span>&gt;</span>
            <span className="font-semibold text-blue-600">Add New Employee</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
        </div>

        <button
          onClick={() => navigate('/employees')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm self-start md:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-md shadow-blue-200 ring-4 ring-blue-50'
                      : isCompleted
                      ? 'bg-blue-100 text-blue-600'
                      : 'border-2 border-gray-200 text-gray-400 group-hover:border-gray-300'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isActive ? 'text-gray-900' : isCompleted ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{step.subtitle}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block flex-1 h-[2px] bg-gray-100 mx-2 self-center" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content Area: 2 Columns (Left forms, Right upload card) */}
      <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Left Content (3 Columns wide) */}
        <div className="lg:col-span-3 space-y-6">
          {/* STEP 1 & SHOW ALL SECTIONS IN FORM VIEW MATCHING IMAGE 1 */}
          {(currentStep === 1 || currentStep === 4) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Sharma"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul.sharma@techcorp.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nationality
                  </label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Canadian">Canadian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Languages Known */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Languages Known
                  </label>
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50/50 border border-gray-200 rounded-lg min-h-[42px]">
                    {formData.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 text-xs font-medium text-gray-700 rounded-md shadow-2xs"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1 flex-1 min-w-[120px]">
                      <input
                        type="text"
                        name="newLanguage"
                        value={formData.newLanguage}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddLanguage()
                          }
                        }}
                        placeholder="Add language..."
                        className="w-full bg-transparent text-xs text-gray-800 focus:outline-none px-1"
                      />
                      {formData.newLanguage && (
                        <button
                          type="button"
                          onClick={handleAddLanguage}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Address
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="B-12, Sector 62, Noida, Uttar Pradesh, India"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: JOB INFORMATION */}
          {(currentStep === 2 || currentStep === 4 || currentStep === 1) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
                Job Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Employee ID */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="EMP0121"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {departments.length > 0 ? (
                      departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Software Developer">Software Developer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>

                {/* Date of Joining */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="doj"
                    value={formData.doj}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>

                {/* Reporting Manager */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Reporting Manager <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="reportingManager"
                    value={formData.reportingManager}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Amit Kumar (DevOps Engineer)">Amit Kumar (DevOps Engineer)</option>
                    <option value="Priya Sharma (HR Lead)">Priya Sharma (HR Lead)</option>
                    <option value="Aditya Tiwari (HR Manager)">Aditya Tiwari (HR Manager)</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={`${emp.full_name} (${emp.designation || 'Manager'})`}>
                        {emp.full_name} ({emp.designation || 'Manager'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ADDITIONAL INFORMATION */}
          {(currentStep === 3 || currentStep === 4 || currentStep === 1) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
                Additional Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* PF Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">PF Number</label>
                  <input
                    type="text"
                    name="pfNumber"
                    value={formData.pfNumber}
                    onChange={handleChange}
                    placeholder="PF7845125896"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* ESI Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">ESI Number</label>
                  <input
                    type="text"
                    name="esiNumber"
                    value={formData.esiNumber}
                    onChange={handleChange}
                    placeholder="ESI45879632"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* UAN Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">UAN Number</label>
                  <input
                    type="text"
                    name="uanNumber"
                    value={formData.uanNumber}
                    onChange={handleChange}
                    placeholder="100001234567"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Profile Photo Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              Profile Photo
            </h2>

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* Drop Zone Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-blue-500 bg-gray-50/50 rounded-xl p-6 text-center cursor-pointer transition-colors group flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Upload Photo</p>
                <p className="text-xs text-gray-400">JPG, PNG or JPEG</p>
                <p className="text-xs text-gray-400">Max size 2MB</p>
              </div>
            </div>

            {/* Avatar Preview */}
            {formData.photoPreview && (
              <div className="flex flex-col items-center pt-2 space-y-2">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-50 shadow-sm border border-gray-200">
                  <img
                    src={formData.photoPreview}
                    alt="Employee Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 pt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar (Spans full width) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563eb] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            {currentStep === 4 ? (
              <>
                <Check className="w-4 h-4" /> Save & Submit
              </>
            ) : (
              <>
                Save & Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEmployee
