<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot Password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <Alert v-if="message" :variant="messageType">
        <AlertCircleIcon v-if="messageType === 'destructive'" class="h-4 w-4" />
        <CheckCircleIcon v-else class="h-4 w-4" />
        <AlertTitle>{{ messageType === 'destructive' ? 'Error' : 'Success' }}</AlertTitle>
        <AlertDescription>{{ message }}</AlertDescription>
      </Alert>

      <form class="mt-8 space-y-6" @submit.prevent="sendResetLink">
        <div>
          <Label for="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            v-model="email"
            placeholder="Enter your email address"
            class="mt-1"
            :disabled="loading || emailSent"
          />
        </div>

        <div>
          <Button
            type="submit"
            class="w-full"
            :disabled="loading || emailSent"
          >
            <Loader2Icon v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ emailSent ? 'Email Sent' : 'Send Reset Link' }}
          </Button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="font-medium text-primary hover:text-primary-500">
            Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  AlertCircleIcon, CheckCircleIcon, Loader2Icon
} from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthService from '@/services/AuthService';

const email = ref<string>('');
const loading = ref<boolean>(false);
const emailSent = ref<boolean>(false);
const message = ref<string>('');
const messageType = ref<'default' | 'destructive'>('default');

const sendResetLink = async (): Promise<void> => {
  if (!email.value.trim()) {
    message.value = 'Please enter your email address.';
    messageType.value = 'destructive';
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    await AuthService.forgotPassword(email.value);
    emailSent.value = true;
    message.value = 'Password reset link has been sent to your email address.';
    messageType.value = 'default';
  } catch (error: any) {
    console.error('Failed to send reset link:', error);
    message.value = error.response?.data?.message || 'Failed to send reset link. Please try again.';
    messageType.value = 'destructive';
  } finally {
    loading.value = false;
  }
};
</script>