<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div class="text-center">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
      </div>

      <div v-if="loading" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="verified" class="bg-green-50 p-6 rounded-md text-center">
        <div class="flex justify-center">
          <CheckCircleIcon class="h-12 w-12 text-green-500" />
        </div>
        <h3 class="mt-4 text-lg font-medium text-green-800">
          Your email has been successfully verified!
        </h3>
        <p class="mt-2 text-sm text-green-600">You can now log in to your account.</p>
        <div class="mt-6">
          <button
            @click="goToLogin"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue to Login
          </button>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 p-6 rounded-md">
        <div class="flex justify-center">
          <XCircleIcon class="h-12 w-12 text-red-500" />
        </div>
        <h3 class="mt-4 text-lg font-medium text-red-800 text-center">Verification Failed</h3>
        <p class="mt-2 text-sm text-red-600 text-center">{{ error }}</p>

        <div v-if="showResendForm" class="mt-6">
          <h4 class="text-md font-medium text-gray-700 text-center">Resend Verification Email</h4>
          <form @submit.prevent="resendVerification" class="mt-4">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                type="email"
                v-model="email"
                placeholder="Enter your email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div class="mt-4">
              <button
                type="submit"
                :disabled="resendLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <RefreshCwIcon
                  v-if="resendLoading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                />
                {{ resendLoading ? 'Sending...' : 'Resend Verification Email' }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="resendSuccess" class="mt-4 bg-green-50 p-4 rounded-md">
          <p class="text-sm font-medium text-green-800 text-center">
            Verification email has been resent. Please check your inbox.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CheckCircleIcon, XCircleIcon, RefreshCwIcon } from 'lucide-vue-next'
import authStore from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const verified = ref(false)
const error = ref('')
const showResendForm = ref(false)
const email = ref('')
const resendLoading = ref(false)
const resendSuccess = ref(false)

const id = ref('')
const token = ref('')

onMounted(async () => {
  id.value = route.params.id
  token.value = route.params.token

  if (!id.value || !token.value) {
    error.value = 'Invalid verification link.'
    loading.value = false
    showResendForm.value = true
    return
  }

  try {
    await authStore.verifyEmail(id.value, token.value)
    verified.value = true
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Email verification failed. The link may be expired or invalid.'
    showResendForm.value = true
  } finally {
    loading.value = false
  }
})

const resendVerification = async () => {
  if (!email.value) return

  resendLoading.value = true
  resendSuccess.value = false

  try {
    await authStore.resendVerification(email.value)
    resendSuccess.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to resend verification email.'
  } finally {
    resendLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>
