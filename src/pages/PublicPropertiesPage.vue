<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-weight-bold text-primary q-mb-xl">Browse Properties</div>

    <SearchAndFilter :items="allProperties" @filtered="filteredProperties = $event" />

    <div class="row q-gutter-lg q-mt-xl" v-if="!dataStore.loading">
      <div v-for="property in filteredProperties" :key="property.id" class="col-12 col-sm-6 col-md-4">
        <PropertyCard :property="property" />
      </div>
      <div v-if="filteredProperties.length === 0" class="col-12 text-center text-h6 text-grey-6">
        No properties found matching your criteria.
      </div>
    </div>
    <div v-else class="row justify-center q-mt-xl">
      <q-spinner size="50px" color="primary" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useDataStore } from 'src/stores/data-store';
import PropertyCard from 'src/components/PropertyCard.vue';
import SearchAndFilter from 'src/components/SearchAndFilter.vue';

export default defineComponent({
  name: 'PublicPropertiesPage',
  components: { PropertyCard, SearchAndFilter },
  setup() {
    const dataStore = useDataStore();
    const allProperties = computed(() => dataStore.propertiesForSale);
    const filteredProperties = ref([]);

    onMounted(() => {
      dataStore.fetchAllData();
    });

    return { allProperties, filteredProperties, dataStore };
  }
});
</script>