// src/services/mockApi.js

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// --- DATA FROM YOUR EXCEL FILE (Expanded) ---
// NOTE: We use 'let' instead of 'const' so we can modify these arrays
let propertiesForSale = [
  { id: 1, name: 'Mike Adenya House', type: 'Built House', address: 'Colorado Street (Maitama)', description: 'Fully Detached, 3 bedrooms shared compound, swimming pool available', landmark: 'Mike Adenya House, Saudi Embassy', city: 'Abuja', price: 'N4.5Billion', titleDocument: 'N/A', agentName: 'Agent A', agentNumber: '07081731601', status: 'Available' },
  { id: 2, name: 'Gwarimpa Duplex', type: 'Built House', address: 'Gwarimpa 4th Avenue by H-Medix', description: '4 bedrooms semi-detached duplex...', landmark: 'H-Medix 4th Avenue', city: 'Abuja', price: 'N450Million', titleDocument: 'FHA', agentName: 'Abubakr', agentNumber: '08033377927', status: 'Sold' },
  { id: 3, name: 'Dawaki Terraces', type: 'Built Estate', address: 'Dawaki, Kubwa Express Way', description: '16 units newly constructed 4-Bedrooms terraces...', landmark: 'N/A', city: 'Abuja', price: 'N5.5 Billion', titleDocument: 'FCDA C of O', agentName: 'Agent B', agentNumber: 'N/A', status: 'Available' }
];

let listingsForLand = [
  { id: 1, name: 'Asokoro Plot', type: 'Residential', address: 'Asokoro', landmark: 'N/A', landSize: 'Unknown', city: 'Abuja', price: 'Contact for Price', titleDocument: 'N/A', sellerName: 'N/A', sellerContact: '08028619475', status: 'Available' },
  { id: 2, name: 'Mararraba Bridge Land', type: 'Commercial', address: 'Mararraba Bridge', landmark: 'N/A', landSize: 'Unknown', city: 'Abuja', price: '600 Million', titleDocument: 'N/A', sellerName: 'N/A', sellerContact: '08032190655', status: 'Under Offer' }
];

let propertyRequests = [
  { id: 1, clientName: 'Huzaifa', request: 'Filling Station', phoneNumber: '08140545112', city: 'Abuja', location: 'Any', budget: '600M', specification: 'Katampe(Shema)', status: 'New' },
  { id: 2, clientName: 'Client B', request: 'Built House', phoneNumber: 'N/A', city: 'Abuja', location: 'Gwarimpa', budget: '150-200M', specification: '3 or 4 bedrooms Bungalow', status: 'Contacted' }
];

let listingsForRentals = [
  { id: 1, name: 'Luxury Apartment in Wuse 2', type: 'Apartment', address: 'Wuse 2', description: '3 bedroom apartment with modern amenities', landmark: 'N/A', city: 'Abuja', price: 'N2.5 Million/year', status: 'Available' },
  { id: 2, name: 'Office Space in Maitama', type: 'Commercial', address: 'Maitama', description: '2,000 sq ft office space', landmark: 'N/A', city: 'Abuja', price: 'N5 Million/year', status: 'Available' }
];

let commercialRequests = [
  { id: 1, clientName: 'Business Owner', request: 'Office Space', phoneNumber: '08012345678', city: 'Abuja', location: 'Central Business District', budget: '3-5M', specification: '1000+ sq ft', status: 'New' }
];

