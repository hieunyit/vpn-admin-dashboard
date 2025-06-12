import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    // Add request timestamp
    config.metadata = { startTime: new Date() }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId()

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
        data: config.data,
        params: config.params
      })
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate response time
    const endTime = new Date()
    const duration = endTime - response.config.metadata.startTime

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ [${response.status}] ${response.config.url} (${duration}ms)`, {
        data: response.data
      })
    }

    // Log slow requests
    if (duration > 5000) {
      console.warn(`🐌 Slow request detected: ${response.config.url} took ${duration}ms`)
    }

    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ [${error.response?.status || 'Network'}] ${originalRequest?.url}`, {
        message: error.message,
        response: error.response?.data
      })
    }

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Token expired or invalid
          if (!originalRequest._retry && authStore.refreshToken) {
            originalRequest._retry = true

            try {
              // Try to refresh token
              await authStore.refreshAccessToken()
              
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${authStore.token}`
              
              return api(originalRequest)
            } catch (refreshError) {
              // Refresh failed, redirect to login
              console.error('Token refresh failed:', refreshError)
              await authStore.logout()
              
              if (router.currentRoute.value.name !== 'Login') {
                router.push({
                  name: 'Login',
                  query: { redirect: router.currentRoute.value.fullPath }
                })
              }
              
              return Promise.reject(new Error('Phiên đăng nhập đã hết hạn'))
            }
          } else {
            // No refresh token or already retried
            await authStore.logout()
            
            if (router.currentRoute.value.name !== 'Login') {
              router.push({
                name: 'Login',
                query: { redirect: router.currentRoute.value.fullPath }
              })
            }
            
            return Promise.reject(new Error('Không có quyền truy cập'))
          }

        case 403:
          // Forbidden - user doesn't have permission
          return Promise.reject(new Error('Bạn không có quyền thực hiện hành động này'))

        case 404:
          // Not found
          return Promise.reject(new Error('Không tìm thấy tài nguyên yêu cầu'))

        case 409:
          // Conflict
          return Promise.reject(new Error(data?.error?.message || 'Xung đột dữ liệu'))

        case 422:
          // Validation error
          return Promise.reject(new Error(data?.error?.message || 'Dữ liệu không hợp lệ'))

        case 429:
          // Rate limiting
          return Promise.reject(new Error('Quá nhiều yêu cầu, vui lòng thử lại sau'))

        case 500:
          // Server error
          return Promise.reject(new Error('Lỗi máy chủ nội bộ'))

        case 502:
        case 503:
        case 504:
          // Server unavailable
          return Promise.reject(new Error('Máy chủ không khả dụng'))

        default:
          return Promise.reject(new Error(data?.error?.message || `HTTP ${status} Error`))
      }
    } else if (error.request) {
      // Network error
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Yêu cầu bị timeout'))
      } else if (error.code === 'ERR_NETWORK') {
        return Promise.reject(new Error('Lỗi kết nối mạng'))
      } else {
        return Promise.reject(new Error('Không thể kết nối đến máy chủ'))
      }
    } else {
      // Other error
      return Promise.reject(new Error(error.message || 'Có lỗi xảy ra'))
    }
  }
)

// Utility functions
function generateRequestId() {
  return 'req_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// API helper methods
export const apiHelpers = {
  // Upload file with progress
  uploadFile: (url, file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        if (onProgress) onProgress(progress)
      }
    })
  },

  // Download file
  downloadFile: async (url, filename, params = {}) => {
    try {
      const response = await api.get(url, {
        params,
        responseType: 'blob'
      })

      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      return { success: true, message: 'File downloaded successfully' }
    } catch (error) {
      throw new Error('Download failed: ' + error.message)
    }
  },

  // Batch requests
  batch: (requests) => {
    return Promise.allSettled(requests.map(request => api(request)))
  },

  // Retry failed request
  retry: async (config, maxRetries = 3, delay = 1000) => {
    let retries = 0
    
    while (retries < maxRetries) {
      try {
        return await api(config)
      } catch (error) {
        retries++
        
        if (retries === maxRetries) {
          throw error
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * retries))
      }
    }
  },

  // Cancel request
  cancelToken: () => {
    return axios.CancelToken.source()
  }
}

// Request/Response logging for debugging
export const enableApiLogging = () => {
  api.interceptors.request.use(request => {
    console.group(`🚀 ${request.method?.toUpperCase()} ${request.url}`)
    console.log('Headers:', request.headers)
    console.log('Data:', request.data)
    console.log('Params:', request.params)
    console.groupEnd()
    return request
  })

  api.interceptors.response.use(
    response => {
      console.group(`✅ ${response.status} ${response.config.url}`)
      console.log('Headers:', response.headers)
      console.log('Data:', response.data)
      console.groupEnd()
      return response
    },
    error => {
      console.group(`❌ ${error.response?.status || 'Network'} ${error.config?.url}`)
      console.error('Error:', error.message)
      console.log('Response:', error.response?.data)
      console.groupEnd()
      return Promise.reject(error)
    }
  )
}

// Health check endpoint
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    throw new Error('Health check failed: ' + error.message)
  }
}

// API status check
export const checkApiStatus = async () => {
  try {
    const response = await api.get('/')
    return {
      status: 'healthy',
      version: response.data?.version || 'unknown',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

export default api