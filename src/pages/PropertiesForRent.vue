<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Properties for Rent</div>
        <div class="text-subtitle1 text-grey-6">Find rental properties in Abuja</div>
      </div>
      <q-btn
        color="secondary"
        icon="add"
        label="List Property"
        @click="showContactModal = true"
        v-if="isAuthenticated"
      />
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-table
        :rows="properties"
        :columns="columns"
        row-key="id"
        :loading="dataStore.loading"
        :pagination="pagination"
        @request="onRequest"
        binary-state-sort
        class="modern-table"
      >
        <template #body-cell-image="props">
          <q-td :props="props">
            <q-avatar size="60px" class="q-ma-sm">
              <img :src="getImageUrl(props.row)" :alt="props.row.name" />
            </q-avatar>
          </q-td>
        </template>

        <template #body-cell-price="props">
          <q-td :props="props">
            <div class="text-weight-bold text-secondary">{{ formatPrice(props.row.price) }}</div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              :label="props.row.status"
              size="sm"
            />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="primary"
              @click="viewProperty(props.row)"
            >
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="phone"
              color="positive"
              @click="contactAgent(props.row)"
              class="q-ml-sm"
            >
              <q-tooltip>Contact Agent</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Contact Modal -->
    <q-dialog v-model="showContactModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6 text-center">List Your Rental Property</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-center text-grey-6 q-mb-md">
            Want to list your property for rent? Contact our team to get started.
          </div>
          <div class="text-center">
            <q-btn color="secondary" label="Call: +234 123 456 7890" class="q-mr-sm" />
            <q-btn color="primary" label="Email: rentals@danmama.com" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useDataStore } from 'src/stores/data-store';
import { useAuthStore } from 'src/stores/auth-store';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PropertiesForRent',
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    const $q = useQuasar();

    const showContactModal = ref(false);

    const properties = computed(() => dataStore.listingsForRentals);
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    });

    const columns = [
      {
        name: 'image',
        label: '',
        align: 'center',
        field: 'image',
        sortable: false
      },
      {
        name: 'name',
        label: 'Property Name',
        align: 'left',
        field: 'name',
        sortable: true
      },
      {
        name: 'type',
        label: 'Type',
        align: 'left',
        field: 'type',
        sortable: true
      },
      {
        name: 'address',
        label: 'Address',
        align: 'left',
        field: 'address',
        sortable: true
      },
      {
        name: 'price',
        label: 'Price',
        align: 'right',
        field: 'price',
        sortable: true
      },
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'status',
        sortable: true
      },
      {
        name: 'actions',
        label: 'Actions',
        align: 'center',
        field: 'actions',
        sortable: false
      }
    ];

    const getImageUrl = (property) => {
      return property.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070';
    };

    const formatPrice = (price) => {
      return price || 'Contact for Price';
    };

    const getStatusColor = (status) => {
      const colors = {
        'Available': 'positive',
        'Rented': 'negative',
        'Under Offer': 'warning'
      };
      return colors[status] || 'grey';
    };

    const viewProperty = (property) => {
      // For now, we'll just show a notification since we don't have individual property pages for rentals
      $q.notify({
        type: 'info',
        message: `Viewing details for: ${property.name}`,
        position: 'top'
      });
    };

    const contactAgent = () => {
      $q.notify({
        type: 'info',
        message: 'Contact information will be available soon.',
        position: 'top'
      });
    };

    const onRequest = (props) => {
      pagination.value = props.pagination;
    };

    onMounted(() => {
      dataStore.fetchAllData();
    });

    return {
      properties,
      columns,
      pagination,
      dataStore,
      isAuthenticated,
      showContactModal,
      getImageUrl,
      formatPrice,
      getStatusColor,
      viewProperty,
      contactAgent,
      onRequest
    };
  }
});
</script>

<style scoped>
.modern-table {
  border-radius: 8px;
}

.modern-table .q-table__top {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.modern-table .q-table thead th {
  font-weight: 600;
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
}

.modern-table .q-table tbody td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.modern-table .q-table tbody tr:hover {
  background-color: rgba(25, 118, 210, 0.04);
}
</style>
