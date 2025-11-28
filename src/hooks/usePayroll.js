import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export const usePayroll = (startDate, endDate, filters = {}) => {
  return useQuery({
    queryKey: ['payroll', startDate, endDate, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        ...filters,
      })
      const response = await api.get(`/payroll?${params}`)
      return response.data.data
    },
    enabled: !!startDate && !!endDate,
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
