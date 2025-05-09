<!-- src/views/auth/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-primary hover:text-primary-500">
            create a new account
          </router-link>
        </p>
      </div>

      <Alert v-if="errorMessage" variant="destructive">
        <AlertCircleIcon class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <Alert v-if="blockedMessage" variant="destructive">
        <LockIcon class="h-4 w-4" />
        <AlertTitle>Account Blocked</AlertTitle>
        <AlertDescription>{{ blockedMessage }}</AlertDescription>
      </Alert>

      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <Label for="email" class="sr-only">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              placeholder="Email address"
              class="rounded-t-md"
              :disabled="loading"
            />
          </div>
          <div>
            <Label for="password" class="sr-only">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="form.password"
              placeholder="Password"
              class="rounded-b-md"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Checkbox id="remember-me" v-model:checked="form.remember" :disabled="loading" />
            <Label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </Label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-primary hover:text-primary-500">
              Forgot your password?
            </router-link>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            class="w-full"
            :disabled="loading"
          >
            <Loader2Icon v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            Sign in
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
  AlertCircleIcon, LockIcon, Loader2Icon
} from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import authStore from '@/stores/auth';
import type { LoginCredentials } from '@/types/auth';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const blockedMessage = ref('');

const form = reactive<LoginCredentials>({
  email: '',
  password: '',
  remember: false
});

const login = async () => {
  loading.value = true;
  errorMessage.value = '';
  blockedMessage.value = '';

  try {
    await authStore.login(form);

    // Check if user is blocked
    if (authStore.state.user?.blocked === 'Y') {
      blockedMessage.value = 'Your account has been blocked due to too many failed login attempts. Please contact an administrator.';
      await authStore.logout();
      return;
    }

    // Redirect based on role
    if (authStore.state.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.response?.status === 429) {
      errorMessage.value = 'Too many login attempts. Please try again later.';
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Failed to login. Please check your credentials and try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>