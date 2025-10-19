<template>
    <q-card class="add-form-card" style="min-width: 600px; max-width: 800px;">
      <q-card-section>
        <div class="text-h6">{{ isEditing ? 'Edit Property' : 'Add New Property' }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-lg">
          <!-- Basic Property Information -->
          <div class="form-section">
            <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Basic Property Information</div>
            <div class="row q-gutter-md">
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.name" label="Property Name *" required />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.propertyId" label="Property ID" />
              </div>
            </div>
            <div class="row q-gutter-md">
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.type" label="Property Type *" required />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  filled
                  v-model="form.status"
                  :options="['Available', 'Sold', 'Under Offer']"
                  label="Status *"
                  required
                />
              </div>
            </div>
            <q-input filled v-model="form.price" label="Price *" required />
            <div class="row q-gutter-md">
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.city" label="City *" required />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.landmark" label="Landmark" />
              </div>
            </div>
            <q-input filled v-model="form.address" label="Full Address *" required />
          </div>

          <!-- Property Details -->
          <div class="form-section">
            <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Property Details</div>
            <q-input filled v-model="form.titleDocument" label="Title Document" />
            <q-input
              filled
              type="textarea"
              rows="3"
              v-model="form.description"
              label="Description"
              placeholder="Detailed description of the property..."
            />
            <q-input
              filled
              type="textarea"
              rows="2"
              v-model="form.note"
              label="Notes"
              placeholder="Additional notes or special instructions..."
            />
            <q-input
              filled
              type="date"
              v-model="form.dateListed"
              label="Date Listed"
            />
          </div>

          <!-- Seller Information -->
          <div class="form-section">
            <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Seller Information</div>
            <div class="row q-gutter-md">
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.sellerName" label="Seller Name" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.sellerContact" label="Seller Contact" />
              </div>
            </div>
            <q-input filled type="email" v-model="form.sellerEmail" label="Seller Email" />
          </div>

          <!-- Agent Information -->
          <div class="form-section">
            <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Agent Information</div>
            <div class="row q-gutter-md">
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.agentName" label="Agent Name *" required />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.agentNumber" label="Agent Contact *" required />
              </div>
            </div>
            <q-input filled type="email" v-model="form.agentEmail" label="Agent Email" />
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn flat label="Cancel" @click="$emit('close')" />
            <q-btn :label="isEditing ? 'Update' : 'Save'" color="secondary" class="q-ml-sm" :loading="loading" @click="onSubmit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </template>
  
  <script>
  import { defineComponent, reactive, computed, watch, ref } from 'vue';

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
      const loading = ref(false);

      // Initialize form with all required fields
      const form = reactive({
        // Basic Property Information
        name: '',
        propertyId: '',
        type: '',
        status: 'Available',
        price: '',
        city: '',
        landmark: '',
        address: '',

        // Property Details
        titleDocument: '',
        description: '',
        note: '',
        dateListed: new Date().toISOString().split('T')[0], // Today's date as default

        // Seller Information
        sellerName: '',
        sellerContact: '',
        sellerEmail: '',

        // Agent Information
        agentName: '',
        agentNumber: '',
        agentEmail: ''
      });

      // Watch for changes in the itemToEdit prop and update the form
      watch(() => props.itemToEdit, (newItem) => {
        if (newItem) {
          // Update form with existing data, preserving all fields
          Object.keys(form).forEach(key => {
            if (newItem[key] !== undefined) {
              form[key] = newItem[key];
            }
          });
        } else {
          // Reset form if itemToEdit becomes null
          Object.keys(form).forEach(key => {
            if (key === 'status') {
              form[key] = 'Available';
            } else if (key === 'dateListed') {
              form[key] = new Date().toISOString().split('T')[0];
            } else {
              form[key] = '';
            }
          });
        }
      }, { immediate: true });

      const onSubmit = async () => {
        loading.value = true;
        try {
          // Basic validation
          if (!form.name.trim() || !form.type.trim() || !form.price.trim() || !form.city.trim() || !form.address.trim() || !form.agentName.trim() || !form.agentNumber.trim()) {
            throw new Error('Please fill in all required fields marked with *');
          }

          emit('save', { ...form });
        } catch (error) {
          console.error('Form validation error:', error);
          // You might want to show a notification here
        } finally {
          loading.value = false;
        }
      };

      return { form, isEditing, loading, onSubmit };
    }
  });
  </script>

<style scoped>
.form-section {
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}

.form-section .text-subtitle1 {
  border-bottom: 2px solid #1976d2;
  padding-bottom: 8px;
  margin-bottom: 16px !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-section {
    padding: 16px;
  }

  .q-card {
    min-width: 95vw !important;
    max-width: 95vw !important;
  }
}
</style>