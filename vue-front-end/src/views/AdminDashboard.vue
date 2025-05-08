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

          <!-- Admin-specific content would go here -->
          <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">User Management</h3>
                <p class="mt-1 text-sm text-gray-500">Manage users, roles, and permissions</p>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">System Settings</h3>
                <p class="mt-1 text-sm text-gray-500">Configure application settings</p>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">Analytics</h3>
                <p class="mt-1 text-sm text-gray-500">View system analytics and reports</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/layout/NavbarComp.vue';
import authStore from '../stores/auth';

const user = ref(authStore.state.user);

onMounted(async () => {
  await authStore.checkAuth();
  user.value = authStore.state.user;
});
</script>
