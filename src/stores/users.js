import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userService from '@/services/user.service'
import { useAuthStore } from './auth'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0
  })

  // Statistics
  const stats = ref({
    total: 0,
    active: 0,
    inactive: 0,
    expired: 0,
    online: 0,
    newToday: 0,
    newThisWeek: 0,
    newThisMonth: 0
  })

  // Search and filters
  const filters = ref({
    search: '',
    status: '',
    group: '',
    role: '',
    dateFrom: null,
    dateTo: null,
    lastLoginFrom: null,
    lastLoginTo: null
  })

  // Getters
  const totalUsers = computed(() => users.value.length)
  const activeUsers = computed(() => users.value.filter(user => user.isActive && !isUserExpired(user)).length)
  const inactiveUsers = computed(() => users.value.filter(user => !user.isActive).length)
  const expiredUsers = computed(() => users.value.filter(user => isUserExpired(user)).length)
  const onlineUsers = computed(() => users.value.filter(user => user.isOnline).length)

  const filteredUsers = computed(() => {
    let filtered = [...users.value]

    // Apply search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(search) ||
        (user.email && user.email.toLowerCase().includes(search)) ||
        (user.fullName && user.fullName.toLowerCase().includes(search))
      )
    }

    // Apply status filter
    if (filters.value.status) {
      filtered = filtered.filter(user => {
        const status = getUserStatus(user)
        return status === filters.value.status
      })
    }

    // Apply group filter
    if (filters.value.group) {
      filtered = filtered.filter(user => user.groupName === filters.value.group)
    }

    // Apply role filter
    if (filters.value.role) {
      filtered = filtered.filter(user => user.role === filters.value.role)
    }

    // Apply date range filters
    if (filters.value.dateFrom) {
      filtered = filtered.filter(user => 
        new Date(user.dateCreated) >= new Date(filters.value.dateFrom)
      )
    }

    if (filters.value.dateTo) {
      filtered = filtered.filter(user => 
        new Date(user.dateCreated) <= new Date(filters.value.dateTo)
      )
    }

    return filtered
  })

  // Actions
  const fetchUsers = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.getUsers({
        page: pagination.value.page,
        per_page: pagination.value.perPage,
        ...params
      })

      if (response.success) {
        users.value = response.data.users || response.data
        
        // Update pagination if provided
        if (response.data.pagination) {
          pagination.value = {
            ...pagination.value,
            ...response.data.pagination
          }
        }

        // Update stats
        await updateStats()
        
        return response
      } else {
        throw new Error(response.message || 'Failed to fetch users')
      }
    } catch (err) {
      error.value = err.message
      console.error('Fetch users error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (username) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.getUser(username)
      
      if (response.success) {
        currentUser.value = response.data
        
        // Update user in users array if exists
        const index = users.value.findIndex(u => u.username === username)
        if (index !== -1) {
          users.value[index] = response.data
        }
        
        return response.data
      } else {
        throw new Error(response.message || 'User not found')
      }
    } catch (err) {
      error.value = err.message
      console.error('Fetch user error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.createUser(userData)
      
      if (response.success) {
        // Add new user to the list
        users.value.unshift(response.data)
        
        // Update stats
        await updateStats()
        
        return response
      } else {
        throw new Error(response.message || 'Failed to create user')
      }
    } catch (err) {
      error.value = err.message
      console.error('Create user error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (username, userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.updateUser(username, userData)
      
      if (response.success) {
        // Update user in the list
        const index = users.value.findIndex(u => u.username === username)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...response.data }
        }
        
        // Update current user if it's the same
        if (currentUser.value && currentUser.value.username === username) {
          currentUser.value = { ...currentUser.value, ...response.data }
        }
        
        return response
      } else {
        throw new Error(response.message || 'Failed to update user')
      }
    } catch (err) {
      error.value = err.message
      console.error('Update user error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (username) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.deleteUser(username)
      
      if (response.success) {
        // Remove user from the list
        users.value = users.value.filter(u => u.username !== username)
        
        // Clear current user if it's the deleted one
        if (currentUser.value && currentUser.value.username === username) {
          currentUser.value = null
        }
        
        // Update stats
        await updateStats()
        
        return response
      } else {
        throw new Error(response.message || 'Failed to delete user')
      }
    } catch (err) {
      error.value = err.message
      console.error('Delete user error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkUpdateUsers = async (usernames, updateData) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.bulkUpdateUsers(usernames, updateData)
      
      if (response.success) {
        // Update users in the list
        users.value = users.value.map(user => {
          if (usernames.includes(user.username)) {
            return { ...user, ...updateData }
          }
          return user
        })
        
        // Update stats
        await updateStats()
        
        return response
      } else {
        throw new Error(response.message || 'Failed to bulk update users')
      }
    } catch (err) {
      error.value = err.message
      console.error('Bulk update error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkDeleteUsers = async (usernames) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.bulkDeleteUsers(usernames)
      
      if (response.success) {
        // Remove users from the list
        users.value = users.value.filter(u => !usernames.includes(u.username))
        
        // Update stats
        await updateStats()
        
        return response
      } else {
        throw new Error(response.message || 'Failed to bulk delete users')
      }
    } catch (err) {
      error.value = err.message
      console.error('Bulk delete error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const changeUserPassword = async (username, passwordData) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.changePassword(username, passwordData)
      
      if (response.success) {
        return response
      } else {
        throw new Error(response.message || 'Failed to change password')
      }
    } catch (err) {
      error.value = err.message
      console.error('Change password error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetUserPassword = async (username) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.resetPassword(username)
      
      if (response.success) {
        return response
      } else {
        throw new Error(response.message || 'Failed to reset password')
      }
    } catch (err) {
      error.value = err.message
      console.error('Reset password error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleUserStatus = async (username) => {
    const user = users.value.find(u => u.username === username)
    if (!user) throw new Error('User not found')

    return await updateUser(username, { isActive: !user.isActive })
  }

  const extendUserExpiration = async (username, days) => {
    const user = users.value.find(u => u.username === username)
    if (!user) throw new Error('User not found')

    const currentExpiration = user.expirationDate ? new Date(user.expirationDate) : new Date()
    const newExpiration = new Date(currentExpiration.getTime() + (days * 24 * 60 * 60 * 1000))

    return await updateUser(username, { 
      expirationDate: newExpiration.toISOString().split('T')[0] 
    })
  }

  const getUserConnections = async (username) => {
    try {
      const response = await userService.getUserConnections(username)
      return response.success ? response.data : []
    } catch (err) {
      console.error('Get user connections error:', err)
      return []
    }
  }

  const disconnectUser = async (username) => {
    try {
      const response = await userService.disconnectUser(username)
      
      if (response.success) {
        // Update user's online status
        const user = users.value.find(u => u.username === username)
        if (user) {
          user.isOnline = false
        }
      }
      
      return response
    } catch (err) {
      console.error('Disconnect user error:', err)
      throw err
    }
  }

  const exportUsers = async (format = 'csv', filters = {}) => {
    try {
      const response = await userService.exportUsers(format, filters)
      return response
    } catch (err) {
      console.error('Export users error:', err)
      throw err
    }
  }

  const importUsers = async (file, options = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.importUsers(file, options)
      
      if (response.success) {
        // Refresh users list
        await fetchUsers()
        return response
      } else {
        throw new Error(response.message || 'Failed to import users')
      }
    } catch (err) {
      error.value = err.message
      console.error('Import users error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchUsers = async (searchParams) => {
    loading.value = true
    error.value = null

    try {
      const response = await userService.searchUsers(searchParams)
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || 'Search failed')
      }
    } catch (err) {
      error.value = err.message
      console.error('Search users error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserStats = async () => {
    try {
      const response = await userService.getUserStats()
      
      if (response.success) {
        stats.value = response.data
        return response.data
      }
    } catch (err) {
      console.error('Get user stats error:', err)
    }
  }

  // Helper functions
  const updateStats = () => {
    stats.value = {
      total: users.value.length,
      active: activeUsers.value,
      inactive: inactiveUsers.value,
      expired: expiredUsers.value,
      online: onlineUsers.value,
      newToday: users.value.filter(u => isCreatedToday(u)).length,
      newThisWeek: users.value.filter(u => isCreatedThisWeek(u)).length,
      newThisMonth: users.value.filter(u => isCreatedThisMonth(u)).length
    }
  }

  const getUserStatus = (user) => {
    if (!user.isActive) return 'inactive'
    if (isUserExpired(user)) return 'expired'
    if (user.isLocked) return 'locked'
    return 'active'
  }

  const isUserExpired = (user) => {
    if (!user.expirationDate) return false
    return new Date(user.expirationDate) < new Date()
  }

  const isCreatedToday = (user) => {
    const today = new Date()
    const created = new Date(user.dateCreated)
    return created.toDateString() === today.toDateString()
  }

  const isCreatedThisWeek = (user) => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const created = new Date(user.dateCreated)
    return created >= weekAgo
  }

  const isCreatedThisMonth = (user) => {
    const now = new Date()
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
    const created = new Date(user.dateCreated)
    return created >= monthAgo
  }

  const clearError = () => {
    error.value = null
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      status: '',
      group: '',
      role: '',
      dateFrom: null,
      dateTo: null,
      lastLoginFrom: null,
      lastLoginTo: null
    }
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    pagination,
    stats,
    filters,

    // Getters
    totalUsers,
    activeUsers,
    inactiveUsers,
    expiredUsers,
    onlineUsers,
    filteredUsers,

    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    bulkUpdateUsers,
    bulkDeleteUsers,
    changeUserPassword,
    resetUserPassword,
    toggleUserStatus,
    extendUserExpiration,
    getUserConnections,
    disconnectUser,
    exportUsers,
    importUsers,
    searchUsers,
    getUserStats,

    // Helper functions
    updateStats,
    getUserStatus,
    isUserExpired,
    clearError,
    setFilters,
    clearFilters,
    setPagination
  }
})