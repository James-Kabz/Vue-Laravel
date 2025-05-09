<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </router-link>
        </p>
      </div>

      <!-- User blocked message -->
      <div v-if="userBlocked" class="bg-red-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <ShieldAlertIcon class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Account blocked</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>
                Your account has been blocked due to too many failed login attempts.
                Please contact the administrator for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Email verification message -->
      <div v-else-if="needsVerification" class="bg-yellow-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <TriangleAlertIcon class="h-5 w-5 text-yellow-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-yellow-800">
              Please verify your email address before logging in.
            </p>
            <div class="mt-2">
              <button
                @click="resendVerificationEmail"
                :disabled="resendLoading"
                class="text-sm font-medium text-yellow-800 underline"
              >
                {{ resendLoading ? 'Sending...' : 'Resend verification email' }}
              </button>
            </div>
            <div v-if="resendSuccess" class="mt-2 text-sm text-green-600">
              Verification email has been sent. Please check your inbox.
            </div>
          </div>
        </div>
      </div>

      <!-- General error message -->
      <div v-else-if="errorMessage" class="bg-red-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || userBlocked"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
            </span>
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { LockIcon, XCircleIcon, ShieldAlertIcon, TriangleAlertIcon } from 'lucide-vue-next';
import authStore from '../stores/auth';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const needsVerification = ref(false);
const userBlocked = ref(false);
const resendLoading = ref(false);
const resendSuccess = ref(false);

const form = reactive({
  email: '',
  password: '',
  remember: false
});

onMounted(() => {
  // Initialize refs to avoid conditional hook calls
  loading.value = false;
  errorMessage.value = '';
  needsVerification.value = false;
  userBlocked.value = false;
  resendLoading.value = false;
  resendSuccess.value = false;
});

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  needsVerification.value = false;
  userBlocked.value = false;

  try {
    const response = await authStore.login(form);

    // Redirect based on role
    if (response?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);

    // Store email for verification resend
    localStorage.setItem('pendingVerificationEmail', form.email);

    // Check specific error types based on your backend exceptions
    if (error.response?.data?.message?.includes('blocked') ||
        error.response?.data?.message?.includes('Account is blocked')) {
      userBlocked.value = true;
    }
    else if (error.response?.data?.message?.includes('verify') ||
             error.response?.data?.message?.includes('Please verify your email')) {
      needsVerification.value = true;
    }
    else {
      errorMessage.value = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
    }
  } finally {
    loading.value = false;
  }
};

const resendVerificationEmail = async () => {
  resendLoading.value = true;
  resendSuccess.value = false;

  try {
    await authStore.resendVerification(form.email);
    resendSuccess.value = true;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to resend verification email.';
    needsVerification.value = false;
  } finally {
    resendLoading.value = false;
  }
};
</script>