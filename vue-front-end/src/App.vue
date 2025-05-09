<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import authStore from './stores/auth'

onMounted(async () => {
  // Check authentication status on app load
  await authStore.checkAuth()
})
</script>
