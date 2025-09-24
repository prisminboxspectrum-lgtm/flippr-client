<template>
  <nav
    class="sticky top-0 z-40 w-full bg-gray-100 dark:bg-gray-800 py-2 shadow-sm"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-100 rounded-sm transition-colors duration-200"
        >
          Flippr
        </RouterLink>

        <!-- Right side -->
        <div class="flex items-center sm:space-x-4">
          <!-- Mobile menu toggle -->
          <button
            class="sm:hidden p-2 rounded"
            aria-label="Toggle navigation menu"
            @click="isOpen = !isOpen"
          >
            <Bars3Icon v-if="!isOpen" class="h-6 w-6 text-gray-700 dark:text-gray-200" />
            <XMarkIcon v-else class="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </button>

          <!-- Desktop nav links + dark mode -->
          <div
            class="hidden sm:flex items-center space-x-4 text-sm sm:text-base text-gray-700 dark:text-gray-300"
          >
            <RouterLink
              to="/dashboard"
              class="text-base text-gray-700 dark:text-gray-300 hover:underline"
            >
              Dashboard
            </RouterLink>

            <button
              class="text-base text-gray-700 dark:text-gray-300 hover:underline cursor-pointer"
              @click="logout"
            >
              Logout
            </button>

            <!-- Dark mode toggle -->
            <div
              class="flex items-center gap-3 ml-2 pl-4 border-l border-gray-300 dark:border-gray-600"
            >
              <button
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
                  isDark ? 'bg-blue-600' : 'bg-gray-300',
                ]"
                role="switch"
                :aria-checked="isDark"
                :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                @click="toggle"
              >
                <span class="sr-only">Toggle dark mode</span>
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out',
                    isDark ? 'translate-x-6' : 'translate-x-1',
                  ]"
                ></span>
              </button>
              <span class="font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile nav links + dark mode -->
      <div v-if="isOpen" class="sm:hidden mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <RouterLink to="/dashboard" class="block hover:underline"> Dashboard </RouterLink>
        <button
          class="block text-left w-full hover:underline text-gray-700 dark:text-gray-300 cursor-pointer"
          @click="logout"
        >
          Logout
        </button>

        <!-- Dark mode toggle - Mobile -->
        <div
          class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600"
        >
          <span class="font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
          <button
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
              isDark ? 'bg-blue-600' : 'bg-gray-300',
            ]"
            role="switch"
            :aria-checked="isDark"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggle"
          >
            <span class="sr-only">Toggle dark mode</span>
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out',
                isDark ? 'translate-x-6' : 'translate-x-1',
              ]"
            ></span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';

const isOpen = ref(false);
const { isDark, toggle } = useTheme();
const { logout } = useAuth();
</script>
