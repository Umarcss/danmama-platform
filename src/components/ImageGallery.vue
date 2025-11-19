<template>
  <div class="image-gallery">
    <!-- Main Image Display -->
    <div class="main-image-container">
      <div class="main-image-wrapper" @click="toggleZoom">
        <img
          ref="mainImage"
          :src="currentImage"
          :alt="`Property image ${currentIndex + 1}`"
          :class="{ 'zoomed': isZoomed }"
          @load="onImageLoad"
        />
        <div v-if="loading" class="loading-overlay">
          <q-spinner color="primary" size="3em" />
        </div>
      </div>

      <!-- Navigation Arrows -->
      <q-btn
        v-if="images.length > 1"
        flat
        round
        dense
        icon="chevron_left"
        class="nav-btn nav-btn-left"
        @click="previousImage"
        :disable="currentIndex === 0"
      />
      <q-btn
        v-if="images.length > 1"
        flat
        round
        dense
        icon="chevron_right"
        class="nav-btn nav-btn-right"
        @click="nextImage"
        :disable="currentIndex === images.length - 1"
      />

      <!-- Image Counter -->
      <div v-if="images.length > 1" class="image-counter">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Zoom Controls -->
      <div class="zoom-controls">
        <q-btn
          flat
          round
          dense
          :icon="isZoomed ? 'zoom_out' : 'zoom_in'"
          @click="toggleZoom"
          class="zoom-btn"
        >
          <q-tooltip>{{ isZoomed ? 'Zoom Out' : 'Zoom In' }}</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Thumbnail Navigation -->
    <div v-if="images.length > 1" class="thumbnail-container">
      <div class="thumbnail-scroll">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="thumbnail-item"
          :class="{ 'active': index === currentIndex }"
          @click="selectImage(index)"
        >
          <img :src="image" :alt="`Thumbnail ${index + 1}`" />
          <div v-if="index === primaryImage" class="primary-indicator">
            <q-icon name="star" size="xs" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'ImageGallery',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    primaryImage: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const mainImage = ref(null);
    const currentIndex = ref(props.initialIndex);
    const isZoomed = ref(false);
    const loading = ref(false);

    const currentImage = computed(() => {
      if (props.images.length === 0) return '';
      return props.images[currentIndex.value] || props.images[0];
    });

    const selectImage = (index) => {
      if (index >= 0 && index < props.images.length) {
        currentIndex.value = index;
        isZoomed.value = false;
        loading.value = true;
      }
    };

    const nextImage = () => {
      if (currentIndex.value < props.images.length - 1) {
        selectImage(currentIndex.value + 1);
      }
    };

    const previousImage = () => {
      if (currentIndex.value > 0) {
        selectImage(currentIndex.value - 1);
      }
    };

    const toggleZoom = () => {
      isZoomed.value = !isZoomed.value;
    };

    const onImageLoad = () => {
      loading.value = false;
    };

    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        previousImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      } else if (event.key === 'Escape') {
        isZoomed.value = false;
      }
    };

    const handleSwipe = (event) => {
      // Simple swipe detection for mobile
      const touch = event.touches[0] || event.changedTouches[0];
      if (!touch) return;

      const startX = touch.clientX;
      const startY = touch.clientY;

      const handleTouchEnd = (e) => {
        const endTouch = e.changedTouches[0];
        if (!endTouch) return;

        const deltaX = endTouch.clientX - startX;
        const deltaY = endTouch.clientY - startY;

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            previousImage();
          } else {
            nextImage();
          }
        }

        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchend', handleTouchEnd);
    };

    watch(() => props.initialIndex, (newIndex) => {
      if (newIndex >= 0 && newIndex < props.images.length) {
        currentIndex.value = newIndex;
      }
    });

    watch(() => props.images, () => {
      if (currentIndex.value >= props.images.length) {
        currentIndex.value = Math.max(0, props.images.length - 1);
      }
    });

    onMounted(() => {
      document.addEventListener('keydown', handleKeyPress);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyPress);
    });

    return {
      mainImage,
      currentIndex,
      currentImage,
      isZoomed,
      loading,
      selectImage,
      nextImage,
      previousImage,
      toggleZoom,
      onImageLoad,
      handleSwipe
    };
  }
});
</script>

<style scoped>
.image-gallery {
  width: 100%;
}

.main-image-container {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
  overflow: hidden;
}

.main-image-wrapper .zoomed {
  cursor: zoom-out;
}

.main-image-wrapper img {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-image-wrapper img.zoomed {
  transform: scale(2);
  cursor: grab;
}

.main-image-wrapper img.zoomed:active {
  cursor: grabbing;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.nav-btn-left {
  left: 16px;
}

.nav-btn-right {
  right: 16px;
}

.image-counter {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.zoom-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}

.zoom-btn {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  backdrop-filter: blur(10px);
}

.zoom-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.thumbnail-container {
  width: 100%;
  overflow-x: auto;
  padding: 8px 0;
}

.thumbnail-scroll {
  display: flex;
  gap: 12px;
  padding: 0 4px;
}

.thumbnail-item {
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  background: #f5f5f5;
}

.thumbnail-item:hover {
  transform: scale(1.05);
  border-color: rgba(25, 118, 210, 0.5);
}

.thumbnail-item.active {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.primary-indicator {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 152, 0, 0.9);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-image-container {
    min-height: 300px;
  }

  .main-image-wrapper {
    min-height: 300px;
  }

  .main-image-wrapper img {
    max-height: 400px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
  }

  .thumbnail-item {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .main-image-container {
    min-height: 250px;
  }

  .main-image-wrapper {
    min-height: 250px;
  }

  .main-image-wrapper img {
    max-height: 300px;
  }

  .thumbnail-item {
    width: 50px;
    height: 50px;
  }
}
</style>

