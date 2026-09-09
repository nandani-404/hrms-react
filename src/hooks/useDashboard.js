import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

// Get dashboard statistics
export const useDashboardStats = (params = {}) => {
  return useQuery({
    queryKey: ['dashboard-stats', params],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats', { params })
      return data.data || data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get attendance graph data
export const useAttendanceGraph = (month, params = {}) => {
  return useQuery({
    queryKey: ['attendance-graph', month, params],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/attendance-graph', {
        params: { month, ...params }
      })
      return data.data || data
    },
    enabled: !!month,
    staleTime: 1000 * 60 * 5,
  })
}

// Get recent WFH requests
export const useRecentWfh = (limit = 5, params = {}) => {
  return useQuery({
    queryKey: ['recent-wfh', limit, params],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/recent-wfh', {
        params: { limit, ...params }
      })
      return data.data || data
    },
    staleTime: 1000 * 60 * 2,
  })
}

// Get recent leave requests
export const useRecentLeaves = (limit = 5, params = {}) => {
  return useQuery({
    queryKey: ['recent-leaves', limit, params],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/recent-leaves', {
        params: { limit, ...params }
      })
      return data.data || data
    },
    staleTime: 1000 * 60 * 2,
  })
}

// Get upcoming birthdays
export const useUpcomingBirthdays = (days = 30, limit = 5) => {
  return useQuery({
    queryKey: ['upcoming-birthdays', days, limit],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/upcoming-birthdays', {
        params: { days, limit }
      })
      return data.data || data
    },
    staleTime: 1000 * 60 * 5,
  })
}

// Get user's tasks for dashboard mini tracker
export const useDashboardTasks = () => {
  return useQuery({
    queryKey: ['dashboard-tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks')
      return Array.isArray(data) ? data : data.data || []
    },
    staleTime: 1000 * 60 * 2,
  })
}

// Get department-wise employee breakdown
export const useDepartmentBreakdown = () => {
  return useQuery({
    queryKey: ['department-breakdown'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/dashboard/department-breakdown')
        return data.data || data
      } catch {
        // Fallback: fetch employees and compute breakdown client-side
        return null
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}
