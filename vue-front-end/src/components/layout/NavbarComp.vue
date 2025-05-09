<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-primary">
              Vue Laravel Auth
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[$route.path === '/' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
            >
              Home
            </router-link>

            <template v-if="isAuthenticated">
              <router-link
                to="/dashboard"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[$route.path === '/dashboard' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                Dashboard
              </router-link>

              <template v-if="isAdmin">
                <router-link
                  to="/admin"
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  :class="[$route.path.startsWith('/admin') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                >
                  Admin
                </router-link>
              </template>
            </template>
          </div>
        </div>

        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <template v-if="isAuthenticated">
            <DropdownMenu>
              <DropdownMenuTrigger class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none">
                <span>{{ user?.name }}</span>
                <ChevronDownIcon class="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout">
                  <LogOutIcon class="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Register
            </router-link>
          </template>
        </div>

        <div class="-mr-2 flex items-center sm:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            <span class="sr-only">Open main menu</span>
            <MenuIcon v-if="!mobileMenuOpen" class="block h-6 w-6" />
            <XIcon v-else class="block h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[$route.path === '/' ? 'border-primary text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800']"
          @click="mobileMenuOpen = false"
        >
          Home
        </router-link>

        <template v-if="isAuthenticated">
          <router-link
            to="/dashboard"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="[$route.path === '/dashboard' ? 'border-primary text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800']"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </router-link>

          <template v-if="isAdmin">
            <router-link
              to="/admin"
              class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              :class="[$route.path.startsWith('/admin') ? 'border-primary text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800']"
              @click="mobileMenuOpen = false"
            >
              Admin
            </router-link>
          </template>
        </template>
      </div>

      <div class="pt-4 pb-3 border-t border-gray-200">
        <template v-if="isAuthenticated">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-lg font-medium text-gray-600">{{ userInitials }}</span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user?.name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </template>

        <template v-else>
          <div class="space-y-1 px-4">
            <router-link
              to="/login"
              class="block text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              @click="mobileMenuOpen = false"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="block text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              @click="mobileMenuOpen = false"
            >
              Register
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  MenuIcon, XIcon, ChevronDownIcon, LogOutIcon
} from 'lucide-vue-next';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import authStore from '@/stores/auth';
import type { User } from '@/types/auth';

const router = useRouter();
const route = useRoute();
const mobileMenuOpen = ref(false);

const isAuthenticated = computed(() => authStore.state.isAuthenticated);
const isAdmin = computed(() => authStore.state.role === 'admin');
const user = computed(() => authStore.state.user);

const userInitials = computed(() => {
  if (!user.value?.name) return '';
  return user.value.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

const logout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
    mobileMenuOpen.value = false;
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>