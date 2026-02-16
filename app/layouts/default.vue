<template>
  <div class="min-h-screen bg-primary flex flex-col">
    <LayoutAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>
