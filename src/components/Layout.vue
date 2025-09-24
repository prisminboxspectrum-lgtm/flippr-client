<template>
  <div>
    <Navbar />
    <div class="min-h-[calc(100svh-52px)] overflow-x-hidden">
      <div class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <main role="main" aria-label="Main content"><slot></slot></main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
</script>
