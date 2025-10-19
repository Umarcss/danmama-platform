// src/router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // --- PUBLIC PAGES ---
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'properties-for-sale', component: () => import('pages/PropertiesForSale.vue') },
      { path: 'properties-for-rent', component: () => import('pages/PropertiesForRent.vue') },
      { path: 'land-listings', component: () => import('pages/LandListings.vue') },
      { path: 'property-requests', component: () => import('pages/PropertyRequests.vue') },
      { path: 'commercial-requests', component: () => import('pages/CommercialRequests.vue') },
      { path: 'commercial-listings', component: () => import('pages/CommercialListings.vue') },
      { path: 'properties', component: () => import('pages/PublicPropertiesPage.vue') }, // Legacy route
      { path: 'property/:id', component: () => import('pages/PropertyDetail.vue') }, // Dynamic detail page
      { path: 'request', component: () => import('pages/RequestProperty.vue') }, // Legacy route

      // --- ADMIN PAGES (PROTECTED) ---
      {
        path: 'admin',
        meta: { requiresAuth: true },
        children: [
          { path: 'dashboard', component: () => import('pages/AdminDashboard.vue') },
          { path: ':type', component: () => import('pages/GenericAdminPage.vue') }
        ]
      }
    ]
  },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
]

export default routes