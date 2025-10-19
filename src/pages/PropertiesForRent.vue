<template>
  <q-page class="q-pa-md">
    <!-- Header Section -->
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Properties for Rent</div>
        <div class="text-subtitle1 text-grey-6">Comprehensive rental property management</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          icon="refresh"
          label="Refresh"
          @click="refreshData"
          :loading="dataStore.loading"
        />
        <q-btn
          v-if="isAuthenticated"
          color="secondary"
          icon="add"
          label="Add Property"
          @click="openFormForCreate"
        />
      </div>
    </div>

    <!-- Modern Analytics Cards -->
    <div class="analytics-grid q-mb-xl">
      <!-- Available for Rent Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card available-rent-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper available-rent-bg">
                  <q-icon name="apartment" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ availableCount }}</div>
                <div class="stat-label">Available for Rent</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_up" size="1rem" />
                  <span>{{ properties.length > 0 ? Math.round((availableCount / properties.length) * 100) : 0 }}% of total</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill available-rent-fill" :style="{ width: properties.length > 0 ? `${(availableCount / properties.length) * 100}%` : '0%' }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Currently Rented Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card rented-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper rented-bg">
                  <q-icon name="meeting_room" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ rentedCount }}</div>
                <div class="stat-label">Currently Rented</div>
                <div class="stat-trend neutral">
                  <q-icon name="check_circle" size="1rem" />
                  <span>Active leases</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill rented-fill" :style="{ width: properties.length > 0 ? `${(rentedCount / properties.length) * 100}%` : '0%' }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Under Offer Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card under-offer-rent-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper under-offer-rent-bg">
                  <q-icon name="pending" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ underOfferCount }}</div>
                <div class="stat-label">Under Offer</div>
                <div class="stat-trend warning">
                  <q-icon name="access_time" size="1rem" />
                  <span>Application pending</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill under-offer-rent-fill" :style="{ width: properties.length > 0 ? `${(underOfferCount / properties.length) * 100}%` : '0%' }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Properties Table -->
    <q-card flat class="q-mb-md">
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

        <template #body-cell-propertyId="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.propertyId || 'N/A' }}</div>
          </q-td>
        </template>

        <template #body-cell-price="props">
          <q-td :props="props">
            <div class="text-weight-bold text-secondary">{{ formatPrice(props.row.price) }}</div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <!-- Editable status for authenticated users (admins) -->
            <q-select
              v-if="isAuthenticated"
              v-model="props.row.status"
              :options="['Available', 'Rented', 'Under Offer']"
              dense
              outlined
              emit-value
              map-options
              @update:model-value="updatePropertyStatus(props.row, $event)"
              class="status-select"
              :class="getStatusClass(props.row.status)"
            />
            <!-- Read-only status display for regular users -->
            <q-chip
              v-else
              :color="getStatusColor(props.row.status)"
              text-color="white"
              dense
              class="status-chip"
            >
              {{ props.row.status }}
            </q-chip>
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
                size="sm"
                @click="viewPropertyDetails(props.row)"
              >
                <q-tooltip>View Details</q-tooltip>
              </q-btn>
              <q-btn
                v-if="isAuthenticated"
                flat
                round
                dense
                icon="edit"
                color="warning"
                size="sm"
                @click="openFormForEdit(props.row)"
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
                size="sm"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Delete Property</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Property Form Modal -->
    <q-dialog v-model="showForm" persistent maximized class="scrollable-modal">
      <q-scroll-area style="height: 90vh; max-width: 100%;">
        <AddPropertyForm
          :item-to-edit="itemToEdit"
          @save="handleSave"
          @close="closeForm"
        />
      </q-scroll-area>
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

    <!-- Modern Property Details Modal -->
    <q-dialog v-model="showDetailsDialog" class="modern-modal" maximized>
      <q-scroll-area style="height: 90vh; max-width: 100%;">
        <div class="modal-card">
          <!-- Hero Section -->
          <div class="modal-hero">
            <div class="hero-background">
              <img :src="getImageUrl(selectedProperty)" alt="Property" class="hero-image">
              <div class="hero-overlay"></div>
            </div>
            <div class="hero-content">
              <div class="hero-title-section">
                <h1 class="hero-title">{{ selectedProperty?.name }}</h1>
                <div class="hero-subtitle">
                  <q-icon name="location_on" size="sm" />
                  <span>{{ selectedProperty?.address }}, {{ selectedProperty?.city }}</span>
                </div>
              </div>
              <div class="hero-actions">
                <q-chip
                  :color="getStatusColor(selectedProperty?.status)"
                  text-color="white"
                  :label="selectedProperty?.status"
                  class="status-chip-large"
                />
                <q-btn
                  icon="close"
                  flat
                  round
                  dense
                  class="close-btn"
                  @click="showDetailsDialog = false"
                />
              </div>
            </div>
            <div class="hero-price">
              <div class="price-display">{{ formatPrice(selectedProperty?.price) }}</div>
              <div class="price-label">Monthly Rent</div>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="modal-content" v-if="selectedProperty">
            <div class="content-grid">
              <!-- Basic Property Information -->
              <div class="info-card glass-card">
                <div class="card-header">
                  <div class="card-icon-wrapper">
                    <q-icon name="home" size="md" />
                  </div>
                  <h3>Property Information</h3>
                </div>
                <div class="card-content">
                  <div class="info-row">
                    <span class="info-label">Property Type</span>
                    <span class="info-value">{{ selectedProperty.type }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Location</span>
                    <span class="info-value">{{ selectedProperty.city }}, {{ selectedProperty.address }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Property ID</span>
                    <span class="info-value">{{ selectedProperty.propertyId || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Date Listed</span>
                    <span class="info-value">{{ formatDate(selectedProperty.dateListed) }}</span>
                  </div>
                  <div class="description-section">
                    <h4 class="section-title">Description</h4>
                    <p class="description-text">{{ selectedProperty.description || 'No description available' }}</p>
                  </div>
                </div>
              </div>

              <!-- Property Documents & Details -->
              <div class="info-card glass-card">
                <div class="card-header">
                  <div class="card-icon-wrapper">
                    <q-icon name="description" size="md" />
                  </div>
                  <h3>Documents & Details</h3>
                </div>
                <div class="card-content">
                  <div class="info-row">
                    <span class="info-label">Title Document</span>
                    <span class="info-value">{{ selectedProperty.titleDocument || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Landmark</span>
                    <span class="info-value">{{ selectedProperty.landmark || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Property Status</span>
                    <q-chip
                      :color="getStatusColor(selectedProperty.status)"
                      text-color="white"
                      :label="selectedProperty.status"
                      size="sm"
                    />
                  </div>
                  <div class="description-section">
                    <h4 class="section-title">Additional Notes</h4>
                    <p class="description-text">{{ selectedProperty.note || 'No additional notes available' }}</p>
                  </div>
                </div>
              </div>

              <!-- Seller Information -->
              <div class="info-card glass-card">
                <div class="card-header">
                  <div class="card-icon-wrapper">
                    <q-icon name="person" size="md" />
                  </div>
                  <h3>Seller Information</h3>
                </div>
                <div class="card-content">
                  <div class="info-row">
                    <span class="info-label">Name</span>
                    <span class="info-value">{{ selectedProperty.sellerName || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Contact</span>
                    <span class="info-value">{{ selectedProperty.sellerContact || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Email</span>
                    <span class="info-value">{{ selectedProperty.sellerEmail || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <!-- Agent Information -->
              <div class="info-card glass-card">
                <div class="card-header">
                  <div class="card-icon-wrapper">
                    <q-icon name="support_agent" size="md" />
                  </div>
                  <h3>Agent Information</h3>
                </div>
                <div class="card-content">
                  <div class="contact-info">
                    <div class="contact-item">
                      <q-icon name="account_circle" />
                      <div>
                        <div class="contact-label">Agent Name</div>
                        <div class="contact-value">{{ selectedProperty.agentName || 'N/A' }}</div>
                      </div>
                    </div>
                    <div class="contact-item">
                      <q-icon name="phone" />
                      <div>
                        <div class="contact-label">Contact Number</div>
                        <div class="contact-value">{{ selectedProperty.agentNumber || 'N/A' }}</div>
                      </div>
                    </div>
                    <div class="contact-item">
                      <q-icon name="email" />
                      <div>
                        <div class="contact-label">Email Address</div>
                        <div class="contact-value">{{ selectedProperty.agentEmail || 'N/A' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-scroll-area>
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
  name: 'PropertiesForRent',
  components: { AddPropertyForm },
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    const $q = useQuasar();

    // Data
    const properties = computed(() => dataStore.listingsForRentals);
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    // Statistics
    const availableCount = computed(() =>
      properties.value.filter(p => p.status === 'Available').length
    );
    const rentedCount = computed(() =>
      properties.value.filter(p => p.status === 'Rented').length
    );
    const underOfferCount = computed(() =>
      properties.value.filter(p => p.status === 'Under Offer').length
    );

    // Modal states
    const showForm = ref(false);
    const showDeleteDialog = ref(false);
    const showDetailsDialog = ref(false);
    const selectedProperty = ref(null);
    const itemToEdit = ref(null);
    const itemToDelete = ref(null);

    // Table configuration
    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 1,
      rowsPerPage: 50,
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
        name: 'propertyId',
        label: 'Property ID',
        align: 'left',
        field: 'propertyId',
        sortable: true
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
        'Rented': 'negative',
        'Under Offer': 'warning'
      };
      return colors[status] || 'grey';
    };

    const getStatusClass = (status) => {
      const classes = {
        'Available': 'status-available',
        'Rented': 'status-rented',
        'Under Offer': 'status-under-offer'
      };
      return classes[status] || '';
    };

    // Modal management
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

    const viewPropertyDetails = (property) => {
      selectedProperty.value = property;
      showDetailsDialog.value = true;
    };

    const confirmDelete = (property) => {
      itemToDelete.value = property;
      showDeleteDialog.value = true;
    };

    const cancelDelete = () => {
      itemToDelete.value = null;
      showDeleteDialog.value = false;
    };

    // CRUD operations
    const handleSave = async (formData) => {
      try {
        if (itemToEdit.value) {
          await dataStore.updateItem('listingsForRentals', itemToEdit.value.id, formData);
          $q.notify({
            type: 'positive',
            message: 'Rental property updated successfully!',
            position: 'top'
          });
        } else {
          await dataStore.addNewItem('listingsForRentals', formData);
          $q.notify({
            type: 'positive',
            message: 'Rental property added successfully!',
            position: 'top'
          });
        }
        closeForm();
        await refreshData();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to save rental property. Please try again.',
          position: 'top'
        });
      }
    };

    const handleDelete = async () => {
      try {
        await dataStore.deleteItem('listingsForRentals', itemToDelete.value.id);
        $q.notify({
          type: 'positive',
          message: 'Rental property deleted successfully!',
          position: 'top'
        });
        cancelDelete();
        await refreshData();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to delete rental property. Please try again.',
          position: 'top'
        });
      }
    };

    const updatePropertyStatus = async (property, newStatus) => {
      try {
        await dataStore.updateItem('listingsForRentals', property.id, { ...property, status: newStatus });
        $q.notify({
          type: 'positive',
          message: `Property status updated to ${newStatus}`,
          position: 'top'
        });
        await refreshData();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to update property status. Please try again.',
          position: 'top'
        });
      }
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
      rentedCount,
      underOfferCount,
      isAuthenticated,

      // Modal states
      showForm,
      showDeleteDialog,
      showDetailsDialog,
      selectedProperty,
      itemToEdit,
      itemToDelete,

      // Table
      pagination,
      columns,

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
      viewPropertyDetails,
      confirmDelete,
      cancelDelete,
      handleSave,
      handleDelete,
      updatePropertyStatus,
      refreshData,
      onRequest
    };
  }
});
</script>

<style scoped>
/* Analytics Grid */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.analytics-item {
  min-height: 140px;
}

/* Analytics Cards */
.analytics-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.analytics-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.analytics-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

/* Card Specific Backgrounds */
.available-rent-card::before {
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
}

.rented-card::before {
  background: linear-gradient(90deg, #F44336 0%, #EF5350 100%);
}

.under-offer-rent-card::before {
  background: linear-gradient(90deg, #FF9800 0%, #FFB74D 100%);
}

/* Icon Wrappers */
.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.available-rent-bg {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.rented-bg {
  background: linear-gradient(135deg, #F44336 0%, #EF5350 100%);
}

.under-offer-rent-bg {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
}

.stat-icon-wrapper:hover {
  transform: scale(1.05);
}

/* Stat Content */
.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 500;
  gap: 4px;
}

.stat-trend.positive {
  color: #4CAF50;
}

.stat-trend.neutral {
  color: #666;
}

.stat-trend.warning {
  color: #FF9800;
}

.stat-trend q-icon {
  font-size: 1rem;
}

/* Progress Bars */
.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Progress Fill Colors */
.available-rent-fill {
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
}

.rented-fill {
  background: linear-gradient(90deg, #F44336 0%, #EF5350 100%);
}

.under-offer-rent-fill {
  background: linear-gradient(90deg, #FF9800 0%, #FFB74D 100%);
}

/* Admin Table Styles */
.admin-table {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.admin-table .q-table__top {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.8);
}

.admin-table .q-table thead th {
  font-weight: 600;
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  background: rgba(25, 118, 210, 0.05);
}

.admin-table .q-table tbody td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.admin-table .q-table tbody tr:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

/* Status Styles */
.status-select {
  min-width: 120px;
}

.status-chip {
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 12px;
  min-height: 24px;
}

.status-available {
  background-color: rgba(76, 175, 80, 0.1);
}

.status-rented {
  background-color: rgba(244, 67, 54, 0.1);
}

.status-under-offer {
  background-color: rgba(255, 152, 0, 0.1);
}

/* Modern Property Details Modal Styles */
.modern-modal .q-dialog__inner {
  padding: 0;
  max-width: 100vw;
  max-height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 0;
}

.modern-modal .q-scroll-area {
  border-radius: 0;
}

/* Scrollable Form Modal Styles */
.scrollable-modal .q-dialog__inner {
  padding: 0;
  max-width: 100vw;
  max-height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 0;
}

.scrollable-modal .q-scroll-area {
  border-radius: 0;
}

/* Modal Card */
.modal-card {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  overflow: hidden;
}

/* Hero Section */
.modal-hero {
  position: relative;
  height: 450px;
  overflow: hidden;
  border-radius: 0;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hero-title-section {
  flex: 1;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 400;
}

.hero-subtitle q-icon {
  margin-right: 8px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-price {
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-display {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.price-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Modal Content */
.modal-content {
  padding: 40px;
  background: rgba(255, 255, 255, 0.98);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Glass Cards */
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* Card Headers */
.card-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 16px;
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: white;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Card Content */
.card-content {
  padding: 0 24px 24px 24px;
}

/* Info Rows */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  text-align: right;
}

/* Description Section */
.description-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.description-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #555;
  margin: 0;
}


/* Status Chip Large */
.status-chip-large {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .analytics-item {
    min-height: 120px;
  }

  .analytics-card {
    border-radius: 12px;
  }

  .stat-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.9rem;
  }

  .hero-content {
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-actions {
    margin-left: 0;
    margin-top: 16px;
    align-self: flex-end;
    flex-direction: column;
    gap: 8px;
  }

  .hero-price {
    position: relative;
    left: 0;
    right: 0;
    bottom: 0;
    margin-top: 20px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .modal-content {
    padding: 24px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }


  .modal-hero {
    height: 350px;
  }
}

/* Contact Information Styles */
.contact-info {
  padding: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item .q-icon {
  color: #718096;
  background: rgba(113, 128, 150, 0.1);
  border-radius: 6px;
  padding: 6px;
}

.contact-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.contact-value {
  font-size: 1rem;
  color: #2d3748;
  font-weight: 500;
}
</style>
