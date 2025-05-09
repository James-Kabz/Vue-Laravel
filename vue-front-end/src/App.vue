<template>
  <router-view />
  <Toaster />
</template>

<script setup>
import { onMounted } from 'vue';
import authStore from './stores/auth';
import { Toaster } from './components/ui/sonner';

onMounted(async () => {
  // Check authentication status on app load
  await authStore.checkAuth();
});
</script>