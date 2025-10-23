<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Property Requests</div>
        <div class="text-subtitle1 text-grey-6">Browse property inquiries from clients</div>
      </div>
      <q-btn
        color="secondary"
        icon="add"
        label="Make Request"
        @click="showRequestModal = true"
      />
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
        <template #body-cell-budget="props">
          <q-td :props="props">
            <div class="text-weight-bold text-secondary">{{ props.row.budget }}</div>
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
              icon="phone"
              color="positive"
              @click="contactClient(props.row)"
            >
              <q-tooltip>Contact Client</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="message"
              color="info"
              @click="viewDetails(props.row)"
              class="q-ml-sm"
            >
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Request Modal -->
    <q-dialog v-model="showRequestModal" persistent maximized class="scrollable-modal">
      <q-scroll-area style="height: 90vh; max-width: 100%;">
        <q-card class="add-form-card" style="min-width: 600px; max-width: 800px; margin: 0 auto;">
          <q-card-section>
            <div class="text-h6">Submit Property Request</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-md">
            <q-form @submit="submitRequest" class="q-gutter-lg">
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

                  <!-- Location Information -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Location Preferences</div>
                    <q-select
                      filled
                      v-model="requestForm.request"
                      :options="['Built House', 'Land', 'Office Space', 'Shop', 'Filling Station']"
                      label="Property Type Needed *"
                      required
                      lazy-rules
                      :rules="[val => !!val || 'Property type is required']"
                    />
                    <q-input
                      filled
                      v-model="requestForm.location"
                      label="Preferred Location"
                      placeholder="e.g., Wuse 2, Maitama, Any"
                    />
                  </div>
                </div>

                <!-- Right Column -->
                <div class="col-12 col-md-6">
                  <!-- Budget & Requirements -->
                  <div class="form-section">
                    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Budget & Requirements</div>
                    <q-input
                      filled
                      v-model="requestForm.budget"
                      label="Budget Range"
                      placeholder="e.g., 100-200M, 300M+"
                    />
                    <q-input
                      filled
                      type="textarea"
                      v-model="requestForm.specification"
                      label="Specific Requirements"
                      placeholder="Describe your specific needs..."
                      rows="6"
                    />
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="row justify-end q-mt-lg">
                <q-btn flat label="Cancel" @click="closeRequestModal" />
                <q-btn
                  :label="'Submit Request'"
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
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useDataStore } from 'src/stores/data-store';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PropertyRequests',
  setup() {
    const dataStore = useDataStore();
    const $q = useQuasar();

    const showRequestModal = ref(false);

    const requests = computed(() => dataStore.propertyRequests);

    const requestForm = reactive({
      clientName: '',
      phoneNumber: '',
      request: null,
      location: '',
      budget: '',
      specification: ''
    });

    const pagination = ref({
      sortBy: 'clientName',
      descending: false,
      page: 1,
      rowsPerPage: 10,
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
        label: 'Property Type',
        align: 'left',
        field: 'request',
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
        name: 'budget',
        label: 'Budget',
        align: 'right',
        field: 'budget',
        sortable: true
      },
      {
        name: 'phoneNumber',
        label: 'Contact',
        align: 'left',
        field: 'phoneNumber',
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

    const getStatusColor = (status) => {
      const colors = {
        'New': 'info',
        'Contacted': 'warning',
        'Closed': 'positive'
      };
      return colors[status] || 'grey';
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

    const viewDetails = (request) => {
      const details = `Request: ${request.request}\nLocation: ${request.location}\nBudget: ${request.budget}\nSpecs: ${request.specification || 'N/A'}`;
      $q.notify({
        type: 'info',
        message: `Request Details:\n${details}`,
        position: 'top',
        timeout: 8000
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
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to submit request. Please try again.',
          position: 'top'
        });
      }
    };

    const closeRequestModal = () => {
      showRequestModal.value = false;
      Object.assign(requestForm, {
        clientName: '',
        phoneNumber: '',
        request: null,
        location: '',
        budget: '',
        specification: ''
      });
    };

    const onRequest = (props) => {
      pagination.value = props.pagination;
    };

    onMounted(() => {
      dataStore.fetchAllData();
    });

    return {
      requests,
      columns,
      pagination,
      dataStore,
      showRequestModal,
      requestForm,
      getStatusColor,
      contactClient,
      viewDetails,
      submitRequest,
      closeRequestModal,
      onRequest
    };
  }
});
</script>

<style scoped>
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

/* Responsive adjustments */
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
