import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGroupsStore = defineStore('groups', () => {
  // State
  const groups = ref([])
  const currentGroup = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Mock data for development
  const mockGroups = [
    {
      groupName: 'developers',
      authMethod: 'local',
      mfa: true,
      role: 'user',
      denyAccess: false,
      accessControl: ['192.168.1.0/24', '10.0.0.0/16'],
      description: 'Development team members',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-06-01T15:30:00Z'
    },
    {
      groupName: 'managers',
      authMethod: 'ldap',
      mfa: true,
      role: 'admin',
      denyAccess: false,
      accessControl: ['0.0.0.0/0'],
      description: 'Management team with full access',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-05-20T11:45:00Z'
    },
    {
      groupName: 'users',
      authMethod: 'local',
      mfa: false,
      role: 'user',
      denyAccess: false,
      accessControl: ['192.168.2.0/24'],
      description: 'Regular users with limited access',
      createdAt: '2024-02-01T14:00:00Z',
      updatedAt: '2024-06-10T16:20:00Z'
    },
    {
      groupName: 'guests',
      authMethod: 'radius',
      mfa: false,
      role: 'user',
      denyAccess: true,
      accessControl: ['192.168.3.0/24'],
      description: 'Temporary guest access',
      createdAt: '2024-03-15T12:00:00Z',
      updatedAt: '2024-06-05T10:15:00Z'
    },
    {
      groupName: 'contractors',
      authMethod: 'ldap',
      mfa: true,
      role: 'user',
      denyAccess: false,
      accessControl: ['192.168.4.0/24', '172.16.0.0/16'],
      description: 'External contractors',
      createdAt: '2024-04-01T08:00:00Z',
      updatedAt: '2024-06-08T13:30:00Z'
    }
  ]

  // Getters
  const totalGroups = computed(() => groups.value.length)
  const activeGroups = computed(() => groups.value.filter(g => !g.denyAccess).length)
  const adminGroups = computed(() => groups.value.filter(g => g.role === 'admin').length)
  const mfaEnabledGroups = computed(() => groups.value.filter(g => g.mfa).length)

  const groupsByAuthMethod = computed(() => {
    return groups.value.reduce((acc, group) => {
      const method = group.authMethod || 'local'
      if (!acc[method]) acc[method] = []
      acc[method].push(group)
      return acc
    }, {})
  })

  // Actions
  const fetchGroups = async () => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In production, replace with actual API call:
      // const response = await groupService.getGroups()
      // groups.value = response.data
      
      groups.value = [...mockGroups]
      
      return { success: true, data: groups.value }
    } catch (err) {
      error.value = err.message
      console.error('Fetch groups error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchGroup = async (groupName) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const group = groups.value.find(g => g.groupName === groupName)
      if (!group) {
        throw new Error(`Group ${groupName} not found`)
      }
      
      currentGroup.value = group
      return { success: true, data: group }
    } catch (err) {
      error.value = err.message
      console.error('Fetch group error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (groupData) => {
    loading.value = true
    error.value = null

    try {
      // Validate group data
      if (!groupData.groupName || !groupData.groupName.trim()) {
        throw new Error('Group name is required')
      }

      // Check if group already exists
      const existingGroup = groups.value.find(g => g.groupName === groupData.groupName)
      if (existingGroup) {
        throw new Error('Group already exists')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create new group object
      const newGroup = {
        ...groupData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add to groups array
      groups.value.unshift(newGroup)
      
      return { success: true, data: newGroup }
    } catch (err) {
      error.value = err.message
      console.error('Create group error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroup = async (groupName, groupData) => {
    loading.value = true
    error.value = null

    try {
      // Find group index
      const index = groups.value.findIndex(g => g.groupName === groupName)
      if (index === -1) {
        throw new Error('Group not found')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // Update group
      const updatedGroup = {
        ...groups.value[index],
        ...groupData,
        updatedAt: new Date().toISOString()
      }

      groups.value[index] = updatedGroup

      // Update current group if it's the same
      if (currentGroup.value && currentGroup.value.groupName === groupName) {
        currentGroup.value = updatedGroup
      }
      
      return { success: true, data: updatedGroup }
    } catch (err) {
      error.value = err.message
      console.error('Update group error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGroup = async (groupName) => {
    loading.value = true
    error.value = null

    try {
      // Check if it's a system group
      const systemGroups = ['__DEFAULT__', 'admin', 'system']
      if (systemGroups.includes(groupName)) {
        throw new Error('Cannot delete system group')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))

      // Remove from groups array
      groups.value = groups.value.filter(g => g.groupName !== groupName)

      // Clear current group if it's the deleted one
      if (currentGroup.value && currentGroup.value.groupName === groupName) {
        currentGroup.value = null
      }
      
      return { success: true, message: 'Group deleted successfully' }
    } catch (err) {
      error.value = err.message
      console.error('Delete group error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const duplicateGroup = async (sourceGroupName, newGroupName) => {
    loading.value = true
    error.value = null

    try {
      // Find source group
      const sourceGroup = groups.value.find(g => g.groupName === sourceGroupName)
      if (!sourceGroup) {
        throw new Error('Source group not found')
      }

      // Check if new group name already exists
      const existingGroup = groups.value.find(g => g.groupName === newGroupName)
      if (existingGroup) {
        throw new Error('Group with this name already exists')
      }

      // Create duplicated group
      const duplicatedGroup = {
        ...sourceGroup,
        groupName: newGroupName,
        description: `Copy of ${sourceGroup.description || sourceGroup.groupName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Add to groups array
      groups.value.unshift(duplicatedGroup)
      
      return { success: true, data: duplicatedGroup }
    } catch (err) {
      error.value = err.message
      console.error('Duplicate group error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkUpdateGroups = async (groupNames, updateData) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update groups
      groups.value = groups.value.map(group => {
        if (groupNames.includes(group.groupName)) {
          return {
            ...group,
            ...updateData,
            updatedAt: new Date().toISOString()
          }
        }
        return group
      })
      
      return { success: true, message: `Updated ${groupNames.length} groups` }
    } catch (err) {
      error.value = err.message
      console.error('Bulk update error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkDeleteGroups = async (groupNames) => {
    loading.value = true
    error.value = null

    try {
      // Check for system groups
      const systemGroups = ['__DEFAULT__', 'admin', 'system']
      const invalidGroups = groupNames.filter(name => systemGroups.includes(name))
      if (invalidGroups.length > 0) {
        throw new Error(`Cannot delete system groups: ${invalidGroups.join(', ')}`)
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1800))

      // Remove groups
      groups.value = groups.value.filter(g => !groupNames.includes(g.groupName))
      
      return { success: true, message: `Deleted ${groupNames.length} groups` }
    } catch (err) {
      error.value = err.message
      console.error('Bulk delete error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getGroupMembers = async (groupName) => {
    try {
      // This would typically call the users API to get members
      // For now, return mock data
      const mockMembers = [
        { username: 'john_doe', email: 'john@example.com', isActive: true },
        { username: 'jane_smith', email: 'jane@example.com', isActive: true }
      ]
      
      return { success: true, data: mockMembers }
    } catch (err) {
      console.error('Get group members error:', err)
      throw err
    }
  }

  const assignUsersToGroup = async (groupName, usernames) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In production, this would call the users API to update their group
      return { success: true, message: `Assigned ${usernames.length} users to ${groupName}` }
    } catch (err) {
      error.value = err.message
      console.error('Assign users error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeUsersFromGroup = async (groupName, usernames) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { success: true, message: `Removed ${usernames.length} users from ${groupName}` }
    } catch (err) {
      error.value = err.message
      console.error('Remove users error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchGroups = async (searchParams) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      let filtered = [...groups.value]

      // Apply search filters
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase()
        filtered = filtered.filter(group =>
          group.groupName.toLowerCase().includes(query) ||
          (group.description && group.description.toLowerCase().includes(query))
        )
      }

      if (searchParams.authMethod) {
        filtered = filtered.filter(group => group.authMethod === searchParams.authMethod)
      }

      if (searchParams.role) {
        filtered = filtered.filter(group => group.role === searchParams.role)
      }

      if (searchParams.mfa !== undefined) {
        filtered = filtered.filter(group => group.mfa === searchParams.mfa)
      }

      if (searchParams.status) {
        if (searchParams.status === 'active') {
          filtered = filtered.filter(group => !group.denyAccess)
        } else if (searchParams.status === 'blocked') {
          filtered = filtered.filter(group => group.denyAccess)
        }
      }

      return { success: true, data: filtered }
    } catch (err) {
      error.value = err.message
      console.error('Search groups error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getGroupStats = async () => {
    try {
      // Calculate stats from current groups
      const stats = {
        total: totalGroups.value,
        active: activeGroups.value,
        admin: adminGroups.value,
        mfaEnabled: mfaEnabledGroups.value,
        byAuthMethod: groupsByAuthMethod.value
      }

      return { success: true, data: stats }
    } catch (err) {
      console.error('Get group stats error:', err)
      throw err
    }
  }

  // Helper functions
  const getGroupByName = (groupName) => {
    return groups.value.find(g => g.groupName === groupName)
  }

  const isSystemGroup = (groupName) => {
    const systemGroups = ['__DEFAULT__', 'admin', 'system']
    return systemGroups.includes(groupName)
  }

  const validateGroupName = (groupName) => {
    if (!groupName || !groupName.trim()) {
      return 'Group name is required'
    }

    if (groupName.length < 3) {
      return 'Group name must be at least 3 characters'
    }

    if (groupName.length > 50) {
      return 'Group name must be less than 50 characters'
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(groupName)) {
      return 'Group name can only contain letters, numbers, underscores, and hyphens'
    }

    if (isSystemGroup(groupName)) {
      return 'This is a reserved group name'
    }

    const existingGroup = getGroupByName(groupName)
    if (existingGroup) {
      return 'Group name already exists'
    }

    return null
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentGroup = () => {
    currentGroup.value = null
  }

  // Initialize with mock data
  const initializeMockData = () => {
    groups.value = [...mockGroups]
  }

  return {
    // State
    groups,
    currentGroup,
    loading,
    error,

    // Getters
    totalGroups,
    activeGroups,
    adminGroups,
    mfaEnabledGroups,
    groupsByAuthMethod,

    // Actions
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    duplicateGroup,
    bulkUpdateGroups,
    bulkDeleteGroups,
    getGroupMembers,
    assignUsersToGroup,
    removeUsersFromGroup,
    searchGroups,
    getGroupStats,

    // Helper functions
    getGroupByName,
    isSystemGroup,
    validateGroupName,
    clearError,
    clearCurrentGroup,
    initializeMockData
  }
})