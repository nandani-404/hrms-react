import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export const useAttendance = (params = {}) => {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: async () => {
      const queryString = new URLSearchParams(params).toString()
      const response = await api.get(`/attendance?${queryString}`)
      return response.data.data || []
    },
    enabled: !!params.date,
  })
}

export const useAttendanceReport = (startDate, endDate) => {
  return useQuery({
    queryKey: ['attendance-report', startDate, endDate],
    queryFn: async () => {
      const response = await api.get(`/attendance/report?start_date=${startDate}&end_date=${endDate}`)
      return response.data.data
    },
    enabled: !!startDate && !!endDate,
  })
}

export const useEmployeeAttendanceSummary = (employeeId, startDate, endDate) => {
  return useQuery({
    queryKey: ['employee-attendance-summary', employeeId, startDate, endDate],
    queryFn: async () => {
      const response = await api.get(`/attendance/employee/${employeeId}/summary?start_date=${startDate}&end_date=${endDate}`)
      return response.data.data
    },
    enabled: !!employeeId && !!startDate && !!endDate,
  })
}

export const useEmployeeTodayStatus = (employeeId) => {
  return useQuery({
    queryKey: ['employee-today-status', employeeId],
    queryFn: async () => {
      const response = await api.get(`/attendance/employee/${employeeId}/today`)
      return response.data.data
    },
    enabled: !!employeeId,
  })
}

export const useDepartmentSummary = (startDate, endDate) => {
  return useQuery({
    queryKey: ['department-summary', startDate, endDate],
    queryFn: async () => {
      const response = await api.get(`/attendance/department-summary?start_date=${startDate}&end_date=${endDate}`)
      return response.data.data
    },
    enabled: !!startDate && !!endDate,
  })
}

export const useCheckIn = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/attendance/check-in', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      queryClient.invalidateQueries({ queryKey: ['employee-today-status'] })
    },
  })
}

export const useCheckOut = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/attendance/check-out', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      queryClient.invalidateQueries({ queryKey: ['employee-today-status'] })
    },
  })
}

export const useCreateAttendance = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (attendanceData) => {
      const response = await api.post('/attendance', attendanceData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/attendance/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/attendance/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

export const useBulkCreateAttendance = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (records) => {
      const response = await api.post('/attendance/bulk', { records })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}
