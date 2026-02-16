<template>
  <div>
    <!-- Skeleton -->
    <div v-if="loading" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
      <CommonSkeletonLoader v-for="i in 18" :key="i" variant="poster" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!items?.length"
      class="flex flex-col items-center justify-center py-20 text-white/50"
    >
      <Icon name="material-symbols:movie-outline" class="w-16 h-16 mb-4" />
      <p class="text-lg">{{ emptyText }}</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
      <CommonMovieCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @click="$emit('select', item)"
      />
    </div>

    <!-- Infinite scroll sentinel -->
    <div ref="sentinel" class="h-10" />
  </div>
</template>

<script setup lang="ts">
import type { MovieItem } from '~/types/tmdb'

interface Props {
  items: MovieItem[]
  loading?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: '검색된 결과가 없습니다',
})

const emit = defineEmits<{
  select: [item: MovieItem]
  loadMore: []
}>()

const sentinel = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!sentinel.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          emit('loadMore')
        }
      })
    },
    { rootMargin: '200px' }
  )

  observer.observe(sentinel.value)

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})
</script>
