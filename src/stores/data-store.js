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
          case 'properties':
          case 'properties-for-sale':
            newItem = await mockApi.addPropertyForSale(item);
            break;
          case 'rental':
          case 'listingsForRentals':
          case 'listings-for-rentals':
            newItem = await mockApi.addListingForRental(item);
            break;
          case 'land':
          case 'listingsForLand':
          case 'listings-for-land':
            newItem = await mockApi.addListingForLand(item);
            break;
          case 'property-requests':
            newItem = await mockApi.addPropertyRequest(item);
            break;
          case 'commercial-requests':
            newItem = await mockApi.addCommercialRequest(item);
            break;
          case 'commercial':
          case 'commercialListings':
          case 'commercial-listings':
            newItem = await mockApi.addCommercialListing(item);
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }
        
        // Don't manually push - let refreshData handle it to avoid duplicates
        // Just refresh from API to get the latest state
        await this.fetchAllData();
        
        return newItem;
      } finally {
        this.loading = false;
        loadingStore.stopLoading('addNewItem');
      }
    },

    // --- NEW CRUD ACTIONS ---
    async updateItem(type, id, data) {
      const loadingStore = useLoadingStore();
      loadingStore.startLoading('updateItem', 'Updating Property', 'Saving changes...');
      this.loading = true;
      
      try {
        let updatedItem;
        let stateKey;
        
        // Map type to correct API function and state key
        switch (type) {
          case 'properties':
          case 'properties-for-sale':
            updatedItem = await mockApi.updatePropertyForSale(id, data);
            stateKey = 'propertiesForSale';
            break;
          case 'rental':
          case 'listingsForRentals':
          case 'listings-for-rentals':
            updatedItem = await mockApi.updateListingForRental(id, data);
            stateKey = 'listingsForRentals';
            break;
          case 'land':
          case 'listingsForLand':
          case 'listings-for-land':
            updatedItem = await mockApi.updateListingForLand(id, data);
            stateKey = 'listingsForLand';
            break;
          case 'property-requests':
            updatedItem = await mockApi.updatePropertyRequest(id, data);
            stateKey = 'propertyRequests';
            break;
          case 'commercial-requests':
            updatedItem = await mockApi.updateCommercialRequest(id, data);
            stateKey = 'commercialRequests';
            break;
          case 'commercial':
          case 'commercialListings':
          case 'commercial-listings':
            updatedItem = await mockApi.updateCommercialListing(id, data);
            stateKey = 'commercialListings';
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }

        if (updatedItem) {
          // Update the item in the local state
          const itemArray = this[stateKey];
          const index = itemArray.findIndex(item => item.id === id);
          if (index !== -1) itemArray[index] = updatedItem;
        }
        return updatedItem;
      } finally {
        this.loading = false;
        loadingStore.stopLoading('updateItem');
      }
    },

    async deleteItem(type, id) {
      const loadingStore = useLoadingStore();
      loadingStore.startLoading('deleteItem', 'Deleting Property', 'Removing property...');
      this.loading = true;
      
      try {
        let success;
        let stateKey;
        
        // Map type to correct API function and state key
        switch (type) {
          case 'properties':
          case 'properties-for-sale':
            success = await mockApi.deletePropertyForSale(id);
            stateKey = 'propertiesForSale';
            break;
          case 'rental':
          case 'listingsForRentals':
          case 'listings-for-rentals':
            success = await mockApi.deleteListingForRental(id);
            stateKey = 'listingsForRentals';
            break;
          case 'land':
          case 'listingsForLand':
          case 'listings-for-land':
            success = await mockApi.deleteListingForLand(id);
            stateKey = 'listingsForLand';
            break;
          case 'property-requests':
            success = await mockApi.deletePropertyRequest(id);
            stateKey = 'propertyRequests';
            break;
          case 'commercial-requests':
            success = await mockApi.deleteCommercialRequest(id);
            stateKey = 'commercialRequests';
            break;
          case 'commercial':
          case 'commercialListings':
          case 'commercial-listings':
            success = await mockApi.deleteCommercialListing(id);
            stateKey = 'commercialListings';
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }

        if (success) {
          const itemArray = this[stateKey];
          const index = itemArray.findIndex(item => item.id === id);
          if (index !== -1) itemArray.splice(index, 1);
        }
        return success;
      } finally {
        this.loading = false;
        loadingStore.stopLoading('deleteItem');
      }
    }
  },
});