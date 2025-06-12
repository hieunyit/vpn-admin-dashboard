<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile menu overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="sidebarOpen = false"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <span class="ml-3 text-white font-bold text-lg">VPN Admin</span>
        </div>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden text-white hover:text-gray-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            :class="[
              'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
              $route.name === item.name
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="sidebarOpen = false"
          >
            <component
              :is="item.icon"
              :class="[
                'mr-3 h-5 w-5',
                $route.name === item.name
                  ? 'text-blue-700'
                  : 'text-gray-400 group-hover:text-gray-500'
              ]"
            />
            {{ item.label }}
            <span
              v-if="item.badge"
              class="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </div>

        <!-- User Section -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="px-3 mb-4">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tài khoản
            </p>
          </div>
          <router-link
            to="/profile"
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
          >
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Hồ sơ cá nhân
          </router-link>
          <button
            @click="handleLogout"
            class="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Đăng xuất
          </button>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Mobile menu button -->
            <button
              @click="sidebarOpen = true"
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <!-- Breadcrumb -->
            <div class="flex-1 min-w-0">
              <nav class="flex" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-4">
                  <li>
                    <router-link to="/dashboard" class="text-gray-400 hover:text-gray-500">
                      <svg class="flex-shrink-0 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                      </svg>
                    </router-link>
                  </li>
                  <li v-if="$route.meta.title">
                    <div class="flex items-center">
                      <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span class="ml-4 text-sm font-medium text-gray-500">
                        {{ $route.meta.title }}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>

            <!-- Header actions -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <div class="relative">
                <button
                  @click="showNotifications = !showNotifications"
                  class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 17a4 4 0 01-4-4V8a4 4 0 018 0v5a4 4 0 01-4 4z"/>
                  </svg>
                  <span v-if="unreadNotifications > 0" class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>

                <!-- Notifications dropdown -->
                <div
                  v-if="showNotifications"
                  v-click-outside="() => showNotifications = false"
                  class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-900">Thông báo</h3>
                    <div class="mt-3 space-y-3 max-h-64 overflow-y-auto">
                      <div
                        v-for="notification in notifications"
                        :key="notification.id"
                        class="flex p-3 rounded-lg hover:bg-gray-50"
                      >
                        <div class="flex-1">
                          <p class="text-sm text-gray-900">{{ notification.title }}</p>
                          <p class="text-xs text-gray-500 mt-1">{{ formatTimeAgo(notification.createdAt) }}</p>
                        </div>
                        <div
                          v-if="!notification.read"
                          class="ml-2 w-2 h-2 bg-blue-600 rounded-full"
                        ></div>
                      </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                      <button class="text-sm text-blue-600 hover:text-blue-500">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- User menu -->
              <div class="relative">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-white">
                      {{ authStore.user?.username?.charAt(0).toUpperCase() || 'A' }}
                    </span>
                  </div>
                  <div class="hidden sm:block">
                    <p class="text-sm font-medium text-gray-700">{{ authStore.user?.username }}</p>
                    <p class="text-xs text-gray-500">{{ authStore.userRole }}</p>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                <!-- User dropdown -->
                <div
                  v-if="showUserMenu"
                  v-click-outside="() => showUserMenu = false"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div class="py-1">
                    <router-link
                      to="/profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="showUserMenu = false"
                    >
                      Hồ sơ cá nhân
                    </router-link>
                    <router-link
                      to="/settings"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="showUserMenu = false"
                    >
                      Cài đặt
                    </router-link>
                    <div class="border-t border-gray-100"></div>
                    <button
                      @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Page header -->
            <div v-if="$route.meta.title" class="mb-8">
              <h1 class="text-2xl font-bold text-gray-900">{{ $route.meta.title }}</h1>
            </div>

            <!-- Router view -->
            <router-view />
          </div>
        </div>
      </main>
    </div>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl">
        <div class="flex items-center space-x-4">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-lg font-medium text-gray-900">Đang xử lý...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

// Icons (simplified - you can use Heroicons or FontAwesome)
const ChartBarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  `
}

const UsersIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
    </svg>
  `
}

const UserGroupIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  `
}

const GlobeAltIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
    </svg>
  `
}

const DocumentTextIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  `
}

const CogIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  `
}

export default {
  name: 'DashboardLayout',
  components: {
    ChartBarIcon,
    UsersIcon,
    UserGroupIcon,
    GlobeAltIcon,
    DocumentTextIcon,
    CogIcon
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Reactive data
    const sidebarOpen = ref(false)
    const showNotifications = ref(false)
    const showUserMenu = ref(false)
    const loading = ref(false)

    // Navigation items
    const navigation = computed(() => [
      {
        name: 'Dashboard',
        label: 'Dashboard',
        to: '/dashboard',
        icon: 'ChartBarIcon'
      },
      {
        name: 'Users',
        label: 'Quản lý người dùng',
        to: '/users',
        icon: 'UsersIcon',
        badge: unreadUserNotifications.value
      },
      {
        name: 'Groups',
        label: 'Quản lý nhóm',
        to: '/groups',
        icon: 'UserGroupIcon'
      },
      {
        name: 'Connections',
        label: 'Kết nối VPN',
        to: '/connections',
        icon: 'GlobeAltIcon',
        badge: activeConnectionsCount.value
      },
      {
        name: 'Logs',
        label: 'Nhật ký hệ thống',
        to: '/logs',
        icon: 'DocumentTextIcon'
      },
      {
        name: 'Settings',
        label: 'Cài đặt',
        to: '/settings',
        icon: 'CogIcon'
      }
    ].filter(item => {
      // Filter based on user permissions
      if (item.name === 'Settings' && !authStore.hasPermission('settings.manage')) {
        return false
      }
      return true
    }))

    // Sample notifications
    const notifications = ref([
      {
        id: 1,
        title: 'Người dùng mới đăng ký',
        message: 'john_doe vừa tạo tài khoản',
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      },
      {
        id: 2,
        title: 'Kết nối VPN bất thường',
        message: 'Phát hiện kết nối từ IP lạ',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        read: false
      },
      {
        id: 3,
        title: 'Cập nhật hệ thống',
        message: 'Hệ thống đã được cập nhật thành công',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true
      }
    ])

    // Computed properties
    const unreadNotifications = computed(() => 
      notifications.value.filter(n => !n.read).length
    )

    const unreadUserNotifications = computed(() => {
      // This would come from your user store
      return 0
    })

    const activeConnectionsCount = computed(() => {
      // This would come from your connections store
      return 5
    })

    // Methods
    const handleLogout = async () => {
      try {
        loading.value = true
        await authStore.logout()
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        loading.value = false
      }
    }

    const formatTimeAgo = (date) => {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: vi
      })
    }

    // Click outside directive
    const clickOutside = {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }

    onMounted(() => {
      // Close sidebar when clicking outside on mobile
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          sidebarOpen.value = false
        }
      }
      window.addEventListener('resize', handleResize)
    })

    return {
      sidebarOpen,
      showNotifications,
      showUserMenu,
      loading,
      navigation,
      notifications,
      unreadNotifications,
      unreadUserNotifications,
      activeConnectionsCount,
      authStore,
      handleLogout,
      formatTimeAgo
    }
  },
  directives: {
    clickOutside: {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
/* Smooth transitions */
.transform {
  transition: transform 0.3s ease-in-out;
}

/* Custom scrollbar for notifications */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Focus styles */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-blue-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
}
</style>