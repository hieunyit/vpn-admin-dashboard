<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-800/20"></div>
    
    <!-- Login Form -->
    <div class="relative z-10 max-w-md w-full space-y-8 p-8">
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <!-- Header -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-white mb-2">VPN Admin</h2>
          <p class="text-blue-100">Đăng nhập vào hệ thống quản lý</p>
        </div>

        <!-- Alert -->
        <div v-if="error" class="mt-6 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg">
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>
        </div>

        <div v-if="success" class="mt-6 bg-green-500/20 border border-green-500/50 text-green-100 px-4 py-3 rounded-lg">
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ success }}
          </div>
        </div>

        <!-- Rate Limit Warning -->
        <div v-if="authStore.isRateLimited()" class="mt-6 bg-yellow-500/20 border border-yellow-500/50 text-yellow-100 px-4 py-3 rounded-lg">
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau {{ remainingTime }} giây.
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
          <div class="space-y-4">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <input
                  v-model="form.username"
                  type="text"
                  required
                  class="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Nhập username"
                  :disabled="loading || authStore.isRateLimited()"
                  autocomplete="username"
                />
              </div>
              <span v-if="errors.username" class="text-red-300 text-sm mt-1">{{ errors.username }}</span>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Mật khẩu
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="block w-full pl-10 pr-10 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Nhập mật khẩu"
                  :disabled="loading || authStore.isRateLimited()"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  :disabled="loading"
                >
                  <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-white transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400 hover:text-white transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <span v-if="errors.password" class="text-red-300 text-sm mt-1">{{ errors.password }}</span>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/10"
                :disabled="loading"
              />
              <label class="ml-2 block text-sm text-white">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <router-link
              to="/auth/forgot-password"
              class="text-sm text-blue-300 hover:text-blue-200 transition duration-200"
            >
              Quên mật khẩu?
            </router-link>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || authStore.isRateLimited() || !isFormValid"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-105"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang đăng nhập...
            </span>
            <span v-else-if="authStore.isRateLimited()">
              Đã bị khóa ({{ remainingTime }}s)
            </span>
            <span v-else>
              Đăng nhập
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center">
          <p class="text-sm text-blue-100">
            VPN Admin Dashboard v1.0.0
          </p>
          <p class="text-xs text-blue-200 mt-1">
            © 2024 - Bảo mật và đáng tin cậy
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    // Form data
    const form = ref({
      username: '',
      password: '',
      rememberMe: false
    })

    const showPassword = ref(false)
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const errors = ref({})
    const remainingTime = ref(0)
    let countdownInterval = null

    // Computed
    const isFormValid = computed(() => {
      return form.value.username.trim() && form.value.password.trim()
    })

    // Methods
    const validateForm = () => {
      errors.value = {}
      
      if (!form.value.username.trim()) {
        errors.value.username = 'Username là bắt buộc'
      }
      
      if (!form.value.password.trim()) {
        errors.value.password = 'Mật khẩu là bắt buộc'
      } else if (form.value.password.length < 6) {
        errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      }
      
      return Object.keys(errors.value).length === 0
    }

    const handleLogin = async () => {
      error.value = ''
      success.value = ''
      
      if (!validateForm()) {
        return
      }

      loading.value = true

      try {
        await authStore.login({
          username: form.value.username.trim(),
          password: form.value.password,
          remember_me: form.value.rememberMe
        })

        success.value = 'Đăng nhập thành công! Đang chuyển hướng...'
        
        setTimeout(() => {
          const redirectPath = route.query.redirect || '/dashboard'
          router.push(redirectPath)
        }, 1000)

      } catch (err) {
        error.value = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
        
        // Clear password on error
        form.value.password = ''
        
        // Focus username field if empty, otherwise focus password
        setTimeout(() => {
          const usernameField = document.querySelector('input[type="text"]')
          const passwordField = document.querySelector('input[type="password"]')
          
          if (!form.value.username.trim() && usernameField) {
            usernameField.focus()
          } else if (passwordField) {
            passwordField.focus()
          }
        }, 100)
      } finally {
        loading.value = false
      }
    }

    const updateRemainingTime = () => {
      remainingTime.value = authStore.getRemainingLockoutTime()
      
      if (remainingTime.value <= 0 && countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    }

    const startCountdown = () => {
      if (authStore.isRateLimited()) {
        updateRemainingTime()
        countdownInterval = setInterval(updateRemainingTime, 1000)
      }
    }

    // Lifecycle
    onMounted(() => {
      // Focus first input
      setTimeout(() => {
        const firstInput = document.querySelector('input[type="text"]')
        if (firstInput) {
          firstInput.focus()
        }
      }, 100)

      // Start countdown if rate limited
      startCountdown()

      // Check for success message from password reset
      if (route.query.resetSuccess) {
        success.value = 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.'
      }
    })

    onUnmounted(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    })

    return {
      form,
      showPassword,
      loading,
      error,
      success,
      errors,
      remainingTime,
      isFormValid,
      authStore,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white\/10 {
  animation: fadeInUp 0.6s ease-out;
}

/* Input focus effects */
input:focus {
  transform: translateY(-1px);
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* Backdrop blur fallback */
@supports not (backdrop-filter: blur(10px)) {
  .backdrop-blur-lg {
    background-color: rgba(255, 255, 255, 0.15);
  }
}
</style>