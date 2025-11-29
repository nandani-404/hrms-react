import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export const usePayroll = (params = {}) => {
  const { start_date, end_date, employee_id, department } = params
  
  return useQuery({
    queryKey: ['payroll', start_date, end_date, employee_id, department],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (start_date) queryParams.append('start_date', start_date)
      if (end_date) queryParams.append('end_date', end_date)
      if (employee_id) queryParams.append('employee_id', employee_id)
      if (department) queryParams.append('department', department)
      
      const response = await api.get(`/payroll?${queryParams.toString()}`)
      return response.data.data
    },
    enabled: !!start_date && !!end_date,
  })
}

export const usePayrollSummary = (startDate, endDate) => {
  return useQuery({
    queryKey: ['payroll-summary', startDate, endDate],
    queryFn: async () => {
      const response = await api.get(`/payroll/summary?start_date=${startDate}&end_date=${endDate}`)
      return response.data.data
    },
    enabled: !!startDate && !!endDate,
  })
}

export const useEmployeePayroll = (employeeId, startDate, endDate) => {
  return useQuery({
    queryKey: ['employee-payroll', employeeId, startDate, endDate],
    queryFn: async () => {
      const response = await api.get(`/payroll/employee/${employeeId}?start_date=${startDate}&end_date=${endDate}`)
      return response.data.data
    },
    enabled: !!employeeId && !!startDate && !!endDate,
  })
}
