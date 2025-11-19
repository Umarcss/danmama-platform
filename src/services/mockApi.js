// src/services/mockApi.js

import databaseData from '../data/database.json';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Storage keys
const STORAGE_KEYS = {
  PROPERTIES_FOR_SALE: 'danmama_properties_for_sale',
  LISTINGS_FOR_LAND: 'danmama_listings_for_land',
  PROPERTY_REQUESTS: 'danmama_property_requests',
  LISTINGS_FOR_RENTALS: 'danmama_listings_for_rentals',
  COMMERCIAL_REQUESTS: 'danmama_commercial_requests',
  COMMERCIAL_LISTINGS: 'danmama_commercial_listings',
  DATA_VERSION: 'danmama_data_version'
};

// Helper functions for localStorage
const loadFromStorage = (key, defaultValue = []) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Update version timestamp to track changes
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, Date.now().toString());
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please export and clear data.');
    }
  }
};

// Initialize: Load from localStorage if it exists (has latest changes), otherwise use JSON file
// This ensures data persists across page refreshes while JSON file remains the source of truth for Git
const initializeData = () => {
  // Check if we have any data in localStorage
  const hasStoredData = localStorage.getItem(STORAGE_KEYS.PROPERTIES_FOR_SALE) !== null;
  
  if (hasStoredData) {
    // Load from localStorage (has latest changes from current session)
    propertiesForSale = loadFromStorage(STORAGE_KEYS.PROPERTIES_FOR_SALE, databaseData.propertiesForSale || []);
    listingsForLand = loadFromStorage(STORAGE_KEYS.LISTINGS_FOR_LAND, databaseData.listingsForLand || []);
    propertyRequests = loadFromStorage(STORAGE_KEYS.PROPERTY_REQUESTS, databaseData.propertyRequests || []);
    listingsForRentals = loadFromStorage(STORAGE_KEYS.LISTINGS_FOR_RENTALS, databaseData.listingsForRentals || []);
    commercialRequests = loadFromStorage(STORAGE_KEYS.COMMERCIAL_REQUESTS, databaseData.commercialRequests || []);
    commercialListings = loadFromStorage(STORAGE_KEYS.COMMERCIAL_LISTINGS, databaseData.commercialListings || []);
  } else {
    // First time load or localStorage cleared - use JSON file data
    propertiesForSale = [...(databaseData.propertiesForSale || [])];
    listingsForLand = [...(databaseData.listingsForLand || [])];
    propertyRequests = [...(databaseData.propertyRequests || [])];
    listingsForRentals = [...(databaseData.listingsForRentals || [])];
    commercialRequests = [...(databaseData.commercialRequests || [])];
    commercialListings = [...(databaseData.commercialListings || [])];
    
    // Save to localStorage for persistence
    saveToStorage(STORAGE_KEYS.PROPERTIES_FOR_SALE, propertiesForSale);
    saveToStorage(STORAGE_KEYS.LISTINGS_FOR_LAND, listingsForLand);
    saveToStorage(STORAGE_KEYS.PROPERTY_REQUESTS, propertyRequests);
    saveToStorage(STORAGE_KEYS.LISTINGS_FOR_RENTALS, listingsForRentals);
    saveToStorage(STORAGE_KEYS.COMMERCIAL_REQUESTS, commercialRequests);
    saveToStorage(STORAGE_KEYS.COMMERCIAL_LISTINGS, commercialListings);
  }
};

// Initialize data arrays
let propertiesForSale = [];
let listingsForLand = [];
let propertyRequests = [];
let listingsForRentals = [];
let commercialRequests = [];
let commercialListings = [];

// Initialize on module load
initializeData();

