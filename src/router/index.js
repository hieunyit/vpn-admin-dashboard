import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Auth Views
import LoginView from '@/views/auth/LoginView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'

// Dashboard Views
import DashboardView from '@/views/dashboard/DashboardView.vue'
import UsersView from '@/views/users/UsersView.vue'
import UserDetailView from '@/views/users/UserDetailView.vue'
import CreateUserView from '@/views/users/CreateUserView.vue'
import GroupsView from '@/views/groups/GroupsView.vue'
import GroupDetailView from '@/views/groups/GroupDetailView.vue'
import CreateGroupView from '@/views/groups/CreateGroupView.vue'
import ConnectionsView from '@/views/connections/ConnectionsView.vue'
import LogsView from '@/views/logs/LogsView.vue'
import SettingsView from '@/views/settings/SettingsView.vue'

// Error Views
import NotFoundView from '@/views/errors/NotFoundView.vue'
import ServerErrorView from '@/views/errors/ServerErrorView.vue'

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
        meta: { title: 'Đăng nhập' }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordView,
        meta: { title: 'Quên mật khẩu' }
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: ResetPasswordView,
        meta: { title: 'Đặt lại mật khẩu' }
      }
    ]
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { 
          title: 'Dashboard',
          icon: 'chart-bar'
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: UsersView,
        meta: { 
          title: 'Quản lý người dùng',
          icon: 'users',
          permissions: ['users.view']
        }
      },
      {
        path: 'users/create',
        name: 'CreateUser',
        component: CreateUserView,
        meta: { 
          title: 'Tạo người dùng mới',
          permissions: ['users.create']
        }
      },
      {
        path: 'users/:username',
        name: 'UserDetail',
        component: UserDetailView,
        meta: { 
          title: 'Chi tiết người dùng',
          permissions: ['users.view']
        },
        props: true
      },
      {
        path: 'groups',
        name: 'Groups',
        component: GroupsView,
        meta: { 
          title: 'Quản lý nhóm',
          icon: 'user-group',
          permissions: ['groups.view']
        }
      },
      {
        path: 'groups/create',
        name: 'CreateGroup',
        component: CreateGroupView,
        meta: { 
          title: 'Tạo nhóm mới',
          permissions: ['groups.create']
        }
      },
      {
        path: 'groups/:groupName',
        name: 'GroupDetail',
        component: GroupDetailView,
        meta: { 
          title: 'Chi tiết nhóm',
          permissions: ['groups.view']
        },
        props: true
      },
      {
        path: 'connections',
        name: 'Connections',
        component: ConnectionsView,
        meta: { 
          title: 'Kết nối VPN',
          icon: 'globe-alt',
          permissions: ['connections.view']
        }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: LogsView,
        meta: { 
          title: 'Nhật ký hệ thống',
          icon: 'document-text',
          permissions: ['logs.view']
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsView,
        meta: { 
          title: 'Cài đặt',
          icon: 'cog',
          permissions: ['settings.manage']
        }
      }
    ]
  },
  {
    path: '/error',
    name: 'ServerError',
    component: ServerErrorView,
    meta: { title: 'Lỗi máy chủ' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: 'Không tìm thấy trang' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - VPN Admin` : 'VPN Admin Dashboard'
  
  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check guest routes (redirect authenticated users)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }
  
  // Check permissions
  if (to.meta.permissions && !authStore.hasPermissions(to.meta.permissions)) {
    next({ name: 'NotFound' })
    return
  }
  
  next()
})

export default router