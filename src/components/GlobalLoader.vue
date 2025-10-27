<template>
  <div v-if="isLoading" class="global-loader">
    <div class="loader-overlay">
      <div class="loader-content">
        <q-spinner-dots
          size="50px"
          color="primary"
          class="q-mb-md"
        />
        <div class="text-h6 text-primary text-weight-medium">
          {{ loadingMessage }}
        </div>
        <div class="text-caption text-grey-6 q-mt-sm">
          {{ loadingSubMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'GlobalLoader',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Loading...'
    },
    subMessage: {
      type: String,
      default: 'Please wait while we fetch your data'
    }
  },
  setup(props) {
    const isLoading = computed(() => props.loading)
    const loadingMessage = computed(() => props.message)
    const loadingSubMessage = computed(() => props.subMessage)

    return {
      isLoading,
      loadingMessage,
      loadingSubMessage
    }
  }
})
</script>

<style scoped>
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: all;
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-content {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 300px;
  width: 90%;
}

/* Dark mode support */
.body--dark .loader-overlay {
  background: rgba(0, 0, 0, 0.8);
}

.body--dark .loader-content {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .loader-content {
    padding: 1.5rem;
    max-width: 280px;
  }
  
  .text-h6 {
    font-size: 1rem !important;
  }
  
  .text-caption {
    font-size: 0.8rem !important;
  }
}

@media (max-width: 480px) {
  .loader-content {
    padding: 1rem;
    max-width: 250px;
  }
  
  .q-spinner-dots {
    font-size: 40px !important;
  }
}
</style>
