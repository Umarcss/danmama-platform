<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Commercial Property Listings</div>
        <div class="text-subtitle1 text-grey-6">Browse commercial spaces for rent/lease in Abuja</div>
      </div>
      <q-btn
        color="secondary"
        icon="add"
        label="List Commercial Space"
        @click="showContactModal = true"
        v-if="isAuthenticated"
      />
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-table
        :rows="listings"
        :columns="columns"
        row-key="id"
        :loading="dataStore.loading"
        :pagination="pagination"
        @request="onRequest"
        binary-state-sort
        class="modern-table"
      >
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
              @click="viewListing(props.row)"
            >
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="phone"
              color="positive"
              @click="contactOwner(props.row)"
              class="q-ml-sm"
            >
              <q-tooltip>Contact Owner</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Contact Modal -->
    <q-dialog v-model="showContactModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6 text-center">List Your Commercial Space</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-center text-grey-6 q-mb-md">
            Want to rent out your commercial space? Contact our team to list your property.
          </div>
          <div class="text-center">
            <q-btn color="secondary" label="Call: +234 123 456 7890" class="q-mr-sm" />
            <q-btn color="primary" label="Email: commercial@danmama.com" />
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
  name: 'CommercialListings',
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    const $q = useQuasar();

    const showContactModal = ref(false);

    const listings = computed(() => dataStore.commercialListings);
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
        name: 'name',
        label: 'Property Name',
        align: 'left',
        field: 'name',
        sortable: true
      },
      {
        name: 'type',
        label: 'Space Type',
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
        name: 'description',
        label: 'Description',
        align: 'left',
        field: 'description',
        sortable: false
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

    const viewListing = (listing) => {
      const details = `Property: ${listing.name}\nType: ${listing.type}\nAddress: ${listing.address}\nDescription: ${listing.description}\nPrice: ${listing.price}`;
      $q.notify({
        type: 'info',
        message: `Property Details:\n${details}`,
        position: 'top',
        timeout: 10000
      });
    };

    const contactOwner = () => {
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
      listings,
      columns,
      pagination,
      dataStore,
      isAuthenticated,
      showContactModal,
      formatPrice,
      getStatusColor,
      viewListing,
      contactOwner,
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
