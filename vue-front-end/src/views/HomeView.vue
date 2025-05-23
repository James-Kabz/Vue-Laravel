<template>
  <div class="bg-white">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <div class="relative bg-white overflow-hidden">
      <div class="mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div class="relative pt-6 px-4 sm:px-6 lg:px-8">
            <!-- Navbar is already included above -->
          </div>

          <main class="mt-10 mx-auto px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Welcome to</span>
                <span class="block text-indigo-600 xl:inline">Our Platform</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                A secure and powerful platform with authentication, role-based access control, and email verification.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <router-link to="/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    Get started
                  </router-link>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <router-link to="/login" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                    Sign in
                  </router-link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80" alt="Team working on laptops">
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need
          </p>
          <p class="mt-4 text-xl text-gray-500 lg:mx-auto">
            Our platform provides a comprehensive set of features to help you build secure applications.
          </p>
        </div>

        <div class="mt-20">
          <dl class="space-y-20 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div class="relative">
              <dt>
                <div class="relative flex items-center justify-center ml-20 h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <LockIcon class="h-6 w-6" />
                </div>
                <p class=" text-lg leading-6 font-medium text-gray-900">Secure Authentication</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Robust authentication system with email verification and password reset functionality.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="relative flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <ShieldIcon class="h-6 w-6" />
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Role-Based Access</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Granular control over user permissions with role-based access control.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="relative flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <MailIcon class="h-6 w-6" />
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Email Verification</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Ensure user authenticity with email verification before account activation.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="relative flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <RefreshCwIcon class="h-6 w-6" />
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Password Recovery</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Simple and secure password reset process for users who forget their credentials.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-indigo-50">
      <div class="mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span class="block">Ready to dive in?</span>
          <span class="block text-indigo-600">Start your journey today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <router-link to="/register" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Get started
            </router-link>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <router-link to="/login" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
              Sign in
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white">
      <div class="mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p class="mt-8 text-center text-base text-gray-400">
          &copy; 2023 Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { LockIcon, ShieldIcon, MailIcon, RefreshCwIcon } from 'lucide-vue-next';
import Navbar from '../components/layout/NavbarComp.vue';
</script>