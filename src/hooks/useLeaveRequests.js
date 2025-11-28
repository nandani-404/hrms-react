import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export const useLeaveRequests = (params = {}) => {
  return useQuery({
    queryKey: ['leave-requests', params],
    queryFn: async () => {
      const queryString = new URLSearchParams(params).toString()
      const response = await api.get(`/leave-requests?${queryString}`)
      return response.data.data || []
    },
  })
}

export const useLeaveRequest = (id) => {
  return useQuery({
    queryKey: ['leave-request', id],
    queryFn: async () => {
      const response = await api.get(`/leave-requests/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export const useLeaveBalance = () => {
  return useQuery({
    queryKey: ['leave-balance'],
    queryFn: async () => {
      const response = await api.get('/leave-balance')
      return response.data.data
    },
  })
}

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/leave-requests', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] })
    },
  })
}

export const useUpdateLeaveRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/leave-requests/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
    },
  })
}

export const useApproveLeaveRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, remarks }) => {
      const response = await api.post(`/leave-requests/${id}/approve`, { remarks })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
    },
  })
}

export const useRejectLeaveRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, remarks }) => {
      const response = await api.post(`/leave-requests/${id}/reject`, { remarks })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
    },
  })
}

export const useCancelLeaveRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/leave-requests/${id}/cancel`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] })
    },
  })
}

export const useDeleteLeaveRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/leave-requests/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
    },
  })
}