// --- API FUNCTIONS ---
export const mockApi = {
  // Auth
  async login(username, password) {
    await delay(500);
    if (username === 'admin' && password === 'password') {
      return { success: true, token: 'fake-jwt-token' };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Properties
  async getPropertiesForSale() { 
    await delay(300); 
    return propertiesForSale; 
  },
  
  async addPropertyForSale(property) { 
    await delay(300); 
    property.id = Date.now(); 
    // Ensure images array and primaryImage exist
    if (!property.images) property.images = [];
    if (property.primaryImage === undefined) property.primaryImage = property.images.length > 0 ? 0 : null;
    propertiesForSale.push(property);
    saveToStorage(STORAGE_KEYS.PROPERTIES_FOR_SALE, propertiesForSale);
    return property; 
  },
  
  async updatePropertyForSale(id, data) {
    await delay(300);
    const index = propertiesForSale.findIndex(p => p.id === id);
    if (index !== -1) {
      propertiesForSale[index] = { ...propertiesForSale[index], ...data };
      saveToStorage(STORAGE_KEYS.PROPERTIES_FOR_SALE, propertiesForSale);
      return propertiesForSale[index];
    }
    return null;
  },
  
  async deletePropertyForSale(id) {
    await delay(300);
    const index = propertiesForSale.findIndex(p => p.id === id);
    if (index !== -1) {
      propertiesForSale.splice(index, 1);
      saveToStorage(STORAGE_KEYS.PROPERTIES_FOR_SALE, propertiesForSale);
      return true;
    }
    return false;
  },

  // Land
  async getListingsForLand() { 
    await delay(300); 
    return listingsForLand; 
  },
  
  async addListingForLand(land) { 
    await delay(300); 
    land.id = Date.now(); 
    listingsForLand.push(land);
    saveToStorage(STORAGE_KEYS.LISTINGS_FOR_LAND, listingsForLand);
    return land; 
  },
  
  async updateListingForLand(id, data) {
    await delay(300);
    const index = listingsForLand.findIndex(p => p.id === id);
    if (index !== -1) {
      listingsForLand[index] = { ...listingsForLand[index], ...data };
      saveToStorage(STORAGE_KEYS.LISTINGS_FOR_LAND, listingsForLand);
      return listingsForLand[index];
    }
    return null;
  },
  
  async deleteListingForLand(id) {
    await delay(300);
    const index = listingsForLand.findIndex(p => p.id === id);
    if (index !== -1) {
      listingsForLand.splice(index, 1);
      saveToStorage(STORAGE_KEYS.LISTINGS_FOR_LAND, listingsForLand);
      return true;
    }
    return false;
  },

  // Requests
  async getPropertyRequests() { 
    await delay(300); 
    return propertyRequests; 
  },
  
  async addPropertyRequest(request) { 
    await delay(300); 
    request.id = Date.now(); 
    propertyRequests.push(request);
    saveToStorage(STORAGE_KEYS.PROPERTY_REQUESTS, propertyRequests);
    return request; 
  },
  
  async updatePropertyRequest(id, data) {
    await delay(300);
    const index = propertyRequests.findIndex(p => p.id === id);
    if (index !== -1) {
      propertyRequests[index] = { ...propertyRequests[index], ...data };
      saveToStorage(STORAGE_KEYS.PROPERTY_REQUESTS, propertyRequests);
      return propertyRequests[index];
    }
    return null;
  },
  
  async deletePropertyRequest(id) {
    await delay(300);
    const index = propertyRequests.findIndex(p => p.id === id);
    if (index !== -1) {
      propertyRequests.splice(index, 1);
      saveToStorage(STORAGE_KEYS.PROPERTY_REQUESTS, propertyRequests);
      return true;
    }
    return false;
  },

  // Rentals
  async getListingsForRentals() { 
    await delay(300); 
    return listingsForRentals; 
  },
  
  async addListingForRental(rental) { 
    await delay(300); 
    rental.id = Date.now(); 
    // Ensure images array and primaryImage exist
    if (!rental.images) rental.images = [];
    if (rental.primaryImage === undefined) rental.primaryImage = rental.images.length > 0 ? 0 : null;
    listingsForRentals.push(rental);
    saveToStorage(STORAGE_KEYS.LISTINGS_FOR_RENTALS, listingsForRentals);
    return rental; 
  },
  
  async updateListingForRental(id, data) {
    await delay(300);
    const index = listingsForRentals.findIndex(p => p.id === id);
    if (index !== -1) {
      listingsForRentals[index] = { ...listingsForRentals[index], ...data };
      saveToStorage(STORAGE_KEYS.LISTINGS_FOR_RENTALS, listingsForRentals);
      return listingsForRentals[index];
    }
    return null;
  },
  
  async deleteListingForRental(id) {
    await delay(300);
    const index = listingsForRentals.findIndex(p => p.id === id);
    if (index !== -1) {
      listingsForRentals.splice(index, 1);
      saveToStorage(STORAGE_KEYS.LISTINGS_FOR_RENTALS, listingsForRentals);
      return true;
    }
    return false;
  },

  // Commercial Requests
  async getCommercialRequests() { 
    await delay(300); 
    return commercialRequests; 
  },
  
  async addCommercialRequest(request) { 
    await delay(300); 
    request.id = Date.now(); 
    commercialRequests.push(request);
    saveToStorage(STORAGE_KEYS.COMMERCIAL_REQUESTS, commercialRequests);
    return request; 
  },
  
  async updateCommercialRequest(id, data) {
    await delay(300);
    const index = commercialRequests.findIndex(p => p.id === id);
    if (index !== -1) {
      commercialRequests[index] = { ...commercialRequests[index], ...data };
      saveToStorage(STORAGE_KEYS.COMMERCIAL_REQUESTS, commercialRequests);
      return commercialRequests[index];
    }
    return null;
  },
  
  async deleteCommercialRequest(id) {
    await delay(300);
    const index = commercialRequests.findIndex(p => p.id === id);
    if (index !== -1) {
      commercialRequests.splice(index, 1);
      saveToStorage(STORAGE_KEYS.COMMERCIAL_REQUESTS, commercialRequests);
      return true;
    }
    return false;
  },

  // Commercial Listings
  async getCommercialListings() { 
    await delay(300); 
    return commercialListings; 
  },
  
  async addCommercialListing(listing) { 
    await delay(300); 
    listing.id = Date.now(); 
    commercialListings.push(listing);
    saveToStorage(STORAGE_KEYS.COMMERCIAL_LISTINGS, commercialListings);
    return listing; 
  },
  
  async updateCommercialListing(id, data) {
    await delay(300);
    const index = commercialListings.findIndex(p => p.id === id);
    if (index !== -1) {
      commercialListings[index] = { ...commercialListings[index], ...data };
      saveToStorage(STORAGE_KEYS.COMMERCIAL_LISTINGS, commercialListings);
      return commercialListings[index];
    }
    return null;
  },
  
  async deleteCommercialListing(id) {
    await delay(300);
    const index = commercialListings.findIndex(p => p.id === id);
    if (index !== -1) {
      commercialListings.splice(index, 1);
      saveToStorage(STORAGE_KEYS.COMMERCIAL_LISTINGS, commercialListings);
      return true;
    }
    return false;
  },

  // Export current data as JSON (for updating the database.json file)
  exportToJSON() {
    const data = {
      _version: Date.now(),
      propertiesForSale,
      listingsForLand,
      propertyRequests,
      listingsForRentals,
      commercialRequests,
      commercialListings
    };
    
    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return data;
  },
  
  // Import from JSON file (for syncing with codebase)
  importFromJSON(jsonData) {
    if (jsonData.propertiesForSale) propertiesForSale = jsonData.propertiesForSale;
    if (jsonData.listingsForLand) listingsForLand = jsonData.listingsForLand;
    if (jsonData.propertyRequests) propertyRequests = jsonData.propertyRequests;
    if (jsonData.listingsForRentals) listingsForRentals = jsonData.listingsForRentals;
    if (jsonData.commercialRequests) commercialRequests = jsonData.commercialRequests;
    if (jsonData.commercialListings) commercialListings = jsonData.commercialListings;
    
    // Save to localStorage
    saveToStorage(STORAGE_KEYS.PROPERTIES_FOR_SALE, propertiesForSale);
    saveToStorage(STORAGE_KEYS.LISTINGS_FOR_LAND, listingsForLand);
    saveToStorage(STORAGE_KEYS.PROPERTY_REQUESTS, propertyRequests);
    saveToStorage(STORAGE_KEYS.LISTINGS_FOR_RENTALS, listingsForRentals);
    saveToStorage(STORAGE_KEYS.COMMERCIAL_REQUESTS, commercialRequests);
    saveToStorage(STORAGE_KEYS.COMMERCIAL_LISTINGS, commercialListings);
    
    return true;
  },
  
  // Reset to JSON file data (clears localStorage and reloads from JSON)
  resetToJSONData() {
    // Clear all localStorage data
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== 'DATA_VERSION') {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem(STORAGE_KEYS.DATA_VERSION);
    
    // Reload from JSON
    initializeData();
    return true;
  }
};
