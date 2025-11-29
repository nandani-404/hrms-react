import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { queryClient } from './lib/queryClient'
import Layout from './components/Layout'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import MyAttendance from './pages/MyAttendance'
import WfhRequests from './pages/WfhRequests'
import LeaveRequests from './pages/LeaveRequests'
import Helpdesk from './pages/Helpdesk'
import Payroll from './pages/Payroll'
import Reports from './pages/Reports'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="my-attendance" element={<MyAttendance />} />
              <Route path="wfh-requests" element={<WfhRequests />} />
              <Route path="leave-requests" element={<LeaveRequests />} />
              <Route path="helpdesk" element={<Helpdesk />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
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
