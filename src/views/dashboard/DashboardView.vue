<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Chào mừng trở lại, {{ authStore.user?.username }}! 👋
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Đây là tổng quan về hệ thống VPN của bạn ngày {{ formatDate(new Date()) }}
            </p>
          </div>
          <div class="hidden sm:block">
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Cập nhật lần cuối: {{ formatDateTime(lastUpdate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Users -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tổng người dùng</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ stats.userGrowth }}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/users" class="font-medium text-blue-700 hover:text-blue-600">
              Xem tất cả người dùng
            </router-link>
          </div>
        </div>
      </div>

      <!-- Active Connections -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Kết nối hoạt động</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.activeConnections }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold" :class="connectionTrendClass">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="stats.connectionTrend > 0" fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                      <path v-else fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ Math.abs(stats.connectionTrend) }}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/connections" class="font-medium text-blue-700 hover:text-blue-600">
              Xem chi tiết kết nối
            </router-link>
          </div>
        </div>
      </div>

      <!-- Total Groups -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tổng nhóm</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ stats.totalGroups }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/groups" class="font-medium text-blue-700 hover:text-blue-600">
              Quản lý nhóm
            </router-link>
          </div>
        </div>
      </div>

      <!-- Bandwidth Usage -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Lưu lượng (24h)</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ formatBytes(stats.totalBandwidth) }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-gray-500">Tải lên: {{ formatBytes(stats.uploadBandwidth) }}</span>
            <span class="mx-2 text-gray-300">|</span>
            <span class="text-gray-500">Tải xuống: {{ formatBytes(stats.downloadBandwidth) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Connection Chart -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Kết nối theo thời gian
          </h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Biểu đồ kết nối</h3>
              <p class="mt-1 text-sm text-gray-500">Tích hợp Chart.js đang được phát triển</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bandwidth Chart -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Lưu lượng sử dụng
          </h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Biểu đồ băng thông</h3>
              <p class="mt-1 text-sm text-gray-500">Tích hợp Chart.js đang được phát triển</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity & System Status -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Hoạt động gần đây
            </h3>
            <router-link to="/logs" class="text-sm text-blue-600 hover:text-blue-500">
              Xem tất cả →
            </router-link>
          </div>
          
          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in recentActivities" :key="activity.id">
                <div class="relative pb-8" :class="{ 'pb-0': index === recentActivities.length - 1 }">
                  <span
                    v-if="index !== recentActivities.length - 1"
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  ></span>
                  <div class="relative flex space-x-3">
                    <div>
                      <span :class="[
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                        getActivityIconClass(activity.type)
                      ]">
                        <component :is="getActivityIcon(activity.type)" class="h-5 w-5 text-white"/>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">
                          <span class="font-medium text-gray-900">{{ activity.user }}</span>
                          {{ activity.description }}
                        </p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        {{ formatTimeAgo(activity.timestamp) }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div v-if="recentActivities.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Chưa có hoạt động</h3>
            <p class="mt-1 text-sm text-gray-500">Các hoạt động gần đây sẽ được hiển thị ở đây.</p>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Trạng thái hệ thống
          </h3>
          
          <div class="space-y-4">
            <!-- Overall Status -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-900">Tổng quan</span>
              </div>
              <span class="text-sm text-green-600 font-medium">Hoạt động bình thường</span>
            </div>

            <!-- VPN Server -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700">VPN Server</span>
              </div>
              <span class="text-sm text-gray-500">{{ systemStatus.vpnServer }}</span>
            </div>

            <!-- Database -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700">Cơ sở dữ liệu</span>
              </div>
              <span class="text-sm text-gray-500">{{ systemStatus.database }}</span>
            </div>

            <!-- API -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700">API</span>
              </div>
              <span class="text-sm text-gray-500">{{ systemStatus.api }}</span>
            </div>

            <!-- LDAP -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div :class="[
                  'w-3 h-3 rounded-full mr-3',
                  systemStatus.ldap === 'Kết nối' ? 'bg-green-400' : 'bg-yellow-400'
                ]"></div>
                <span class="text-sm text-gray-700">LDAP</span>
              </div>
              <span class="text-sm text-gray-500">{{ systemStatus.ldap }}</span>
            </div>
          </div>

          <!-- System Resources -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Tài nguyên hệ thống</h4>
            
            <!-- CPU Usage -->
            <div class="mb-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">CPU</span>
                <span class="text-gray-900">{{ systemResources.cpu }}%</span>
              </div>
              <div class="mt-1 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: systemResources.cpu + '%' }"
                ></div>
              </div>
            </div>

            <!-- Memory Usage -->
            <div class="mb-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Bộ nhớ</span>
                <span class="text-gray-900">{{ systemResources.memory }}%</span>
              </div>
              <div class="mt-1 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: systemResources.memory + '%' }"
                ></div>
              </div>
            </div>

            <!-- Disk Usage -->
            <div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Ổ cứng</span>
                <span class="text-gray-900">{{ systemResources.disk }}%</span>
              </div>
              <div class="mt-1 bg-gray-200 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full transition-all duration-300',
                    systemResources.disk > 80 ? 'bg-red-600' : 'bg-yellow-600'
                  ]"
                  :style="{ width: systemResources.disk + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Uptime -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Thời gian hoạt động</span>
              <span class="text-sm font-medium text-gray-900">{{ systemStatus.uptime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Thao tác nhanh
        </h3>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <router-link
            to="/users/create"
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true"></span>
              <p class="text-sm font-medium text-gray-900">Thêm người dùng</p>
              <p class="text-sm text-gray-500 truncate">Tạo tài khoản mới</p>
            </div>
          </router-link>

          <router-link
            to="/groups/create"
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true"></span>
              <p class="text-sm font-medium text-gray-900">Tạo nhóm</p>
              <p class="text-sm text-gray-500 truncate">Tạo nhóm mới</p>
            </div>
          </router-link>

          <router-link
            to="/connections"
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true"></span>
              <p class="text-sm font-medium text-gray-900">Theo dõi kết nối</p>
              <p class="text-sm text-gray-500 truncate">Xem kết nối VPN</p>
            </div>
          </router-link>

          <router-link
            to="/settings"
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true"></span>
              <p class="text-sm font-medium text-gray-900">Cài đặt</p>
              <p class="text-sm text-gray-500 truncate">Cấu hình hệ thống</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useGroupsStore } from '@/stores/groups'
import { formatDistanceToNow, format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default {
  name: 'DashboardView',
  setup() {
    const authStore = useAuthStore()
    const usersStore = useUsersStore()
    const groupsStore = useGroupsStore()

    // State
    const loading = ref(false)
    const lastUpdate = ref(new Date())
    let updateInterval = null

    // Stats data
    const stats = ref({
      totalUsers: 156,
      userGrowth: 12.5,
      activeConnections: 43,
      connectionTrend: 8.2,
      totalGroups: 12,
      totalBandwidth: 2847500000, // bytes
      uploadBandwidth: 1247500000,
      downloadBandwidth: 1600000000
    })

    // System status
    const systemStatus = ref({
      vpnServer: 'Hoạt động',
      database: 'Kết nối',
      api: 'Online',
      ldap: 'Kết nối',
      uptime: '15 ngày 8 giờ 32 phút'
    })

    // System resources
    const systemResources = ref({
      cpu: 45,
      memory: 62,
      disk: 78
    })

    // Recent activities
    const recentActivities = ref([
      {
        id: 1,
        type: 'user_login',
        user: 'john_doe',
        description: 'đã đăng nhập thành công',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: 2,
        type: 'user_created',
        user: 'admin',
        description: 'đã tạo người dùng mới jane_smith',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: 3,
        type: 'group_updated',
        user: 'admin',
        description: 'đã cập nhật cài đặt nhóm developers',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 4,
        type: 'connection_disconnect',
        user: 'bob_wilson',
        description: 'đã ngắt kết nối VPN',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 5,
        type: 'settings_updated',
        user: 'admin',
        description: 'đã cập nhật cài đặt LDAP',
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      }
    ])

    // Computed
    const connectionTrendClass = computed(() => {
      return stats.value.connectionTrend > 0 ? 'text-green-600' : 'text-red-600'
    })

    // Methods
    const loadDashboardData = async () => {
      loading.value = true
      try {
        // Load data from stores
        await Promise.all([
          loadStats(),
          loadSystemStatus(),
          loadRecentActivities()
        ])
        
        lastUpdate.value = new Date()
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        loading.value = false
      }
    }

    const loadStats = async () => {
      try {
        // This would normally fetch from your API
        // For now, we'll simulate with some dynamic data
        stats.value = {
          ...stats.value,
          totalUsers: Math.floor(Math.random() * 50) + 150,
          activeConnections: Math.floor(Math.random() * 20) + 35,
          userGrowth: (Math.random() * 20 - 5).toFixed(1),
          connectionTrend: (Math.random() * 20 - 10).toFixed(1)
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    const loadSystemStatus = async () => {
      try {
        // Simulate API call to check system health
        systemResources.value = {
          cpu: Math.floor(Math.random() * 40) + 30,
          memory: Math.floor(Math.random() * 30) + 50,
          disk: Math.floor(Math.random() * 20) + 70
        }
      } catch (error) {
        console.error('Failed to load system status:', error)
      }
    }

    const loadRecentActivities = async () => {
      try {
        // This would normally fetch from your API
        // For now, we'll use the static data
      } catch (error) {
        console.error('Failed to load recent activities:', error)
      }
    }

    const formatDate = (date) => {
      return format(date, 'dd/MM/yyyy', { locale: vi })
    }

    const formatDateTime = (date) => {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi })
    }

    const formatTimeAgo = (date) => {
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: vi
      })
    }

    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getActivityIcon = (type) => {
      const icons = {
        user_login: {
          template: `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
          `
        },
        user_created: {
          template: `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          `
        },
        group_updated: {
          template: `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          `
        },
        connection_disconnect: {
          template: `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
            </svg>
          `
        },
        settings_updated: {
          template: `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          `
        }
      }
      
      return icons[type] || icons.user_login
    }

    const getActivityIconClass = (type) => {
      const classes = {
        user_login: 'bg-green-500',
        user_created: 'bg-blue-500',
        group_updated: 'bg-purple-500',
        connection_disconnect: 'bg-red-500',
        settings_updated: 'bg-gray-500'
      }
      
      return classes[type] || 'bg-gray-500'
    }

    // Auto-refresh data
    const startAutoRefresh = () => {
      updateInterval = setInterval(() => {
        loadDashboardData()
      }, 30000) // Refresh every 30 seconds
    }

    const stopAutoRefresh = () => {
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
    }

    // Lifecycle
    onMounted(() => {
      loadDashboardData()
      startAutoRefresh()
    })

    onUnmounted(() => {
      stopAutoRefresh()
    })

    return {
      // State
      loading,
      lastUpdate,
      stats,
      systemStatus,
      systemResources,
      recentActivities,
      
      // Stores
      authStore,
      usersStore,
      groupsStore,
      
      // Computed
      connectionTrendClass,
      
      // Methods
      loadDashboardData,
      formatDate,
      formatDateTime,
      formatTimeAgo,
      formatBytes,
      getActivityIcon,
      getActivityIconClass
    }
  }
}
</script>

<style scoped>
/* Animation for stats cards */
.hover\:border-gray-400:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease-in-out;
}

/* Progress bar animations */
.transition-all {
  transition: all 0.3s ease;
}

/* Activity timeline styles */
.flow-root ul li:last-child .relative::before {
  display: none;
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeIn 0.6s ease-out;
}

/* Loading states */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Responsive improvements */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>