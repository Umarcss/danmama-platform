<template>
    <q-card class="add-form-card" style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">{{ isEditing ? 'Edit Property' : 'Add New Property' }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="form.name" label="Property Name" />
          <q-input filled v-model="form.address" label="Address" />
          <q-input filled v-model="form.price" label="Price" />
          <q-input filled v-model="form.type" label="Type" />
          <q-select
            filled
            v-model="form.status"
            :options="['Available', 'Sold', 'Under Offer']"
            label="Status"
          />
          <!-- Add all other fields from the Excel sheet here -->
  
          <div class="row justify-end q-mt-lg">
            <q-btn flat label="Cancel" @click="$emit('close')" />
            <q-btn :label="isEditing ? 'Update' : 'Save'" type="submit" color="secondary" class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </template>
  
  <script>
  import { defineComponent, reactive, computed, watch } from 'vue';
  
  export default defineComponent({
    name: 'AddPropertyForm',
    props: {
      // This prop will be used to pre-fill the form for editing
      itemToEdit: {
        type: Object,
        default: null
      }
    },
    emits: ['save', 'close'],
    setup(props, { emit }) {
      const isEditing = computed(() => !!props.itemToEdit);
  
      // Initialize form with empty values or the itemToEdit data
      const form = reactive({
        name: '',
        address: '',
        price: '',
        type: '',
        status: 'Available',
        // ... other fields
      });
  
      // Watch for changes in the itemToEdit prop and update the form
      watch(() => props.itemToEdit, (newItem) => {
        if (newItem) {
          Object.assign(form, newItem);
        } else {
          // Reset form if itemToEdit becomes null
          Object.keys(form).forEach(key => (form[key] = ''));
          form.status = 'Available';
        }
      }, { immediate: true }); // immediate: true runs the watcher on component mount
  
      const onSubmit = () => {
        emit('save', { ...form });
      };
  
      return { form, isEditing, onSubmit };
    }
  });
  </script>