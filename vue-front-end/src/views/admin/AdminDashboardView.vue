<!-- src/views/admin/AdminDashboardView.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">Admin Dashboard</h1>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Welcome to the Admin Dashboard</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">This is a protected area for administrators only.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p class="text-gray-700">You have access to all administrative functions.</p>
            </div>
          </div>

          <!-- Admin modules -->
          <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <UsersIcon class="h-6 w-6 text-white" />
                  </div>
                  <div class="ml-5">
                    <h3 class="text-lg font-medium text-gray-900">User Management</h3>
                    <p class="mt-1 text-sm text-gray-500">Manage users and their accounts</p>
                  </div>
                </div>
                <div class="mt-4">
                  <router-link to="/admin/users">
                    <Button class="w-full">Manage Users</Button>
                  </router-link>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <ShieldIcon class="h-6 w-6 text-white" />
                  </div>
                  <div class="ml-5">
                    <h3 class="text-lg font-medium text-gray-900">Role Management</h3>
                    <p class="mt-1 text-sm text-gray-500">Manage user roles and access levels</p>
                  </div>
                </div>
                <div class="mt-4">
                  <router-link to="/admin/roles">
                    <Button class="w-full">Manage Roles</Button>
                  </router-link>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <KeyIcon class="h-6 w-6 text-white" />
                  </div>
                  <div class="ml-5">
                    <h3 class="text-lg font-medium text-gray-900">Permission Management</h3>
                    <p class="mt-1 text-sm text-gray-500">Manage system permissions</p>
                  </div>
                </div>
                <div class="mt-4">
                  <router-link to="/admin/permissions">
                    <Button class="w-full">Manage Permissions</Button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,computed } from 'vue';
import Navbar from '@/components/layout/NavbarComp.vue';
import { Button } from '@/components/ui/button';
import { UsersIcon, ShieldIcon, KeyIcon } from 'lucide-vue-next';
import authStore from '@/stores/auth';
import type { User } from '@/types/auth';

const userData = ref<User | null>(null);
const user = computed(() => authStore.state.user);

onMounted(async () => {
  try {
    await authStore.checkAuth();

    // Create a mutable copy of the user object from the readonly state
    if (authStore.state.user) {
      userData.value = {
        ...authStore.state.user,
        // Convert readonly arrays to mutable arrays if needed
        roles: authStore.state.user.roles ? [...authStore.state.user.roles] : undefined
      };
    }

    console.log('User data:', userData.value);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
});

</script>