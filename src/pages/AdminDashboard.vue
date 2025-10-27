<template>
    <q-page class="q-pa-md">
    <!-- Header Section -->
    <div class="row justify-between items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary q-mb-sm">Admin Dashboard</div>
        <div class="text-subtitle1 text-grey-6">Comprehensive real estate management overview</div>
      </div>
      <q-btn
        color="secondary"
        icon="refresh"
        label="Refresh Data"
        @click="refreshData"
        :loading="loading"
        unelevated
        class="q-px-lg"
      />
    </div>

    <!-- Statistics Cards -->
    <div class="analytics-grid q-mb-xl">
      <div class="analytics-item">
        <q-card class="analytics-card total-properties-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <div class="stat-icon-wrapper total-properties-bg">
                  <q-icon name="home" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col q-ml-md">
                <div class="stat-number">{{ totalProperties }}</div>
                <div class="stat-label">Total Properties</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_up" />
                  <span>+12% growth</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="analytics-item">
        <q-card class="analytics-card active-listings-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <div class="stat-icon-wrapper active-listings-bg">
                  <q-icon name="check_circle" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col q-ml-md">
                <div class="stat-number">{{ activeListings }}</div>
                <div class="stat-label">Active Listings</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_flat" />
                  <span>{{ activePercentage }}% occupancy</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="analytics-item">
        <q-card class="analytics-card client-inquiries-card">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <div class="stat-icon-wrapper client-inquiries-bg">
                  <q-icon name="people" size="2.5rem" color="white" />
                </div>
              </div>
              <div class="col q-ml-md">
                <div class="stat-number">{{ totalRequests }}</div>
                <div class="stat-label">Client Inquiries</div>
                <div class="stat-trend positive">
                  <q-icon name="trending_up" />
                  <span>+8% this month</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Property Analytics -->
    <div class="analytics-grid q-mb-xl">
      <!-- Property Status Distribution -->
      <div class="analytics-item">
        <q-card class="analytics-card status-distribution-card">
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle1 text-weight-medium q-mb-lg text-grey-8">Property Status Distribution</div>
            <div class="status-distribution">
              <div class="status-item">
                <div class="row items-center q-mb-md">
                  <div class="status-dot bg-positive"></div>
                  <div class="col">
                    <div class="text-body2 text-weight-medium">Available</div>
                    <div class="text-caption text-grey-6">{{ statusCounts.available }} properties</div>
                  </div>
                  <div class="text-h6 text-weight-bold text-positive">{{ Math.round((statusCounts.available / totalProperties) * 100) }}%</div>
                </div>
                <q-linear-progress :value="statusCounts.available / totalProperties" color="positive" class="q-mb-md" />
              </div>

              <div class="status-item">
                <div class="row items-center q-mb-md">
                  <div class="status-dot bg-warning"></div>
                  <div class="col">
                    <div class="text-body2 text-weight-medium">Under Offer</div>
                    <div class="text-caption text-grey-6">{{ statusCounts.underOffer }} properties</div>
                  </div>
                  <div class="text-h6 text-weight-bold text-warning">{{ Math.round((statusCounts.underOffer / totalProperties) * 100) }}%</div>
                </div>
                <q-linear-progress :value="statusCounts.underOffer / totalProperties" color="warning" class="q-mb-md" />
              </div>

              <div class="status-item">
                <div class="row items-center q-mb-md">
                  <div class="status-dot bg-negative"></div>
                  <div class="col">
                    <div class="text-body2 text-weight-medium">Sold</div>
                    <div class="text-caption text-grey-6">{{ statusCounts.sold }} properties</div>
                  </div>
                  <div class="text-h6 text-weight-bold text-negative">{{ Math.round((statusCounts.sold / totalProperties) * 100) }}%</div>
                </div>
                <q-linear-progress :value="statusCounts.sold / totalProperties" color="negative" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Performance Metrics -->
      <div class="analytics-item">
        <q-card class="analytics-card performance-metrics-card">
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle1 text-weight-medium q-mb-lg text-grey-8">Performance Overview</div>
            <div class="performance-metrics">
              <div class="metric-item q-mb-lg">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-body2 text-grey-7">Conversion Rate</div>
                  <div class="text-body2 text-weight-medium">{{ Math.round((statusCounts.sold / totalProperties) * 100) }}%</div>
                </div>
                <q-linear-progress :value="statusCounts.sold / totalProperties" color="secondary" size="8px" />
              </div>

              <div class="metric-item q-mb-lg">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-body2 text-grey-7">Occupancy Rate</div>
                  <div class="text-body2 text-weight-medium">{{ activePercentage }}%</div>
                </div>
                <q-linear-progress :value="activePercentage / 100" color="positive" size="8px" />
              </div>

              <div class="metric-item">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-body2 text-grey-7">Inquiry Response</div>
                  <div class="text-body2 text-weight-medium">94%</div>
                </div>
                <q-linear-progress value="0.94" color="info" size="8px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Actions & Recent Activity -->
    <div class="analytics-grid q-mb-xl">
      <div class="analytics-item">
        <q-card class="analytics-card quick-actions-card">
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle1 text-weight-medium q-mb-lg text-grey-8">Quick Actions</div>

            <div class="actions-grid">
              <div class="action-item">
                <q-btn
                  unelevated
                  color="secondary"
                  icon="add"
                  class="action-btn"
                  @click="navigateToProperties"
                >
                  <div class="action-content">
                    <div class="action-icon">
                      <q-icon name="add" size="1.5rem" />
                    </div>
                    <div class="action-text">
                      <div class="text-body2 text-weight-medium">Add Property</div>
                      <div class="text-caption">Create new listing</div>
                    </div>
                  </div>
                </q-btn>
              </div>

              <div class="action-item">
                <q-btn
                  unelevated
                  color="info"
                  icon="people"
                  class="action-btn"
                  @click="navigateToRequests"
                >
                  <div class="action-content">
                    <div class="action-icon">
                      <q-icon name="people" size="1.5rem" />
                    </div>
                    <div class="action-text">
                      <div class="text-body2 text-weight-medium">View Requests</div>
                      <div class="text-caption">Client inquiries</div>
                    </div>
                  </div>
                </q-btn>
              </div>

              <div class="action-item">
                <q-btn
                  unelevated
                  color="positive"
                  icon="analytics"
                  class="action-btn"
                  @click="generateReport"
                >
                  <div class="action-content">
                    <div class="action-icon">
                      <q-icon name="analytics" size="1.5rem" />
                    </div>
                    <div class="action-text">
                      <div class="text-body2 text-weight-medium">Reports</div>
                      <div class="text-caption">Generate insights</div>
                    </div>
                  </div>
                </q-btn>
              </div>

              <div class="action-item">
                <q-btn
                  unelevated
                  color="warning"
                  icon="settings"
                  class="action-btn"
                  @click="openSettings"
                >
                  <div class="action-content">
                    <div class="action-icon">
                      <q-icon name="settings" size="1.5rem" />
                    </div>
                    <div class="action-text">
                      <div class="text-body2 text-weight-medium">Settings</div>
                      <div class="text-caption">System config</div>
                    </div>
                  </div>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="analytics-item">
        <q-card class="analytics-card recent-activity-card">
          <q-card-section class="q-pa-lg">
            <div class="row justify-between items-center q-mb-lg">
              <div class="text-subtitle1 text-weight-medium text-grey-8">Recent Activity</div>
              <q-btn flat dense round icon="more_vert" class="text-grey-6">
                <q-menu>
                  <q-list dense>
                    <q-item clickable>
                      <q-item-section>View All Activity</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Export Activity Log</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div class="activity-list">
              <div
                v-for="activity in recentActivities.slice(0, 4)"
                :key="activity.id"
                class="activity-item-modern q-mb-md"
              >
                <div class="row items-start">
                  <div class="col-auto q-mr-md">
                    <div class="activity-icon" :class="`bg-${activity.color}-5`">
                      <q-icon :name="activity.icon" :color="activity.color" size="1.2rem" />
                    </div>
                  </div>
                  <div class="col">
                    <div class="text-body2 text-weight-medium text-grey-9 q-mb-xs">{{ activity.title }}</div>
                    <div class="text-caption text-grey-6 q-mb-xs">{{ activity.description }}</div>
                    <div class="text-caption text-grey-5">{{ activity.time }}</div>
                  </div>
                </div>
        </div>
            </div>
          </q-card-section>
        </q-card>
        </div>
      </div>
    </q-page>
  </template>
  
  <script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
  import { useDataStore } from 'src/stores/data-store';
