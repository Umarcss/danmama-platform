<template>
  <q-card flat bordered class="q-pa-md">
    <div class="row q-gutter-md">
      <q-input
        class="col-12 col-md-3"
        filled
        v-model="filters.search"
        label="Search by name or location"
        clearable
      />
      <q-select
        class="col-12 col-md-3"
        filled
        v-model="filters.type"
        :options="typeOptions"
        label="Property Type"
        clearable
      />
      <q-select
        class="col-12 col-md-3"
        filled
        v-model="filters.status"
        :options="statusOptions"
        label="Status"
        clearable
      />
      <q-btn class="col-12 col-md-3 self-end" color="secondary" label="Apply Filters" @click="applyFilters" />
    </div>
  </q-card>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue';

export default defineComponent({
  name: 'SearchAndFilter',
  props: {
    items: Array
  },
  emits: ['filtered'],
  setup(props, { emit }) {
    const filters = reactive({
      search: '',
      type: '',
      status: ''
    });

    const typeOptions = ['Built House', 'Built Estate', 'Land', 'Commercial'];
    const statusOptions = ['Available', 'Sold', 'Under Offer'];

    const applyFilters = () => {
      let filteredItems = props.items;

      if (filters.search) {
        const lowerSearch = filters.search.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          (item.name && item.name.toLowerCase().includes(lowerSearch)) ||
          (item.address && item.address.toLowerCase().includes(lowerSearch))
        );
      }
      if (filters.type) {
        filteredItems = filteredItems.filter(item => item.type === filters.type);
      }
      if (filters.status) {
        filteredItems = filteredItems.filter(item => item.status === filters.status);
      }

      emit('filtered', filteredItems);
    };

    watch(() => props.items, () => {
      applyFilters();
    });

    return { filters, typeOptions, statusOptions, applyFilters };
  }
});
</script>

<style scoped>
.q-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.q-card:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>