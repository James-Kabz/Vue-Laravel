<!-- src/views/auth/ResetPasswordView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <Alert v-if="message" :variant="messageType">
        <AlertCircleIcon v-if="messageType === 'destructive'" class="h-4 w-4" />
        <CheckCircleIcon v-else class="h-4 w-4" />
        <AlertTitle>{{ messageType === 'destructive' ? 'Error' : 'Success' }}</AlertTitle>
        <AlertDescription>{{ message }}</AlertDescription>
      </Alert>

      <form class="mt-8 space-y-6" @submit.prevent="resetPassword">
        <div>
          <Label for="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            v-model="form.email"
            placeholder="Enter your email address"
            class="mt-1"
            :disabled="loading || resetComplete"
          />
        </div>

        <div>
          <Label for="password">New Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            v-model="form.password"
            placeholder="Enter your new password"
            class="mt-1"
            :disabled="loading || resetComplete"
          />
        </div>

        <div>
          <Label for="password_confirmation">Confirm New Password</Label>
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            autocomplete="new-password"
            required
            v-model="form.password_confirmation"
            placeholder="Confirm your new password"
            class="mt-1"
            :disabled="loading || resetComplete"
          />
        </div>

        <div>
          <Button
            type="submit"
            class="w-full"
            :disabled="loading || resetComplete"
          >
            <Loader2Icon v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ resetComplete ? 'Password Reset' : 'Reset Password' }}
          </Button>
        </div>

        <div v-if="resetComplete" class="text-center">
          <Button variant="outline" class="w-full" @click="goToLogin">
            Go to Login
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  AlertCircleIcon, CheckCircleIcon, Loader2Icon
} from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthService from '@/services/AuthService';
import type { ResetPasswordData } from '@/types/auth';

interface Props {
  token: string;
}

const props = defineProps<Props>();
const router = useRouter();

const loading = ref<boolean>(false);
const resetComplete = ref<boolean>(false);
const message = ref<string>('');
const messageType = ref<'default' | 'destructive'>('default');

const form = reactive<ResetPasswordData>({
  email: '',
  password: '',
  password_confirmation: '',
  token: props.token
});

const resetPassword = async (): Promise<void> => {
  if (form.password !== form.password_confirmation) {
    message.value = 'Passwords do not match.';
    messageType.value = 'destructive';
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    await AuthService.resetPassword(form);
    resetComplete.value = true;
    message.value = 'Your password has been reset successfully.';
    messageType.value = 'default';
  } catch (error: any) {
    console.error('Failed to reset password:', error);

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = [];

      if (errors.email) errorMessages.push(errors.email[0]);
      if (errors.password) errorMessages.push(errors.password[0]);
      if (errors.token) errorMessages.push(errors.token[0]);

      message.value = errorMessages.join(' ') || 'Failed to reset password. Please try again.';
    } else {
      message.value = error.response?.data?.message || 'Failed to reset password. Please try again.';
    }

    messageType.value = 'destructive';
  } finally {
    loading.value = false;
  }
};

const goToLogin = (): void => {
  router.push('/login');
};
</script>