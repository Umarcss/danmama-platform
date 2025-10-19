<template>
  <q-page class="dashboard-page">
    <!-- Compact Header Section -->
    <div class="dashboard-header q-pa-lg q-mb-lg">
      <div class="row justify-between items-center">
        <div class="col-auto">
          <div class="text-h4 text-weight-bold text-white q-mb-xs">Admin Dashboard</div>
          <div class="text-body1 text-white text-opacity-80">Welcome back! Here's your real estate overview</div>
        </div>
        <div class="col-auto">
          <div class="row q-gutter-sm">
            <q-btn
              flat
              color="white"
              icon="refresh"
              label="Refresh Data"
              @click="refreshData"
              :loading="loading"
              class="header-btn"
            />
            <q-btn
              flat
              color="white"
              icon="download"
              label="Export Report"
              @click="exportReport"
              class="header-btn"
            />
          </div>
        </div>
      </div>

      <!-- System Status Inline -->
      <div class="row justify-start q-mt-md">
        <q-chip
          color="green-5"
          text-color="white"
          icon="check_circle"
          label="All systems operational"
          class="status-chip"
        />
        <div class="text-caption text-white text-opacity-70 q-ml-md q-mt-sm">
          Last updated: {{ lastUpdated }}
        </div>
      </div>
    </div>

    <!-- Key Performance Indicators -->
    <div class="q-pa-lg q-mb-xl">
      <div class="text-h6 text-weight-medium text-grey-8 q-mb-lg">Key Performance Indicators</div>
      <div class="kpi-grid">
        <!-- Property Portfolio KPIs -->
        <div class="kpi-item">
          <q-card flat class="kpi-card-modern">
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="col-auto">
                  <div class="kpi-icon-modern bg-secondary-5">
                    <q-icon name="home" size="2.5rem" color="secondary" />
                  </div>
                </div>
                <div class="col q-ml-md">
                  <div class="text-h4 text-weight-bold text-grey-9">{{ totalProperties }}</div>
                  <div class="text-body2 text-grey-7 q-mb-xs">Total Properties</div>
                  <q-chip size="sm" color="positive" text-color="white" label="+12%" class="kpi-trend" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="kpi-item">
          <q-card flat class="kpi-card-modern">
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="col-auto">
                  <div class="kpi-icon-modern bg-positive-5">
                    <q-icon name="check_circle" size="2.5rem" color="positive" />
                  </div>
                </div>
                <div class="col q-ml-md">
                  <div class="text-h4 text-weight-bold text-grey-9">{{ activeListings }}</div>
                  <div class="text-body2 text-grey-7 q-mb-xs">Active Listings</div>
                  <q-chip size="sm" color="info" text-color="white" :label="`${activePercentage}%`" class="kpi-trend" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="kpi-item">
          <q-card flat class="kpi-card-modern">
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="col-auto">
                  <div class="kpi-icon-modern bg-info-5">
                    <q-icon name="real_estate_agent" size="2.5rem" color="info" />
                  </div>
                </div>
                <div class="col q-ml-md">
                  <div class="text-h4 text-weight-bold text-grey-9">{{ totalRequests }}</div>
                  <div class="text-body2 text-grey-7 q-mb-xs">Client Inquiries</div>
                  <q-chip size="sm" color="warning" text-color="white" label="+8%" class="kpi-trend" />
                </div>
              </div>
              <div class="kpi-badge bg-warning text-white text-center q-mt-sm">
                <q-icon name="trending_up" size="1rem" class="q-mr-xs" />
                This Month
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="kpi-item">
          <q-card flat class="kpi-card-modern">
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="col-auto">
                  <div class="kpi-icon-modern bg-negative-5">
                    <q-icon name="attach_money" size="2.5rem" color="negative" />
                  </div>
                </div>
                <div class="col q-ml-md">
                  <div class="kpi-value">{{ formatCurrency(totalValue) }}</div>
                  <div class="text-body2 text-grey-7 q-mb-xs">Portfolio Value</div>
                  <q-chip size="sm" color="positive" text-color="white" label="+5%" class="kpi-trend" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Analytics & Insights Section -->
    <div class="q-pa-lg q-mb-xl">
      <div class="text-h6 text-weight-medium text-grey-8 q-mb-lg">Analytics & Insights</div>
      <div class="analytics-grid">
        <!-- Property Status Distribution -->
        <div class="analytics-item">
          <q-card flat class="analytics-card">
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
          <q-card flat class="analytics-card">
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
    </div>

    <!-- Activity & Actions Section -->
    <div class="q-pa-lg q-mb-xl">
      <div class="text-h6 text-weight-medium text-grey-8 q-mb-lg">Activity & Quick Actions</div>
      <div class="activity-actions-grid">
        <!-- Recent Activity Feed -->
        <div class="activity-item">
          <q-card flat class="activity-card">
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

        <!-- Quick Actions Panel -->
        <div class="actions-item">
          <q-card flat class="actions-card">
            <q-card-section class="q-pa-lg">
              <div class="text-subtitle1 text-weight-medium text-grey-8 q-mb-lg">Quick Actions</div>

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
      </div>
    </div>

    <!-- Modern Data Insights Section -->
    <div class="q-pa-lg q-mb-xl">
      <div class="text-h6 text-weight-medium text-grey-8 q-mb-lg">Recent Insights</div>
      <div class="insights-grid">
        <!-- Recent Property Requests - Modern Card Layout -->
        <div class="insights-item">
          <q-card flat class="insights-card">
            <q-card-section class="q-pa-lg">
              <div class="row justify-between items-center q-mb-lg">
                <div class="text-subtitle1 text-weight-medium text-grey-8">Recent Property Inquiries</div>
                <q-btn flat dense color="primary" label="View All" @click="navigateToRequests" />
              </div>

              <div class="requests-list">
                <div
                  v-for="(request, index) in recentPropertyRequests.slice(0, 4)"
                  :key="request.id"
                  class="request-item q-mb-md"
                  :class="{ 'q-mb-lg': index < 3 }"
                >
                  <div class="row items-center">
                    <div class="col-auto q-mr-md">
                      <div class="request-avatar">
                        <q-icon name="person" color="primary" size="1.5rem" />
                      </div>
                    </div>
                    <div class="col">
                      <div class="row items-center justify-between">
                        <div class="col">
                          <div class="text-body2 text-weight-medium text-grey-9">{{ request.clientName }}</div>
                          <div class="text-caption text-grey-6">
                            <q-icon name="home" size="0.875rem" class="q-mr-xs" />
                            {{ request.request }} • {{ request.location }}
                          </div>
                        </div>
                        <div class="col-auto">
                          <q-chip
                            size="sm"
                            :color="getStatusColor(request.status)"
                            text-color="white"
                            :label="request.status"
                            dense
                          />
                        </div>
                      </div>
                      <div class="row items-center justify-between q-mt-xs">
                        <div class="text-caption text-grey-5">{{ request.phoneNumber }}</div>
                        <div class="text-caption text-weight-medium text-grey-7">{{ request.budget }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="recentPropertyRequests.length === 0" class="text-center text-grey-6 q-py-lg">
                  <q-icon name="inbox" size="3rem" class="q-mb-md" />
                  <div>No recent property requests</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Commercial Activity Dashboard -->
        <div class="insights-item">
          <q-card flat class="insights-card">
            <q-card-section class="q-pa-lg">
              <div class="row justify-between items-center q-mb-lg">
                <div class="text-subtitle1 text-weight-medium text-grey-8">Commercial Overview</div>
                <q-btn flat dense color="primary" label="View All" @click="navigateToCommercial" />
              </div>

              <div class="commercial-dashboard">
                <!-- Commercial Requests Widget -->
                <div class="commercial-widget q-mb-lg">
                  <div class="row items-center justify-between q-mb-sm">
                    <div class="col">
                      <div class="text-body2 text-weight-medium text-grey-8">Commercial Requests</div>
                      <div class="text-caption text-grey-6">Business inquiries this month</div>
                    </div>
                    <div class="col-auto">
                      <div class="commercial-icon bg-blue-5">
                        <q-icon name="store" color="primary" size="1.5rem" />
                      </div>
                    </div>
                  </div>
                  <div class="row items-center justify-between">
                    <div class="col">
                      <div class="commercial-number">{{ dataStore.commercialRequests.length }}</div>
                      <div class="text-caption text-positive q-mt-xs">
                        <q-icon name="trending_up" size="0.875rem" class="q-mr-xs" />
                        +12% from last month
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-btn
                        flat
                        round
                        dense
                        icon="visibility"
                        color="primary"
                        @click="navigateToCommercial"
                      />
                    </div>
                  </div>
                </div>

                <!-- Commercial Listings Widget -->
                <div class="commercial-widget q-mb-lg">
                  <div class="row items-center justify-between q-mb-sm">
                    <div class="col">
                      <div class="text-body2 text-weight-medium text-grey-8">Active Listings</div>
                      <div class="text-caption text-grey-6">Commercial spaces available</div>
                    </div>
                    <div class="col-auto">
                      <div class="commercial-icon bg-green-5">
                        <q-icon name="business" color="positive" size="1.5rem" />
                      </div>
                    </div>
                  </div>
                  <div class="row items-center justify-between">
                    <div class="col">
                      <div class="commercial-number">{{ dataStore.commercialListings.length }}</div>
                      <div class="text-caption text-positive q-mt-xs">
                        <q-icon name="trending_up" size="0.875rem" class="q-mr-xs" />
                        +8% from last month
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-btn
                        flat
                        round
                        dense
                        icon="add"
                        color="positive"
                        @click="navigateToCommercial"
                      />
                    </div>
                  </div>
                </div>

                <!-- Quick Stats Row -->
                <div class="commercial-stats">
                  <div class="stat-mini">
                    <div class="stat-value">{{ dataStore.commercialRequests.filter(r => r.status === 'New').length }}</div>
                    <div class="stat-label">New Requests</div>
                  </div>
                  <div class="stat-mini">
                    <div class="stat-value">{{ dataStore.commercialListings.filter(l => l.status === 'Available').length }}</div>
                    <div class="stat-label">Available Spaces</div>
                  </div>
                  <div class="stat-mini">
                    <div class="stat-value">{{ Math.round((dataStore.commercialRequests.length / Math.max(dataStore.propertyRequests.length, 1)) * 100) }}%</div>
                    <div class="stat-label">Of Total</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
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

    const totalValue = computed(() => {
      // Calculate approximate portfolio value (simplified)
      return totalProperties.value * 150000000; // Average property value estimate
    });

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
      totalValue,
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
.dashboard-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Header Section */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  position: relative;
  overflow: hidden;
}

