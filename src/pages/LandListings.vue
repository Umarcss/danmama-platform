<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Land Listings</div>
        <div class="text-subtitle1 text-grey-6">Browse available land plots in Abuja</div>
      </div>
      <q-btn
        color="secondary"
        icon="add"
        label="List Land"
        @click="showContactModal = true"
        v-if="isAuthenticated"
      />
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-table
        :rows="landListings"
        :columns="columns"
        row-key="id"
        :loading="dataStore.loading"
        :pagination="pagination"
        @request="onRequest"
        binary-state-sort
        class="modern-table"
      >
        <template #body-cell-landSize="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.landSize || 'Not specified' }}</div>
          </q-td>
        </template>

        <template #body-cell-price="props">
          <q-td :props="props">
            <div class="text-weight-bold text-secondary">{{ formatPrice(props.row.price) }}</div>
          </q-td>
        </template>

        <template #body-cell-titleDocument="props">
          <q-td :props="props">
            <q-chip
              :color="getDocumentColor(props.row.titleDocument)"
              text-color="white"
              :label="props.row.titleDocument || 'N/A'"
              size="sm"
            />
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
              @click="viewLand(props.row)"
            >
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="phone"
              color="positive"
              @click="contactSeller(props.row)"
              class="q-ml-sm"
            >
              <q-tooltip>Contact Seller</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Contact Modal -->
    <q-dialog v-model="showContactModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6 text-center">List Your Land</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-center text-grey-6 q-mb-md">
            Want to sell your land? Contact our team to list your property.
          </div>
          <div class="text-center">
            <q-btn color="secondary" label="Call: +234 123 456 7890" class="q-mr-sm" />
            <q-btn color="primary" label="Email: land@danmama.com" />
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
  name: 'LandListings',
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    const $q = useQuasar();

    const showContactModal = ref(false);

    const landListings = computed(() => dataStore.listingsForLand);
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
        label: 'Land Name',
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
        name: 'landSize',
        label: 'Land Size',
        align: 'left',
        field: 'landSize',
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
        name: 'titleDocument',
        label: 'Title Document',
        align: 'center',
        field: 'titleDocument',
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

    const getDocumentColor = (document) => {
      if (!document || document === 'N/A') return 'grey';
      if (document.includes('C of O')) return 'positive';
      if (document.includes('FHA')) return 'info';
      return 'warning';
    };

    const getStatusColor = (status) => {
      const colors = {
        'Available': 'positive',
        'Sold': 'negative',
        'Under Offer': 'warning'
      };
      return colors[status] || 'grey';
    };

    const viewLand = (land) => {
      $q.notify({
        type: 'info',
        message: `Viewing details for: ${land.name}`,
        position: 'top'
      });
    };

    const contactSeller = (land) => {
      const sellerInfo = `Seller Contact: ${land.sellerContact || 'N/A'}`;
      $q.notify({
        type: 'info',
        message: `Contact Information:\n${sellerInfo}`,
        position: 'top',
        timeout: 5000
      });
    };

    const onRequest = (props) => {
      pagination.value = props.pagination;
    };

    onMounted(() => {
      dataStore.fetchAllData();
    });

    return {
      landListings,
      columns,
      pagination,
      dataStore,
      isAuthenticated,
      showContactModal,
      formatPrice,
      getDocumentColor,
      getStatusColor,
      viewLand,
      contactSeller,
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
