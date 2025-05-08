<template>
    <nav class="bg-white shadow">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and primary nav -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl mr-10 font-bold text-indigo-600">Laravel Vue</router-link>
            </div>
            <div class="hidden sm:ml-6  sm:flex sm:space-x-8">
              <!-- Always visible links -->
              <router-link 
                to="/" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[
                  $route.path === '/' 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Home
              </router-link>
              
              <!-- Authenticated user links -->
              <template v-if="isAuthenticated">
                <router-link 
                  to="/dashboard" 
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  :class="[
                    $route.path === '/dashboard' 
                      ? 'border-indigo-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  ]"
                >
                  Dashboard
                </router-link>
                
                <!-- Admin-only links -->
                <router-link 
                  v-if="isAdmin"
                  to="/admin" 
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  :class="[
                    $route.path === '/admin' 
                      ? 'border-indigo-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  ]"
                >
                  Admin
                </router-link>
              </template>
            </div>
          </div>
          
          <!-- Secondary nav and mobile menu button -->
          <div class="flex items-center">
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <!-- Unauthenticated user links -->
              <div v-if="!isAuthenticated" class="flex space-x-4">
                <router-link 
                  to="/login" 
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                >
                  Log in
                </router-link>
                <router-link 
                  to="/register" 
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register
                </router-link>
              </div>
              
              <!-- User dropdown -->
              <div v-else class="ml-3 relative">
                <div>
                  <button 
                    @click="toggleUserMenu" 
                    class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span class="sr-only">Open user menu</span>
                    <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                      {{ userInitials }}
                    </div>
                  </button>
                </div>
                
                <!-- Dropdown menu -->
                <div 
                  v-if="userMenuOpen"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabindex="-1"
                >
                  <div class="block px-4 py-2 text-xs text-gray-400">
                    {{ userName }}
                  </div>
                  <router-link 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </router-link>
                  <button 
                    @click="handleLogout" 
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Mobile menu button -->
            <div class="flex items-center sm:hidden">
              <button 
                @click="toggleMobileMenu" 
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
                <MenuIcon v-if="!mobileMenuOpen" class="block h-6 w-6" />
                <XIcon v-else class="block h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            to="/" 
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="[
              $route.path === '/' 
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            ]"
          >
            Home
          </router-link>
          
          <template v-if="isAuthenticated">
            <router-link 
              to="/dashboard" 
              class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              :class="[
                $route.path === '/dashboard' 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              ]"
            >
              Dashboard
            </router-link>
            
            <router-link 
              v-if="isAdmin"
              to="/admin" 
              class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              :class="[
                $route.path === '/admin' 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              ]"
            >
              Admin
            </router-link>
          </template>
        </div>
        
        <!-- Mobile menu authentication links -->
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div v-if="isAuthenticated" class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                {{ userInitials }}
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ userName }}</div>
              <div class="text-sm font-medium text-gray-500">{{ userEmail }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <template v-if="isAuthenticated">
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Your Profile
              </router-link>
              <button 
                @click="handleLogout" 
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </template>
            <template v-else>
              <router-link 
                to="/login" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Log in
              </router-link>
              <router-link 
                to="/register" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { MenuIcon, XIcon } from 'lucide-vue-next';
  import authStore from '../../stores/auth';
  
  const router = useRouter();
  const mobileMenuOpen = ref(false);
  const userMenuOpen = ref(false);
  
  // Computed properties
  const isAuthenticated = computed(() => authStore.state.isAuthenticated);
  const isAdmin = computed(() => authStore.state.role === 'admin');
  const userName = computed(() => authStore.state.user?.name || 'User');
  const userEmail = computed(() => authStore.state.user?.email || '');
  const userInitials = computed(() => {
    const name = userName.value;
    if (!name) return 'U';
    
    const parts = name.split(' ');
    if (parts.length === 1) return name.charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });
  
  // Methods
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    if (mobileMenuOpen.value) userMenuOpen.value = false;
  };
  
  const toggleUserMenu = () => {
    userMenuOpen.value = !userMenuOpen.value;
  };
  
  const handleLogout = async () => {
    await authStore.logout();
    userMenuOpen.value = false;
    mobileMenuOpen.value = false;
    router.push('/');
  };
  
  // Close menus when clicking outside
  const closeMenus = (event) => {
    if (userMenuOpen.value && !event.target.closest('#user-menu-button')) {
      userMenuOpen.value = false;
    }
  };
  
  // Add event listener for clicks outside the menu
  if (typeof window !== 'undefined') {
    window.addEventListener('click', closeMenus);
  }
  </script>