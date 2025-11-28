import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export const useWfhRequests = (params = {}) => {
  return useQuery({
    queryKey: ['wfh-requests', params],
    queryFn: async () => {
      const queryString = new URLSearchParams(params).toString()
      const response = await api.get(`/wfh-requests?${queryString}`)
      return response.data.data || []
    },
  })
}

export const useWfhRequest = (id) => {
  return useQuery({
    queryKey: ['wfh-request', id],
    queryFn: async () => {
      const response = await api.get(`/wfh-requests/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export const useCreateWfhRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/wfh-requests', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wfh-requests'] })
    },
  })
}

export const useUpdateWfhRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/wfh-requests/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wfh-requests'] })
    },
  })
}

export const useApproveWfhRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, remarks }) => {
      const response = await api.post(`/wfh-requests/${id}/approve`, { remarks })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wfh-requests'] })
    },
  })
}

export const useRejectWfhRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, remarks }) => {
      const response = await api.post(`/wfh-requests/${id}/reject`, { remarks })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wfh-requests'] })
    },
  })
}

export const useDeleteWfhRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/wfh-requests/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wfh-requests'] })
    },
  })
}
