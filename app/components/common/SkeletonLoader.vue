<template>
  <div
    class="animate-pulse-skeleton rounded-lg"
    :class="[sizeClasses, props.class]"
    :style="{ backgroundColor: 'rgba(255,255,255,0.08)' }"
  />
</template>

<script setup lang="ts">
interface Props {
  variant?: 'poster' | 'backdrop' | 'text' | 'circle' | 'card' | 'custom'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'poster',
  class: '',
})

const sizeClasses = computed(() => {
  switch (props.variant) {
    case 'poster':
      return 'w-full aspect-[2/3]'
    case 'backdrop':
      return 'w-full aspect-video'
    case 'text':
      return 'h-4 w-full'
    case 'circle':
      return 'w-12 h-12 rounded-full'
    case 'card':
      return 'w-full h-48'
    case 'custom':
      return ''
    default:
      return ''
  }
})
</script>
