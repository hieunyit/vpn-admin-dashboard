import api from './api'

class AuthService {
  constructor() {
    this.baseURL = '/auth'
  }

  // Login with username and password
  async login(credentials) {
    try {
      const response = await api.post(`${this.baseURL}/login`, {
        username: credentials.username,
        password: credentials.password,
        remember_me: credentials.remember_me || false
      })

      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Logout
  async logout() {
    try {
      const response = await api.post(`${this.baseURL}/logout`)
      return this.handleResponse(response)
    } catch (error) {
      // Don't throw error on logout failure
      console.warn('Logout API call failed:', error.message)
      return { success: true, message: 'Logged out locally' }
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      const response = await api.post(`${this.baseURL}/refresh`, {
        refresh_token: refreshToken
      })

      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Validate current token
  async validateToken() {
    try {
      const response = await api.get(`${this.baseURL}/validate`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post(`${this.baseURL}/forgot-password`, {
        email
      })

      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Reset password with token
  async resetPassword(token, password) {
    try {
      const response = await api.post(`${this.baseURL}/reset-password`, {
        token,
        password,
        password_confirmation: password
      })

      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Change password (authenticated user)
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post(`${this.baseURL}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword
      })

      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put(`${this.baseURL}/profile`, profileData)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get(`${this.baseURL}/profile`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Two-factor authentication
  async enableTwoFactor() {
    try {
      const response = await api.post(`${this.baseURL}/2fa/enable`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async disableTwoFactor(password) {
    try {
      const response = await api.post(`${this.baseURL}/2fa/disable`, {
        password
      })

      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async verifyTwoFactor(code) {
    try {
      const response = await api.post(`${this.baseURL}/2fa/verify`, {
        code
      })

      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async generateBackupCodes() {
    try {
      const response = await api.post(`${this.baseURL}/2fa/backup-codes`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Session management
  async getSessions() {
    try {
      const response = await api.get(`${this.baseURL}/sessions`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async terminateSession(sessionId) {
    try {
      const response = await api.delete(`${this.baseURL}/sessions/${sessionId}`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async terminateAllSessions() {
    try {
      const response = await api.delete(`${this.baseURL}/sessions`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // API Keys management
  async getApiKeys() {
    try {
      const response = await api.get(`${this.baseURL}/api-keys`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createApiKey(name, permissions = []) {
    try {
      const response = await api.post(`${this.baseURL}/api-keys`, {
        name,
        permissions
      })

      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async revokeApiKey(keyId) {
    try {
      const response = await api.delete(`${this.baseURL}/api-keys/${keyId}`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Account security
  async getSecurityLog() {
    try {
      const response = await api.get(`${this.baseURL}/security-log`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getLoginHistory(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/login-history`, { params })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Password strength validation
  validatePasswordStrength(password) {
    const rules = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommonWords: !this.isCommonPassword(password)
    }

    const score = Object.values(rules).filter(Boolean).length
    const strength = this.getPasswordStrength(score)

    return {
      score,
      strength,
      rules,
      isValid: score >= 4
    }
  }

  isCommonPassword(password) {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ]
    
    return commonPasswords.includes(password.toLowerCase())
  }

  getPasswordStrength(score) {
    if (score < 2) return 'very-weak'
    if (score < 3) return 'weak'
    if (score < 4) return 'medium'
    if (score < 5) return 'strong'
    return 'very-strong'
  }

  // Token utilities
  parseJwtToken(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Failed to parse JWT token:', error)
      return null
    }
  }

  isTokenExpired(token) {
    const payload = this.parseJwtToken(token)
    if (!payload || !payload.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  }

  getTokenExpirationTime(token) {
    const payload = this.parseJwtToken(token)
    if (!payload || !payload.exp) return null

    return new Date(payload.exp * 1000)
  }

  // Response and error handling
  handleResponse(response) {
    if (response.data) {
      // Handle the enhanced response format from the GoVPN API
      if (response.data.success) {
        return response.data.success
      } else if (response.data.error) {
        throw new Error(response.data.error.message || 'API Error')
      } else {
        // Fallback for simple responses
        return {
          success: true,
          data: response.data,
          message: 'Operation completed successfully'
        }
      }
    }
    
    throw new Error('Invalid response format')
  }

  handleError(error) {
    if (error.response) {
      const { data, status } = error.response
      
      if (data && data.error) {
        return new Error(data.error.message || `HTTP ${status} Error`)
      }
      
      switch (status) {
        case 400:
          return new Error('Dữ liệu đăng nhập không hợp lệ')
        case 401:
          return new Error('Tên đăng nhập hoặc mật khẩu không đúng')
        case 403:
          return new Error('Tài khoản bị khóa hoặc không có quyền truy cập')
        case 404:
          return new Error('Không tìm thấy endpoint')
        case 422:
          return new Error('Dữ liệu không hợp lệ')
        case 429:
          return new Error('Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau')
        case 500:
          return new Error('Lỗi máy chủ nội bộ')
        default:
          return new Error(`HTTP ${status} Error`)
      }
    } else if (error.request) {
      return new Error('Lỗi kết nối mạng')
    } else {
      return new Error(error.message || 'Có lỗi xảy ra')
    }
  }
}

export default new AuthService()