// src/components/PropertyCard.vue
<template>
  <q-card class="property-card" flat bordered>
    <div style="position: relative;">
      <q-img :src="getImageUrl" height="200px" />
      <div v-if="imageCount > 1" class="image-count-badge">
        <q-icon name="photo_library" size="xs" />
        <span>{{ imageCount }}</span>
      </div>
    </div>

    <q-card-section>
      <div class="text-h6 text-weight-bold text-primary">{{ property.name }}</div>
      <div class="text-subtitle2 text-grey-6">{{ property.location }}</div>
      <div class="text-h5 text-weight-bold text-secondary q-mt-sm">{{ property.price }}</div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat color="primary" label="View Details" :to="`/property/${property.id}`" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'PropertyCard',
  props: {
    property: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getImageUrl = computed(() => {
      const property = props.property;
      if (!property) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070';
      // Use primary image from images array if available
      if (property.images && Array.isArray(property.images) && property.images.length > 0) {
        const primaryIndex = property.primaryImage !== undefined && property.primaryImage !== null 
          ? property.primaryImage 
          : 0;
        return property.images[primaryIndex] || property.images[0];
      }
      // Fallback to old image property or default
      return property.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070';
    });

    const imageCount = computed(() => {
      if (props.property.images && Array.isArray(props.property.images)) {
        return props.property.images.length;
      }
      return props.property.image ? 1 : 0;
    });

    return {
      getImageUrl,
      imageCount
    };
  }
})
</script>

<style scoped>
.property-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.property-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.image-count-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}
</style>