import { useQuasar } from 'quasar';
  
  export default defineComponent({
    name: 'AdminDashboard',
    setup() {
    const router = useRouter();
      const dataStore = useDataStore();
    const $q = useQuasar();

    const loading = ref(false);
    const lastUpdated = ref(new Date().toLocaleString());

    // Computed properties for KPIs
    const totalProperties = computed(() =>
      dataStore.propertiesForSale.length +
      dataStore.listingsForRentals.length +
      dataStore.listingsForLand.length +
      dataStore.commercialListings.length
    );

    const activeListings = computed(() => {
      const saleActive = dataStore.propertiesForSale.filter(p => p.status === 'Available').length;
      const rentActive = dataStore.listingsForRentals.filter(p => p.status === 'Available').length;
      const landActive = dataStore.listingsForLand.filter(p => p.status === 'Available').length;
      const commercialActive = dataStore.commercialListings.filter(p => p.status === 'Available').length;
      return saleActive + rentActive + landActive + commercialActive;
    });

    const activePercentage = computed(() => {
      if (totalProperties.value === 0) return 0;
      return Math.round((activeListings.value / totalProperties.value) * 100);
    });

    const totalRequests = computed(() =>
      dataStore.propertyRequests.length + dataStore.commercialRequests.length
    );


    // Status counts for chart
    const statusCounts = computed(() => ({
      available: dataStore.propertiesForSale.filter(p => p.status === 'Available').length,
      underOffer: dataStore.propertiesForSale.filter(p => p.status === 'Under Offer').length,
      sold: dataStore.propertiesForSale.filter(p => p.status === 'Sold').length
    }));

    // Recent activities (mock data - in real app, this would come from API)
    const recentActivities = ref([
      {
        id: 1,
        title: 'New Property Request',
        description: 'Client "John Doe" requested a 3-bedroom apartment',
        time: '2 minutes ago',
        icon: 'person_add',
        color: 'positive'
      },
      {
        id: 2,
        title: 'Property Status Updated',
        description: 'Villa in Maitama marked as "Under Offer"',
        time: '15 minutes ago',
        icon: 'update',
        color: 'warning'
      },
      {
        id: 3,
        title: 'Commercial Listing Added',
        description: 'New office space added in Wuse 2',
        time: '1 hour ago',
        icon: 'business',
        color: 'info'
      },
      {
        id: 4,
        title: 'Client Inquiry Resolved',
        description: 'Property request from "Jane Smith" completed',
        time: '2 hours ago',
        icon: 'check_circle',
        color: 'positive'
      }
    ]);

    // Recent property requests (last 5)
    const recentPropertyRequests = computed(() =>
      dataStore.propertyRequests.slice(0, 5)
    );

    // Table columns
      const requestColumns = [
      {
        name: 'clientName',
        label: 'Client',
        field: 'clientName',
        align: 'left'
      },
      {
        name: 'request',
        label: 'Request',
        field: 'request',
        align: 'left'
      },
      {
        name: 'status',
        label: 'Status',
        field: 'status',
        align: 'center'
      }
    ];

    // Methods
    const refreshData = async () => {
      loading.value = true;
      try {
        await dataStore.fetchAllData();
        lastUpdated.value = new Date().toLocaleString();
        $q.notify({
          type: 'positive',
          message: 'Dashboard data refreshed successfully!',
          position: 'top'
        });
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Failed to refresh data. Please try again.',
          position: 'top'
        });
      } finally {
        loading.value = false;
      }
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const getStatusColor = (status) => {
      const colors = {
        'New': 'info',
        'Contacted': 'warning',
        'Closed': 'positive',
        'Available': 'positive',
        'Sold': 'negative',
        'Under Offer': 'warning'
      };
      return colors[status] || 'grey';
    };

    // Navigation methods
    const navigateToProperties = () => {
      router.push('/properties-for-sale');
    };

    const navigateToRequests = () => {
      router.push('/property-requests');
    };

    const navigateToCommercial = () => {
      router.push('/commercial-listings');
    };

    // Action methods
    const exportReport = () => {
      $q.notify({
        type: 'info',
        message: 'Report export feature will be implemented soon!',
        position: 'top'
      });
    };

    const generateReport = () => {
      $q.notify({
        type: 'info',
        message: 'Report generation feature will be implemented soon!',
        position: 'top'
      });
    };

    const openSettings = () => {
      $q.notify({
        type: 'info',
        message: 'Settings panel will be implemented soon!',
        position: 'top'
      });
    };

    // Mock data for growth indicators (in real app, calculate from historical data)
    // These would be calculated from historical data in a real implementation

    onMounted(async () => {
      await refreshData();
    });

    return {
      // Reactive data
      loading,
      lastUpdated,
      recentActivities,

      // Computed properties
      totalProperties,
      activeListings,
      activePercentage,
      totalRequests,
      statusCounts,
      recentPropertyRequests,

      // Table config
      requestColumns,

      // Services
      dataStore,

      // Methods
      refreshData,
      formatCurrency,
      getStatusColor,
      navigateToProperties,
      navigateToRequests,
      navigateToCommercial,
      exportReport,
      generateReport,
      openSettings
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
.total-properties-card::before {
  background: linear-gradient(90deg, #2196F3 0%, #21CBF3 100%);
}

.active-listings-card::before {
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
}

.client-inquiries-card::before {
  background: linear-gradient(90deg, #FF9800 0%, #FFB74D 100%);
}


.quick-actions-card::before {
  background: linear-gradient(90deg, #FF5722 0%, #FF8A65 100%);
}

.recent-activity-card::before {
  background: linear-gradient(90deg, #607D8B 0%, #90A4AE 100%);
}

.status-distribution-card::before {
  background: linear-gradient(90deg, #795548 0%, #A1887F 100%);
}

.performance-metrics-card::before {
  background: linear-gradient(90deg, #3F51B5 0%, #7986CB 100%);
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

.total-properties-bg {
  background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
}

.active-listings-bg {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.client-inquiries-bg {
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

/* Status Distribution */
.status-distribution {
  padding: 0;
}

.status-item {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  margin-bottom: 12px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Performance Metrics */
.performance-metrics {
  padding: 0;
}

.metric-item {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  margin-bottom: 12px;
}

.metric-item:last-child {
  margin-bottom: 0;
}

/* Activity List */
.activity-list {
  max-height: 320px;
  overflow-y: auto;
}

.activity-item-modern {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  background: rgba(0, 0, 0, 0.01);
  transition: all 0.2s ease;
}

.activity-item-modern:hover {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.08);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.action-item {
  transition: transform 0.2s ease;
}

.action-item:hover {
  transform: scale(1.02);
}

.action-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  text-align: left;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: rgba(255, 255, 255, 0.2);
}

.action-text {
  flex: 1;
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
    font-weight: 600;
  }

  .stat-label {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .stat-trend {
    font-size: 0.8rem;
    font-weight: 400;
  }

  .action-content {
    flex-direction: column;
    text-align: center;
  }

  .action-icon {
    margin-right: 0;
    margin-bottom: 8px;
  }

  /* Reduce padding on mobile */
  .q-pa-lg {
    padding: 12px !important;
  }

  .q-mb-xl {
    margin-bottom: 16px !important;
  }

  .q-mb-lg {
    margin-bottom: 12px !important;
  }
}

@media (max-width: 480px) {
  .stat-number {
    font-size: 1.75rem;
    font-weight: 600;
  }

  .stat-label {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .stat-trend {
    font-size: 0.75rem;
    font-weight: 400;
  }

  .action-btn {
    padding: 12px;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  /* Further reduce padding on small screens */
  .q-pa-lg {
    padding: 8px !important;
  }

  .q-mb-xl {
    margin-bottom: 12px !important;
  }

  .q-mb-lg {
    margin-bottom: 8px !important;
  }
}

@media (max-width: 360px) {
  .stat-number {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .stat-label {
    font-size: 0.8rem;
    font-weight: 500;
  }

  .stat-trend {
    font-size: 0.7rem;
    font-weight: 400;
  }

  .stat-icon-wrapper {
    width: 44px;
    height: 44px;
  }
}
</style>