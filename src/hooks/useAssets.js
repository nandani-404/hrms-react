import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

// Asset Categories Hooks
export const useAssetCategories = () => {
  return useQuery({
    queryKey: ['assetCategories'],
    queryFn: async () => {
      const response = await api.get('/asset-categories')
      return response.data
    }
  })
}

export const useCreateAssetCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/asset-categories', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetCategories'] })
    }
  })
}

export const useUpdateAssetCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ categoryId, data }) => {
      const response = await api.put(`/asset-categories/${categoryId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetCategories'] })
    }
  })
}

export const useDeleteAssetCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/asset-categories/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetCategories'] })
    }
  })
}

// Asset Sub Categories Hooks
export const useAssetSubCategories = (categoryId) => {
  return useQuery({
    queryKey: ['assetSubCategories', categoryId],
    queryFn: async () => {
      const response = await api.get(`/asset-sub-categories/${categoryId}`)
      return response.data
    },
    enabled: !!categoryId
  })
}

export const useCreateAssetSubCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/asset-sub-categories', data)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['assetSubCategories', variables.category_id]
      })
    }
  })
}

export const useUpdateAssetSubCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ subCategoryId, data }) => {
      const response = await api.put(`/asset-sub-categories/${subCategoryId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetSubCategories'] })
    }
  })
}

export const useDeleteAssetSubCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/asset-sub-categories/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetSubCategories'] })
    }
  })
}

// Assets Hooks
export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets')
      return response.data
    }
  })
}

export const useCreateAsset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/assets', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    }
  })
}

export const useUpdateAsset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ assetId, data }) => {
      const response = await api.put(`/assets/${assetId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    }
  })
}

export const useAssignAsset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/assets/assign', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    }
  })
}

export const useReturnAsset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/assets/return', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    }
  })
}
