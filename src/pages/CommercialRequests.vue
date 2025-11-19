<template>
  <q-page class="q-pa-md">
    <!-- Header Section -->
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary q-mb-sm">Commercial Property Requests</div>
        <div class="text-subtitle1 text-grey-6">Manage business inquiries for commercial spaces</div>
      </div>
      <q-btn
        v-if="isAuthenticated"
        color="secondary"
        icon="add"
        label="Add New Request"
        @click="openFormForCreate"
        class="q-px-lg"
        unelevated
      />
    </div>

    <!-- Statistics Cards -->
    <div class="analytics-grid q-mb-xl">
      <div class="analytics-item">
        <q-card class="analytics-card new-requests-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <div class="stat-icon-wrapper new-requests-bg">
                  <q-icon name="schedule" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col q-ml-md">
                <div class="stat-number">{{ newRequestsCount }}</div>
                <div class="stat-label">New Requests</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_up" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="analytics-item">
        <q-card class="analytics-card contacted-requests-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <div class="stat-icon-wrapper contacted-requests-bg">
                  <q-icon name="phone" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col q-ml-md">
                <div class="stat-number">{{ contactedRequestsCount }}</div>
                <div class="stat-label">Contacted</div>
                <div class="stat-trend neutral">
                  <q-icon name="trending_flat" />
                  <span>In Progress</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="analytics-item">
        <q-card class="analytics-card closed-requests-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <div class="stat-icon-wrapper closed-requests-bg">
                  <q-icon name="check_circle" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col q-ml-md">
                <div class="stat-number">{{ closedRequestsCount }}</div>
                <div class="stat-label">Closed</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_up" />
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Table -->
    <q-card class="admin-table q-mb-md">
      <q-table
        :rows="requests"
        :columns="columns"
        row-key="id"
        :loading="dataStore.loading"
        :pagination="pagination"
        @request="onRequest"
        binary-state-sort
        class="admin-table"
        :rows-per-page-options="[10, 25, 50, 100]"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              v-if="!isAuthenticated"
              :color="getStatusColor(props.row.status)"
              text-color="white"
              :label="props.row.status"
              size="sm"
              class="status-chip"
            />
            <q-select
              v-else
              v-model="props.row.status"
              :options="['New', 'Contacted', 'Closed']"
              dense
              outlined
              emit-value
              map-options
              @update:model-value="updateRequestStatus(props.row, $event)"
              class="status-select"
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
              @click="viewRequestDetails(props.row)"
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
              @click="openFormForEdit(props.row)"
              class="q-ml-xs"
            >
              <q-tooltip>Edit Request</q-tooltip>
            </q-btn>
            <q-btn
              v-if="isAuthenticated"
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="confirmDelete(props.row)"
              class="q-ml-xs"
            >
              <q-tooltip>Delete Request</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- View Request Details Modal -->
    <q-dialog v-model="showDetailsDialog" class="modern-modal" maximized>
      <q-scroll-area style="height: 90vh; max-width: 100%;">
        <q-card class="modal-card">
          <!-- Hero Section -->
          <div class="modal-hero">
            <div class="hero-background">
              <div class="hero-image" :style="{ backgroundImage: `url(${getRequestImage(requestToView)})` }"></div>
              <div class="hero-overlay"></div>
            </div>
            <div class="hero-content">
              <div class="hero-title-section">
                <div class="hero-title">{{ requestToView?.clientName || 'Business Request' }}</div>
                <div class="hero-subtitle">
                  <q-icon name="business" />
                  <span>{{ requestToView?.request || 'Commercial Space Request' }}</span>
                </div>
              </div>
              <div class="hero-actions">
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  color="white"
                  @click="closeDetailsModal"
                  class="close-btn"
                />
              </div>
            </div>
            <div class="hero-price">
              <div class="price-display">{{ formatBudget(requestToView?.budget) }}</div>
              <div class="price-label">Monthly Budget</div>
            </div>
          </div>

          <div class="modal-content">
            <div class="content-grid">
            <!-- Request Information -->
            <q-card class="glass-card">
              <q-card-section class="card-header">
                <div class="card-icon-wrapper">
                  <q-icon name="info" size="md" />
                </div>
                <h3>Request Information</h3>
              </q-card-section>
              <q-card-section class="card-content">
                <div class="info-row">
                  <div class="info-label">Business Name</div>
                  <div class="info-value">{{ requestToView?.clientName || 'N/A' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">{{ requestToView?.phoneNumber || 'N/A' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Space Type</div>
                  <div class="info-value">{{ requestToView?.request || 'N/A' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">City</div>
                  <div class="info-value">{{ requestToView?.city || 'N/A' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">London</div>
                  <div class="info-value">{{ requestToView?.london || 'N/A' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Address</div>
                  <div class="info-value">{{ requestToView?.address || 'N/A' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Status</div>
                  <div class="info-value">
                    <q-chip :color="getStatusColor(requestToView?.status)" text-color="white" :label="requestToView?.status" size="sm" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Contact Information -->
            <q-card class="glass-card">
              <q-card-section class="card-header">
                <div class="card-icon-wrapper">
                  <q-icon name="contact_phone" size="md" />
                </div>
                <h3>Contact Information</h3>
              </q-card-section>
              <q-card-section class="card-content">
                <div class="contact-info">
                  <div class="contact-item">
                    <q-icon name="account_circle" />
                    <div>
                      <div class="contact-label">Business Representative</div>
                      <div class="contact-value">{{ requestToView?.clientName || 'N/A' }}</div>
                    </div>
                  </div>
                  <div class="contact-item">
                    <q-icon name="phone" />
                    <div>
                      <div class="contact-label">Phone Number</div>
                      <div class="contact-value">{{ requestToView?.phoneNumber || 'N/A' }}</div>
                    </div>
                  </div>
                  <div class="contact-item">
                    <q-icon name="location_on" />
                    <div>
                      <div class="contact-label">Location</div>
                      <div class="contact-value">{{ requestToView?.address || 'N/A' }}, {{ requestToView?.city || 'N/A' }}</div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Budget & Requirements -->
            <q-card class="glass-card">
              <q-card-section class="card-header">
                <div class="card-icon-wrapper">
                  <q-icon name="attach_money" size="md" />
                </div>
                <h3>Budget & Requirements</h3>
              </q-card-section>
              <q-card-section class="card-content">
                <div class="info-row">
                  <div class="info-label">Budget Range</div>
                  <div class="info-value">{{ formatBudget(requestToView?.budget) }}</div>
                </div>
                <div class="description-section">
                  <div class="section-title">Space Requirements</div>
                  <div class="description-text">{{ requestToView?.specification || 'No specific requirements provided' }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          </div>
        </q-card>
      </q-scroll-area>
    </q-dialog>

    <!-- Add/Edit Request Form Modal -->
    <q-dialog v-model="showForm" persistent maximized class="scrollable-modal">
      <q-scroll-area style="height: 90vh; max-width: 100%;">
        <q-card class="add-form-card" style="min-width: 600px; max-width: 800px; margin: 0 auto;">
          <q-card-section>
            <div class="text-h6">{{ editingRequest ? 'Edit Commercial Request' : 'Add New Commercial Request' }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-md">
            <q-form @submit="handleSave" class="q-gutter-lg">
              <!-- Form Content -->
              <!-- Form Sections Row -->
              <div class="row q-gutter-md">
                <!-- Left Column -->
                <div class="col-12 col-md-6">
                  <!-- Basic Business Information -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Business Information</div>
                    <q-input
                      filled
                      v-model="requestForm.clientName"
                      label="Client Name *"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'Client name is required']"
                    />
                    <q-input
                      filled
                      v-model="requestForm.phoneNumber"
                      label="Phone Number *"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'Phone number is required']"
                    />
                  </div>

                  <!-- Location Information -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Location Information</div>
                    <q-input
                      filled
                      v-model="requestForm.city"
                      label="City *"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'City is required']"
                    />
                    <q-input
                      filled
                      v-model="requestForm.london"
                      label="London"
                      placeholder="London area or landmark"
                    />
                    <q-input
                      filled
                      v-model="requestForm.address"
                      label="Address *"
                      placeholder="Specific address or area"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'Address is required']"
                    />
                  </div>
                </div>

                <!-- Right Column -->
                <div class="col-12 col-md-6">
                  <!-- Request Details -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Request Details</div>
                    <q-input
                      filled
                      v-model="requestForm.request"
                      label="Request Type *"
                      placeholder="e.g., Office Space, Retail Shop, Warehouse, Restaurant Space, Showroom, Industrial Space, Medical Facility"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'Request type is required']"
                    />
                    <q-input
                      filled
                      v-model="requestForm.budget"
                      label="Budget Range *"
                      placeholder="e.g., ₦3M-5M, ₦1M-2M"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'Budget is required']"
                    />
                    <q-select
                      v-if="editingRequest"
                      filled
                      v-model="requestForm.status"
                      :options="['New', 'Contacted', 'Closed']"
                      label="Status"
                    />
                  </div>

                  <!-- Additional Information -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Additional Information</div>
                    <q-input
                      filled
                      type="textarea"
                      v-model="requestForm.specification"
                      label="Space Requirements & Specifications"
                      placeholder="Describe your space needs (sq ft, facilities, parking, etc.)..."
                      rows="6"
                    />
                  </div>
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn flat label="Cancel" @click="closeForm" />
                <q-btn
                  :label="editingRequest ? 'Update Request' : 'Submit Request'"
                  color="secondary"
                  class="q-ml-sm"
                  type="submit"
                />
              </div>
            </q-form>
            </q-card-section>
          </q-card>
        </q-scroll-area>
      </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this commercial request?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="cancelDelete" />
          <q-btn flat label="Delete" color="negative" @click="handleDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useDataStore } from 'src/stores/data-store';
import { useAuthStore } from 'src/stores/auth-store';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'CommercialRequests',
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    const $q = useQuasar();

    // Authentication
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    // Data
    const requests = computed(() => dataStore.commercialRequests);

    // Statistics
    const newRequestsCount = computed(() =>
      requests.value.filter(r => r.status === 'New').length
    );
    const contactedRequestsCount = computed(() =>
      requests.value.filter(r => r.status === 'Contacted').length
    );
    const closedRequestsCount = computed(() =>
      requests.value.filter(r => r.status === 'Closed').length
    );

    // Modal states
    const showForm = ref(false);
    const showDetailsDialog = ref(false);
    const showDeleteDialog = ref(false);

    // Form data
    const editingRequest = ref(null);
    const requestToView = ref(null);
    const requestToDelete = ref(null);

    const requestForm = reactive({
      clientName: '',
      phoneNumber: '',
      request: '',
      budget: '',
      city: '',
      Locationn: '',
      address: '',
      specification: '',
      status: 'New'
    });

    // Table configuration
    const pagination = ref({
      sortBy: 'clientName',
      descending: false,
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 0
    });

    const columns = [
      {
        name: 'clientName',
        label: 'Client Name',
        align: 'left',
        field: 'clientName',
        sortable: true
      },
      {
        name: 'request',
        label: 'Request',
        align: 'left',
        field: 'request',
        sortable: true
      },
      {
        name: 'phoneNumber',
        label: 'Phone Number',
        align: 'left',
        field: 'phoneNumber',
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
        name: 'Locationn',
        label: 'Locationn',
        align: 'left',
        field: 'Locationn',
        sortable: true
      },
      {
        name: 'budget',
        label: 'Budget',
        align: 'left',
        field: 'budget',
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
    const getStatusColor = (status) => {
      const colors = {
        'New': 'info',
        'Contacted': 'warning',
        'Closed': 'positive'
      };
      return colors[status] || 'grey';
    };

    const getRequestImage = (request) => {
      const images = {
        'Office Space': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069',
        'Retail Shop': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070',
        'Warehouse': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070',
        'Restaurant Space': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070',
        'Showroom': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2070',
        'Industrial Space': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070',
        'Medical Facility': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070'
      };
      return images[request?.request] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070';
    };

    const formatBudget = (budget) => {
      if (!budget) return 'N/A';
      return budget.startsWith('₦') ? budget : `₦${budget}`;
    };

    // Modal management
    const openFormForCreate = () => {
      editingRequest.value = null;
      Object.assign(requestForm, {
        clientName: '',
        phoneNumber: '',
        request: '',
        budget: '',
        city: '',
        Locationn: '',
        address: '',
        specification: '',
        status: 'New'
      });
      showForm.value = true;
    };

    const openFormForEdit = (request) => {
      editingRequest.value = request;
      Object.assign(requestForm, {
        clientName: request.clientName || '',
        phoneNumber: request.phoneNumber || '',
        request: request.request || '',
        budget: request.budget || '',
        city: request.city || '',
        Locationn: request.Locationn || '',
        address: request.address || '',
        specification: request.specification || '',
        status: request.status || 'New'
      });
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      editingRequest.value = null;
    };

    const viewRequestDetails = (request) => {
      requestToView.value = request;
      showDetailsDialog.value = true;
    };

    const closeDetailsModal = () => {
      showDetailsDialog.value = false;
      requestToView.value = null;
    };

    const confirmDelete = (request) => {
      requestToDelete.value = request;
      showDeleteDialog.value = true;
    };

    const cancelDelete = () => {
      showDeleteDialog.value = false;
      requestToDelete.value = null;
    };

    // CRUD operations
    const handleSave = async () => {
      try {
        if (editingRequest.value) {
          await dataStore.updateItem('commercial-requests', editingRequest.value.id, { ...requestForm });
          $q.notify({
            type: 'positive',
            message: 'Commercial request updated successfully!',
            position: 'top'
          });
        } else {
          await dataStore.addNewItem('commercial-requests', { ...requestForm });
          $q.notify({
            type: 'positive',
            message: 'Commercial request added successfully!',
            position: 'top'
          });
        }
        closeForm();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to save request. Please try again.',
          position: 'top'
        });
      }
    };

    const handleDelete = async () => {
      try {
        await dataStore.deleteItem('commercial-requests', requestToDelete.value.id);
        $q.notify({
          type: 'positive',
          message: 'Commercial request deleted successfully!',
          position: 'top'
        });
        cancelDelete();
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to delete request. Please try again.',
          position: 'top'
        });
      }
    };

    const updateRequestStatus = async (request, newStatus) => {
      try {
        await dataStore.updateItem('commercial-requests', request.id, { ...request, status: newStatus });
        $q.notify({
          type: 'positive',
          message: 'Request status updated successfully!',
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

    // Contact functionality
    const contactBusiness = (request) => {
      const contactInfo = `Business: ${request.clientName}\nPhone: ${request.phoneNumber}`;
      $q.notify({
        type: 'info',
        message: `Contact Information:\n${contactInfo}`,
        position: 'top',
        timeout: 5000
      });
    };

    // Table events
    const onRequest = (props) => {
      pagination.value = props.pagination;
    };

    const refreshData = () => {
      dataStore.fetchAllData();
    };

    onMounted(() => {
      dataStore.fetchAllData();
    });

    return {
      // Data
      requests,
      newRequestsCount,
      contactedRequestsCount,
      closedRequestsCount,
      isAuthenticated,

      // Modal states
      showForm,
      showDetailsDialog,
      showDeleteDialog,
      editingRequest,
      requestToView,
      requestToDelete,

      // Table
      pagination,
      columns,

      // Services
      dataStore,

      // Form
      requestForm,

      // Methods
      getStatusColor,
      getRequestImage,
      formatBudget,
      openFormForCreate,
      openFormForEdit,
      closeForm,
      viewRequestDetails,
      closeDetailsModal,
      confirmDelete,
      cancelDelete,
      handleSave,
      handleDelete,
      updateRequestStatus,
      contactBusiness,
      onRequest,
      refreshData
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
.new-requests-card::before {
  background: linear-gradient(90deg, #2196F3 0%, #21CBF3 100%);
}

.contacted-requests-card::before {
  background: linear-gradient(90deg, #FF9800 0%, #FFB74D 100%);
}

.closed-requests-card::before {
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
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

.new-requests-bg {
  background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
}

.contacted-requests-bg {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
}

.closed-requests-bg {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
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
}

@media (max-width: 480px) {
  .hero-content {
    padding: 20px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .price-display {
    font-size: 1.5rem;
  }
}

/* Form Sections */
.form-section {
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
  height: fit-content;
}

.form-section .text-subtitle1 {
  border-bottom: 2px solid #1976d2;
  padding-bottom: 8px;
  margin-bottom: 16px !important;
}

/* Add Form Card */
.add-form-card {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

@media (max-width: 768px) {
  .form-section {
    padding: 16px;
    margin-bottom: 12px;
  }

  .add-form-card {
    min-width: 95vw !important;
    max-width: 95vw !important;
  }
}

@media (min-width: 769px) {
  .form-section {
    min-height: 200px;
  }
}
</style>
