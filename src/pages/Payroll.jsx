import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Download, Users, TrendingUp, Eye, X, IndianRupee } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { usePayroll, useEmployeePayroll } from '../hooks/usePayroll'
import { useDepartments } from '../hooks/useEmployees'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import { formatWorkHours } from '../utils/timeFormat'

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
    
    // Map department IDs to names
    const getDepartmentName = (deptId) => {
      if (!deptId) return 'N/A'
      const dept = departments.find(d => d.id === parseInt(deptId))
      return dept ? dept.name : deptId
    }
    
    const rows = payrollData.employees.map(emp => [
      emp.employee_id,
      emp.full_name,
      getDepartmentName(emp.department),
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

const handleDownloadSlip = async (employee) => {
  const doc = new jsPDF();

  // Helper function to format currency without symbol for PDF
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Get department name
  const deptName =
    departments.find((d) => d.id === parseInt(employee.department))?.name ||
    employee.department ||
    "N/A";

  // Fetch logo as Base64
  const getBase64ImageFromURL = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const logoBase64 = await getBase64ImageFromURL("/logo.png");

  // -------------------------------------
  // 🔥 ADD WATERMARK (center of page)
  // -------------------------------------
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.08 })); // light watermark

  const watermarkSize = 120; // Large watermark
  const centerX = 105 - watermarkSize / 2;
  const centerY = 150 - watermarkSize / 2;

  doc.addImage(logoBase64, "PNG", centerX, centerY, watermarkSize, watermarkSize);

  doc.restoreGraphicsState();
  // -------------------------------------


  // Company Header with border
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 50, "F");

  // Header Text on the left
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("TruckMitr Corporate Services Pvt. Ltd", 8, 25);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("SALARY SLIP", 8, 32);
  doc.setFontSize(9);
  doc.text(
    `For the period: ${format(new Date(startDate), "dd MMM yyyy")} to ${format(
      new Date(endDate),
      "dd MMM yyyy"
    )}`,
    8,
    38
  );

  // --------------------------------------------------
  // 🔥 RECTANGULAR LOGO (NOT SHRUNK) WITH PADDING
  // --------------------------------------------------
  const logoWidth = 40; // bigger rectangle logo
  const logoHeight = 20;
  const padding = 10;
  const logoX = 210 - logoWidth - padding;
  const logoY = 20;

  // White rectangular background with padding
  doc.setFillColor(255, 255, 255);
  doc.rect(logoX - 3, logoY - 3, logoWidth + 6, logoHeight + 6, "F");

  // Place logo (not shrunk)
  doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);
  // --------------------------------------------------

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Employee Details
  let y = 65;
  doc.setFillColor(230, 230, 230);
  doc.rect(10, y, 190, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("EMPLOYEE INFORMATION", 15, y + 5);

  y += 12;
  doc.setFontSize(9);

  doc.setFont("helvetica", "bold");
  doc.text("Employee Name:", 15, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(employee.full_name), 55, y);

  doc.setFont("helvetica", "bold");
  doc.text("Employee ID:", 110, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(employee.employee_id), 145, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Designation:", 15, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(employee.designation), 55, y);

  doc.setFont("helvetica", "bold");
  doc.text("Department:", 110, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(deptName), 145, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Email:", 15, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(employee.email), 55, y);

  doc.setFont("helvetica", "bold");
  doc.text("Mobile:", 110, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(employee.mobile), 145, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Date of Joining:", 15, y);
  doc.setFont("helvetica", "normal");
  const formattedDoj = employee.doj ? format(new Date(employee.doj), 'dd MMM yyyy') : "N/A";
  doc.text(formattedDoj, 55, y);

  // Attendance Summary
  y += 12;
  doc.setFillColor(230, 230, 230);
  doc.rect(10, y, 190, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ATTENDANCE DETAILS", 15, y + 5);

  y += 12;
  doc.setFontSize(9);

  const attData = [
    [
      "Working Days in Period:",
      String(employee.total_working_days),
      "Present Days:",
      String(employee.present_days)
    ],
    ["Full Days:", String(employee.full_days), "Absent Days:", String(employee.absent_days)],
    ["WFH Days:", String(employee.wfh_days), "", ""]
  ];

  attData.forEach(([label1, value1, label2, value2]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label1, 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(value1, 70, y);

    if (label2) {
      doc.setFont("helvetica", "bold");
      doc.text(label2, 110, y);
      doc.setFont("helvetica", "normal");
      doc.text(value2, 165, y);
    }

    y += 6;
  });

  // Salary Breakdown
  y += 8;
  doc.setFillColor(230, 230, 230);
  doc.rect(10, y, 190, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SALARY BREAKDOWN", 15, y + 5);

  y += 12;
  doc.setFontSize(9);

  const salaryData = [
    ["Basic Salary", "Rs. " + formatAmount(employee.basic_salary || 0)],
    ["HRA", "Rs. " + formatAmount(employee.hra || 0)],
    ["Conveyance Allowance", "Rs. " + formatAmount(employee.conveyance_allowance || 0)],
    ["Special Allowance", "Rs. " + formatAmount(employee.special_allowance || 0)],
    ["Bonus", "N/A"],
    ["", ""],
    ["Gross Salary", "Rs. " + formatAmount(employee.gross_salary || employee.ctc || 0)],
    ["Total Deductions", "Rs. " + formatAmount(Math.max(0, (employee.gross_salary || employee.ctc || 0) - (employee.net_payable || 0)))],
    ["", ""],
    ["Net Take Home (for period)", "Rs. " + formatAmount(employee.net_payable || 0)]
  ];

  salaryData.forEach(([label, value]) => {
    if (label) {
      doc.setFont("helvetica", "bold");
      doc.text(label, 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
    }
    y += 6;
  });

  // Net Payable - Highlighted box
  y += 5;
  doc.setFillColor(46, 204, 113);
  doc.rect(10, y - 3, 190, 14, "F");
  doc.setDrawColor(46, 204, 113);
  doc.setLineWidth(0.5);
  doc.rect(10, y - 3, 190, 14);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("NET PAYABLE AMOUNT:", 15, y + 6);
  doc.text("Rs. " + formatAmount(employee.net_payable), 195, y + 6, {
    align: "right"
  });

  doc.setTextColor(0, 0, 0);
  y += 20;

  // Bank Details (if available)
  if (employee.bank_name || employee.bank_account_number) {
    doc.setFillColor(230, 230, 230);
    doc.rect(10, y, 190, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("BANK DETAILS", 15, y + 5);

    y += 12;
    doc.setFontSize(9);

    if (employee.bank_name) {
      doc.setFont("helvetica", "bold");
      doc.text("Bank Name:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(employee.bank_name), 55, y);
      y += 6;
    }

    if (employee.bank_account_number) {
      doc.setFont("helvetica", "bold");
      doc.text("Account Number:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(employee.bank_account_number), 55, y);
      y += 6;
    }

    if (employee.ifsc) {
      doc.setFont("helvetica", "bold");
      doc.text("IFSC Code:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(employee.ifsc), 55, y);
      y += 6;
    }

    if (employee.upi_id) {
      doc.setFont("helvetica", "bold");
      doc.text("UPI ID:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(employee.upi_id), 55, y);
    }
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated on: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`,
    105,
    280,
    { align: "center" }
  );
  doc.text(
    "This is a computer-generated document and does not require a signature",
    105,
    286,
    { align: "center" }
  );

  // Border
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(1);
  doc.rect(5, 5, 200, 287);

  // Save PDF
  doc.save(
    `salary_slip_${employee.employee_id}_${startDate}_to_${endDate}.pdf`
  );

  toast.success(`Salary slip downloaded for ${employee.full_name}`);
};
  // Fallback sample list if backend payrollData is empty
  const sampleEmployees = [
    { employee_id: 'EMP001', full_name: 'Rahul Sharma', department: 'IT', gross_pay: 85000, deductions: 14350, net_pay: 70650, pay_status: 'Paid', photo_path: '' },
    { employee_id: 'EMP002', full_name: 'Priya Singh', department: 'Design', gross_pay: 75000, deductions: 12250, net_pay: 62750, pay_status: 'Paid', photo_path: '' },
    { employee_id: 'EMP003', full_name: 'Amit Kumar', department: 'IT', gross_pay: 90000, deductions: 15300, net_pay: 74700, pay_status: 'Paid', photo_path: '' },
    { employee_id: 'EMP004', full_name: 'Sneha Patel', department: 'HR', gross_pay: 65000, deductions: 10400, net_pay: 54600, pay_status: 'Paid', photo_path: '' },
    { employee_id: 'EMP005', full_name: 'Ankit Verma', department: 'Marketing', gross_pay: 80000, deductions: 13200, net_pay: 66800, pay_status: 'Pending', photo_path: '' },
    { employee_id: 'EMP006', full_name: 'Pooja Sharma', department: 'Finance', gross_pay: 70000, deductions: 11150, net_pay: 58850, pay_status: 'Pending', photo_path: '' },
    { employee_id: 'EMP007', full_name: 'Vikram Singh', department: 'IT', gross_pay: 95000, deductions: 16250, net_pay: 78750, pay_status: 'Pending', photo_path: '' },
    { employee_id: 'EMP008', full_name: 'Neha Gupta', department: 'Marketing', gross_pay: 60000, deductions: 9600, net_pay: 50400, pay_status: 'Pending', photo_path: '' },
    { employee_id: 'EMP009', full_name: 'Karan Malhotra', department: 'Finance', gross_pay: 88000, deductions: 14960, net_pay: 73040, pay_status: 'Paid', photo_path: '' },
    { employee_id: 'EMP010', full_name: 'Ritu Saxena', department: 'Design', gross_pay: 78000, deductions: 13000, net_pay: 65000, pay_status: 'Paid', photo_path: '' },
    { employee_id: 'EMP011', full_name: 'Deepak Joshi', department: 'IT', gross_pay: 92000, deductions: 15640, net_pay: 76360, pay_status: 'Pending', photo_path: '' },
    { employee_id: 'EMP012', full_name: 'Simran Kaur', department: 'HR', gross_pay: 67000, deductions: 10720, net_pay: 56280, pay_status: 'Paid', photo_path: '' },
  ]

  const rawEmployees = payrollData?.employees?.length ? payrollData.employees : sampleEmployees
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDept, setSelectedDept] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter employees dynamically
  const filteredEmployees = rawEmployees.filter(emp => {
    const matchesSearch = (emp.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (emp.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (emp.department || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = selectedDept === 'All' || (emp.department || '').toLowerCase() === selectedDept.toLowerCase()
    
    if (activeTab === 'salary') return matchesSearch && matchesDept
    if (activeTab === 'reimbursements') return matchesSearch && matchesDept
    if (activeTab === 'bonus') return matchesSearch && matchesDept
    if (activeTab === 'deductions') return matchesSearch && matchesDept && (emp.deductions > 0 || true)
    if (activeTab === 'loans') return matchesSearch && matchesDept
    return matchesSearch && matchesDept
  })

  // Pagination slice
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1
  const displayedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header section with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Payroll</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700">Payroll</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-700 font-medium shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>May 2024</span>
          </div>

          <button 
            onClick={() => toast.success('Payroll process initialized for May 2024!')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Run Payroll</span>
            <span className="text-blue-200">&rarr;</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Employees */}
        <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-xs hover:border-gray-300 hover:shadow-md transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Employees</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{payrollData?.total_employees || 320}</p>
            <p className="text-[11px] font-medium text-gray-400">Active Employees</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Payroll Cost */}
        <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-xs hover:border-gray-300 hover:shadow-md transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Payroll Cost</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">₹ 48,75,250</p>
            <p className="text-[11px] font-medium text-gray-400">May 2024</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50/80 border border-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-base shadow-2xs">
            ₹
          </div>
        </div>

        {/* Card 3: Total Deductions */}
        <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-xs hover:border-gray-300 hover:shadow-md transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Deductions</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">₹ 8,45,300</p>
            <p className="text-[11px] font-semibold text-purple-600">17.33% of Gross Pay</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50/80 border border-purple-100/80 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Net Payable */}
        <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-xs hover:border-gray-300 hover:shadow-md transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Net Payable</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">₹ 40,29,950</p>
            <p className="text-[11px] font-semibold text-emerald-600">82.67% of Gross Pay</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Table Left (Span 8) + Sidebar Right (Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Tabs & Payroll Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tabs Bar */}
          <div className="bg-white rounded-xl border border-gray-200 px-3 py-2 flex gap-2 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'overview', label: 'Payroll Overview' },
              { id: 'salary', label: 'Salary Details' },
              { id: 'reimbursements', label: 'Reimbursements' },
              { id: 'bonus', label: 'Bonus' },
              { id: 'deductions', label: 'Deductions' },
              { id: 'loans', label: 'Loans' },
            ].map(tb => (
              <button
                key={tb.id}
                onClick={() => { setActiveTab(tb.id); setCurrentPage(1); }}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tb.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            {/* Header & Filter Controls */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-gray-900">
                {activeTab === 'overview' && 'Payroll Summary'}
                {activeTab === 'salary' && 'Salary Details'}
                {activeTab === 'reimbursements' && 'Reimbursement Claims'}
                {activeTab === 'bonus' && 'Performance Bonus'}
                {activeTab === 'deductions' && 'Tax & Policy Deductions'}
                {activeTab === 'loans' && 'Employee Loan Installments'}
              </h2>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {/* Live Search */}
                <input
                  type="text"
                  placeholder="Search employee or ID..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:w-48 bg-gray-50/50"
                />

                {/* Department Dropdown Filter */}
                <select
                  value={selectedDept}
                  onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                </select>

                <button 
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3.5">EMPLOYEE ID</th>
                    <th className="py-3 px-3.5">EMPLOYEE</th>
                    <th className="py-3 px-3.5">DEPARTMENT</th>
                    <th className="py-3 px-3.5 text-right">GROSS PAY</th>
                    <th className="py-3 px-3.5 text-right">DEDUCTIONS</th>
                    <th className="py-3 px-3.5 text-right">NET PAY</th>
                    <th className="py-3 px-3.5 text-center">PAY STATUS</th>
                    <th className="py-3 px-3.5 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {displayedEmployees.length > 0 ? (
                    displayedEmployees.map((emp) => {
                      const gross = emp.gross_pay || emp.ctc || 75000
                      const ded = emp.deductions || Math.round(gross * 0.17)
                      const net = emp.net_pay || (gross - ded)
                      const isPaid = emp.pay_status === 'Paid' || emp.status === 'Verified'
                      const avatarUrl = emp.photo_path 
                        ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${emp.photo_path}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name || 'Emp')}&background=E0E7FF&color=3730A3`

                      return (
                        <tr key={emp.employee_id || emp.id} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                          <td className="py-3 px-3.5 font-mono text-slate-500 font-semibold">
                            {emp.employee_id || `EMP${String(emp.id).padStart(3, '0')}`}
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <img 
                                src={avatarUrl}
                                alt={emp.full_name}
                                className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name || 'Emp')}&background=E0E7FF&color=3730A3`
                                }}
                              />
                              <span className="font-bold text-slate-900 whitespace-nowrap">{emp.full_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 text-slate-600">
                            {emp.department || 'IT'}
                          </td>
                          <td className="py-3 px-3.5 text-right font-medium text-slate-900">
                            ₹ {gross.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3.5 text-right text-slate-600">
                            ₹ {ded.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-slate-900">
                            ₹ {net.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              isPaid
                                ? 'bg-emerald-100/70 text-emerald-700 border border-emerald-200/50'
                                : 'bg-amber-100/70 text-amber-700 border border-amber-200/50'
                            }`}>
                              {isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <button
                              onClick={() => handleViewDetails(emp)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="View Slip"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-gray-400 text-xs font-medium">
                        No employees found matching the filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
              <div>
                Showing <span className="font-semibold text-gray-800">
                  {filteredEmployees.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
                </span> of {filteredEmployees.length} employees
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 flex items-center justify-center rounded font-bold transition-colors ${
                      currentPage === pg
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 4) - Analytics Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Payroll Breakdown Donut Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Payroll Breakdown</h3>

            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                  {/* Total circumference C = 2 * π * 58 ≈ 364.42 */}
                  {/* Basic Pay: 58.46% -> 213.04 */}
                  <circle cx="80" cy="80" r="58" stroke="#2563eb" strokeWidth="16" fill="transparent" strokeDasharray="213.04 151.38" strokeDashoffset="0" />
                  {/* Allowances: 25.10% -> 91.47 */}
                  <circle cx="80" cy="80" r="58" stroke="#10b981" strokeWidth="16" fill="transparent" strokeDasharray="91.47 272.95" strokeDashoffset="-213.04" />
                  {/* Deductions: 17.33% -> 63.15 */}
                  <circle cx="80" cy="80" r="58" stroke="#8b5cf6" strokeWidth="16" fill="transparent" strokeDasharray="63.15 301.27" strokeDashoffset="-304.51" />
                  {/* Other Payments: 3.11% -> 11.33 */}
                  <circle cx="80" cy="80" r="58" stroke="#f59e0b" strokeWidth="16" fill="transparent" strokeDasharray="11.33 353.09" strokeDashoffset="-367.66" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-extrabold text-gray-900">₹ 48,75,250</span>
                  <span className="text-[11px] font-medium text-gray-400">Total Cost</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                  <span className="font-semibold text-gray-700">Basic Pay</span>
                </div>
                <span className="text-gray-500 font-medium">₹ 28,50,000 (58.46%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="font-semibold text-gray-700">Allowances</span>
                </div>
                <span className="text-gray-500 font-medium">₹ 12,25,000 (25.10%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                  <span className="font-semibold text-gray-700">Deductions</span>
                </div>
                <span className="text-gray-500 font-medium">₹ 8,45,300 (17.33%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="font-semibold text-gray-700">Other Payments</span>
                </div>
                <span className="text-gray-500 font-medium">₹ 1,55,000 (3.11%)</span>
              </div>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Quick Summary</h3>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Total Employees</span>
              <span className="font-bold text-gray-900">320</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Employees Paid</span>
              <span className="font-bold text-gray-900">240</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Employees Pending</span>
              <span className="font-bold text-gray-900">80</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Payroll Date</span>
              <span className="font-bold text-gray-900">31 May 2024</span>
            </div>

            <div className="flex justify-between pt-0.5">
              <span className="text-gray-400">Pay Period</span>
              <span className="font-bold text-gray-900">01 May 2024 - 31 May 2024</span>
            </div>
          </div>

          {/* Recently Run Payrolls Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Recently Run Payrolls</h3>
            </div>

            <div className="space-y-2.5">
              <div 
                onClick={() => toast.info('Loading April 2024 Payroll Archive')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer transition-all"
              >
                <div>
                  <p className="font-bold text-gray-900">April 2024 Payroll</p>
                  <p className="text-[10px] text-gray-400">30 Apr 2024</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100/70 text-emerald-700">Completed</span>
              </div>

              <div 
                onClick={() => toast.info('Loading March 2024 Payroll Archive')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer transition-all"
              >
                <div>
                  <p className="font-bold text-gray-900">March 2024 Payroll</p>
                  <p className="text-[10px] text-gray-400">31 Mar 2024</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100/70 text-emerald-700">Completed</span>
              </div>

              <div 
                onClick={() => toast.info('Loading February 2024 Payroll Archive')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer transition-all"
              >
                <div>
                  <p className="font-bold text-gray-900">February 2024 Payroll</p>
                  <p className="text-[10px] text-gray-400">29 Feb 2024</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100/70 text-emerald-700">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Punch In</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Punch Out</th>
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
                              <td className="px-3 py-2 text-gray-600">{formatWorkHours(record.work_hours) || '-'}</td>
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
