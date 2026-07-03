import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit, X, ToggleLeft, ToggleRight, AlertTriangle, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDepartments, useStates } from '../hooks/useEmployees'
import { useAuth } from '../context/AuthContext'
import { getTeamMembers, canManageTeam } from '../utils/teamFilter'

const INACTIVE_REASONS = [
  'Resigned',
  'Terminated',
  'Contract Ended',
  'Retired',
  'Absconding',
  'Long-term Leave',
  'Others',
]

const Employees = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('active')
  const [filterDepartment, setFilterDepartment] = useState('')

  const { data: employeesData = [], isLoading: loading } = useEmployees({
    search: searchTerm,
    status: filterStatus,
    department: filterDepartment
  })
  const { data: departments = [] } = useDepartments()
  const { data: states = [] } = useStates()
  const createEmployee = useCreateEmployee()
  const updateEmployee = useUpdateEmployee()
  
  // Filter employees based on team
  const allEmployees = employeesData?.data || employeesData || []
  const employees = getTeamMembers(allEmployees, user)
  const canManage = canManageTeam(user)
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [activeTab, setActiveTab] = useState('personal')
  // Deactivation confirm modal state
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [deactivateReasonOption, setDeactivateReasonOption] = useState('')
  const [deactivateReasonText, setDeactivateReasonText] = useState('')
  const [formData, setFormData] = useState({
    // Personal Info
    full_name: '',
    guardian_name: '',
    dob: '',
    gender: 'Male',
    workingHours: '',
    working_hours: '',
    employement_work_type: '',
    email: '',
    mobile: '',
    password: '',
    // Address Info
    current_address: '',
    permanent_address: '',
    city: '',
    state_id: '',
    pin: '',
    // Employment Info
    designation: '',
    department_id: '',
    doj: '',
    employment_type: 'Permanent',
    work_location: '',
    reporting_manager_id: '',
    ctc: '',
    status: 'Pending',
    is_active: true,
    inactive_reason: '',
    // Bank Details
    bank_account_name: '',
    bank_name: '',
    bank_account_number: '',
    ifsc: '',
    upi_id: '',
    // Documents
    pan: '',
    aadhaar: '',
    highest_qualification: '',
    // Emergency Contact
    emergency_name: '',
    emergency_relation: '',
    emergency_phone: '',
    // Salary Components
    basic_salary: '',
    hra: '',
    conveyance_allowance: '',
    special_allowance: '',
    gross_salary: '',
    epf: '',
    esi: '',
    medical: '',
    gratuity: '',
    bonus: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const loadingToast = toast.loading(editingEmployee ? 'Updating employee...' : 'Creating employee...')
    
    try {
      if (editingEmployee) {
        // Update employee - remove password if empty
        const submitData = { ...formData }
        if (!submitData.password) {
          delete submitData.password
        }
        const result = await updateEmployee.mutateAsync({ email: editingEmployee.email, ...submitData })
        toast.success(result.message || 'Employee updated successfully! ✅', { id: loadingToast })
      } else {
        // Create employee - send only required fields with correct field names
        const createData = {
          full_name: formData.full_name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          department: formData.department_id, // API expects 'department' not 'department_id'
          state: formData.state_id // API expects 'state' not 'state_id'
        }
        const result = await createEmployee.mutateAsync(createData)
        toast.success(result.message || 'Employee created successfully! ✅', { id: loadingToast })
      }
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save employee:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save employee'
      toast.error(errorMessage, { id: loadingToast })
    }
  }


  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      // Personal Info
      full_name: employee.full_name || '',
      guardian_name: employee.guardian_name || '',
      dob: employee.dob || '',
      gender: employee.gender || 'Male',
      workingHours: employee.workingHours || employee.working_hours || '',
      working_hours: employee.workingHours || employee.working_hours || '',
      employement_work_type: employee.employement_work_type || '',
      email: employee.email || '',
      mobile: employee.mobile || '',
      password: '',
      // Address Info
      current_address: employee.current_address || '',
      permanent_address: employee.permanent_address || '',
      city: employee.city || '',
      state_id: employee.state_id || '',
      pin: employee.pin || '',
      // Employment Info
      designation: employee.designation || '',
      department_id: employee.department_id || '',
      doj: employee.doj || '',
      employment_type: employee.employment_type || 'Permanent',
      work_location: employee.work_location || '',
      reporting_manager_id: employee.reporting_manager_id || '',
      ctc: employee.ctc || '',
      status: employee.status || 'Pending',
      is_active: employee.is_active !== undefined ? !!employee.is_active : true,
      inactive_reason: employee.inactive_reason || '',
      // Bank Details
      bank_account_name: employee.bank_account_name || '',
      bank_name: employee.bank_name || '',
      bank_account_number: employee.bank_account_number || '',
      ifsc: employee.ifsc || '',
      upi_id: employee.upi_id || '',
      // Documents
      pan: employee.pan || '',
      aadhaar: employee.aadhaar || '',
      highest_qualification: employee.highest_qualification || '',
      // Emergency Contact
      emergency_name: employee.emergency_name || '',
      emergency_relation: employee.emergency_relation || '',
      emergency_phone: employee.emergency_phone || '',
      // Salary Components
      basic_salary: employee.basic_salary || '',
      hra: employee.hra || '',
      conveyance_allowance: employee.conveyance_allowance || '',
      special_allowance: employee.special_allowance || '',
      gross_salary: employee.gross_salary || '',
      epf: employee.epf || '',
      esi: employee.esi || '',
      medical: employee.medical || '',
      gratuity: employee.gratuity || '',
      bonus: employee.bonus || ''
    })
    setDeactivateReasonOption('')
    setDeactivateReasonText('')
    setActiveTab('personal')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEmployee(null)
    setActiveTab('personal')
    setShowDeactivateModal(false)
    setDeactivateReasonOption('')
    setDeactivateReasonText('')
    setFormData({
      // Personal Info
      full_name: '',
      guardian_name: '',
      dob: '',
      gender: 'Male',
      workingHours: '',
      working_hours: '',
      employement_work_type: '',
      email: '',
      mobile: '',
      password: '',
      // Address Info
      current_address: '',
      permanent_address: '',
      city: '',
      state_id: '',
      pin: '',
      // Employment Info
      designation: '',
      department_id: '',
      doj: '',
      employment_type: 'Permanent',
      work_location: '',
      reporting_manager_id: '',
      ctc: '',
      status: 'Pending',
      is_active: true,
      inactive_reason: '',
      // Bank Details
      bank_account_name: '',
      bank_name: '',
      bank_account_number: '',
      ifsc: '',
      upi_id: '',
      // Documents
      pan: '',
      aadhaar: '',
      highest_qualification: '',
      // Emergency Contact
      emergency_name: '',
      emergency_relation: '',
      emergency_phone: '',
      // Salary Components
      basic_salary: '',
      hra: '',
      conveyance_allowance: '',
      special_allowance: '',
      gross_salary: '',
      epf: '',
      esi: '',
      medical: '',
      gratuity: '',
      bonus: ''
    })
  }

  // Called when admin clicks Confirm inside the deactivation reason modal
  const handleConfirmDeactivate = () => {
    const reason = deactivateReasonOption === 'Others'
      ? deactivateReasonText.trim()
      : deactivateReasonOption
    if (!reason) {
      toast.error('Please provide an inactive reason.')
      return
    }
    setFormData(prev => ({ ...prev, is_active: false, inactive_reason: reason }))
    setShowDeactivateModal(false)
  }

  // Called when the toggle is clicked
  const handleToggleActive = () => {
    if (formData.is_active) {
      // Going inactive — open reason dialog
      setDeactivateReasonOption('')
      setDeactivateReasonText('')
      setShowDeactivateModal(true)
    } else {
      // Re-activating — clear reason
      setFormData(prev => ({ ...prev, is_active: true, inactive_reason: '' }))
    }
  }

  const getDepartmentName = (deptId) => {
    const dept = departments?.find(d => d.id === parseInt(deptId))
    return dept ? dept.name : deptId
  }

  const handleExport = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const url = new URL(`${baseUrl}/employees/export`);
    
    if (filterStatus !== 'all') {
      url.searchParams.append('status', filterStatus);
    }
    if (filterDepartment) {
      url.searchParams.append('department', filterDepartment);
    }

    const toastId = toast.loading('Exporting data...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `employees_export_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast.success('Export successful!', { id: toastId });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data', { id: toastId });
    }
  };

  const filteredEmployees = employees;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.is_reporting_manager === 1 && user?.role !== 'admin' && user?.role !== 'hr' 
              ? 'My Team' 
              : 'Employees'}
          </h1>
          <p className="text-gray-600 mt-1">
            {employees.length} {user?.is_reporting_manager === 1 && user?.role !== 'admin' && user?.role !== 'hr' ? 'team members' : 'total employees'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          )}
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {/* <option value="all">All Status</option> */}
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={String(dept.id)}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation / Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporting Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {employee.photo_path && (
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${employee.photo_path}`}
                          alt={employee.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <span className="text-sm font-medium text-gray-900">{employee.full_name}</span>
                    </div>
                    <td className="py-1 text-xs text-gray-900">{employee.emp_id}</td>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.email}<br/>{employee.mobile}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
  {employee.designation}
  <br />
  <div className="inline-block mt-1 px-2 py-1 text-xs font-medium text-gray-900 bg-orange-300 rounded-full">
    {getDepartmentName(employee.department_id || employee.department)}
  </div>
</td>
<td className="py-1 text-sm text-gray-900">{employee.reporting_manager}</td>
<td className="px-6 py-4 text-sm">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        employee.status === 'Verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        (employee.is_active !== undefined ? !!employee.is_active : true)
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(employee.is_active !== undefined ? !!employee.is_active : true) ? 'Active' : 'Inactive'}
                      </span>
                      {employee.is_active !== undefined && !employee.is_active && employee.inactive_reason && (
                        <span className="text-[10px] text-red-500 max-w-[150px] leading-tight" title={employee.inactive_reason}>
                          Reason: {employee.inactive_reason}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Tabs - Only show for editing */}
                {editingEmployee && (
                  <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
                    {['personal', 'address', 'employment', 'salary', 'bank', 'documents', 'emergency'].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === tab
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                  {/* Add Employee Form - Simple form for creating new employee */}
                  {!editingEmployee && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                          maxLength="10"
                          pattern="[0-9]{10}"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                          minLength="6"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                        <select
                          value={formData.department_id}
                          onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <select
                          value={formData.state_id}
                          onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                
                  {/* Personal Info Tab - Only for editing */}
                  {editingEmployee && activeTab === 'personal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                        <input
                          type="text"
                          value={formData.guardian_name}
                          onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                          required
                          disabled={editingEmployee}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                        <select
                          value={formData.workingHours}
                          onChange={(e) => setFormData({ ...formData, workingHours: e.target.value, working_hours: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="" disabled>Select Working Hours</option>
                          <option value="09:30-18:00">09:30 AM - 06:00 PM</option>
                          <option value="09:30-18:30">09:30 AM - 06:30 PM</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                        <select
                          value={formData.employement_work_type}
                          onChange={(e) => setFormData({ ...formData, employement_work_type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="" disabled>Select Work Type</option>
                          <option value="Onsite">Onsite</option>
                          <option value="work-from-home">Work From Home</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      {editingEmployee && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Leave blank to keep current)</label>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter new password to update"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Address Tab - Only for editing */}
                  {editingEmployee && activeTab === 'address' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
                        <textarea
                          value={formData.current_address}
                          onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows="3"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                        <textarea
                          value={formData.permanent_address}
                          onChange={(e) => setFormData({ ...formData, permanent_address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <select
                          value={formData.state_id}
                          onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={formData.pin}
                          onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          maxLength="6"
                        />
                      </div>
                    </div>
                  )}

                  {/* Employment Tab - Only for editing */}
                  {editingEmployee && activeTab === 'employment' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                        <input
                          type="text"
                          value={formData.designation}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                        <select
                          value={formData.department_id}
                          onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining *</label>
                        <input
                          type="date"
                          value={formData.doj}
                          onChange={(e) => setFormData({ ...formData, doj: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                        <select
                          value={formData.employment_type}
                          onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="Permanent">Permanent</option>
                          <option value="Contract">Contract</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                        <input
                          type="text"
                          value={formData.work_location}
                          onChange={(e) => setFormData({ ...formData, work_location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager</label>
                        <select
                          value={formData.reporting_manager_id}
                          onChange={(e) => setFormData({ ...formData, reporting_manager_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select Reporting Manager</option>
                          {employees
                            .filter(emp => emp.is_reporting_manager === 1 && emp.emp_id !== editingEmployee?.emp_id)
                            .map((emp) => (
                              <option key={emp.emp_id} value={emp.emp_id}>{emp.full_name}</option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CTC (Annual) *</label>
                        <input
                          type="number"
                          value={formData.ctc}
                          onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Active / Inactive Toggle — full width */}
                      <div className="md:col-span-2">
                        <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                          formData.is_active
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div>
                            <p className={`text-sm font-semibold ${
                              formData.is_active ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {formData.is_active ? '✅ Employee is Active' : '🔴 Employee is Inactive'}
                            </p>
                            {!formData.is_active && formData.inactive_reason && (
                              <p className="text-xs text-red-500 mt-1">
                                Reason: {formData.inactive_reason}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formData.is_active
                                ? 'Toggle to deactivate this employee account'
                                : 'Toggle to reactivate this employee account'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleToggleActive}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
                              formData.is_active ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                              formData.is_active ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Deactivation Reason Modal */}
                  <AnimatePresence>
                    {showDeactivateModal && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
                        onClick={() => setShowDeactivateModal(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          onClick={e => e.stopPropagation()}
                          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Deactivate Employee</h3>
                              <p className="text-sm text-gray-500">Please provide a reason for deactivation</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Reason *</label>
                            <div className="grid grid-cols-2 gap-2">
                              {INACTIVE_REASONS.map(reason => (
                                <button
                                  key={reason}
                                  type="button"
                                  onClick={() => setDeactivateReasonOption(reason)}
                                  className={`px-3 py-2 text-sm rounded-lg border-2 text-left transition-colors ${
                                    deactivateReasonOption === reason
                                      ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                  }`}
                                >
                                  {reason}
                                </button>
                              ))}
                            </div>

                            {deactivateReasonOption === 'Others' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specify reason</label>
                                <textarea
                                  value={deactivateReasonText}
                                  onChange={e => setDeactivateReasonText(e.target.value)}
                                  rows={3}
                                  placeholder="Enter custom reason..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm resize-none"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={() => setShowDeactivateModal(false)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleConfirmDeactivate}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              Confirm Deactivate
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Salary Tab */}
                  {activeTab === 'salary' && editingEmployee && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                        <input
                          type="number"
                          value={formData.basic_salary}
                          onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                        <input
                          type="number"
                          value={formData.hra}
                          onChange={(e) => setFormData({ ...formData, hra: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conveyance Allowance</label>
                        <input
                          type="number"
                          value={formData.conveyance_allowance}
                          onChange={(e) => setFormData({ ...formData, conveyance_allowance: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Allowance</label>
                        <input
                          type="number"
                          value={formData.special_allowance}
                          onChange={(e) => setFormData({ ...formData, special_allowance: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary</label>
                        <input
                          type="number"
                          value={formData.gross_salary}
                          onChange={(e) => setFormData({ ...formData, gross_salary: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">EPF</label>
                        <input
                          type="number"
                          value={formData.epf}
                          onChange={(e) => setFormData({ ...formData, epf: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ESI</label>
                        <input
                          type="number"
                          value={formData.esi}
                          onChange={(e) => setFormData({ ...formData, esi: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medical</label>
                        <input
                          type="number"
                          value={formData.medical}
                          onChange={(e) => setFormData({ ...formData, medical: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gratuity</label>
                        <input
                          type="number"
                          value={formData.gratuity}
                          onChange={(e) => setFormData({ ...formData, gratuity: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
                        <input
                          type="number"
                          value={formData.bonus}
                          onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bank Details Tab - Only for editing */}
                  {editingEmployee && activeTab === 'bank' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                        <input
                          type="text"
                          value={formData.bank_account_name}
                          onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={formData.bank_name}
                          onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={formData.bank_account_number}
                          onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={formData.ifsc}
                          onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                        <input
                          type="text"
                          value={formData.upi_id}
                          onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Documents Tab - Only for editing */}
                  {editingEmployee && activeTab === 'documents' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                          <input
                            type="text"
                            value={formData.pan}
                            onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            maxLength="10"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                          <input
                            type="text"
                            value={formData.aadhaar}
                            onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            maxLength="12"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                          <input
                            type="text"
                            value={formData.highest_qualification}
                            onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {editingEmployee && (
                        <div className="border-t pt-6">
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Document Images</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {editingEmployee.photo_path && (
                              <div className="border rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">Photo</p>
                                <img 
                                  src={`${import.meta.env.VITE_BASE_FILE_PATH}/${editingEmployee.photo_path}`}
                                  alt="Employee Photo"
                                  className="w-full h-32 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                                  }}
                                />
                              </div>
                            )}
                            {editingEmployee.pan_file_path && (
                              <div className="border rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">PAN Card</p>
                                <img 
                                  src={`${import.meta.env.VITE_BASE_FILE_PATH}/${editingEmployee.pan_file_path}`}
                                  alt="PAN Card"
                                  className="w-full h-32 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                                  }}
                                />
                              </div>
                            )}
                            {editingEmployee.aadhaar_file_path && (
                              <div className="border rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">Aadhaar Card</p>
                                <img 
                                  src={`${import.meta.env.VITE_BASE_FILE_PATH}/${editingEmployee.aadhaar_file_path}`}
                                  alt="Aadhaar Card"
                                  className="w-full h-32 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                                  }}
                                />
                              </div>
                            )}
                            {editingEmployee.education_file_path && (
                              <div className="border rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">Education Certificate</p>
                                <img 
                                  src={`${import.meta.env.VITE_BASE_FILE_PATH}/${editingEmployee.education_file_path}`}
                                  alt="Education Certificate"
                                  className="w-full h-32 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                                  }}
                                />
                              </div>
                            )}
                            {editingEmployee.cheque_path && (
                              <div className="border rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">Cancelled Cheque</p>
                                <img 
                                  src={`${import.meta.env.VITE_BASE_FILE_PATH}/${editingEmployee.cheque_path}`}
                                  alt="Cheque"
                                  className="w-full h-32 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                                  }}
                                />
                              </div>
                            )}
                            {editingEmployee.esign_path && (
                              <div className="border rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">E-Signature</p>
                                <img 
                                  src={`${import.meta.env.VITE_BASE_FILE_PATH}/${editingEmployee.esign_path}`}
                                  alt="Signature"
                                  className="w-full h-32 object-contain rounded bg-white"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Emergency Contact Tab - Only for editing */}
                  {editingEmployee && activeTab === 'emergency' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                        <input
                          type="text"
                          value={formData.emergency_name}
                          onChange={(e) => setFormData({ ...formData, emergency_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                        <input
                          type="text"
                          value={formData.emergency_relation}
                          onChange={(e) => setFormData({ ...formData, emergency_relation: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
                        <input
                          type="tel"
                          value={formData.emergency_phone}
                          onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      {editingEmployee ? 'Update Employee' : 'Add Employee'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Employees