let commercialListings = [
  { id: 1, name: 'Shopping Mall Space', type: 'Retail', address: 'Wuse 2', description: 'Prime retail space in busy shopping mall', landmark: 'N/A', city: 'Abuja', price: 'N15 Million/year', status: 'Available' }
];

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
  async getPropertiesForSale() { await delay(300); return propertiesForSale; },
  async addPropertyForSale(property) { await delay(300); property.id = Date.now(); propertiesForSale.push(property); return property; },
  // --- NEW FUNCTIONS ---
  async updatePropertyForSale(id, data) {
    await delay(300);
    const index = propertiesForSale.findIndex(p => p.id === id);
    if (index !== -1) {
      propertiesForSale[index] = { ...propertiesForSale[index], ...data };
      return propertiesForSale[index];
    }
    return null;
  },
  async deletePropertyForSale(id) {
    await delay(300);
    const index = propertiesForSale.findIndex(p => p.id === id);
    if (index !== -1) {
      propertiesForSale.splice(index, 1);
      return true;
    }
    return false;
  },

  // Land
  async getListingsForLand() { await delay(300); return listingsForLand; },
  async addListingForLand(land) { await delay(300); land.id = Date.now(); listingsForLand.push(land); return land; },
  // --- NEW FUNCTIONS ---
  async updateListingForLand(id, data) {
    await delay(300);
    const index = listingsForLand.findIndex(p => p.id === id);
    if (index !== -1) {
      listingsForLand[index] = { ...listingsForLand[index], ...data };
      return listingsForLand[index];
    }
    return null;
  },
  async deleteListingForLand(id) {
    await delay(300);
    const index = listingsForLand.findIndex(p => p.id === id);
    if (index !== -1) {
      listingsForLand.splice(index, 1);
      return true;
    }
    return false;
  },

  // Requests
  async getPropertyRequests() { await delay(300); return propertyRequests; },
  async addPropertyRequest(request) { await delay(300); request.id = Date.now(); propertyRequests.push(request); return request; },
  // --- NEW FUNCTIONS ---
  async updatePropertyRequest(id, data) {
    await delay(300);
    const index = propertyRequests.findIndex(p => p.id === id);
    if (index !== -1) {
      propertyRequests[index] = { ...propertyRequests[index], ...data };
      return propertyRequests[index];
    }
    return null;
  },
  async deletePropertyRequest(id) {
    await delay(300);
    const index = propertyRequests.findIndex(p => p.id === id);
    if (index !== -1) {
      propertyRequests.splice(index, 1);
      return true;
    }
    return false;
  },

  // Rentals
  async getListingsForRentals() { await delay(300); return listingsForRentals; },
  async addListingForRental(rental) { await delay(300); rental.id = Date.now(); listingsForRentals.push(rental); return rental; },
  async updateListingForRental(id, data) {
    await delay(300);
    const index = listingsForRentals.findIndex(p => p.id === id);
    if (index !== -1) {
      listingsForRentals[index] = { ...listingsForRentals[index], ...data };
      return listingsForRentals[index];
    }
    return null;
  },
  async deleteListingForRental(id) {
    await delay(300);
    const index = listingsForRentals.findIndex(p => p.id === id);
    if (index !== -1) {
      listingsForRentals.splice(index, 1);
      return true;
    }
    return false;
  },

  // Commercial Requests
  async getCommercialRequests() { await delay(300); return commercialRequests; },
  async addCommercialRequest(request) { await delay(300); request.id = Date.now(); commercialRequests.push(request); return request; },
  async updateCommercialRequest(id, data) {
    await delay(300);
    const index = commercialRequests.findIndex(p => p.id === id);
    if (index !== -1) {
      commercialRequests[index] = { ...commercialRequests[index], ...data };
      return commercialRequests[index];
    }
    return null;
  },
  async deleteCommercialRequest(id) {
    await delay(300);
    const index = commercialRequests.findIndex(p => p.id === id);
    if (index !== -1) {
      commercialRequests.splice(index, 1);
      return true;
    }
    return false;
  },

  // Commercial Listings
  async getCommercialListings() { await delay(300); return commercialListings; },
  async addCommercialListing(listing) { await delay(300); listing.id = Date.now(); commercialListings.push(listing); return listing; },
  async updateCommercialListing(id, data) {
    await delay(300);
    const index = commercialListings.findIndex(p => p.id === id);
    if (index !== -1) {
      commercialListings[index] = { ...commercialListings[index], ...data };
      return commercialListings[index];
    }
    return null;
  },
  async deleteCommercialListing(id) {
    await delay(300);
    const index = commercialListings.findIndex(p => p.id === id);
    if (index !== -1) {
      commercialListings.splice(index, 1);
      return true;
    }
    return false;
  }
};