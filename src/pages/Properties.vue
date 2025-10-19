// src/pages/Properties.vue
<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-weight-bold text-primary q-mb-xl">All Properties</div>
    <div class="row q-gutter-lg">
      <div v-for="property in allProperties" :key="property.id" class="col-12 col-sm-6 col-md-4">
        <PropertyCard :property="property" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import PropertyCard from 'components/PropertyCard.vue'

export default defineComponent({
  name: 'PropertiesPage',
  components: { PropertyCard },
  setup () {
    const allProperties = ref([
      // Add more properties here...
      { id: 1, name: 'Luxury Villa in Asokoro', price: 'N4.5 Billion', location: 'Asokoro, Abuja', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070' },
      { id: 2, name: 'Modern Duplex in Maitama', price: 'N850 Million', location: 'Maitama, Abuja', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070' }
    ])
    return { allProperties }
  }
})
</script>