.dashboard-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  50% { transform: translate(-50%, -50%) rotate(180deg); }
}

.header-btn {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-chip {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.kpi-item {
  transition: transform 0.3s ease;
}

.kpi-item:hover {
  transform: translateY(-8px);
}

.kpi-card-modern {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.kpi-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.kpi-card-modern:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.kpi-icon-modern {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kpi-trend {
  font-size: 0.75rem;
  margin-left: 8px;
}

.kpi-badge {
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.kpi-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #424242;
  line-height: 1.2;
  word-break: break-word;
  overflow-wrap: break-word;
}

@media (min-width: 768px) {
  .kpi-value {
    font-size: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .kpi-value {
    font-size: 1.75rem;
  }
}

/* Analytics Section */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.analytics-item {
  transition: transform 0.3s ease;
}

.analytics-item:hover {
  transform: translateY(-4px);
}

.analytics-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.analytics-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.status-distribution .status-item + .status-item {
  margin-top: 16px;
}

.status-item {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.performance-metrics .metric-item + .metric-item {
  margin-top: 20px;
}

.metric-item {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* Activity & Actions Section */
.activity-actions-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .activity-actions-grid {
    grid-template-columns: 1fr;
  }
}

.activity-item, .actions-item {
  transition: transform 0.3s ease;
}

.activity-item:hover, .actions-item:hover {
  transform: translateY(-4px);
}

.activity-card, .actions-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  height: fit-content;
}

.activity-card:hover, .actions-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

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

/* Data Tables Section */
.no-shadow {
  box-shadow: none;
}

/* Modern Insights Section */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.insights-item {
  transition: transform 0.3s ease;
}

.insights-item:hover {
  transform: translateY(-4px);
}

.insights-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  height: fit-content;
}

.insights-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* Property Requests List */
.requests-list {
  max-height: 360px;
  overflow-y: auto;
}

.request-item {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.request-item:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateX(4px);
}

.request-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Commercial Dashboard */

.commercial-widget {
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.commercial-widget:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.commercial-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.commercial-number {
  font-size: 2rem;
  font-weight: 700;
  color: #424242;
  line-height: 1;
}

/* Commercial Stats */
.commercial-stats {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.stat-mini {
  flex: 1;
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1976d2;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #757575;
  margin-top: 4px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 0;
  }

  .dashboard-header {
    border-radius: 0;
    margin-bottom: 16px;
  }

  .kpi-grid, .analytics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .activity-actions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .kpi-card-modern, .analytics-card, .activity-card, .actions-card {
    margin-bottom: 16px;
  }

  .action-content {
    flex-direction: column;
    text-align: center;
  }

  .action-icon {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .kpi-value {
    font-size: 1.125rem !important;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .insights-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .requests-list {
    max-height: 280px;
  }

  .request-item {
    padding: 12px;
  }

  .commercial-stats {
    flex-direction: column;
    gap: 12px;
  }

  .stat-mini {
    padding: 8px;
  }
}
</style>