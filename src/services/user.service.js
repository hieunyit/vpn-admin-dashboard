import api from './api'

/**
 * User Service - Complete API service for user management
 * Handles all user-related API calls with comprehensive error handling
 */
class UserService {
  constructor() {
    this.baseURL = '/api/users'
  }

  // =================== BASIC CRUD OPERATIONS ===================

  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getUsers(params = {}) {
    try {
      const response = await api.get(this.baseURL, { params })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get single user by username
   * @param {string} username - Username to fetch
   * @returns {Promise} API response
   */
  async getUser(username) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise} API response
   */
  async createUser(userData) {
    try {
      const formattedData = this.formatUserData(userData)
      const response = await api.post(this.baseURL, formattedData)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update existing user
   * @param {string} username - Username to update
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response
   */
  async updateUser(username, userData) {
    try {
      const formattedData = this.formatUserData(userData)
      const response = await api.put(`${this.baseURL}/${encodeURIComponent(username)}`, formattedData)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete user
   * @param {string} username - Username to delete
   * @returns {Promise} API response
   */
  async deleteUser(username) {
    try {
      const response = await api.delete(`${this.baseURL}/${encodeURIComponent(username)}`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== BULK OPERATIONS ===================

  /**
   * Bulk update multiple users
   * @param {Array} usernames - Array of usernames
   * @param {Object} updateData - Data to update
   * @returns {Promise} API response
   */
  async bulkUpdateUsers(usernames, updateData) {
    try {
      const response = await api.put(`${this.baseURL}/bulk`, {
        usernames,
        data: this.formatUserData(updateData)
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Bulk delete multiple users
   * @param {Array} usernames - Array of usernames to delete
   * @returns {Promise} API response
   */
  async bulkDeleteUsers(usernames) {
    try {
      const response = await api.delete(`${this.baseURL}/bulk`, {
        data: { usernames }
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Bulk enable users
   * @param {Array} usernames - Array of usernames
   * @returns {Promise} API response
   */
  async bulkEnableUsers(usernames) {
    return this.bulkUpdateUsers(usernames, { isActive: true })
  }

  /**
   * Bulk disable users
   * @param {Array} usernames - Array of usernames
   * @returns {Promise} API response
   */
  async bulkDisableUsers(usernames) {
    return this.bulkUpdateUsers(usernames, { isActive: false })
  }

  /**
   * Bulk extend user expiration
   * @param {Array} usernames - Array of usernames
   * @param {number} days - Number of days to extend
   * @returns {Promise} API response
   */
  async bulkExtendUsers(usernames, days) {
    try {
      const response = await api.post(`${this.baseURL}/bulk/extend`, {
        usernames,
        days
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Bulk assign users to group
   * @param {Array} usernames - Array of usernames
   * @param {string} groupName - Group name to assign
   * @returns {Promise} API response
   */
  async bulkAssignGroup(usernames, groupName) {
    return this.bulkUpdateUsers(usernames, { groupName })
  }

  // =================== PASSWORD MANAGEMENT ===================

  /**
   * Change user password
   * @param {string} username - Username
   * @param {Object} passwordData - Password change data
   * @returns {Promise} API response
   */
  async changePassword(username, passwordData) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Reset user password
   * @param {string} username - Username
   * @returns {Promise} API response with new password
   */
  async resetPassword(username) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/reset-password`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Generate temporary password for user
   * @param {string} username - Username
   * @param {number} expiryHours - Hours until password expires
   * @returns {Promise} API response
   */
  async generateTemporaryPassword(username, expiryHours = 24) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/temp-password`, {
        expiryHours
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Force user to change password on next login
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async forcePasswordChange(username) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/force-password-change`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== USER ACTIONS ===================

  /**
   * Enable user account
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async enableUser(username) {
    return this.updateUser(username, { isActive: true })
  }

  /**
   * Disable user account
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async disableUser(username) {
    return this.updateUser(username, { isActive: false })
  }

  /**
   * Lock user account
   * @param {string} username - Username
   * @param {string} reason - Lock reason
   * @returns {Promise} API response
   */
  async lockUser(username, reason = 'Administrative action') {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/lock`, {
        reason,
        lockedAt: new Date().toISOString()
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Unlock user account
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async unlockUser(username) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/unlock`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Extend user expiration date
   * @param {string} username - Username
   * @param {number} days - Number of days to extend
   * @returns {Promise} API response
   */
  async extendExpiration(username, days) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/extend`, { 
        days 
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Set user expiration date
   * @param {string} username - Username
   * @param {string} expirationDate - ISO date string
   * @returns {Promise} API response
   */
  async setExpiration(username, expirationDate) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/set-expiration`, {
        expirationDate: new Date(expirationDate).toISOString()
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Remove user expiration (set to never expire)
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async removeExpiration(username) {
    try {
      const response = await api.delete(`${this.baseURL}/${encodeURIComponent(username)}/expiration`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== CONNECTION MANAGEMENT ===================

  /**
   * Get user's active connections
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async getUserConnections(username) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/connections`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Disconnect user from VPN
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async disconnectUser(username) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/disconnect`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user's active sessions
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async getUserSessions(username) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/sessions`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Terminate specific user session
   * @param {string} username - Username
   * @param {string} sessionId - Session ID
   * @returns {Promise} API response
   */
  async terminateUserSession(username, sessionId) {
    try {
      const response = await api.delete(`${this.baseURL}/${encodeURIComponent(username)}/sessions/${sessionId}`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Terminate all user sessions
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async terminateAllUserSessions(username) {
    try {
      const response = await api.delete(`${this.baseURL}/${encodeURIComponent(username)}/sessions`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user connection history
   * @param {string} username - Username
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getUserConnectionHistory(username, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/connection-history`, { 
        params 
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== SEARCH AND FILTERING ===================

  /**
   * Search users with advanced filters
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} API response
   */
  async searchUsers(searchParams) {
    try {
      const response = await api.post(`${this.baseURL}/search`, searchParams)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Advanced search with complex criteria
   * @param {Object} searchCriteria - Advanced search criteria
   * @returns {Promise} API response
   */
  async advancedSearch(searchCriteria) {
    try {
      const response = await api.post(`${this.baseURL}/advanced-search`, searchCriteria)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get users by group
   * @param {string} groupName - Group name
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getUsersByGroup(groupName, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/by-group/${encodeURIComponent(groupName)}`, { 
        params 
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get users by status
   * @param {string} status - User status (active, inactive, expired, locked)
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getUsersByStatus(status, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/by-status/${status}`, { params })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get expired users
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getExpiredUsers(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/expired`, { params })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get users expiring soon
   * @param {number} days - Days until expiration
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getExpiringUsers(days = 30, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/expiring`, {
        params: { days, ...params }
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== STATISTICS AND REPORTS ===================

  /**
   * Get user statistics
   * @returns {Promise} API response
   */
  async getUserStats() {
    try {
      const response = await api.get(`${this.baseURL}/stats`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user activity logs
   * @param {string} username - Username
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getUserActivity(username, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/activity`, { 
        params 
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user usage report
   * @param {string} username - Username
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getUserUsageReport(username, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/usage`, { 
        params 
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user login history
   * @param {string} username - Username
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getUserLoginHistory(username, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/login-history`, { 
        params 
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get top users by metric
   * @param {string} metric - Metric type (connections, bandwidth, etc.)
   * @param {number} limit - Number of users to return
   * @returns {Promise} API response
   */
  async getTopUsers(metric = 'connections', limit = 10) {
    try {
      const response = await api.get(`${this.baseURL}/top`, {
        params: { metric, limit }
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get dashboard statistics
   * @returns {Promise} API response
   */
  async getDashboardStats() {
    try {
      const response = await api.get(`${this.baseURL}/dashboard-stats`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== IMPORT/EXPORT ===================

  /**
   * Export users to file
   * @param {string} format - Export format (csv, xlsx, json)
   * @param {Object} filters - Export filters
   * @returns {Promise} Download response
   */
  async exportUsers(format = 'csv', filters = {}) {
    try {
      const response = await api.get(`${this.baseURL}/export`, {
        params: { format, ...filters },
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      link.setAttribute('download', `users_${timestamp}.${format}`)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Xuất file thành công' }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Import users from file
   * @param {File} file - File to import
   * @param {Object} options - Import options
   * @returns {Promise} API response
   */
  async importUsers(file, options = {}) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Add options
      Object.keys(options).forEach(key => {
        formData.append(key, options[key])
      })

      const response = await api.post(`${this.baseURL}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000 // 2 minutes for large files
      })
      
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Download import template
   * @param {string} format - Template format (csv, xlsx)
   * @returns {Promise} Download response
   */
  async getImportTemplate(format = 'csv') {
    try {
      const response = await api.get(`${this.baseURL}/import-template`, {
        params: { format },
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `user_import_template.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Tải template thành công' }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Validate import file
   * @param {File} file - File to validate
   * @returns {Promise} API response
   */
  async validateImportFile(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post(`${this.baseURL}/validate-import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get import history
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async getImportHistory(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/import-history`, { params })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== USER PROFILE AND SETTINGS ===================

  /**
   * Get user profile
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async getUserProfile(username) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/profile`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update user profile
   * @param {string} username - Username
   * @param {Object} profileData - Profile data
   * @returns {Promise} API response
   */
  async updateUserProfile(username, profileData) {
    try {
      const response = await api.put(`${this.baseURL}/${encodeURIComponent(username)}/profile`, profileData)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user settings
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async getUserSettings(username) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/settings`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update user settings
   * @param {string} username - Username
   * @param {Object} settings - Settings object
   * @returns {Promise} API response
   */
  async updateUserSettings(username, settings) {
    try {
      const response = await api.put(`${this.baseURL}/${encodeURIComponent(username)}/settings`, settings)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Upload user avatar
   * @param {string} username - Username
   * @param {File} file - Avatar file
   * @returns {Promise} API response
   */
  async uploadUserAvatar(username, file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete user avatar
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async deleteUserAvatar(username) {
    try {
      const response = await api.delete(`${this.baseURL}/${encodeURIComponent(username)}/avatar`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== USER CERTIFICATES AND CONFIGS ===================

  /**
   * Generate user VPN config
   * @param {string} username - Username
   * @param {string} configType - Config type (ovpn, ipsec, wireguard)
   * @returns {Promise} Download response
   */
  async generateUserConfig(username, configType = 'ovpn') {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/config`, {
        type: configType
      }, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${username}.${configType}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Tạo config thành công' }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user certificate info
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async getUserCertificate(username) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/certificate`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Revoke user certificate
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async revokeUserCertificate(username) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/revoke-certificate`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Regenerate user certificate
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async regenerateUserCertificate(username) {
    try {
      const response = await api.post(`${this.baseURL}/${encodeURIComponent(username)}/regenerate-certificate`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user configs
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  async getUserConfigs(username) {
    try {
      const response = await api.get(`${this.baseURL}/${encodeURIComponent(username)}/configs`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete user config
   * @param {string} username - Username
   * @param {string} configId - Config ID
   * @returns {Promise} API response
   */
  async deleteUserConfig(username, configId) {
    try {
      const response = await api.delete(`${this.baseURL}/${encodeURIComponent(username)}/configs/${configId}`)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== VALIDATION HELPERS ===================

  /**
   * Check username availability
   * @param {string} username - Username to check
   * @returns {Promise} API response
   */
  async checkUsernameAvailability(username) {
    try {
      const response = await api.get(`${this.baseURL}/check-username`, {
        params: { username }
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Check email availability
   * @param {string} email - Email to check
   * @returns {Promise} API response
   */
  async checkEmailAvailability(email) {
    try {
      const response = await api.get(`${this.baseURL}/check-email`, {
        params: { email }
      })
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Validate user data
   * @param {Object} userData - User data to validate
   * @returns {Promise} API response
   */
  async validateUserData(userData) {
    try {
      const response = await api.post(`${this.baseURL}/validate`, userData)
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // =================== USER AUDIT LOGS ===================

}
export default new UserService()