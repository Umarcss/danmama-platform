<template>
  <q-page class="q-pa-md">
    <!-- Header with Stats and Actions -->
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Properties for Sale</div>
        <div class="text-subtitle1 text-grey-6">{{ properties.length }} total properties • Manage your property inventory</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          color="primary"
          icon="refresh"
          label="Refresh"
          @click="refreshData"
          :loading="dataStore.loading"
        />
        <q-btn
          color="secondary"
          icon="add"
          label="Add Property"
          @click="openFormForCreate"
        />
      </div>
    </div>

    <!-- Modern Analytics Cards -->
    <div class="analytics-grid q-mb-xl">
      <!-- Total Properties Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card total-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper total-bg">
                  <q-icon name="home" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ properties.length }}</div>
                <div class="stat-label">Total Properties</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_up" size="1rem" />
                  <span>+12% this month</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill" :style="{ width: '100%' }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Available Properties Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card available-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper available-bg">
                  <q-icon name="check_circle" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ availableCount }}</div>
                <div class="stat-label">Available</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_up" size="1rem" />
                  <span>{{ Math.round((availableCount / properties.length) * 100) }}% of total</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill available-fill" :style="{ width: `${(availableCount / properties.length) * 100}%` }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Under Offer Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card offer-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper offer-bg">
                  <q-icon name="schedule" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ underOfferCount }}</div>
                <div class="stat-label">Under Offer</div>
                <div class="stat-trend warning">
                  <q-icon name="access_time" size="1rem" />
                  <span>Pending closure</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill offer-fill" :style="{ width: `${(underOfferCount / properties.length) * 100}%` }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Sold Properties Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card sold-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper sold-bg">
                  <q-icon name="sell" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ soldCount }}</div>
                <div class="stat-label">Sold</div>
                <div class="stat-trend success">
                  <q-icon name="celebration" size="1rem" />
                  <span>Great performance</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill sold-fill" :style="{ width: `${(soldCount / properties.length) * 100}%` }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Data Table -->
    <q-card flat bordered>
      <q-table
        :rows="properties"
        :columns="columns"
        row-key="id"
        :loading="dataStore.loading"
        :pagination="pagination"
        @request="onRequest"
        binary-state-sort
        class="admin-table"
        :rows-per-page-options="[10, 25, 50, 100]"
      >
        <template #body-cell-image="props">
          <q-td :props="props">
            <q-avatar size="50px">
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
            <q-select
              v-model="props.row.status"
              :options="['Available', 'Sold', 'Under Offer']"
              dense
              outlined
              emit-value
              map-options
              @update:model-value="updatePropertyStatus(props.row, $event)"
              class="status-select"
              :class="getStatusClass(props.row.status)"
            />
          </q-td>
        </template>

        <template #body-cell-agent="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.agentName || 'N/A' }}</div>
            <div class="text-caption text-grey-6">{{ props.row.agentNumber || 'N/A' }}</div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                @click="viewPropertyDetails(props.row)"
                size="sm"
              >
                <q-tooltip>View Details</q-tooltip>
              </q-btn>
              <q-btn
                v-if="isAuthenticated"
                flat
                round
                dense
                icon="edit"
                color="info"
                @click="openFormForEdit(props.row)"
                size="sm"
              >
                <q-tooltip>Edit Property</q-tooltip>
              </q-btn>
              <q-btn
                v-if="isAuthenticated"
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="confirmDelete(props.row)"
                size="sm"
              >
                <q-tooltip>Delete Property</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Property Form Modal -->
    <q-dialog v-model="showForm" persistent maximized>
      <AddPropertyForm
        :item-to-edit="itemToEdit"
        @save="handleSave"
        @close="closeForm"
      />
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" size="lg" />
          <div class="q-ml-md">
            <div class="text-h6">Confirm Delete</div>
            <div class="text-body2 text-grey-6 q-mt-xs">
              Are you sure you want to delete "<strong>{{ itemToDelete?.name }}</strong>"?
              This action cannot be undone.
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="primary" @click="cancelDelete" />
          <q-btn flat label="Delete" color="negative" @click="handleDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Property Details Dialog -->
    <q-dialog v-model="showDetailsDialog" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedProperty?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showDetailsDialog = false" />
        </q-card-section>

        <q-card-section v-if="selectedProperty">
          <div class="row q-gutter-md">
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Property Information</div>
                  <div class="row q-gutter-sm">
                    <div class="col-6"><strong>Type:</strong> {{ selectedProperty.type }}</div>
                    <div class="col-6"><strong>Status:</strong>
                      <q-chip :color="getStatusColor(selectedProperty.status)" text-color="white" :label="selectedProperty.status" size="sm" class="q-ml-xs" />
                    </div>
                    <div class="col-6"><strong>Price:</strong> {{ formatPrice(selectedProperty.price) }}</div>
                    <div class="col-6"><strong>City:</strong> {{ selectedProperty.city }}</div>
                    <div class="col-12"><strong>Address:</strong> {{ selectedProperty.address }}</div>
                    <div class="col-12"><strong>Description:</strong> {{ selectedProperty.description }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Property Details</div>
                  <div class="row q-gutter-sm">
                    <div class="col-12"><strong>Property ID:</strong> {{ selectedProperty.propertyId || 'N/A' }}</div>
                    <div class="col-12"><strong>Title Document:</strong> {{ selectedProperty.titleDocument || 'N/A' }}</div>
                    <div class="col-12"><strong>Landmark:</strong> {{ selectedProperty.landmark || 'N/A' }}</div>
                    <div class="col-12"><strong>Date Listed:</strong> {{ formatDate(selectedProperty.dateListed) }}</div>
                    <div class="col-12"><strong>Description:</strong></div>
                    <div class="col-12 q-pl-md">{{ selectedProperty.description || 'No description available' }}</div>
                    <div class="col-12"><strong>Notes:</strong></div>
                    <div class="col-12 q-pl-md">{{ selectedProperty.note || 'No notes available' }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Agent Information</div>
                  <div class="row q-gutter-sm">
                    <div class="col-12"><strong>Name:</strong> {{ selectedProperty.agentName || 'N/A' }}</div>
                    <div class="col-12"><strong>Contact:</strong> {{ selectedProperty.agentNumber || 'N/A' }}</div>
                    <div class="col-12"><strong>Email:</strong> {{ selectedProperty.agentEmail || 'N/A' }}</div>
                  </div>
                  <div class="text-h6 q-mt-lg q-mb-md">Seller Information</div>
                  <div class="row q-gutter-sm">
                    <div class="col-12"><strong>Name:</strong> {{ selectedProperty.sellerName || 'N/A' }}</div>
                    <div class="col-12"><strong>Contact:</strong> {{ selectedProperty.sellerContact || 'N/A' }}</div>
                    <div class="col-12"><strong>Email:</strong> {{ selectedProperty.sellerEmail || 'N/A' }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useDataStore } from 'src/stores/data-store';
import { useAuthStore } from 'src/stores/auth-store';
import { useQuasar } from 'quasar';
import AddPropertyForm from 'src/components/forms/AddPropertyForm.vue';

export default defineComponent({
  name: 'PropertiesForSale',
  components: { AddPropertyForm },
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    const $q = useQuasar();

    // Modal and form state
    const showForm = ref(false);
    const showDeleteDialog = ref(false);
    const showDetailsDialog = ref(false);
    const itemToEdit = ref(null);
    const itemToDelete = ref(null);
    const selectedProperty = ref(null);

    // Data
    const properties = computed(() => dataStore.propertiesForSale);
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    // Stats
    const availableCount = computed(() =>
      properties.value.filter(p => p.status === 'Available').length
    );
    const soldCount = computed(() =>
      properties.value.filter(p => p.status === 'Sold').length
    );
    const underOfferCount = computed(() =>
      properties.value.filter(p => p.status === 'Under Offer').length
    );

    // Pagination
    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 0
    });

    // Table columns - Keep essential columns for better readability
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
        name: 'city',
        label: 'City',
        align: 'left',
        field: 'city',
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
        name: 'agentName',
        label: 'Agent',
        align: 'left',
        field: 'agentName',
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

    // Helper functions
    const getImageUrl = (property) => {
      return property.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070';
    };

    const formatPrice = (price) => {
      return price || 'Contact for Price';
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return dateString;
      }
    };

    const getStatusColor = (status) => {
      const colors = {
        'Available': 'positive',
        'Sold': 'negative',
        'Under Offer': 'warning'
      };
      return colors[status] || 'grey';
    };

    const getStatusClass = (status) => {
      return `status-${status.toLowerCase().replace(' ', '-')}`;
    };

    // CRUD operations
    const openFormForCreate = () => {
      itemToEdit.value = null;
      showForm.value = true;
    };

    const openFormForEdit = (property) => {
      itemToEdit.value = { ...property };
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      itemToEdit.value = null;
    };

    const handleSave = async (formData) => {
      try {
        if (itemToEdit.value) {
          await dataStore.updateItem('properties', itemToEdit.value.id, formData);
          $q.notify({
            type: 'positive',
            message: 'Property updated successfully!',
            position: 'top'
          });
        } else {
          await dataStore.addNewItem('properties', formData);
          $q.notify({
            type: 'positive',
            message: 'Property added successfully!',
            position: 'top'
          });
        }
        closeForm();
        await refreshData();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to save property. Please try again.',
          position: 'top'
        });
      }
    };

    const confirmDelete = (property) => {
      itemToDelete.value = property;
      showDeleteDialog.value = true;
    };

    const cancelDelete = () => {
      itemToDelete.value = null;
      showDeleteDialog.value = false;
    };

    const handleDelete = async () => {
      try {
        await dataStore.deleteItem('properties', itemToDelete.value.id);
        $q.notify({
          type: 'positive',
          message: 'Property deleted successfully!',
          position: 'top'
        });
        cancelDelete();
        await refreshData();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to delete property. Please try again.',
          position: 'top'
        });
      }
    };

    const updatePropertyStatus = async (property, newStatus) => {
      try {
        await dataStore.updateItem('properties', property.id, { ...property, status: newStatus });
        $q.notify({
          type: 'positive',
          message: `Property status updated to ${newStatus}`,
          position: 'top'
        });
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to update status. Please try again.',
          position: 'top'
        });
      }
    };

    const viewPropertyDetails = (property) => {
      selectedProperty.value = property;
      showDetailsDialog.value = true;
    };

    const refreshData = async () => {
      await dataStore.fetchAllData();
    };

    const onRequest = (props) => {
      pagination.value = props.pagination;
    };

    onMounted(async () => {
      await dataStore.fetchAllData();
    });

    return {
      // Data
      properties,
      availableCount,
      soldCount,
      underOfferCount,
      isAuthenticated,

      // UI state
      showForm,
      showDeleteDialog,
      showDetailsDialog,
      itemToEdit,
      itemToDelete,
      selectedProperty,

      // Table config
      columns,
      pagination,

      // Services
      dataStore,

      // Methods
      getImageUrl,
      formatPrice,
      formatDate,
      getStatusColor,
      getStatusClass,
      openFormForCreate,
      openFormForEdit,
      closeForm,
      handleSave,
      confirmDelete,
      cancelDelete,
      handleDelete,
      updatePropertyStatus,
      viewPropertyDetails,
      refreshData,
      onRequest
    };
  }
});
</script>

