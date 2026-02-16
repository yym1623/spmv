<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <CommonToastContainer />
</template>

<script setup lang="ts">
const authStore = useAuthStore()
authStore.init()
</script>
