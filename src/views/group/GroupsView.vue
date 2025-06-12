<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý nhóm</h1>
        <p class="mt-2 text-sm text-gray-700">
          Tạo và quản lý các nhóm người dùng với quyền hạn và cài đặt khác nhau.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          to="/groups/create"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Tạo nhóm mới
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tổng nhóm</dt>
                <dd class="text-lg font-medium text-gray-900">{{ totalGroups }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Nhóm hoạt động</dt>
                <dd class="text-lg font-medium text-gray-900">{{ activeGroups }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Có MFA</dt>
                <dd class="text-lg font-medium text-gray-900">{{ mfaEnabledGroups }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tổng thành viên</dt>
                <dd class="text-lg font-medium text-gray-900">{{ totalMembers }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <!-- Search -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Tìm kiếm nhóm</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm theo tên nhóm..."
                class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- Auth Method Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Phương thức xác thực</label>
            <select
              v-model="filters.authMethod"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              @change="applyFilters"
            >
              <option value="">Tất cả</option>
              <option value="local">Local</option>
              <option value="ldap">LDAP</option>
              <option value="radius">RADIUS</option>
            </select>
          </div>
        </div>

        <!-- Additional Filters Row -->
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <!-- Role Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Quyền</label>
            <select
              v-model="filters.role"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              @change="applyFilters"
            >
              <option value="">Tất cả quyền</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng</option>
            </select>
          </div>

          <!-- MFA Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">MFA</label>
            <select
              v-model="filters.mfa"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              @change="applyFilters"
            >
              <option value="">Tất cả</option>
              <option value="true">Đã bật</option>
              <option value="false">Đã tắt</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              v-model="filters.status"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              @change="applyFilters"
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="blocked">Bị chặn</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Groups Grid -->
    <div v-if="loading" class="text-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="filteredGroups.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có nhóm nào</h3>
      <p class="mt-1 text-sm text-gray-500">Không tìm thấy nhóm nào với bộ lọc hiện tại.</p>
      <div class="mt-6">
        <router-link
          to="/groups/create"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Tạo nhóm đầu tiên
        </router-link>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="group in paginatedGroups"
        :key="group.groupName"
        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
      >
        <div class="px-4 py-5 sm:p-6">
          <!-- Group Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">{{ group.groupName }}</h3>
                <p class="text-sm text-gray-500">{{ getMemberCount(group.groupName) }} thành viên</p>
              </div>
            </div>
            
            <!-- Group Actions Dropdown -->
            <div class="relative">
              <button
                @click="toggleDropdown(group.groupName)"
                class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
              
              <div
                v-if="openDropdown === group.groupName"
                v-click-outside="() => closeDropdown()"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn"
              >
                <div class="py-1">
                  <router-link
                    :to="`/groups/${group.groupName}`"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    @click="closeDropdown()"
                  >
                    <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    Xem chi tiết
                  </router-link>
                  <button
                    @click="editGroup(group)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Chỉnh sửa
                  </button>
                  <button
                    @click="duplicateGroup(group)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Sao chép
                  </button>
                  <div class="border-t border-gray-100"></div>
                  <button
                    @click="deleteGroup(group)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
                  >
                    <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Xóa nhóm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Group Details -->
          <div class="space-y-3">
            <!-- Auth Method -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Xác thực:</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ group.authMethod || 'Mặc định' }}
              </span>
            </div>

            <!-- Role -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Quyền:</span>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                group.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              ]">
                {{ group.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
              </span>
            </div>

            <!-- MFA Status -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">MFA:</span>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                group.mfa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                <svg class="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3"/>
                </svg>
                {{ group.mfa ? 'Đã bật' : 'Đã tắt' }}
              </span>
            </div>

            <!-- Access Status -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Trạng thái:</span>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                group.denyAccess ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              ]">
                <svg class="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3"/>
                </svg>
                {{ group.denyAccess ? 'Bị chặn' : 'Hoạt động' }}
              </span>
            </div>

            <!-- Access Control -->
            <div v-if="group.accessControl && group.accessControl.length > 0">
              <span class="text-sm text-gray-500">Kiểm soát truy cập:</span>
              <div class="mt-1 flex flex-wrap gap-1">
                <span
                  v-for="(subnet, index) in group.accessControl.slice(0, 2)"
                  :key="index"
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 text-gray-700"
                >
                  {{ subnet }}
                </span>
                <span
                  v-if="group.accessControl.length > 2"
                  class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                >
                  +{{ group.accessControl.length - 2 }} khác
                </span>
              </div>
            </div>
          </div>

          <!-- Group Actions -->
          <div class="mt-6 flex justify-between items-center">
            <router-link
              :to="`/groups/${group.groupName}`"
              class="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200"
            >
              Xem chi tiết →
            </router-link>
            <div class="flex space-x-2">
              <button
                @click="editGroup(group)"
                class="text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                title="Chỉnh sửa"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                @click="deleteGroup(group)"
                class="text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Xóa"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Trước
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Sau
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Hiển thị
            <span class="font-medium">{{ startIndex }}</span>
            đến
            <span class="font-medium">{{ endIndex }}</span>
            trong
            <span class="font-medium">{{ filteredGroups.length }}</span>
            kết quả
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fadeIn">
        <div class="p-6">
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="mt-4 text-center">
            <h3 class="text-lg font-medium text-gray-900">Xác nhận xóa nhóm</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa nhóm <strong class="text-gray-900">{{ groupToDelete?.groupName }}</strong>?
                Tất cả thành viên trong nhóm sẽ bị chuyển về nhóm mặc định.
              </p>
            </div>
          </div>
          <div class="mt-6 flex justify-center space-x-3">
            <button
              @click="confirmDelete"
              :disabled="deleteLoading"
              class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg v-if="deleteLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ deleteLoading ? 'Đang xóa...' : 'Xóa nhóm' }}
            </button>
            <button
              @click="cancelDelete"
              class="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

export default {
  name: 'GroupsView',
  setup() {
    const router = useRouter()

    // State
    const loading = ref(false)
    const deleteLoading = ref(false)
    const showDeleteModal = ref(false)
    const groupToDelete = ref(null)
    const openDropdown = ref(null)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(9)

    // Filters
    const filters = ref({
      authMethod: '',
      role: '',
      mfa: '',
      status: ''
    })

    // Mock data - replace with actual store data
    const groups = ref([
      {
        groupName: 'developers',
        authMethod: 'local',
        mfa: true,
        role: 'user',
        denyAccess: false,
        accessControl: ['192.168.1.0/24', '10.0.0.0/16']
      },
      {
        groupName: 'managers',
        authMethod: 'ldap',
        mfa: true,
        role: 'admin',
        denyAccess: false,
        accessControl: ['0.0.0.0/0']
      },
      {
        groupName: 'users',
        authMethod: 'local',
        mfa: false,
        role: 'user',
        denyAccess: false,
        accessControl: ['192.168.2.0/24']
      },
      {
        groupName: 'guests',
        authMethod: 'radius',
        mfa: false,
        role: 'user',
        denyAccess: true,
        accessControl: ['192.168.3.0/24']
      },
      {
        groupName: 'contractors',
        authMethod: 'ldap',
        mfa: true,
        role: 'user',
        denyAccess: false,
        accessControl: ['192.168.4.0/24', '172.16.0.0/16']
      }
    ])

    const users = ref([
      { username: 'john_doe', groupName: 'developers' },
      { username: 'jane_smith', groupName: 'managers' },
      { username: 'bob_wilson', groupName: 'users' },
      { username: 'alice_johnson', groupName: 'developers' },
      { username: 'charlie_brown', groupName: 'users' },
      { username: 'david_clark', groupName: 'contractors' }
    ])

    // Computed properties
    const totalGroups = computed(() => groups.value.length)
    const activeGroups = computed(() => groups.value.filter(g => !g.denyAccess).length)
    const mfaEnabledGroups = computed(() => groups.value.filter(g => g.mfa).length)
    const totalMembers = computed(() => {
      return groups.value.reduce((total, group) => {
        return total + getMemberCount(group.groupName)
      }, 0)
    })

    const filteredGroups = computed(() => {
      let filtered = [...groups.value]

      // Search filter
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        filtered = filtered.filter(group =>
          group.groupName.toLowerCase().includes(search)
        )
      }

      // Auth method filter
      if (filters.value.authMethod) {
        filtered = filtered.filter(group =>
          (group.authMethod || 'local') === filters.value.authMethod
        )
      }

      // Role filter
      if (filters.value.role) {
        filtered = filtered.filter(group => group.role === filters.value.role)
      }

      // MFA filter
      if (filters.value.mfa !== '') {
        const mfaValue = filters.value.mfa === 'true'
        filtered = filtered.filter(group => group.mfa === mfaValue)
      }

      // Status filter
      if (filters.value.status) {
        if (filters.value.status === 'active') {
          filtered = filtered.filter(group => !group.denyAccess)
        } else if (filters.value.status === 'blocked') {
          filtered = filtered.filter(group => group.denyAccess)
        }
      }

      return filtered
    })

    const paginatedGroups = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredGroups.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredGroups.value.length / itemsPerPage.value)
    })

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value + 1
    })

    const endIndex = computed(() => {
      return Math.min(currentPage.value * itemsPerPage.value, filteredGroups.value.length)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      
      let start = Math.max(1, current - 2)
      let end = Math.min(total, current + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    // Methods
    const loadGroups = async () => {
      loading.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        // In real app: await groupsStore.fetchGroups()
      } catch (error) {
        console.error('Failed to load groups:', error)
      } finally {
        loading.value = false
      }
    }

    const getMemberCount = (groupName) => {
      return users.value.filter(user => user.groupName === groupName).length
    }

    const toggleDropdown = (groupName) => {
      openDropdown.value = openDropdown.value === groupName ? null : groupName
    }

    const closeDropdown = () => {
      openDropdown.value = null
    }

    const editGroup = (group) => {
      closeDropdown()
      router.push(`/groups/${group.groupName}/edit`)
    }

    const duplicateGroup = async (group) => {
      closeDropdown()
      try {
        const newGroupName = `${group.groupName}_copy`
        const duplicatedGroup = {
          ...group,
          groupName: newGroupName
        }
        
        // Add to groups array (in real app: await groupsStore.createGroup(duplicatedGroup))
        groups.value.push(duplicatedGroup)
        
        console.log('Group duplicated successfully:', newGroupName)
      } catch (error) {
        console.error('Failed to duplicate group:', error)
      }
    }

    const deleteGroup = (group) => {
      closeDropdown()
      groupToDelete.value = group
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!groupToDelete.value) return

      deleteLoading.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Remove from groups array (in real app: await groupsStore.deleteGroup(groupToDelete.value.groupName))
        groups.value = groups.value.filter(g => g.groupName !== groupToDelete.value.groupName)
        
        showDeleteModal.value = false
        groupToDelete.value = null
        console.log('Group deleted successfully')
      } catch (error) {
        console.error('Failed to delete group:', error)
      } finally {
        deleteLoading.value = false
      }
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      groupToDelete.value = null
    }

    const debouncedSearch = debounce(() => {
      currentPage.value = 1
    }, 300)

    const applyFilters = () => {
      currentPage.value = 1
    }

    const clearFilters = () => {
      searchQuery.value = ''
      filters.value = {
        authMethod: '',
        role: '',
        mfa: '',
        status: ''
      }
      currentPage.value = 1
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    // Watch for filter changes
    watch(() => searchQuery.value, () => {
      currentPage.value = 1
    })

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

    // Lifecycle
    onMounted(() => {
      loadGroups()
    })

    return {
      // State
      loading,
      deleteLoading,
      showDeleteModal,
      groupToDelete,
      openDropdown,
      searchQuery,
      currentPage,
      itemsPerPage,
      filters,
      
      // Data
      groups,
      users,
      
      // Computed
      totalGroups,
      activeGroups,
      mfaEnabledGroups,
      totalMembers,
      filteredGroups,
      paginatedGroups,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      
      // Methods
      loadGroups,
      getMemberCount,
      toggleDropdown,
      closeDropdown,
      editGroup,
      duplicateGroup,
      deleteGroup,
      confirmDelete,
      cancelDelete,
      debouncedSearch,
      applyFilters,
      clearFilters,
      goToPage,
      previousPage,
      nextPage
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
/* Animation classes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

/* Card hover effects */
.hover\:shadow-lg:hover {
  transform: translateY(-4px);
  transition: all 0.3s ease;
}

/* Loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease;
}

.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .sm\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Custom scrollbar */
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

/* Focus styles for accessibility */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: #3b82f6;
}
</style>