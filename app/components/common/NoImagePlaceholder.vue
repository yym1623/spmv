<template>
  <div
    class="flex flex-col items-center justify-center gap-1.5 text-white/30 bg-white/5 rounded-lg"
    :class="aspectClass"
  >
    <Icon name="material-symbols:image-outline-rounded" class="w-8 h-8 md:w-10 md:h-10" />
    <span class="text-xs font-medium tracking-wide">이미지 없음</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** poster: 2/3, backdrop: video 등 */
    aspectClass?: string
  }>(),
  { aspectClass: 'aspect-[2/3]' }
)
</script>
