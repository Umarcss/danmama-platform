<template>
  <q-page class="q-pa-md">
    <!-- Statistics Cards -->
    <div class="analytics-grid q-mb-xl">
      <!-- Total Requests Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card total-requests-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper total-requests-bg">
                  <q-icon name="receipt_long" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ totalRequests }}</div>
                <div class="stat-label">Total Requests</div>
                <div class="stat-trend neutral">
                  <q-icon name="analytics" size="1rem" />
                  <span>All inquiries</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill total-requests-fill" :style="{ width: '100%' }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- New Requests Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card new-requests-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper new-requests-bg">
                  <q-icon name="fiber_new" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ newCount }}</div>
                <div class="stat-label">New Requests</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_up" size="1rem" />
                  <span>{{ totalRequests > 0 ? Math.round((newCount / totalRequests) * 100) : 0 }}% active</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill new-requests-fill" :style="{ width: totalRequests > 0 ? `${(newCount / totalRequests) * 100}%` : '0%' }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Closed Requests Card -->
      <div class="analytics-item">
        <q-card flat class="analytics-card closed-requests-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto q-mr-lg">
                <div class="stat-icon-wrapper closed-requests-bg">
                  <q-icon name="check_circle" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col">
                <div class="stat-number">{{ closedCount }}</div>
                <div class="stat-label">Closed Requests</div>
                <div class="stat-trend positive">
                  <q-icon name="task_alt" size="1rem" />
                  <span>{{ totalRequests > 0 ? Math.round((closedCount / totalRequests) * 100) : 0 }}% completed</span>
                </div>
              </div>
            </div>
            <div class="progress-bar q-mt-md">
              <div class="progress-fill closed-requests-fill" :style="{ width: totalRequests > 0 ? `${(closedCount / totalRequests) * 100}%` : '0%' }"></div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Header with Admin Controls -->
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Property Requests</div>
        <div class="text-subtitle1 text-grey-6">Browse and manage property inquiries from clients</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          v-if="isAuthenticated"
          color="secondary"
          icon="add"
          label="Add Request"
          @click="openFormForCreate"
        />
        <q-btn
          v-else
          color="secondary"
          icon="add"
          label="Make Request"
          @click="showRequestModal = true"
        />
      </div>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-table
        :rows="requests"
        :columns="columns"
        row-key="id"
        :loading="dataStore.loading"
        :pagination="pagination"
        @request="onRequest"
        binary-state-sort
        class="modern-table"
      >
        <template #body-cell-serialNumber="props">
          <q-td :props="props">
            <div class="text-weight-bold text-grey-8">{{ props.rowIndex + 1 }}</div>
          </q-td>
        </template>

        <template #body-cell-budget="props">
          <q-td :props="props">
            <div class="text-weight-bold text-secondary">{{ formatBudget(props.row.budget) }}</div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <div v-if="isAuthenticated">
              <q-select
                v-model="props.row.status"
                :options="['New', 'Contacted', 'Closed']"
                outlined
                dense
                emit-value
                map-options
                @update:model-value="updateRequestStatus(props.row, $event)"
                class="status-select"
              />
            </div>
            <q-chip
              v-else
              :color="getStatusColor(props.row.status)"
              text-color="white"
              :label="props.row.status"
              size="sm"
            />
          </q-td>
        </template>

        <template #body-cell-specification="props">
          <q-td :props="props">
            <div class="text-truncate" style="max-width: 200px;" :title="props.row.specification">
              {{ props.row.specification || 'N/A' }}
            </div>
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
              >
                <q-tooltip>Delete Request</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Request Modal -->
    <q-dialog v-model="showRequestModal" persistent maximized class="scrollable-modal">
      <q-scroll-area style="height: 90vh; max-width: 100%;">
        <q-card class="add-form-card" style="min-width: 600px; max-width: 800px; margin: 0 auto;">
          <q-card-section>
            <div class="text-h6">{{ itemToEdit ? 'Edit Property Request' : 'Add New Property Request' }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-md">
            <q-form @submit.prevent="handleSave" class="q-gutter-lg">
              <!-- Form Sections Row -->
              <div class="row q-gutter-md">
                <!-- Left Column -->
                <div class="col-12 col-md-6">
                  <!-- Basic Information -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Contact Information</div>
                    <q-input
                      filled
                      v-model="requestForm.clientName"
                      label="Your Name *"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'Name is required']"
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

                  <!-- Property Information -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Property Information</div>
                    <q-input
                      filled
                      v-model="requestForm.request"
                      label="Property Type Needed *"
                      placeholder="e.g., Built House, Land, Office Space, Shop, Filling Station"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'Property type is required']"
                    />
                    <q-input
                      filled
                      v-model="requestForm.size"
                      label="Size Required"
                      placeholder="e.g., 500 sqm, 2 Acres, 1000 sq ft"
                    />
                  </div>

                  <!-- Location Information -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Location Information</div>
                    <q-input
                      filled
                      v-model="requestForm.location"
                      label="Preferred Location"
                      placeholder="e.g., Wuse 2, Maitama, Any"
                    />
                    <q-input
                      filled
                      v-model="requestForm.address"
                      label="Specific Address"
                      placeholder="Detailed address if known"
                    />
                  </div>
                </div>

                <!-- Right Column -->
                <div class="col-12 col-md-6">
                  <!-- Budget Information -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Budget Information</div>
                    <q-input
                      filled
                      v-model="requestForm.budget"
                      label="Budget Range"
                      placeholder="e.g., 100-200M, 300M+"
                    />
                  </div>

                  <!-- Requirements -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Requirements</div>
                    <q-input
                      filled
                      type="textarea"
                      v-model="requestForm.specification"
                      label="Specific Requirements"
                      placeholder="Describe your specific needs, features required, etc."
                      rows="6"
                    />
                  </div>

                  <!-- Status (Admin Only) -->
                  <div v-if="isAuthenticated" class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Status</div>
                    <q-select
                      filled
                      v-model="requestForm.status"
                      :options="['New', 'Contacted', 'Closed']"
                      label="Request Status"
                      emit-value
                      map-options
                    />
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="row justify-end q-mt-lg">
                <q-btn flat label="Cancel" @click="closeRequestModal" type="button" />
                <q-btn
                  :label="itemToEdit ? 'Update Request' : 'Submit Request'"
                  color="secondary"
                  class="q-ml-sm"
                  type="submit"
                  :loading="saving"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </q-dialog>

    <!-- View Request Details Modal -->
    <q-dialog v-model="showDetailsDialog" class="modern-modal" maximized>
      <div class="modal-card">
        <!-- Hero Section -->
        <div class="modal-hero">
            <div class="hero-background">
              <div class="hero-image" :style="{ backgroundImage: `url(${getRequestImage(requestToView)})` }"></div>
              <div class="hero-overlay"></div>
            </div>
            <div class="hero-content">
              <div class="hero-title-section">
                <div class="hero-title">{{ requestToView?.clientName || 'Property Request' }}</div>
                <div class="hero-subtitle">
                  <q-icon name="home" />
                  <span>{{ requestToView?.request || 'Property Request' }}</span>
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
              <div class="price-label">Budget Range</div>
            </div>
          </div>

        <!-- Modal Content -->
        <q-scroll-area style="height: calc(90vh - 450px); max-width: 100%;">
          <div class="modal-content" v-if="requestToView">
            <div class="content-grid">
              <!-- Request Information -->
              <div class="info-card glass-card">
                <div class="card-header">
                  <div class="card-icon-wrapper">
                    <q-icon name="info" size="md" />
                  </div>
                  <h3>Request Information</h3>
                </div>
                <div class="card-content">
                  <div class="info-row">
                    <span class="info-label">Property Type</span>
                    <span class="info-value">{{ requestToView?.request || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Size Required</span>
                    <span class="info-value">{{ requestToView?.size || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Budget Range</span>
                    <span class="info-value">{{ formatBudget(requestToView?.budget) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Requirements</span>
                    <span class="info-value">{{ requestToView?.specification || 'No specific requirements provided' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Status</span>
                    <q-chip
                      :color="getStatusColor(requestToView?.status)"
                      text-color="white"
                      :label="requestToView?.status"
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Location Information -->
              <div class="info-card glass-card">
                <div class="card-header">
                  <div class="card-icon-wrapper">
                    <q-icon name="location_on" size="md" />
                  </div>
                  <h3>Location Information</h3>
                </div>
                <div class="card-content">
                  <div class="info-row">
                    <span class="info-label">City</span>
                    <span class="info-value">{{ requestToView?.city || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Location</span>
                    <span class="info-value">{{ requestToView?.location || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Address</span>
                    <span class="info-value">{{ requestToView?.address || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <!-- Client Information (Name and Location visible to all, Phone only for authenticated) -->
              <div class="info-card glass-card">
                <div class="card-header">
                  <div class="card-icon-wrapper">
                    <q-icon name="person" size="md" />
                  </div>
                  <h3>Client Information</h3>
                </div>
                <div class="card-content">
                  <div class="contact-info">
                    <div class="contact-item">
                      <q-icon name="account_circle" />
                      <div>
                        <div class="contact-label">Client Name</div>
                        <div class="contact-value">{{ requestToView?.clientName || 'N/A' }}</div>
                      </div>
                    </div>
                    <div v-if="isAuthenticated" class="contact-item">
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
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" size="lg" />
          <div class="q-ml-md">
            <div class="text-h6">Confirm Delete</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              Are you sure you want to delete this property request? This action cannot be undone.
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            label="Delete"
            color="negative"
            @click="handleDelete"
            :loading="deleting"
          />
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
  name: 'PropertyRequests',
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    const $q = useQuasar();

    // Reactive state
    const showRequestModal = ref(false);
    const showDetailsDialog = ref(false);
    const showDeleteDialog = ref(false);
    const requestToView = ref(null);
    const itemToEdit = ref(null);
    const itemToDelete = ref(null);
    const deleting = ref(false);

    // Computed properties
    const requests = computed(() => dataStore.propertyRequests);
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const totalRequests = computed(() => requests.value.length);
    const newCount = computed(() => requests.value.filter(r => r.status === 'New').length);
    const closedCount = computed(() => requests.value.filter(r => r.status === 'Closed').length);

    const requestForm = reactive({
      clientName: '',
      phoneNumber: '',
      request: '',
      location: '',
      address: '',
      budget: '',
      size: '',
      specification: '',
      status: 'New'
    });

    const pagination = ref({
      sortBy: 'clientName',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    });

    const columns = computed(() => {
      const baseColumns = [
        {
          name: 'serialNumber',
          label: 'S/N',
          align: 'center',
          field: 'serialNumber',
          sortable: false
        },
        {
          name: 'clientName',
          label: 'Client Name',
          align: 'left',
          field: 'clientName',
          sortable: true
        },
        {
          name: 'request',
          label: 'Property Type',
          align: 'left',
          field: 'request',
          sortable: true
        },
        {
          name: 'size',
          label: 'Size',
          align: 'left',
          field: 'size',
          sortable: true
        },
        {
          name: 'location',
          label: 'Location',
          align: 'left',
          field: 'location',
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
          name: 'budget',
          label: 'Budget',
          align: 'right',
          field: 'budget',
          sortable: true
        },
        {
          name: 'specification',
          label: 'Requirements',
          align: 'left',
          field: 'specification',
          sortable: false
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

      // Only show phone number column for authenticated users
      if (isAuthenticated.value) {
        // Insert phoneNumber after budget
        const budgetIndex = baseColumns.findIndex(col => col.name === 'budget');
        baseColumns.splice(budgetIndex + 1, 0, {
          name: 'phoneNumber',
          label: 'Contact',
          align: 'left',
          field: 'phoneNumber',
          sortable: true
        });
      }

      return baseColumns;
    });

    const getStatusColor = (status) => {
      const colors = {
        'New': 'info',
        'Contacted': 'warning',
        'Closed': 'positive'
      };
      return colors[status] || 'grey';
    };

    // Helper functions
    const formatBudget = (budget) => {
      if (!budget) return 'N/A';
      return budget;
    };

    const getRequestImage = (request) => {
      // Return a default property image based on request type
      const images = {
        'Built House': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
        'Land': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070',
        'Office Space': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070',
        'Shop': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070',
        'Filling Station': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070'
      };
      return images[request?.request] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070';
    };

    // CRUD Operations
    const openFormForCreate = () => {
      itemToEdit.value = null;
      Object.assign(requestForm, {
        clientName: '',
        phoneNumber: '',
        request: '',
        location: '',
        address: '',
        budget: '',
        size: '',
        specification: '',
        status: 'New'
      });
      showRequestModal.value = true;
    };

    const openFormForEdit = (item) => {
      itemToEdit.value = item;
      Object.assign(requestForm, {
        clientName: item.clientName || '',
        phoneNumber: item.phoneNumber || '',
        request: item.request || '',
        location: item.location || '',
        address: item.address || '',
        budget: item.budget || '',
        size: item.size || '',
        specification: item.specification || '',
        status: item.status || 'New'
      });
      showRequestModal.value = true;
    };

    const saving = ref(false);
    const handleSave = async () => {
      // Prevent double submission
      if (saving.value) {
        return;
      }
      saving.value = true;
      try {
        if (itemToEdit.value) {
          // Update existing item
          await dataStore.updateItem('property-requests', itemToEdit.value.id, { ...requestForm });
          $q.notify({
            type: 'positive',
            message: 'Property request updated successfully!',
            position: 'top',
            timeout: 3000
          });
        } else {
          // Create new item
          await dataStore.addNewItem('property-requests', { ...requestForm, city: 'Abuja' });
          $q.notify({
            type: 'positive',
            message: 'Property request added successfully!',
            position: 'top',
            timeout: 3000
          });
        }
        closeRequestModal();
      } catch (error) {
        console.error('Save error:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to save property request. Please try again.',
          position: 'top',
          timeout: 3000
        });
      } finally {
        saving.value = false;
      }
    };

    const updateRequestStatus = async (item, newStatus) => {
      try {
        await dataStore.updateItem('property-requests', item.id, { status: newStatus });
        $q.notify({
          type: 'positive',
          message: `Request status updated to ${newStatus}`,
          position: 'top'
        });
      } catch (error) {
        console.error('Status update error:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to update status. Please try again.',
          position: 'top'
        });
      }
    };

    const confirmDelete = (item) => {
      itemToDelete.value = item;
      showDeleteDialog.value = true;
    };

    const handleDelete = async () => {
      if (!itemToDelete.value) return;

      deleting.value = true;
      try {
        await dataStore.deleteItem('property-requests', itemToDelete.value.id);
        $q.notify({
          type: 'positive',
          message: 'Property request deleted successfully!',
          position: 'top'
        });
        showDeleteDialog.value = false;
        itemToDelete.value = null;
      } catch (error) {
        console.error('Delete error:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to delete property request. Please try again.',
          position: 'top'
        });
      } finally {
        deleting.value = false;
      }
    };

    // Modal management
    const viewRequestDetails = (request) => {
      requestToView.value = request;
      showDetailsDialog.value = true;
    };

    const closeDetailsModal = () => {
      showDetailsDialog.value = false;
      requestToView.value = null;
    };

    const contactClient = (request) => {
      const contactInfo = `Name: ${request.clientName}\nPhone: ${request.phoneNumber}`;
      $q.notify({
        type: 'info',
        message: `Contact Information:\n${contactInfo}`,
        position: 'top',
        timeout: 5000
      });
    };

    const submitRequest = async () => {
      try {
        await dataStore.addNewItem('property-requests', { ...requestForm, status: 'New', city: 'Abuja' });
        $q.notify({
          type: 'positive',
          message: 'Your property request has been submitted successfully!',
          position: 'top'
        });
        closeRequestModal();
      } catch (error) {
        console.error('Submit error:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to submit request. Please try again.',
          position: 'top'
        });
      }
    };

    const closeRequestModal = () => {
      showRequestModal.value = false;
      itemToEdit.value = null;
      Object.assign(requestForm, {
        clientName: '',
        phoneNumber: '',
        request: '',
        location: '',
        address: '',
        budget: '',
        size: '',
        specification: '',
        status: 'New'
      });
    };

    const onRequest = (props) => {
      pagination.value = props.pagination;
    };

    onMounted(() => {
      dataStore.fetchAllData();
    });

    return {
      // Data
      requests,
      columns,
      pagination,
      dataStore,
      isAuthenticated,

      // Statistics
      totalRequests,
      newCount,
      closedCount,

      // Modal state
      showRequestModal,
      showDetailsDialog,
      showDeleteDialog,
      requestToView,
      itemToEdit,
      itemToDelete,
      deleting,
      saving,

      // Form
      requestForm,

      // Methods
      getStatusColor,
      formatBudget,
      getRequestImage,
      openFormForCreate,
      openFormForEdit,
      handleSave,
      updateRequestStatus,
      confirmDelete,
      handleDelete,
      viewRequestDetails,
      closeDetailsModal,
      contactClient,
      submitRequest,
      closeRequestModal,
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
.total-requests-card::before {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.new-requests-card::before {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

.closed-requests-card::before {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

/* Stat Icon Wrapper */
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

.stat-icon-wrapper:hover {
  transform: scale(1.05);
}

/* Background Colors for Icons */
.total-requests-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.new-requests-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.closed-requests-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
  color: #666;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-trend.positive {
  color: #4caf50;
}

.stat-trend.neutral {
  color: #2196f3;
}

.stat-trend.warning {
  color: #ff9800;
}

/* Progress Bar */
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
  transition: width 0.3s ease;
}

/* Progress Fill Colors */
.total-requests-fill {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.new-requests-fill {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

.closed-requests-fill {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

/* Glass Cards */
.glass-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Modal Styles */
.modal-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
}

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
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(10, 61, 98, 0.8) 0%, rgba(25, 118, 210, 0.6) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: white;
}

.hero-title-section {
  flex: 1;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  opacity: 0.9;
}

.hero-actions {
  margin-top: 8px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-price {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  text-align: right;
  color: white;
}

.price-display {
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.price-label {
  font-size: 0.875rem;
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.modal-content {
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.full-width {
  grid-column: 1 / -1;
}

/* Info Card Styling */
.info-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-icon-wrapper {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
}

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
  font-weight: 600;
  color: #424242;
  font-size: 0.9rem;
}

.info-value {
  text-align: right;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
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
  margin-bottom: 2px;
}

.contact-value {
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 600;
}

.description-section {
  margin-top: 16px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
  margin-top: 16px;
}

.section-title:first-child {
  margin-top: 0;
}

.description-text {
  line-height: 1.6;
  color: #424242;
  margin: 0;
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

/* Status Select */
.status-select .q-field__control {
  background: rgba(255, 255, 255, 0.8) !important;
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

  .form-section {
    padding: 16px;
    margin-bottom: 12px;
  }

  .add-form-card {
    min-width: 95vw !important;
    max-width: 95vw !important;
  }

  .modal-hero {
    height: 350px;
  }

  .hero-content {
    padding: 1.5rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .content-grid {
    gap: 1.5rem;
  }
}

@media (min-width: 769px) {
  .form-section {
    min-height: 200px;
  }
}

/* Table Styles */
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
