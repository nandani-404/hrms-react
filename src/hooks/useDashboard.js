import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Get dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats')
      console.log(data);
      return data.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get attendance graph data
export const useAttendanceGraph = (month) => {
  return useQuery({
    queryKey: ['attendance-graph', month],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/attendance-graph', {
        params: { month }
      })
      return data.data
    },
    enabled: !!month,
    staleTime: 1000 * 60 * 5,
  })
}

// Get recent WFH requests
export const useRecentWfh = (limit = 5) => {
  return useQuery({
    queryKey: ['recent-wfh', limit],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/recent-wfh', {
        params: { limit }
      })
      return data.data
    },
    staleTime: 1000 * 60 * 2,
  })
}

// Get recent leave requests
export const useRecentLeaves = (limit = 5) => {
  return useQuery({
    queryKey: ['recent-leaves', limit],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/recent-leaves', {
        params: { limit }
      })
      return data.data
    },
    staleTime: 1000 * 60 * 2,
  })
}
