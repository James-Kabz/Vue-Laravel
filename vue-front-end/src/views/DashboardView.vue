<!-- src/views/DashboardView.vue -->
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
              <h3 class="text-lg leading-6 font-medium text-gray-900">User Information</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account information.</p>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Full name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ userData?.name }}</dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Email address</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ userData?.email }}</dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Role</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <Badge>{{ role || 'User' }}</Badge>
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Email verification</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <Badge :variant="userData?.email_verified_at ? 'default' : 'destructive'">
                      {{ userData?.email_verified_at ? 'Verified' : 'Not Verified' }}
                    </Badge>
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Account created</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(userData?.created_at) }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Navbar from '@/components/layout/NavbarComp.vue';
import { Badge } from '@/components/ui/badge';
import authStore from '@/stores/auth';
import type { User } from '@/types/auth';

// Use a separate ref for the user data to avoid readonly issues
const userData = ref<User | null>(null);
const role = computed(() => authStore.state.role);

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

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>