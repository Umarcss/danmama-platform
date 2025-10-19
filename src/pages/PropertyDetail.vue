<template>
  <q-page class="q-pa-md">
    <div v-if="property" class="row q-gutter-md">
      <div class="col-12 col-md-8">
        <q-carousel
          v-model="slide"
          swipeable
          animated
          control-color="secondary"
          navigation
          padding
          arrows
          height="400px"
          class="text-white rounded-borders"
        >
          <q-carousel-slide v-for="(img, index) in property.images" :key="index" :name="index" :img-src="img" />
        </q-carousel>
        <div class="q-mt-md">
          <div class="text-h4">{{ property.name }}</div>
          <p class="q-mt-md">{{ property.description }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <q-card class="q-pa-md sticky-card">
          <div class="text-h5 text-secondary text-weight-bold">{{ property.price }}</div>
          <div class="q-my-md">
            <q-icon name="location_on" class="text-primary" /> {{ property.address }}
          </div>
          <q-separator />
          <div class="q-my-md text-caption">
            <div><q-icon name="home" /> Type: {{ property.type }}</div>
            <div><q-icon name="gavel" /> Title: {{ property.titleDocument }}</div>
            <div><q-icon name="person" /> Agent: {{ property.agentName }}</div>
          </div>
          <q-separator />
          <q-btn class="full-width q-mt-md" color="secondary" text-color="primary" label="Make an Inquiry" @click="showInquiryForm = true" />
        </q-card>
      </div>
    </div>
    <div v-else class="text-center">
      <q-spinner size="50px" color="primary" />
    </div>

    <!-- Inquiry Form Modal -->
    <q-dialog v-model="showInquiryForm">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Inquire about {{ property?.name }}</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitInquiry" class="q-gutter-md">
            <q-input filled v-model="inquiry.name" label="Your Name" />
            <q-input filled v-model="inquiry.email" label="Your Email" type="email" />
            <q-input filled v-model="inquiry.message" type="textarea" label="Message" />
            <div class="row justify-end">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn label="Send" type="submit" color="secondary" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDataStore } from 'src/stores/data-store';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PropertyDetailPage',
  setup() {
    const route = useRoute();
    const dataStore = useDataStore();
    const $q = useQuasar();
    const slide = ref(1);
    const showInquiryForm = ref(false);
    const inquiry = ref({ name: '', email: '', message: '' });

    const property = computed(() => {
      // Add placeholder images for the carousel
      const foundProperty = dataStore.propertiesForSale.find(p => p.id === parseInt(route.params.id));
      if (foundProperty) {
        foundProperty.images = [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070'
        ];
      }
      return foundProperty;
    });

    onMounted(() => {
      if (dataStore.propertiesForSale.length === 0) {
        dataStore.fetchAllData();
      }
    });

    const submitInquiry = () => {
      $q.notify({
        type: 'positive',
        message: `Inquiry sent for ${property.value.name}! We will contact you soon.`
      });
      showInquiryForm.value = false;
      inquiry.value = { name: '', email: '', message: '' };
    };

    return { property, slide, showInquiryForm, inquiry, submitInquiry };
  }
});
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 20px;
}
</style>