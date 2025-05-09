<!-- src/views/auth/VerifyEmailView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <div v-if="loading" class="text-center py-8">
          <Loader2Icon class="mx-auto h-8 w-8 animate-spin text-primary" />
          <p class="mt-2 text-sm text-gray-500">Verifying your email...</p>
        </div>

        <div v-else-if="verified" class="text-center py-4">
          <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">Email Verified</h3>
          <p class="mt-1 text-sm text-gray-500">
            Your email has been verified successfully.
          </p>
          <Button @click="goToLogin" class="mt-4">
            Continue to Login
          </Button>
        </div>

        <div v-else class="text-center py-4">
          <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">Verification Failed</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ errorMessage }}
          </p>
          <div class="mt-4 space-y-2">
            <Button @click="goToVerificationPending" variant="outline" class="w-full">
              Resend Verification Email
            </Button>
            <Button @click="goToLogin" class="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Loader2Icon, CheckCircleIcon, XCircleIcon
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import AuthService from '@/services/AuthService';

interface Props {
  id: string;
  token: string;
}

const props = defineProps<Props>();
const router = useRouter();

const loading = ref<boolean>(true);
const verified = ref<boolean>(false);
const errorMessage = ref<string>('The verification link is invalid or has expired.');

onMounted(async () => {
  try {
    await AuthService.verifyEmail(props.id, props.token);
    verified.value = true;
  } catch (error: any) {
    console.error('Email verification failed:', error);
    errorMessage.value = error.response?.data?.message || 'The verification link is invalid or has expired.';
  } finally {
    loading.value = false;
  }
});

const goToLogin = (): void => {
  router.push('/login');
};

const goToVerificationPending = (): void => {
  router.push('/verification-pending');
};
</script>