import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { queryClient } from './lib/queryClient'
import Layout from './components/Layout'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import AddEmployee from './pages/AddEmployee'
import Attendance from './pages/Attendance'
import TodayAttendance from './pages/TodayAttendance'
import EmployeeMonthlyAttendance from './pages/EmployeeMonthlyAttendance'
import MyAttendance from './pages/MyAttendance'
import Tasks from './pages/Tasks'
import WfhRequests from './pages/WfhRequests'
import LeaveRequests from './pages/LeaveRequests'
import Helpdesk from './pages/Helpdesk'
import Payroll from './pages/Payroll'
import SalaryAdvance from './pages/SalaryAdvance'
import EmployeeSalaryAdvance from './pages/EmployeeSalaryAdvance'
import EmployeeLoan from './pages/EmployeeLoan'
import HREmployeeLoan from './pages/HREmployeeLoan'
import Reports from './pages/Reports'
import Expenses from './pages/Expenses'
import ExpenseCategory from './pages/ExpenseCategory'
import ExpenseSubCategory from './pages/ExpenseSubCategory'
import ExpenseApprovals from './pages/ExpenseApprovals'
import OfficeCalendar from './pages/OfficeCalendar'
import ShortLeave from './pages/ShortLeave'
import AssetsManagement from './pages/AssetsManagement'
import EmployeeAssets from './pages/EmployeeAssets'
import AssetsCategory from './pages/AssetsCategory'
import AssetsSubCategory from './pages/AssetsSubCategory'
import HRRewards from './pages/HRRewards'
import EmployeeRewards from './pages/EmployeeRewards'
import HRPolicies from './pages/HRPolicies'
import EmployeePolicies from './pages/EmployeePolicies'
import Profile from './pages/Profile'
import OfferLetterGenerator from './pages/OfferLetterGenerator'
import ProtectedRoute from './components/ProtectedRoute'

// Component to handle role-based redirect
const RoleBasedRedirect = () => {
  const { user } = useAuth()
  const isHROrAdmin = user?.role === 'hr' || user?.role === 'admin'
  return <Navigate to={isHROrAdmin ? '/dashboard' : '/my-attendance'} replace />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router basename={import.meta.env.VITE_BASE_PATH}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<RoleBasedRedirect />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="employees/add" element={<AddEmployee />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="today-attendance" element={<TodayAttendance />} />
              <Route path="employee-monthly-attendance/:employeeId/:month" element={<EmployeeMonthlyAttendance />} />
              <Route path="my-attendance" element={<MyAttendance />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="wfh-requests" element={<WfhRequests />} />
              <Route path="leave-requests" element={<LeaveRequests />} />
              <Route path="helpdesk" element={<Helpdesk />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="salary-advance" element={<SalaryAdvance />} />
              <Route path="my-salary-advance" element={<EmployeeSalaryAdvance />} />
              <Route path="employee-loan" element={<HREmployeeLoan />} />
              <Route path="my-loan" element={<EmployeeLoan />} />
              <Route path="offer-letter" element={<OfferLetterGenerator />} />
              <Route path="rewards-recognition" element={<HRRewards />} />
              <Route path="my-rewards" element={<EmployeeRewards />} />
              <Route path="policies" element={<HRPolicies />} />
              <Route path="my-policies" element={<EmployeePolicies />} />
              <Route path="reports" element={<Reports />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="expense-category" element={<ExpenseCategory />} />
              <Route path="expense-sub-category" element={<ExpenseSubCategory />} />
              <Route path="expense-approvals" element={<ExpenseApprovals />} />
              <Route path="office-calendar" element={<OfficeCalendar />} />
              <Route path="short-leave" element={<ShortLeave />} />
              <Route path="assets-management" element={<AssetsManagement />} />
              <Route path="my-assets" element={<EmployeeAssets />} />
              <Route path="assets-category" element={<AssetsCategory />} />
              <Route path="assets-sub-category" element={<AssetsSubCategory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="my-profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#2D2A24',
              border: '1px solid #E6E3DB',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '14px',
              boxShadow: '0 12px 24px -6px rgba(27, 25, 21, 0.10), 0 4px 8px -2px rgba(27, 25, 21, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#226845',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#A83128',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
