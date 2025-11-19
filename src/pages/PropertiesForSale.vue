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
              :options="['Available', 'Sold', 'Under Offer']"
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
        <!-- Hero Section (Header Only) -->
        <div class="modal-hero">
          <div class="hero-background">
            <img :src="getImageUrl(selectedProperty)" alt="Property" class="hero-image">
            <div class="hero-overlay"></div>
          </div>
          <div class="hero-content">
            <div class="hero-header">
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
              <div class="price-label">Property Value</div>
            </div>
          </div>
        </div>

        <!-- Modal Content (Property Information - Top) -->
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

            <!-- Agent Information -->
            <div class="info-card glass-card">
              <div class="card-header">
                <div class="card-icon-wrapper">
                  <q-icon name="person" size="md" />
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

            <!-- Seller Information -->
            <div class="info-card glass-card">
              <div class="card-header">
                <div class="card-icon-wrapper">
                  <q-icon name="business" size="md" />
                </div>
                <h3>Seller Information</h3>
              </div>
              <div class="card-content">
                <div class="contact-info">
                  <div class="contact-item">
                    <q-icon name="account_circle" />
                    <div>
                      <div class="contact-label">Seller Name</div>
                      <div class="contact-value">{{ selectedProperty.sellerName || 'N/A' }}</div>
                    </div>
                  </div>
                  <div class="contact-item">
                    <q-icon name="phone" />
                    <div>
                      <div class="contact-label">Contact Number</div>
                      <div class="contact-value">{{ selectedProperty.sellerContact || 'N/A' }}</div>
                    </div>
                  </div>
                  <div class="contact-item">
                    <q-icon name="email" />
                    <div>
                      <div class="contact-label">Email Address</div>
                      <div class="contact-value">{{ selectedProperty.sellerEmail || 'N/A' }}</div>
                    </div>
                  </div>
                </div>
                <div class="contact-actions">
                  <q-btn
                    label="Call Seller"
                    color="primary"
                    icon="phone"
                    class="contact-btn"
                    :href="`tel:${selectedProperty.sellerContact}`"
                    v-if="selectedProperty.sellerContact"
                  />
                  <q-btn
                    label="Email Seller"
                    color="secondary"
                    icon="email"
                    class="contact-btn"
                    :href="`mailto:${selectedProperty.sellerEmail}`"
                    v-if="selectedProperty.sellerEmail"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Gallery Section (Bottom) -->
        <div v-if="selectedProperty?.images && selectedProperty.images.length > 0" class="gallery-section q-pa-lg">
          <div class="text-h6 text-weight-bold q-mb-md">Property Images</div>
          <ImageGallery
            :images="selectedProperty.images"
            :initial-index="selectedProperty.primaryImage || 0"
            :primary-image="selectedProperty.primaryImage || 0"
          />
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
import ImageGallery from 'src/components/ImageGallery.vue';

export default defineComponent({
  name: 'PropertiesForSale',
  components: { AddPropertyForm, ImageGallery },
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
      if (!property) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070';
      // Use primary image from images array if available
      if (property.images && Array.isArray(property.images) && property.images.length > 0) {
        const primaryIndex = property.primaryImage !== undefined && property.primaryImage !== null 
          ? property.primaryImage 
          : 0;
        return property.images[primaryIndex] || property.images[0];
      }
      // Fallback to old image property or default
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
      } catch (error) {
        console.error('Error saving property:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to save property. Please try again.',
          position: 'top',
          timeout: 3000
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
      } catch (error) {
        console.error('Error deleting property:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to delete property. Please try again.',
          position: 'top',
          timeout: 3000
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

.status-chip {
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 12px;
  min-height: 24px;
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

.modal-card {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  overflow: hidden;
}

/* Hero Section */
.modal-hero {
  position: relative;
  height: 400px;
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
  filter: brightness(0.6);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  color: white;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hero-title-section {
  flex: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.hero-subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  opacity: 0.9;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.status-chip-large {
  font-size: 0.9rem;
  padding: 8px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-price {
  text-align: center;
  margin-bottom: 16px;
}

.price-display {
  font-size: 2.2rem;
  font-weight: 800;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: 4px;
}

.price-label {
  font-size: 1rem;
  opacity: 0.9;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

/* Modal Content */
.modal-content {
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 400px);
}

/* Gallery Section */
.gallery-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 32px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  height: fit-content;
}

/* Glassmorphism Cards */
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  overflow: hidden;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Card Headers */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  padding: 20px 20px 16px 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
}

.card-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 8px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card Content */
.card-content {
  padding: 0 20px 20px 20px;
}

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
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.info-value {
  color: #2d3748;
  font-weight: 500;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

/* Description Sections */
.description-section {
  margin: 20px 0 0 0;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.description-text {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

/* Contact Information */
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

/* Contact Actions */
.contact-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.contact-btn {
  flex: 1;
  min-width: 120px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .price-display {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .modal-hero {
    height: 300px;
  }

  .hero-content {
    padding: 24px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .price-display {
    font-size: 1.6rem;
  }

  .modal-content {
    padding: 24px 16px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .hero-actions {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .contact-actions {
    flex-direction: column;
  }

  .contact-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-hero {
    height: 250px;
  }

  .hero-content {
    padding: 20px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .price-display {
    font-size: 1.4rem;
  }

  .card-header h3 {
    font-size: 1.2rem;
  }

  .info-label,
  .info-value {
    font-size: 0.9rem;
  }
}
</style>
