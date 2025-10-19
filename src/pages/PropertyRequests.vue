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
    <q-dialog v-model="showRequestModal" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6 text-center">Submit Property Request</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="submitRequest" class="q-gutter-md">
            <q-input
              filled
              v-model="requestForm.clientName"
              label="Your Name"
              required
              lazy-rules
              :rules="[val => !!val || 'Name is required']"
            />
            <q-input
              filled
              v-model="requestForm.phoneNumber"
              label="Phone Number"
              required
              lazy-rules
              :rules="[val => !!val || 'Phone number is required']"
            />
            <q-select
              filled
              v-model="requestForm.request"
              :options="['Built House', 'Land', 'Office Space', 'Shop', 'Filling Station']"
              label="Property Type Needed"
              required
            />
            <q-input
              filled
              v-model="requestForm.location"
              label="Preferred Location"
              placeholder="e.g., Wuse 2, Maitama, Any"
            />
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
              rows="3"
            />
            <div class="row justify-end q-mt-lg">
              <q-btn flat label="Cancel" @click="closeRequestModal" class="q-mr-sm" />
              <q-btn label="Submit Request" type="submit" color="secondary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
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
