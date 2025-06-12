import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const refreshToken = ref(null)
  const loading = ref(false)
  const loginAttempts = ref(0)
  const lastLoginAttempt = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'user')
  const isAdmin = computed(() => userRole.value === 'admin')
  const userPermissions = computed(() => user.value?.permissions || [])

  // Actions
  const login = async (credentials) => {
    loading.value = true
    
    try {
      // Check rate limiting
      if (isRateLimited()) {
        throw new Error('Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.')
      }

      const response = await authService.login(credentials)
      
      if (response.success) {
        // Store tokens and user info
        token.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        user.value = response.data.user
        
        // Store in localStorage
        localStorage.setItem('access_token', token.value)
        localStorage.setItem('refresh_token', refreshToken.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        
        // Reset login attempts
        loginAttempts.value = 0
        lastLoginAttempt.value = null
        
        return { success: true }
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      // Track failed attempts
      loginAttempts.value++
      lastLoginAttempt.value = Date.now()
      
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      if (token.value) {
        await authService.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all auth data
      clearAuthData()
      loading.value = false
      
      // Redirect to login
      router.push({ name: 'Login' })
    }
  }

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken.value)
      
      if (response.success) {
        token.value = response.data.access_token
        localStorage.setItem('access_token', token.value)
        
        // Update user info if provided
        if (response.data.user) {
          user.value = response.data.user
          localStorage.setItem('user', JSON.stringify(user.value))
        }
        
        return token.value
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
      throw error
    }
  }

  const forgotPassword = async (email) => {
    loading.value = true
    
    try {
      const response = await authService.forgotPassword(email)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (token, password) => {
    loading.value = true
    
    try {
      const response = await authService.resetPassword(token, password)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    loading.value = true
    
    try {
      const response = await authService.changePassword(currentPassword, newPassword)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    
    try {
      const response = await authService.updateProfile(profileData)
      
      if (response.success) {
        user.value = { ...user.value, ...response.data }
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const validateToken = async () => {
    try {
      if (!token.value) return false
      
      const response = await authService.validateToken()
      return response.success
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    }
  }

  const hasPermission = (permission) => {
    if (isAdmin.value) return true
    return userPermissions.value.includes(permission)
  }

  const hasPermissions = (permissions) => {
    if (isAdmin.value) return true
    return permissions.every(permission => userPermissions.value.includes(permission))
  }

  const hasAnyPermission = (permissions) => {
    if (isAdmin.value) return true
    return permissions.some(permission => userPermissions.value.includes(permission))
  }

  const initializeAuth = () => {
    // Restore auth state from localStorage
    const storedToken = localStorage.getItem('access_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      refreshToken.value = storedRefreshToken
      user.value = JSON.parse(storedUser)
    }
  }

  const clearAuthData = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  const isRateLimited = () => {
    const maxAttempts = 5
    const timeWindow = 15 * 60 * 1000 // 15 minutes
    
    if (loginAttempts.value >= maxAttempts && lastLoginAttempt.value) {
      const timeSinceLastAttempt = Date.now() - lastLoginAttempt.value
      return timeSinceLastAttempt < timeWindow
    }
    
    return false
  }

  const getRemainingLockoutTime = () => {
    if (!isRateLimited()) return 0
    
    const timeWindow = 15 * 60 * 1000 // 15 minutes
    const timeSinceLastAttempt = Date.now() - lastLoginAttempt.value
    return Math.ceil((timeWindow - timeSinceLastAttempt) / 1000)
  }

  return {
    // State
    user,
    token,
    loading,
    loginAttempts,
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    userPermissions,
    
    // Actions
    login,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    validateToken,
    hasPermission,
    hasPermissions,
    hasAnyPermission,
    initializeAuth,
    clearAuthData,
    isRateLimited,
    getRemainingLockoutTime
  }
})