// src/stores/data-store.js
import { defineStore } from 'pinia';
import { mockApi } from 'src/services/mockApi';
import { useLoadingStore } from './loading-store';

export const useDataStore = defineStore('data', {
  state: () => ({
    propertiesForSale: [],
    listingsForRentals: [],
    listingsForLand: [],
    propertyRequests: [],
    commercialRequests: [],
    commercialListings: [],
    loading: false,
  }),

  actions: {
    async fetchAllData() {
      const loadingStore = useLoadingStore();
      loadingStore.startLoading('fetchAllData', 'Loading Properties', 'Fetching all property data...');
      this.loading = true;
      
      try {
        this.propertiesForSale = await mockApi.getPropertiesForSale();
        this.listingsForRentals = await mockApi.getListingsForRentals();
        this.listingsForLand = await mockApi.getListingsForLand();
        this.propertyRequests = await mockApi.getPropertyRequests();
        this.commercialRequests = await mockApi.getCommercialRequests();
        this.commercialListings = await mockApi.getCommercialListings();
      } finally {
        this.loading = false;
        loadingStore.stopLoading('fetchAllData');
      }
    },

    async addNewItem(type, item) {
      const loadingStore = useLoadingStore();
      loadingStore.startLoading('addNewItem', 'Adding Property', 'Saving new property data...');
      this.loading = true;
      
      try {
        let newItem;
        switch (type) {
          case 'properties': newItem = await mockApi.addPropertyForSale(item); this.propertiesForSale.push(newItem); break;
          case 'rental': newItem = await mockApi.addListingForRental(item); this.listingsForRentals.push(newItem); break;
          case 'land': newItem = await mockApi.addListingForLand(item); this.listingsForLand.push(newItem); break;
          case 'property-requests': newItem = await mockApi.addPropertyRequest(item); this.propertyRequests.push(newItem); break;
          case 'commercial-requests': newItem = await mockApi.addCommercialRequest(item); this.commercialRequests.push(newItem); break;
          case 'commercial': newItem = await mockApi.addCommercialListing(item); this.commercialListings.push(newItem); break;
        }
        this.loading = false;
        return newItem;
      } finally {
        this.loading = false;
        loadingStore.stopLoading('addNewItem');
      }
    },

    // --- NEW CRUD ACTIONS ---
    async updateItem(type, id, data) {
      this.loading = true;
      let updatedItem;
      // Construct the API function name dynamically
      const apiFunctionName = `update${type.charAt(0).toUpperCase() + type.slice(1, -1)}`; // 'properties' -> 'updateProperty'
      updatedItem = await mockApi[apiFunctionName](id, data);

      if (updatedItem) {
        // Update the item in the local state
        const stateKey = `${type.replace('-', '')}`; // 'property-requests' -> 'propertyrequests'
        const itemArray = this[stateKey];
        const index = itemArray.findIndex(item => item.id === id);
        if (index !== -1) itemArray[index] = updatedItem;
      }
      this.loading = false;
      return updatedItem;
    },

    async deleteItem(type, id) {
      this.loading = true;
      const apiFunctionName = `delete${type.charAt(0).toUpperCase() + type.slice(1, -1)}`; // 'properties' -> 'deleteProperty'
      const success = await mockApi[apiFunctionName](id);

      if (success) {
        const stateKey = `${type.replace('-', '')}`;
        const itemArray = this[stateKey];
        const index = itemArray.findIndex(item => item.id === id);
        if (index !== -1) itemArray.splice(index, 1);
      }
      this.loading = false;
      return success;
    }
  },
});