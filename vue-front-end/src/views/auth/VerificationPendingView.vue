<!-- src/views/auth/VerificationPendingView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify Your Email
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          We've sent a verification link to your email address.
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="text-center mb-6">
          <MailIcon class="mx-auto h-12 w-12 text-primary" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">Verification Email Sent</h3>
          <p class="mt-1 text-sm text-gray-500">
            Please check your email ({{ email }}) and click the verification link to complete your registration.
          </p>
        </div>

        <Alert v-if="message" :variant="messageType">
          <AlertCircleIcon v-if="messageType === 'destructive'" class="h-4 w-4" />
          <CheckCircleIcon v-else class="h-4 w-4" />
          <AlertTitle>{{ messageType === 'destructive' ? 'Error' : 'Success' }}</AlertTitle>
          <AlertDescription>{{ message }}</AlertDescription>
        </Alert>

        <div class="mt-6 space-y-4">
          <Button
            @click="resendVerification"
            class="w-full"
            variant="outline"
            :disabled="loading || countdown > 0"
          >
            <Loader2Icon v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email' }}
          </Button>

          <Button
            @click="goToLogin"
            class="w-full"
            :disabled="!verified"
          >
            Continue to Login
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  MailIcon, AlertCircleIcon, CheckCircleIcon, Loader2Icon
} from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AuthService from '@/services/AuthService';

interface Props {
  email?: string;
}

const props = withDefaults(defineProps<Props>(), {
  email: ''
});

const router = useRouter();
const loading = ref<boolean>(false);
const message = ref<string>('');
const messageType = ref<'default' | 'destructive'>('default');
const verified = ref<boolean>(false);
const countdown = ref<number>(0);
let countdownTimer: number | null = null;

// Get email from localStorage if not provided as prop
const email = ref<string>(props.email || localStorage.getItem('pendingVerificationEmail') || '');

onMounted(() => {
  // Store email in localStorage for persistence
  if (email.value) {
    localStorage.setItem('pendingVerificationEmail', email.value);
  }
});

onUnmounted(() => {
  // Clear countdown timer when component is unmounted
  if (countdownTimer) {
    window.clearInterval(countdownTimer);
  }
});

const startCountdown = (seconds: number = 60): void => {
  countdown.value = seconds;

  if (countdownTimer) {
    window.clearInterval(countdownTimer);
  }

  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (countdownTimer) {
        window.clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }
  }, 1000);
};

const resendVerification = async (): Promise<void> => {
  if (!email.value) {
    message.value = 'Email address is missing. Please go back to registration.';
    messageType.value = 'destructive';
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    await AuthService.resendVerification(email.value);
    message.value = 'Verification email has been resent. Please check your inbox.';
    messageType.value = 'default';
    startCountdown();
  } catch (error: any) {
    console.error('Failed to resend verification email:', error);
    message.value = error.response?.data?.message || 'Failed to resend verification email. Please try again.';
    messageType.value = 'destructive';
  } finally {
    loading.value = false;
  }
};

const goToLogin = (): void => {
  localStorage.removeItem('pendingVerificationEmail');
  router.push('/login');
};

// Method to be called when verification is successful
const markAsVerified = (): void => {
  verified.value = true;
  message.value = 'Your email has been verified successfully. You can now proceed to login.';
  messageType.value = 'default';
};
</script>