<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p class="mt-2 text-sm text-gray-700">
          Quản lý tài khoản người dùng VPN, thêm mới, chỉnh sửa và theo dõi trạng thái kết nối.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          to="/users/create"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Thêm người dùng
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tổng người dùng</dt>
                <dd class="text-lg font-medium text-gray-900">{{ totalUsers }}</dd>
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
                <dt class="text-sm font-medium text-gray-500 truncate">Đang hoạt động</dt>
                <dd class="text-lg font-medium text-gray-900">{{ activeUsers }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Đang online</dt>
                <dd class="text-lg font-medium text-gray-900">{{ onlineUsers }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <!-- Search -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Tìm kiếm</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Tìm theo username, email..."
                class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              v-model="filters.status"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              @change="loadUsers"
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="expired">Hết hạn</option>
              <option value="locked">Bị khóa</option>
            </select>
          </div>

          <!-- Group Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Nhóm</label>
            <select
              v-model="filters.group"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              @change="loadUsers"
            >
              <option value="">Tất cả nhóm</option>
              <option v-for="group in groups" :key="group.groupName" :value="group.groupName">
                {{ group.groupName }}
              </option>
            </select>
          </div>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedUsers.length > 0" class="mt-4 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center">
            <span class="text-sm font-medium text-blue-900">
              Đã chọn {{ selectedUsers.length }} người dùng
            </span>
          </div>
          <div class="flex space-x-2">
            <button
              @click="bulkAction('enable')"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
            >
              Kích hoạt
            </button>
            <button
              @click="bulkAction('disable')"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
            >
              Vô hiệu hóa
            </button>
            <button
              @click="bulkAction('delete')"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="p-8 text-center">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="paginatedUsers.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Không có người dùng</h3>
        <p class="mt-1 text-sm text-gray-500">Không tìm thấy người dùng nào với bộ lọc hiện tại.</p>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    :checked="allUsersSelected"
                    @change="toggleAllUsers"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sort('username')">
                  Username
                  <svg v-if="sortField === 'username'" class="inline ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
                  </svg>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhóm</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sort('status')">
                  Trạng thái
                  <svg v-if="sortField === 'status'" class="inline ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
                  </svg>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sort('lastLogin')">
                  Lần đăng nhập cuối
                  <svg v-if="sortField === 'lastLogin'" class="inline ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
                  </svg>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in paginatedUsers" :key="user.username" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    :value="user.username"
                    v-model="selectedUsers"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-blue-600">
                          {{ user.username.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                      <div class="text-sm text-gray-500">ID: {{ user.id || 'N/A' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email || 'Chưa có email' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="user.groupName" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ user.groupName }}
                  </span>
                  <span v-else class="text-sm text-gray-500">Chưa có nhóm</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(user)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <svg class="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                    {{ getStatusText(user) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.lastLogin ? formatDateTime(user.lastLogin) : 'Chưa từng đăng nhập' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <router-link
                      :to="`/users/${user.username}`"
                      class="text-blue-600 hover:text-blue-900"
                      title="Xem chi tiết"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </router-link>
                    <button
                      @click="editUser(user)"
                      class="text-indigo-600 hover:text-indigo-900"
                      title="Chỉnh sửa"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      @click="toggleUser(user)"
                      :class="user.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'"
                      :title="user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'"
                    >
                      <svg v-if="user.isActive" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span class="font-medium">{{ filteredUsers.length }}</span>
                kết quả
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
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
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Xác nhận xóa</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa người dùng <strong>{{ userToDelete?.username }}</strong>?
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="confirmDelete"
              :disabled="deleteLoading"
              class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 mr-2"
            >
              <span v-if="deleteLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xóa...
              </span>
              <span v-else>Xóa</span>
            </button>
            <button
              @click="cancelDelete"
              class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Hủy
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
import { useUsersStore } from '@/stores/users'
import { useGroupsStore } from '@/stores/groups'
import { formatDistanceToNow, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { debounce } from 'lodash'

export default {
  name: 'UsersView',
  setup() {
    const router = useRouter()
    const usersStore = useUsersStore()
    const groupsStore = useGroupsStore()

    // State
    const loading = ref(false)
    const deleteLoading = ref(false)
    const selectedUsers = ref([])
    const showDeleteModal = ref(false)
    const userToDelete = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const sortField = ref('username')
    const sortDirection = ref('asc')

    // Filters
    const filters = ref({
      search: '',
      status: '',
      group: ''
    })

    // Computed
    const users = computed(() => usersStore.users)
    const groups = computed(() => groupsStore.groups)
    
    const totalUsers = computed(() => users.value.length)
    const activeUsers = computed(() => users.value.filter(u => u.isActive && !isExpired(u)).length)
    const onlineUsers = computed(() => users.value.filter(u => u.isOnline).length)

    const filteredUsers = computed(() => {
      let filtered = [...users.value]

      // Search filter
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(user =>
          user.username.toLowerCase().includes(search) ||
          (user.email && user.email.toLowerCase().includes(search))
        )
      }

      // Status filter
      if (filters.value.status) {
        filtered = filtered.filter(user => {
          const status = getUserStatus(user)
          return status === filters.value.status
        })
      }

      // Group filter
      if (filters.value.group) {
        filtered = filtered.filter(user => user.groupName === filters.value.group)
      }

      // Sort
      filtered.sort((a, b) => {
        let aVal = a[sortField.value]
        let bVal = b[sortField.value]

        if (sortField.value === 'lastLogin') {
          aVal = aVal ? new Date(aVal) : new Date(0)
          bVal = bVal ? new Date(bVal) : new Date(0)
        }

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }

        if (sortDirection.value === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })

      return filtered
    })

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredUsers.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
    })

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value + 1
    })

    const endIndex = computed(() => {
      return Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length)
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

    const allUsersSelected = computed(() => {
      return paginatedUsers.value.length > 0 && 
             selectedUsers.value.length === paginatedUsers.value.length
    })

    // Methods
    const loadUsers = async () => {
      loading.value = true
      try {
        await usersStore.fetchUsers()
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        loading.value = false
      }
    }

    const loadGroups = async () => {
      try {
        await groupsStore.fetchGroups()
      } catch (error) {
        console.error('Failed to load groups:', error)
      }
    }

    const getUserStatus = (user) => {
      if (!user.isActive) return 'inactive'
      if (isExpired(user)) return 'expired'
      if (user.isLocked) return 'locked'
      return 'active'
    }

    const getStatusText = (user) => {
      const status = getUserStatus(user)
      const statusMap = {
        active: 'Hoạt động',
        inactive: 'Không hoạt động',
        expired: 'Hết hạn',
        locked: 'Bị khóa'
      }
      return statusMap[status] || 'Không xác định'
    }

    const getStatusClass = (user) => {
      const status = getUserStatus(user)
      const classMap = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        expired: 'bg-yellow-100 text-yellow-800',
        locked: 'bg-red-100 text-red-800'
      }
      return classMap[status] || 'bg-gray-100 text-gray-800'
    }

    const isExpired = (user) => {
      if (!user.expirationDate) return false
      return new Date(user.expirationDate) < new Date()
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi })
    }

    const sort = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortDirection.value = 'asc'
      }
    }

    const toggleAllUsers = (event) => {
      if (event.target.checked) {
        selectedUsers.value = paginatedUsers.value.map(user => user.username)
      } else {
        selectedUsers.value = []
      }
    }

    const editUser = (user) => {
      router.push(`/users/${user.username}/edit`)
    }

    const toggleUser = async (user) => {
      try {
        await usersStore.updateUser(user.username, {
          isActive: !user.isActive
        })
        // Reload users to get updated data
        await loadUsers()
      } catch (error) {
        console.error('Failed to toggle user:', error)
      }
    }

    const deleteUser = (user) => {
      userToDelete.value = user
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!userToDelete.value) return

      deleteLoading.value = true
      try {
        await usersStore.deleteUser(userToDelete.value.username)
        await loadUsers()
        showDeleteModal.value = false
        userToDelete.value = null
      } catch (error) {
        console.error('Failed to delete user:', error)
      } finally {
        deleteLoading.value = false
      }
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      userToDelete.value = null
    }

    const bulkAction = async (action) => {
      if (selectedUsers.value.length === 0) return

      try {
        switch (action) {
          case 'enable':
            await usersStore.bulkUpdateUsers(selectedUsers.value, { isActive: true })
            break
          case 'disable':
            await usersStore.bulkUpdateUsers(selectedUsers.value, { isActive: false })
            break
          case 'delete':
            await usersStore.bulkDeleteUsers(selectedUsers.value)
            break
        }
        
        selectedUsers.value = []
        await loadUsers()
      } catch (error) {
        console.error('Bulk action failed:', error)
      }
    }

    const debouncedSearch = debounce(() => {
      currentPage.value = 1
    }, 300)

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
    watch(() => filters.value.status, () => {
      currentPage.value = 1
    })

    watch(() => filters.value.group, () => {
      currentPage.value = 1
    })

    // Lifecycle
    onMounted(() => {
      loadUsers()
      loadGroups()
    })

    return {
      // State
      loading,
      deleteLoading,
      selectedUsers,
      showDeleteModal,
      userToDelete,
      currentPage,
      itemsPerPage,
      sortField,
      sortDirection,
      filters,
      
      // Computed
      users,
      groups,
      totalUsers,
      activeUsers,
      onlineUsers,
      filteredUsers,
      paginatedUsers,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      allUsersSelected,
      
      // Methods
      loadUsers,
      getUserStatus,
      getStatusText,
      getStatusClass,
      formatDateTime,
      sort,
      toggleAllUsers,
      editUser,
      toggleUser,
      deleteUser,
      confirmDelete,
      cancelDelete,
      bulkAction,
      debouncedSearch,
      goToPage,
      previousPage,
      nextPage
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation for row hover */
tbody tr {
  transition: background-color 0.2s ease;
}

/* Loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>