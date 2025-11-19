// src/pages/Index.vue
<template>
  <q-page class="q-pa-none">
    <!-- Hero Section with Glassmorphism -->
    <div class="hero-container">
      <q-parallax src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&w=1080&q=80" :height="600">
        <div class="glass-card text-center">
          <div class="text-h2 text-weight-bolder text-white">Find Your Dream Smart Home</div>
          <div class="text-h5 text-weight-light q-mt-md text-white">Exclusive properties in Abuja</div>
          <q-btn class="q-mt-xl" size="lg" color="secondary" text-color="primary" label="View Properties" to="/properties" />
        </div>
      </q-parallax>
    </div>

    <!-- Featured Properties Section -->
    <div class="q-pa-xl bg-grey-1">
      <div class="text-h4 text-weight-bold text-center text-primary q-mb-xl">Featured Properties</div>
      <div class="row q-gutter-lg justify-center">
        <div v-for="property in featuredProperties" :key="property.id" class="col-12 col-md-4">
          <PropertyCard :property="property" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import PropertyCard from 'components/PropertyCard.vue'
import { useLoadingStore } from 'src/stores/loading-store'

export default defineComponent({
  name: 'PageIndex',
  components: { PropertyCard },
  setup () {
    const loadingStore = useLoadingStore();
    
    // We will replace this with real data later
    const featuredProperties = ref([
      { id: 1, name: 'Luxury Villa in Asokoro', price: 'N4.5 Billion', location: 'Asokoro, Abuja', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070' },
      { id: 2, name: 'Modern Duplex in Maitama', price: 'N850 Million', location: 'Maitama, Abuja', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070' },
      { id: 3, name: 'Penthouse at Wuse 2', price: 'N350 Million', location: 'Wuse 2, Abuja', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070' }
    ])

    // Simulate loading on page mount
    onMounted(() => {
      loadingStore.startLoading('pageLoad', 'Loading Properties', 'Fetching featured properties...');
      setTimeout(() => {
        loadingStore.stopLoading('pageLoad');
      }, 1500);
    });

    return { featuredProperties }
  }
})
</script>

<style scoped>
.hero-container {
  position: relative;
}
.glass-card {
  background: rgba(10, 61, 98, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>