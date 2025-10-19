// src/components/PropertyCard.vue
<template>
  <q-card class="property-card" flat bordered>
    <q-img :src="property.image" height="200px" />

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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PropertyCard',
  props: {
    property: {
      type: Object,
      required: true
    }
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
</style>