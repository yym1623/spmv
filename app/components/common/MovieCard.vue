<template>
  <div
    class="group relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
    @click="$emit('click', item)"
  >
    <!-- Poster -->
    <div class="relative overflow-hidden rounded-lg shadow-lg">
      <img
        v-if="item.poster_path && !imageErrored"
        :src="tmdbImageUrl(item.poster_path, 'poster', 'md')"
        :alt="title"
        class="w-full aspect-[2/3] object-cover transition-all duration-300 group-hover:brightness-75"
        loading="lazy"
        @error="imageErrored = true"
      />
      <CommonNoImagePlaceholder v-else class="w-full aspect-[2/3] rounded-lg shadow-lg" />
      <!-- 이미지 하단 우측: 즐겨찾기·관심목록·평점 (작은 아이콘) -->
      <div v-if="showQuickActions" class="absolute bottom-0.5 right-0.5">
        <DetailActionsCompact
          :media-id="item.id"
          :media-type="item.media_type || 'movie'"
          :media="item"
        />
      </div>
    </div>

    <!-- Hover Overlay -->
    <div
      class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
             transition-opacity duration-300 flex flex-col justify-end p-3
             bg-gradient-to-t from-black/80 via-transparent to-transparent"
    >
      <p class="text-sm font-medium text-white line-clamp-2">{{ title }}</p>
      <div v-if="item.vote_average" class="flex items-center gap-1 mt-1">
        <Icon name="material-symbols:star-rounded" class="text-yellow-400 w-4 h-4" />
        <span class="text-xs text-white/80">{{ item.vote_average?.toFixed(1) }}</span>
      </div>
    </div>

    <!-- Title (below card) -->
    <p v-if="showTitle" class="mt-2 text-sm text-white/70 text-center line-clamp-1">
      {{ title }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface MovieItem {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path?: string | null
  vote_average?: number
  media_type?: string
}

interface Props {
  item: MovieItem
  showTitle?: boolean
  /** 이미지 하단 우측에 즐겨찾기·관심목록·평점 아이콘 표시 */
  showQuickActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTitle: false,
  showQuickActions: false,
})

defineEmits<{
  click: [item: MovieItem]
}>()

const title = computed(() => props.item.title || props.item.name || '제목 없음')
const imageErrored = ref(false)
</script>
