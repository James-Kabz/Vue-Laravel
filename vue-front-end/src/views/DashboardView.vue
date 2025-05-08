<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Welcome to your dashboard</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">This is a protected area for authenticated users.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p class="text-gray-700">You are logged in as a <span class="font-semibold">{{ role }}</span> user.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/layout/Navbar.vue';
import authStore from '../stores/auth';

const user = ref(authStore.state.user);
const role = ref(authStore.state.role);

onMounted(async () => {
  await authStore.checkAuth();
  user.value = authStore.state.user;
});
</script>
