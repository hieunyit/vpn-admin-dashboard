<template>
  <div class="min-h-screen flex">
    <!-- Left side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="absolute inset-0 bg-pattern"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-12 text-white">
        <div class="mb-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h1 class="text-3xl font-bold">VPN Admin</h1>
          </div>
          <h2 class="text-4xl font-bold mb-4">
            Quản lý VPN
            <span class="block text-blue-200">an toàn & hiệu quả</span>
          </h2>
          <p class="text-xl text-blue-100 leading-relaxed">
            Hệ thống quản lý VPN hiện đại với giao diện trực quan, 
            bảo mật cao và tính năng toàn diện.
          </p>
        </div>

        <!-- Features -->
        <div class="space-y-4">
          <div class="flex items-center text-blue-100">
            <svg class="w-5 h-5 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Quản lý người dùng và nhóm dễ dàng</span>
          </div>
          <div class="flex items-center text-blue-100">
            <svg class="w-5 h-5 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Theo dõi kết nối real-time</span>
          </div>
          <div class="flex items-center text-blue-100">
            <svg class="w-5 h-5 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Bảo mật với JWT và MFA</span>
          </div>
          <div class="flex items-center text-blue-100">
            <svg class="w-5 h-5 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Thống kê và báo cáo chi tiết</span>
          </div>
        </div>

        <!-- Version info -->
        <div class="mt-12 pt-8 border-t border-white/20">
          <p class="text-sm text-blue-200">
            VPN Admin Dashboard v1.0.0
          </p>
          <p class="text-xs text-blue-300 mt-1">
            Powered by Vue 3 + Tailwind CSS
          </p>
        </div>
      </div>
    </div>

    <!-- Right side - Form -->
    <div class="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 bg-gray-50">
      <div class="w-full max-w-md mx-auto">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">VPN Admin</h1>
        </div>

        <!-- Router view - Auth pages content -->
        <router-view />

        <!-- Footer links -->
        <div class="mt-8 text-center">
          <div class="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" class="hover:text-gray-700 transition-colors duration-200">
              Trợ giúp
            </a>
            <a href="#" class="hover:text-gray-700 transition-colors duration-200">
              Điều khoản
            </a>
            <a href="#" class="hover:text-gray-700 transition-colors duration-200">
              Bảo mật
            </a>
          </div>
          <p class="mt-4 text-xs text-gray-400">
            © 2024 VPN Admin Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
/* Background pattern */
.bg-pattern {
  background-image: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>');
}

/* Custom animations for the branding side */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.lg\:flex:first-child {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .lg\:w-1\/2 {
    display: none;
  }
}

/* Background animation */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>