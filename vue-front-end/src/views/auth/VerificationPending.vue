<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div class="text-center">
        <MailIcon class="mx-auto h-12 w-12 text-indigo-600" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Please verify your email
        </h2>
      </div>

      <div class="text-center">
        <p class="mt-2 text-sm text-gray-600">You're almost there! We sent an email to</p>
        <p class="font-medium text-indigo-600">{{ email }}</p>
        <p class="mt-2 text-sm text-gray-600">
          Just click on the link in that email to complete your signup.
        </p>
        <p class="mt-2 text-sm text-gray-600">
          If you don't see it, you may need to check your spam folder.
        </p>
      </div>

      <div v-if="resendSuccess" class="bg-green-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-5 w-5 text-green-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">Verification email has been resent!</p>
          </div>
        </div>
      </div>

      <div v-if="resendError" class="bg-red-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ resendError }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">Still can't find the email?</p>
        <button
          @click="resendVerificationEmail"
          :disabled="resendLoading"
          class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <RefreshCwIcon v-if="resendLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
          <span v-if="resendLoading">Resending...</span>
          <span v-else>Resend Email</span>
        </button>
      </div>

      <div class="mt-6 text-center">
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Back to login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MailIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon } from 'lucide-vue-next'
import authStore from '@/stores/auth'

const email = ref('')
const resendLoading = ref(false)
const resendSuccess = ref(false)
const resendError = ref('')

onMounted(() => {
  // Get the email from localStorage
  email.value = localStorage.getItem('pendingVerificationEmail') || ''
})

const resendVerificationEmail = async () => {
  if (!email.value) return

  resendLoading.value = true
  resendSuccess.value = false
  resendError.value = ''

  try {
    const response = await authStore.resendVerification(email.value)

    // Check for success based on your API response format
    if (response.success) {
      resendSuccess.value = true
    } else {
      resendError.value = response.message || 'Failed to resend verification email.'
    }
  } catch (error) {
    resendError.value =
      error.response?.data?.message || 'Failed to resend verification email. Please try again.'
  } finally {
    resendLoading.value = false
  }
}
</script>