<style scoped>
/* Modern Analytics Cards */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.analytics-item {
  transition: transform 0.3s ease;
}

.analytics-item:hover {
  transform: translateY(-8px);
}

.analytics-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.analytics-card:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Card specific backgrounds */
.total-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.available-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #21ba45 0%, #4caf50 100%);
}

.offer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff9800 0%, #ffb74d 100%);
}

.sold-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f44336 0%, #ef5350 100%);
}

/* Icon wrappers with gradients */
.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.stat-icon-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: 0.8;
  filter: blur(8px);
}

.total-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.available-bg {
  background: linear-gradient(135deg, #21ba45 0%, #4caf50 100%);
}

.offer-bg {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
}

.sold-bg {
  background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
}

/* Typography */
.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 1rem;
  font-weight: 600;
  color: #718096;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-trend.positive {
  color: #21ba45;
}

.stat-trend.warning {
  color: #ff9800;
}

.stat-trend.success {
  color: #f44336;
}

/* Progress bars */
.progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.8s ease;
}

.progress-fill.available-fill {
  background: linear-gradient(90deg, #21ba45 0%, #4caf50 100%);
}

.progress-fill.offer-fill {
  background: linear-gradient(90deg, #ff9800 0%, #ffb74d 100%);
}

.progress-fill.sold-fill {
  background: linear-gradient(90deg, #f44336 0%, #ef5350 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .analytics-card {
    border-radius: 16px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .stat-icon-wrapper q-icon {
    font-size: 2rem;
  }

  .analytics-card .q-pa-lg {
    padding: 16px !important;
  }
}

@media (max-width: 480px) {
  .stat-number {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.875rem;
  }

  .stat-trend {
    font-size: 0.75rem;
  }
}

.admin-table {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.admin-table .q-table__top {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.admin-table .q-table thead th {
  font-weight: 600;
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
}

.admin-table .q-table tbody td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.admin-table .q-table tbody tr:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

.status-select {
  min-width: 120px;
}

.status-available {
  background-color: rgba(76, 175, 80, 0.1);
}

.status-sold {
  background-color: rgba(244, 67, 54, 0.1);
}

.status-under-offer {
  background-color: rgba(255, 152, 0, 0.1);
}
</style>
