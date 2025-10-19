<template>
    <q-page class="q-pa-md">
      <div class="row justify-between items-center q-mb-xl">
        <div class="text-h4 text-weight-bold text-primary">{{ pageTitle }}</div>
        <q-btn color="secondary" icon="add" label="Add New" @click="openFormForCreate" />
      </div>
  
      <q-table
        :rows="items"
        :columns="columns"
        row-key="id"
        :loading="dataStore.loading"
        binary-state-sort
      >
        <!-- Custom slot for the Status column -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.status"
              :options="statusOptions"
              dense
              outlined
              @update:model-value="updateItemStatus(props.row)"
              class="status-select"
            />
          </q-td>
        </template>
  
        <!-- Custom slot for Actions column -->
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="edit" @click="openFormForEdit(props.row)" />
            <q-btn flat round dense icon="delete" @click="confirmDelete(props.row)" class="text-negative" />
          </q-td>
        </template>
      </q-table>
  
      <!-- Form Modal for Creating/Editing -->
      <q-dialog v-model="showForm" persistent>
        <component
          :is="currentFormComponent"
          :item-to-edit="itemToEdit"
          @save="handleSave"
          @close="closeForm"
        />
      </q-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <q-dialog v-model="showDeleteDialog">
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="negative" text-color="white" />
            <span class="q-ml-sm">Are you sure you want to delete <strong>{{ itemToDelete?.name || itemToDelete?.clientName }}</strong>?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Delete" color="negative" v-close-popup @click="handleDelete" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useDataStore } from 'src/stores/data-store';
  import { useQuasar } from 'quasar';
  import AddPropertyForm from 'src/components/forms/AddPropertyForm.vue';
  // Import other forms as you create them
  
  export default defineComponent({
    name: 'GenericAdminPage',
    setup() {
      const route = useRoute();
      const dataStore = useDataStore();
      const $q = useQuasar();
  
      const showForm = ref(false);
      const itemToEdit = ref(null);
      const showDeleteDialog = ref(false);
      const itemToDelete = ref(null);
  
      const pageType = computed(() => route.params.type);
      const statusOptions = ['New', 'Contacted', 'Available', 'Sold', 'Under Offer', 'Closed'];
  
      const pageTitle = computed(() => {
        const titles = {
          properties: 'Properties for Sale',
          rentals: 'Listings for Rentals',
          land: 'Listings for Land',
          'property-requests': 'Property Requests',
          'commercial-requests': 'Commercial Requests',
          commercials: 'Commercial Listings'
        };
        return titles[pageType.value] || 'Admin Page';
      });
  
      const items = computed(() => {
        const itemMap = {
          properties: dataStore.propertiesForSale,
          rentals: dataStore.listingsForRentals,
          land: dataStore.listingsForLand,
          'property-requests': dataStore.propertyRequests,
          'commercial-requests': dataStore.commercialRequests,
          commercials: dataStore.commercialListings
        };
        return itemMap[pageType.value] || [];
      });
  
      const columns = computed(() => {
        const baseColumns = [
          { name: 'name', required: true, label: 'Name', field: row => row.name || row.clientName, align: 'left', sortable: true },
          { name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true },
          { name: 'price', align: 'left', label: 'Price', field: 'price', sortable: true },
          { name: 'status', align: 'left', label: 'Status', field: 'status' },
          { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
        ];
        if (pageType.value === 'property-requests') {
          baseColumns[1].label = 'Request';
          baseColumns[2].label = 'Budget';
        }
        return baseColumns;
      });
  
      const currentFormComponent = computed(() => {
        const formMap = {
          properties: AddPropertyForm,
          // rentals: AddRentalForm,
          // land: AddLandForm,
          // etc.
        };
        return formMap[pageType.value] || null;
      });
  
      // --- Form Handling ---
      const openFormForCreate = () => {
        itemToEdit.value = null;
        showForm.value = true;
      };
  
      const openFormForEdit = (item) => {
        itemToEdit.value = { ...item };
        showForm.value = true;
      };
  
      const closeForm = () => {
        showForm.value = false;
        itemToEdit.value = null;
      };
  
      const handleSave = async (formData) => {
        if (itemToEdit.value) {
          await dataStore.updateItem(pageType.value, itemToEdit.value.id, formData);
          $q.notify({ type: 'positive', message: 'Item updated successfully!' });
        } else {
          await dataStore.addNewItem(pageType.value, formData);
          $q.notify({ type: 'positive', message: 'Item added successfully!' });
        }
        closeForm();
      };
  
      // --- Delete Handling ---
      const confirmDelete = (item) => {
        itemToDelete.value = item;
        showDeleteDialog.value = true;
      };
  
      const handleDelete = async () => {
        const success = await dataStore.deleteItem(pageType.value, itemToDelete.value.id);
        if (success) {
          $q.notify({ type: 'positive', message: 'Item deleted.' });
        } else {
          $q.notify({ type: 'negative', message: 'Failed to delete item.' });
        }
        itemToDelete.value = null;
      };
  
      // --- Status Update Handling ---
      const updateItemStatus = async (item) => {
        await dataStore.updateItem(pageType.value, item.id, { status: item.status });
        $q.notify({ type: 'info', message: 'Status updated.' });
      };
  
      onMounted(() => {
        if (dataStore.propertiesForSale.length === 0) {
          dataStore.fetchAllData();
        }
      });
  
      return {
        pageTitle,
        items,
        columns,
        statusOptions,
        showForm,
        itemToEdit,
        currentFormComponent,
        showDeleteDialog,
        itemToDelete,
        openFormForCreate,
        openFormForEdit,
        handleSave,
        closeForm,
        confirmDelete,
        handleDelete,
        updateItemStatus
      };
    }
  });
  </script>
  
  <style scoped>
  .status-select {
    width: 150px;
  }

  /* Glassmorphism for dialogs */
  .q-dialog .q-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  /* Form modal glassmorphism */
  .q-dialog .q-card:has(.q-form) {
    min-width: 500px;
  }
  </style>