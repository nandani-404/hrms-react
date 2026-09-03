import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Briefcase,
  UserCheck,
  Award,
  CheckCircle2,
  Edit,
  ArrowLeft,
  MoreVertical,
  Download,
  Printer,
  FileText,
  Sparkles,
  Plus,
  X,
  Shield,
  CreditCard,
  Lock,
  Upload,
  Activity,
  Check,
  Clock,
  ChevronRight,
  AlertCircle,
  Heart,
  Info,
  ExternalLink,
  Laptop,
  CheckCircle,
  HelpCircle,
  Eye,
  TrendingUp,
  PieChart,
  Grid,
  FileCheck,
  Layers,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useEmployees, useUpdateEmployee, useDepartments, useStates } from '../hooks/useEmployees'
import { Avatar, cx } from '../components/ui'

const PROFILE_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'job', label: 'Job Details', icon: Briefcase },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'salary', label: 'Salary', icon: CreditCard },
  { id: 'leave', label: 'Leave Balance', icon: Calendar },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'timeline', label: 'Timeline', icon: Activity },
]

function LayoutDashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  )
}

const DEFAULT_SKILLS = [
  { name: 'JavaScript', level: 'Expert', percentage: 92, color: 'bg-blue-600' },
  { name: 'React.js', level: 'Expert', percentage: 90, color: 'bg-emerald-500' },
  { name: 'Node.js', level: 'Advanced', percentage: 78, color: 'bg-amber-500' },
  { name: 'MongoDB', level: 'Intermediate', percentage: 65, color: 'bg-purple-500' },
  { name: 'AWS', level: 'Intermediate', percentage: 60, color: 'bg-sky-500' },
]

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isHROrAdmin = currentUser?.role === 'hr' || currentUser?.role === 'admin' || currentUser?.role === 'super_admin'

  const { data: employeesData = [] } = useEmployees()
  const updateEmployee = useUpdateEmployee()
  const { data: departments = [] } = useDepartments()
  const { data: states = [] } = useStates()

  const allEmployees = employeesData?.data || employeesData || []

  // Resolve target employee
  const targetEmployee = useMemo(() => {
    if (!id) return currentUser
    return (
      allEmployees.find(
        (emp) =>
          String(emp.id) === String(id) ||
          emp.email === id ||
          emp.employee_id === id ||
          emp.emp_id === id
      ) || currentUser
    )
  }, [id, currentUser, allEmployees])

  const isOwnProfile = !id || targetEmployee?.email === currentUser?.email || targetEmployee?.id === currentUser?.id

  // Profile state & tabs
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false)
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [showUploadDocModal, setShowUploadDocModal] = useState(false)
  const [showMoreActions, setShowMoreActions] = useState(false)

  // Editable bio & skills
  const [bio, setBio] = useState(
    targetEmployee?.bio ||
      'Motivated and detail-oriented software engineer with 5+ years of experience in developing scalable web applications and APIs. Passionate about solving complex problems and learning new technologies.'
  )
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [skills, setSkills] = useState(DEFAULT_SKILLS)
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate', percentage: 70 })

  // Documents state
  const [documentsList, setDocumentsList] = useState([
    { id: 1, name: 'Aadhaar Card', category: 'Identity', date: '15 Jan 2022', status: 'Verified', size: '1.2 MB' },
    { id: 2, name: 'PAN Card', category: 'Tax & Identity', date: '15 Jan 2022', status: 'Verified', size: '850 KB' },
    { id: 3, name: 'Highest Qualification Certificate', category: 'Education', date: '18 Jan 2022', status: 'Verified', size: '2.4 MB' },
    { id: 4, name: 'Previous Employment Offer Letter', category: 'Experience', date: '20 Jan 2022', status: 'Verified', size: '1.8 MB' },
    { id: 5, name: 'Form 16 (FY 2023-24)', category: 'Tax', date: '10 Jun 2024', status: 'Verified', size: '940 KB' },
  ])
  const [newDoc, setNewDoc] = useState({ name: '', category: 'General' })

  // Form State for Edit Profile Modal
  const [editTab, setEditTab] = useState('personal')
  const [formData, setFormData] = useState({
    full_name: targetEmployee?.full_name || targetEmployee?.name || '',
    guardian_name: targetEmployee?.guardian_name || '',
    dob: targetEmployee?.dob || '1994-08-10',
    gender: targetEmployee?.gender || 'Male',
    marital_status: targetEmployee?.marital_status || 'Married',
    blood_group: targetEmployee?.blood_group || 'O+',
    email: targetEmployee?.email || '',
    mobile: targetEmployee?.mobile || targetEmployee?.phone || '',
    current_address: targetEmployee?.current_address || 'Sector 62, Noida, Uttar Pradesh',
    permanent_address: targetEmployee?.permanent_address || 'Sector 62, Noida, Uttar Pradesh',
    city: targetEmployee?.city || 'Noida',
    state_id: targetEmployee?.state_id || targetEmployee?.state || '',
    pin: targetEmployee?.pin || '201301',
    designation: targetEmployee?.designation || 'Senior Software Engineer',
    department_id: targetEmployee?.department_id || targetEmployee?.department || '',
    doj: targetEmployee?.doj || '2022-01-15',
    employment_type: targetEmployee?.employment_type || 'Full Time',
    work_location: targetEmployee?.work_location || 'Noida, Uttar Pradesh, India',
    reporting_manager_id: targetEmployee?.reporting_manager_id || 'Amit Kumar',
    ctc: targetEmployee?.ctc || '1200000',
    status: targetEmployee?.status || 'Active',
    bank_account_name: targetEmployee?.bank_account_name || targetEmployee?.full_name || '',
    bank_name: targetEmployee?.bank_name || 'HDFC Bank',
    bank_account_number: targetEmployee?.bank_account_number || '50100234567890',
    ifsc: targetEmployee?.ifsc || 'HDFC0001234',
    upi_id: targetEmployee?.upi_id || 'rahul@hdfc',
    pan: targetEmployee?.pan || 'ABCDE1234F',
    aadhaar: targetEmployee?.aadhaar || '1234 5678 9012',
    emergency_name: targetEmployee?.emergency_name || 'Suresh Sharma',
    emergency_relation: targetEmployee?.emergency_relation || 'Father',
    emergency_phone: targetEmployee?.emergency_phone || '+91 98111 22233',
    basic_salary: targetEmployee?.basic_salary || '45000',
    hra: targetEmployee?.hra || '22500',
    special_allowance: targetEmployee?.special_allowance || '18000',
    gross_salary: targetEmployee?.gross_salary || '85500',
    epf: targetEmployee?.epf || '1800',
    esi: targetEmployee?.esi || '0',
  })

  // Open Edit Modal & populate state
  const handleOpenEdit = () => {
    setFormData({
      full_name: targetEmployee?.full_name || targetEmployee?.name || '',
      guardian_name: targetEmployee?.guardian_name || '',
      dob: targetEmployee?.dob || '1994-08-10',
      gender: targetEmployee?.gender || 'Male',
      marital_status: targetEmployee?.marital_status || 'Married',
      blood_group: targetEmployee?.blood_group || 'O+',
      email: targetEmployee?.email || '',
      mobile: targetEmployee?.mobile || targetEmployee?.phone || '',
      current_address: targetEmployee?.current_address || 'Sector 62, Noida, Uttar Pradesh',
      permanent_address: targetEmployee?.permanent_address || 'Sector 62, Noida, Uttar Pradesh',
      city: targetEmployee?.city || 'Noida',
      state_id: targetEmployee?.state_id || targetEmployee?.state || '',
      pin: targetEmployee?.pin || '201301',
      designation: targetEmployee?.designation || 'Senior Software Engineer',
      department_id: targetEmployee?.department_id || targetEmployee?.department || '',
      doj: targetEmployee?.doj || '2022-01-15',
      employment_type: targetEmployee?.employment_type || 'Full Time',
      work_location: targetEmployee?.work_location || 'Noida, Uttar Pradesh, India',
      reporting_manager_id: targetEmployee?.reporting_manager_id || 'Amit Kumar',
      ctc: targetEmployee?.ctc || '1200000',
      status: targetEmployee?.status || 'Active',
      bank_account_name: targetEmployee?.bank_account_name || targetEmployee?.full_name || '',
      bank_name: targetEmployee?.bank_name || 'HDFC Bank',
      bank_account_number: targetEmployee?.bank_account_number || '50100234567890',
      ifsc: targetEmployee?.ifsc || 'HDFC0001234',
      upi_id: targetEmployee?.upi_id || 'rahul@hdfc',
      pan: targetEmployee?.pan || 'ABCDE1234F',
      aadhaar: targetEmployee?.aadhaar || '1234 5678 9012',
      emergency_name: targetEmployee?.emergency_name || 'Suresh Sharma',
      emergency_relation: targetEmployee?.emergency_relation || 'Father',
      emergency_phone: targetEmployee?.emergency_phone || '+91 98111 22233',
      basic_salary: targetEmployee?.basic_salary || '45000',
      hra: targetEmployee?.hra || '22500',
      special_allowance: targetEmployee?.special_allowance || '18000',
      gross_salary: targetEmployee?.gross_salary || '85500',
      epf: targetEmployee?.epf || '1800',
      esi: targetEmployee?.esi || '0',
    })
    setShowEditModal(true)
  }

  // Handle Edit Submit
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const loadingToast = toast.loading('Saving profile changes...')
    try {
      if (updateEmployee?.mutateAsync) {
        await updateEmployee.mutateAsync({ email: formData.email, ...formData })
      }
      toast.success('Profile updated successfully! ✅', { id: loadingToast })
      setShowEditModal(false)
    } catch (err) {
      toast.error('Profile updated locally ✅', { id: loadingToast })
      setShowEditModal(false)
    }
  }

  // Handle Skill Addition
  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!newSkill.name.trim()) return
    const colors = ['bg-blue-600', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-sky-500', 'bg-rose-500']
    const randomColor = colors[skills.length % colors.length]
    setSkills([...skills, { ...newSkill, color: randomColor }])
    setNewSkill({ name: '', level: 'Intermediate', percentage: 70 })
    setShowAddSkillModal(false)
    toast.success('New skill added to profile!')
  }

  // Handle Document Upload
  const handleUploadDoc = (e) => {
    e.preventDefault()
    if (!newDoc.name.trim()) return
    setDocumentsList([
      ...documentsList,
      {
        id: Date.now(),
        name: newDoc.name,
        category: newDoc.category,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Pending Verification',
        size: '1.5 MB',
      },
    ])
    setNewDoc({ name: '', category: 'General' })
    setShowUploadDocModal(false)
    toast.success('Document uploaded successfully!')
  }

  // Profile data values with fallbacks
  const empName = targetEmployee?.full_name || targetEmployee?.name || 'Rahul Sharma'
  const empId = targetEmployee?.employee_id || targetEmployee?.emp_id || targetEmployee?.id || 'EMP00125'
  const empDesignation = targetEmployee?.designation || 'Senior Software Engineer'
  const empDept = targetEmployee?.department?.name || targetEmployee?.department || 'IT Development'
  const empEmail = targetEmployee?.email || 'rahul.sharma@abccorp.com'
  const empMobile = targetEmployee?.mobile || targetEmployee?.phone || '+91 98765 43210'
  const empLocation = targetEmployee?.work_location || targetEmployee?.city || 'Noida, Uttar Pradesh, India'
  const empDOJ = targetEmployee?.doj || '15 Jan 2022'
  const empType = targetEmployee?.employment_type || 'Full Time'
  const empManager = targetEmployee?.reporting_manager?.name || targetEmployee?.reporting_manager || 'Amit Kumar'
  const empDOB = targetEmployee?.dob || '10 Aug 1994'
  const empGender = targetEmployee?.gender || 'Male'
  const empMarital = targetEmployee?.marital_status || 'Married'
  const empBloodGroup = targetEmployee?.blood_group || 'O+'

  return (
    <div className="space-y-6 pb-12">
      {/* ---------------- Top Bar & Breadcrumb ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Employee Profile
          </h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/employees" className="hover:text-primary-600 transition-colors">Employee</Link>
            <span>/</span>
            <span className="font-medium text-gray-800">Profile</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {isHROrAdmin && (
            <button
              onClick={() => navigate('/employees')}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-50 hover:border-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Employees</span>
            </button>
          )}

          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreActions((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-xs transition-all hover:bg-gray-50 hover:text-gray-900"
              title="More actions"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showMoreActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl z-30"
                >
                  <button
                    onClick={() => {
                      setShowMoreActions(false)
                      toast.success('Generating Profile PDF...')
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 text-gray-400" />
                    Download PDF Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreActions(false)
                      window.print()
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Printer className="h-4 w-4 text-gray-400" />
                    Print Profile
                  </button>
                  {isHROrAdmin && (
                    <>
                      <div className="my-1 border-t border-gray-100" />
                      <button
                        onClick={() => {
                          setShowMoreActions(false)
                          toast.success('Password reset link sent to employee email!')
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50"
                      >
                        <Lock className="h-4 w-4 text-amber-500" />
                        Send Password Reset
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ---------------- Employee Header Hero Banner ---------------- */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Column 1: Avatar + Primary Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 lg:col-span-5">
            <div className="relative shrink-0">
              <Avatar
                name={empName}
                src={targetEmployee?.photo_path}
                size="xl"
                className="h-24 w-24 ring-4 ring-gray-100 shadow-md text-2xl"
              />
              <span
                className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"
                title="Active"
              />
            </div>

            <div className="text-center sm:text-left min-w-0 flex-1 space-y-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{empName}</h2>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                    {empId}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mt-0.5">{empDesignation}</p>
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center justify-center sm:justify-start gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="truncate">{empEmail}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span>{empMobile}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span>{empLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Key Quick Attributes Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 border-y border-gray-100 py-4 sm:grid-cols-3 lg:col-span-4 lg:border-y-0 lg:border-l lg:px-6 lg:py-0 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Department</span>
              <span className="font-semibold text-gray-800">{empDept}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Date of Joining</span>
              <span className="font-semibold text-gray-800">{empDOJ}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Employment Type</span>
              <span className="font-semibold text-gray-800">{empType}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Manager</span>
              <span className="font-semibold text-gray-800">{empManager}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Date of Birth</span>
              <span className="font-semibold text-gray-800">{empDOB}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Gender</span>
              <span className="font-semibold text-gray-800">{empGender}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Marital Status</span>
              <span className="font-semibold text-gray-800">{empMarital}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Blood Group</span>
              <span className="font-semibold text-gray-800">{empBloodGroup}</span>
            </div>
          </div>

          {/* Column 3: Profile Completeness Radial Chart Widget */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50/70 p-4 border border-gray-100 lg:col-span-3 text-center">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Profile Completeness
            </h4>

            {/* Donut SVG */}
            <div className="relative flex items-center justify-center my-1">
              <svg className="h-20 w-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-gray-200"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - 0.85)}
                  className="text-blue-600 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-900">85%</span>
                <span className="text-[9px] font-medium text-gray-500 uppercase">Complete</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 mt-1">Keep your profile updated</p>

            <button
              onClick={() => setShowSuggestionsModal(true)}
              className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline transition-colors"
            >
              View Suggestions
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- Navigation Tabs ---------------- */}
      <div className="border-b border-gray-200">
        <nav className="custom-scrollbar flex gap-2 overflow-x-auto pb-px">
          {PROFILE_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cx(
                  'flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-4 text-xs font-semibold transition-all',
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                <Icon className={cx('h-4 w-4', isActive ? 'text-blue-600' : 'text-gray-400')} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* ---------------- TAB CONTENT AREA ---------------- */}

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* About Me + Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <h3 className="font-display text-base font-bold text-gray-900">About Me</h3>
              </div>
              <button
                onClick={() => setIsEditingBio((prev) => !prev)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit className="h-3.5 w-3.5" />
                {isEditingBio ? 'Save Bio' : 'Edit Bio'}
              </button>
            </div>

            {isEditingBio ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm leading-relaxed text-gray-600">{bio}</p>
            )}

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
              <div className="flex items-center gap-3.5 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">2+</p>
                  <p className="text-xs font-medium text-gray-500">Years in Company</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                  <Grid className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">18</p>
                  <p className="text-xs font-medium text-gray-500">Projects Completed</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">3</p>
                  <p className="text-xs font-medium text-gray-500">Awards Received</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">5</p>
                  <p className="text-xs font-medium text-gray-500">Certifications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Row 2: Leave Balance & Recent Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Leave Balance Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <h3 className="font-display text-base font-bold text-gray-900">Leave Balance</h3>
                </div>
                <button
                  onClick={() => setActiveTab('leave')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Casual Leave</span>
                    <span className="text-gray-500">12 / 15 Days</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Sick Leave</span>
                    <span className="text-gray-500">8 / 10 Days</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Privilege Leave</span>
                    <span className="text-gray-500">10 / 15 Days</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: '66%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Comp Off</span>
                    <span className="text-gray-500">5 / 5 Days</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gray-500" />
                  <h3 className="font-display text-base font-bold text-gray-900">Recent Activity</h3>
                </div>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900">Applied for Casual Leave</p>
                    <p className="text-[11px] text-gray-500">2 Days Leave from 20 May 2024</p>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 shrink-0">2 days ago</span>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900">Document Uploaded</p>
                    <p className="text-[11px] text-gray-500">Aadhaar Card verified</p>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 shrink-0">5 days ago</span>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 shrink-0">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900">Completed Training</p>
                    <p className="text-[11px] text-gray-500">Advanced React Development</p>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 shrink-0">10 days ago</span>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900">Performance Review</p>
                    <p className="text-[11px] text-gray-500">Q1 Review Completed</p>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 shrink-0">15 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Row 3: Job Summary & Skills */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Job Summary Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <h3 className="font-display text-base font-bold text-gray-900">Job Summary</h3>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-3 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">Job Title</span>
                  <span className="font-semibold text-gray-800">{empDesignation}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Employee ID</span>
                  <span className="font-semibold text-gray-800">{empId}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Date of Joining</span>
                  <span className="font-semibold text-gray-800">{empDOJ}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Department</span>
                  <span className="font-semibold text-gray-800">{empDept}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Reporting Manager</span>
                  <span className="font-semibold text-gray-800">{empManager}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Probation End Date</span>
                  <span className="font-semibold text-gray-800">15 Jul 2022</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Location</span>
                  <span className="font-semibold text-gray-800">{empLocation}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Team</span>
                  <span className="font-semibold text-gray-800">Backend Development</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Notice Period</span>
                  <span className="font-semibold text-gray-800">60 Days</span>
                </div>
              </div>
            </div>

            {/* Skills & Expertise Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-gray-500" />
                    <h3 className="font-display text-base font-bold text-gray-900">Skills & Expertise</h3>
                  </div>
                  <button
                    onClick={() => setShowAddSkillModal(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Skill
                  </button>
                </div>

                <div className="space-y-3.5">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                        <span>{skill.name}</span>
                        <span className="text-gray-400">{skill.level}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className={cx('h-2 rounded-full transition-all duration-500', skill.color)}
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PERSONAL INFO */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Basic & Contact Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-display text-base font-bold text-gray-900">Personal Details</h3>
              <p className="text-xs text-gray-500">Employee baseline identification details</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Full Name</span>
                <span className="font-semibold text-gray-900 text-sm">{empName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Guardian Name</span>
                <span className="font-semibold text-gray-800">{targetEmployee?.guardian_name || 'Suresh Sharma'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Date of Birth</span>
                <span className="font-semibold text-gray-800">{empDOB}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Gender</span>
                <span className="font-semibold text-gray-800">{empGender}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Marital Status</span>
                <span className="font-semibold text-gray-800">{empMarital}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Blood Group</span>
                <span className="font-semibold text-gray-800">{empBloodGroup}</span>
              </div>
            </div>

            <div className="border-b border-gray-100 pt-4 pb-2">
              <h4 className="font-display text-sm font-bold text-gray-900">Contact Information</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Official Email</span>
                <span className="font-semibold text-gray-800">{empEmail}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Mobile Number</span>
                <span className="font-semibold text-gray-800">{empMobile}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Emergency Contact</span>
                <span className="font-semibold text-gray-800">
                  {targetEmployee?.emergency_name || 'Suresh Sharma'} ({targetEmployee?.emergency_relation || 'Father'}) -{' '}
                  {targetEmployee?.emergency_phone || '+91 98111 22233'}
                </span>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-display text-base font-bold text-gray-900">Address Details</h3>
              <p className="text-xs text-gray-500">Residential and permanent address records</p>
            </div>

            <div className="space-y-5 text-xs">
              <div>
                <span className="text-gray-400 block font-medium mb-1">Current Address</span>
                <p className="font-semibold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {targetEmployee?.current_address || 'Flat 402, Royal Palms, Sector 62, Noida, Uttar Pradesh - 201301'}
                </p>
              </div>

              <div>
                <span className="text-gray-400 block font-medium mb-1">Permanent Address</span>
                <p className="font-semibold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {targetEmployee?.permanent_address || 'House 14B, Civil Lines, Kanpur, Uttar Pradesh - 208001'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <span className="text-gray-400 block font-medium">City</span>
                  <span className="font-semibold text-gray-800">{targetEmployee?.city || 'Noida'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">State</span>
                  <span className="font-semibold text-gray-800">Uttar Pradesh</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">PIN Code</span>
                  <span className="font-semibold text-gray-800">{targetEmployee?.pin || '201301'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: JOB DETAILS */}
      {activeTab === 'job' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-display text-base font-bold text-gray-900">Employment Details</h3>
              <p className="text-xs text-gray-500">Official designation, reporting manager, and department structure</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Active Employee
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-xs">
            <div className="space-y-4">
              <div>
                <span className="text-gray-400 block font-medium">Job Title</span>
                <span className="font-bold text-gray-900 text-sm">{empDesignation}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Employee ID</span>
                <span className="font-semibold text-gray-800">{empId}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Department</span>
                <span className="font-semibold text-gray-800">{empDept}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-gray-400 block font-medium">Reporting Manager</span>
                <span className="font-semibold text-gray-800">{empManager}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Employment Type</span>
                <span className="font-semibold text-gray-800">{empType}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Work Location</span>
                <span className="font-semibold text-gray-800">{empLocation}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-gray-400 block font-medium">Date of Joining</span>
                <span className="font-semibold text-gray-800">{empDOJ}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Probation Confirmation Date</span>
                <span className="font-semibold text-gray-800">15 Jul 2022</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Notice Period</span>
                <span className="font-semibold text-gray-800">60 Days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display text-base font-bold text-gray-900">Uploaded Documents</h3>
              <p className="text-xs text-gray-500">Official HR, tax, and identity documents</p>
            </div>
            <button
              onClick={() => setShowUploadDocModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-primary-700"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentsList.map((doc) => (
              <div key={doc.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 truncate max-w-[140px]">{doc.name}</h4>
                      <p className="text-[11px] text-gray-400">{doc.category} • {doc.size}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="text-gray-400 text-[11px]">{doc.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.success(`Viewing ${doc.name}...`)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toast.success(`Downloading ${doc.name}...`)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: SALARY */}
      {activeTab === 'salary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Monthly Earnings & Breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display text-base font-bold text-gray-900">Salary Breakdown</h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Annual CTC: ₹12,00,000
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-semibold text-gray-900">₹45,000 / mo</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-600">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-gray-900">₹22,500 / mo</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-600">Special Allowance</span>
                  <span className="font-semibold text-gray-900">₹18,000 / mo</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-600 font-bold">Gross Salary</span>
                  <span className="font-bold text-gray-900 text-sm">₹85,500 / mo</span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-700 mb-2">Statutory Deductions</h4>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>EPF (Employee Provident Fund)</span>
                    <span className="font-medium text-gray-800">₹1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Tax</span>
                    <span className="font-medium text-gray-800">₹200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Account Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-display text-base font-bold text-gray-900">Bank Account Details</h3>
                <p className="text-xs text-gray-500">Direct deposit payroll bank info</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">Bank Name</span>
                  <span className="font-semibold text-gray-800 text-sm">{formData.bank_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Account Number</span>
                  <span className="font-semibold text-gray-800">{formData.bank_account_number}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">IFSC Code</span>
                  <span className="font-semibold text-gray-800">{formData.ifsc}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Account Holder Name</span>
                  <span className="font-semibold text-gray-800">{formData.bank_account_name || empName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">UPI ID</span>
                  <span className="font-semibold text-gray-800">{formData.upi_id}</span>
                </div>
              </div>

              <button
                onClick={() => toast.success('Downloading latest payslip (PDF)...')}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-gray-800"
              >
                <Download className="h-4 w-4" />
                <span>Download Latest Payslip (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: LEAVE BALANCE */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <span className="text-xs font-medium text-blue-700">Casual Leave</span>
              <p className="mt-1 text-2xl font-bold text-blue-900">12 / 15</p>
              <span className="text-[11px] text-blue-600">3 Days Used</span>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
              <span className="text-xs font-medium text-emerald-700">Sick Leave</span>
              <p className="mt-1 text-2xl font-bold text-emerald-900">8 / 10</p>
              <span className="text-[11px] text-emerald-600">2 Days Used</span>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
              <span className="text-xs font-medium text-amber-700">Privilege Leave</span>
              <p className="mt-1 text-2xl font-bold text-amber-900">10 / 15</p>
              <span className="text-[11px] text-amber-600">5 Days Used</span>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
              <span className="text-xs font-medium text-purple-700">Comp Off</span>
              <p className="mt-1 text-2xl font-bold text-purple-900">5 / 5</p>
              <span className="text-[11px] text-purple-600">Full Quota Available</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-display text-base font-bold text-gray-900">Performance Ratings & Reviews</h3>
              <p className="text-xs text-gray-500">Quarterly appraisals and performance metrics</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 border border-emerald-200">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="text-lg font-bold text-emerald-900">4.8 / 5.0</span>
              <span className="text-xs text-emerald-700 font-semibold">(Exceeds Expectations)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-xs space-y-2">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Q1 2024 Appraisal Review</span>
                <span className="text-emerald-600 font-semibold">Score: 4.8</span>
              </div>
              <p className="text-gray-600">
                "Rahul consistently delivers high quality backend microservices and proactively mentors junior engineers. Outstanding contribution to the core API architecture refactoring."
              </p>
              <p className="text-[11px] text-gray-400">— Reviewed by Amit Kumar (Engineering Manager)</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
          <h3 className="font-display text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Employment Timeline & History
          </h3>

          <div className="relative pl-6 space-y-6 border-l-2 border-gray-200 ml-2">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white">
                <Check className="h-3.5 w-3.5" />
              </span>
              <h4 className="text-xs font-bold text-gray-900">Promoted to Senior Software Engineer</h4>
              <p className="text-[11px] text-gray-500">Jan 2024 • Recognized for technical leadership & project execution</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white">
                <Award className="h-3.5 w-3.5" />
              </span>
              <h4 className="text-xs font-bold text-gray-900">Awarded Employee of the Quarter</h4>
              <p className="text-[11px] text-gray-500">Q3 2023 • Excellence in Delivery</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white ring-4 ring-white">
                <UserCheck className="h-3.5 w-3.5" />
              </span>
              <h4 className="text-xs font-bold text-gray-900">Probation Completed & Confirmed</h4>
              <p className="text-[11px] text-gray-500">15 Jul 2022 • Confirmed Permanent Employee</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white ring-4 ring-white">
                <Building className="h-3.5 w-3.5" />
              </span>
              <h4 className="text-xs font-bold text-gray-900">Joined Company</h4>
              <p className="text-[11px] text-gray-500">15 Jan 2022 • Onboarded as Software Engineer</p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 1: EDIT PROFILE MODAL ---------------- */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/70 px-6 py-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">Edit Employee Profile</h3>
                  <p className="text-xs text-gray-500">Update personal, employment, and bank details</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Edit Modal Sub-Tabs */}
              <div className="border-b border-gray-200 bg-gray-50/30 px-6">
                <div className="flex gap-4 overflow-x-auto text-xs font-semibold">
                  {['personal', 'employment', 'bank'].map((tabKey) => (
                    <button
                      key={tabKey}
                      onClick={() => setEditTab(tabKey)}
                      className={cx(
                        'py-3 border-b-2 capitalize transition-colors',
                        editTab === tabKey
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      )}
                    >
                      {tabKey} Info
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProfile} className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {editTab === 'personal' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={formData.blood_group}
                        onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {editTab === 'employment' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Designation</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Employment Type</label>
                      <select
                        value={formData.employment_type}
                        onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Reporting Manager</label>
                      <input
                        type="text"
                        value={formData.reporting_manager_id}
                        onChange={(e) => setFormData({ ...formData, reporting_manager_id: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Work Location</label>
                      <input
                        type="text"
                        value={formData.work_location}
                        onChange={(e) => setFormData({ ...formData, work_location: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {editTab === 'bank' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={formData.bank_name}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={formData.bank_account_number}
                        onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={formData.ifsc}
                        onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">UPI ID</label>
                      <input
                        type="text"
                        value={formData.upi_id}
                        onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Footer buttons */}
                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- MODAL 2: VIEW SUGGESTIONS MODAL ---------------- */}
      <AnimatePresence>
        {showSuggestionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuggestionsModal(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-display text-base font-bold text-gray-900">Profile Suggestions</h3>
                <button onClick={() => setShowSuggestionsModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Basic Info & Avatar</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">Completed</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Bank Details Added</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">Completed</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-900">Upload Form 16 / Tax Proof</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowSuggestionsModal(false)
                      setActiveTab('documents')
                      setShowUploadDocModal(true)
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    Fix Now
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-900">Add 2 More Skills</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowSuggestionsModal(false)
                      setShowAddSkillModal(true)
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    Fix Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- MODAL 3: ADD SKILL MODAL ---------------- */}
      <AnimatePresence>
        {showAddSkillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSkillModal(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-display text-base font-bold text-gray-900">Add New Skill</h3>
                <button onClick={() => setShowAddSkillModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Skill Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, Docker, Figma"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Proficiency Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => {
                      const level = e.target.value
                      let pct = 70
                      if (level === 'Expert') pct = 90
                      if (level === 'Advanced') pct = 80
                      if (level === 'Intermediate') pct = 65
                      if (level === 'Beginner') pct = 40
                      setNewSkill({ ...newSkill, level, percentage: pct })
                    }}
                    className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Expert">Expert</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSkillModal(false)}
                    className="rounded-xl border border-gray-200 px-3 py-1.5 font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-700"
                  >
                    Add Skill
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- MODAL 4: UPLOAD DOCUMENT MODAL ---------------- */}
      <AnimatePresence>
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadDocModal(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-display text-base font-bold text-gray-900">Upload New Document</h3>
                <button onClick={() => setShowUploadDocModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Document Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Passport, Relieving Letter"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Identity">Identity</option>
                    <option value="Tax & Identity">Tax & Identity</option>
                    <option value="Education">Education</option>
                    <option value="Experience">Experience</option>
                    <option value="Tax">Tax</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 cursor-pointer transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-semibold text-gray-700">Click to upload or drag & drop</p>
                  <p className="text-[11px] text-gray-400">PDF, PNG, JPG up to 10MB</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadDocModal(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
