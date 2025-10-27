<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Mobile Menu Button -->
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <!-- Logo -->
        <q-toolbar-title class="q-py-md">
          <q-img src="~assets/logo.png" style="height: 40px; max-width: 180px; object-fit: contain;" />
        </q-toolbar-title>

        <!-- Department Title - Only visible on desktop, centered -->
        <div class="gt-sm" style="flex: 1; text-align: center;">
          <h6>Property Management Department</h6>
        </div>

        <!-- Desktop Navigation -->
        <div class="q-pa-sm q-gutter-sm gt-xs">
          <q-btn flat label="Home" to="/" />

          <!-- Properties Management Dropdown -->
          <q-btn-dropdown flat label="Properties" class="q-px-sm">
            <q-list>
              <q-item clickable to="/properties-for-sale">
                <q-item-section>For Sale</q-item-section>
              </q-item>
              <q-item clickable to="/properties-for-rent">
                <q-item-section>For Rent</q-item-section>
              </q-item>
              <q-item clickable to="/land-listings">
                <q-item-section>Land</q-item-section>
              </q-item>
              <q-item clickable to="/commercial-listings">
                <q-item-section>Commercial</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <!-- Requests Management Dropdown -->
          <q-btn-dropdown flat label="Requests" class="q-px-sm">
            <q-list>
              <q-item clickable to="/property-requests">
                <q-item-section>Property Inquiries</q-item-section>
              </q-item>
              <q-item clickable to="/commercial-requests">
                <q-item-section>Commercial Inquiries</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <!-- Conditional Buttons: Login / Dashboard & Logout -->
          <q-btn v-if="!isAuthenticated" color="secondary" label="Login" @click="showLoginModal = true" />
          <q-btn v-if="isAuthenticated" flat label="Dashboard" to="/admin/dashboard" />
          <q-btn v-if="isAuthenticated" flat label="Logout" @click="handleLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Mobile Navigation Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header>Dan Mama Platform</q-item-label>

        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="isAuthenticated" clickable to="/admin/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header>Property Management</q-item-label>
        <q-item clickable to="/properties-for-sale">
          <q-item-section avatar>
            <q-icon name="house" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Properties for Sale</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/properties-for-rent">
          <q-item-section avatar>
            <q-icon name="apartment" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Properties for Rent</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/land-listings">
          <q-item-section avatar>
            <q-icon name="landscape" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Land Listings</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/commercial-listings">
          <q-item-section avatar>
            <q-icon name="business" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Commercial Listings</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header>Client Inquiries</q-item-label>
        <q-item clickable to="/property-requests">
          <q-item-section avatar>
            <q-icon name="real_estate_agent" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Property Inquiries</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/commercial-requests">
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Commercial Inquiries</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Login Modal Component -->
    <LoginModal v-model="showLoginModal" />

  </q-layout>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store';
import LoginModal from 'src/components/LoginModal.vue';

export default {
  name: 'MainLayout',
  components: { LoginModal },
  setup () {
    const router = useRouter()
    const leftDrawerOpen = ref(false)
    const showLoginModal = ref(false);
    const authStore = useAuthStore();

    // A computed property to check authentication status
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const handleLogout = () => {
      authStore.logout();
      router.push('/');
    };

    return {
      leftDrawerOpen,
      showLoginModal,
      isAuthenticated,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      handleLogout
    }
  }
}
</script>

<style scoped>




h6 {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 0.0125em;
    font-family: inherit;
    white-space: nowrap;
    margin: 0;
    padding: 0;
}
/* Glassmorphism for dropdown menus */
.q-btn-dropdown .q-menu {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.q-btn-dropdown .q-menu .q-list {
  background: transparent;
}

/* Glassmorphism for mobile drawer */
.q-drawer {
  background: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

/* Glassmorphism for drawer items on hover */
.q-drawer .q-item:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>