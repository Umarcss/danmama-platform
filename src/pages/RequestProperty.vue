<template>
    <div class="request-page-container">
      <!-- This div creates the background for the glassmorphism effect -->
      <div class="row justify-center items-center full-height">
        <div class="col-11 col-md-7 col-lg-5">
          <!-- The QCard is our main form container with the glass effect -->
          <q-card class="glass-card">
            <q-card-section>
              <div class="text-h5 text-weight-bold text-center text-primary">
                Submit a Property Request
              </div>
              <div class="text-subtitle1 text-center text-grey-6 q-mt-sm">
                Let us find the perfect property for you
              </div>
            </q-card-section>
  
            <q-card-section>
              <q-form @submit="onSubmit" class="q-gutter-md">
                <!-- Name Field -->
                <q-input
                  filled
                  v-model="formData.name"
                  label="Your Full Name *"
                  hint="e.g., John Doe"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type your name']"
                />
  
                <!-- Contact Fields -->
                <div class="row q-gutter-sm">
                  <div class="col">
                    <q-input
                      filled
                      v-model="formData.phone"
                      label="Phone Number *"
                      mask="+234 (###) ### - ####"
                      unmasked-value
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please enter your phone number']"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      filled
                      v-model="formData.email"
                      label="Your E-mail *"
                      type="email"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please type your email']"
                    />
                  </div>
                </div>
  
                <!-- Request Type & Budget -->
                <div class="row q-gutter-sm">
                  <div class="col">
                    <q-input
                      filled
                      v-model="formData.requestType"
                      label="What are you looking for? *"
                      placeholder="e.g., Residential House, Land (Residential), Land (Commercial), Commercial Property"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please enter a request type']"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      filled
                      v-model="formData.budget"
                      :options="budgetOptions"
                      label="Your Budget (NGN)"
                      clearable
                    />
                  </div>
                </div>
  
                <!-- Location -->
                <q-input
                  filled
                  v-model="formData.location"
                  label="Preferred Location *"
                  hint="e.g., Asokoro, Maitama, Gwarimpa"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please enter a preferred location']"
                />
  
                <!-- Specifications -->
                <q-editor
                  v-model="formData.specifications"
                  min-height="5rem"
                  placeholder="Please provide any specific details (e.g., number of bedrooms, type of house, amenities needed, etc.)"
                  :toolbar="[
                    ['bold', 'italic', 'underline'],
                    ['quote', 'unordered', 'ordered'],
                    ['link']
                  ]"
                />
  
                <!-- Submit Button -->
                <div class="row justify-center q-mt-lg">
                  <q-btn
                    label="Submit Request"
                    type="submit"
                    color="secondary"
                    class="full-width text-weight-bold"
                    size="md"
                    icon-right="send"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue'
  import { useQuasar } from 'quasar'
  
  export default defineComponent({
    name: 'RequestProperty',
    setup () {
      const $q = useQuasar()
  
      // --- Form Data ---
      const formData = ref({
        name: '',
        phone: '',
        email: '',
        requestType: '',
        budget: null,
        location: '',
        specifications: ''
      })
  
      // --- Options for Select Fields ---
      const budgetOptions = [
        '50M - 150M',
        '150M - 300M',
        '300M - 600M',
        '600M - 1B',
        '1B - 5B',
        '5B+'
      ]
  
      // --- Form Submission ---
      const onSubmit = () => {
        console.log('Form Submitted!', formData.value)
  
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Your request has been submitted successfully!',
          icon: 'check_circle'
        })
      }
  
      return {
        formData,
        budgetOptions,
        onSubmit
      }
    }
  })
  </script>
  
  <style scoped>
  /* This is where the glassmorphism magic happens! */
  .request-page-container {
    /* A subtle gradient background */
    background: linear-gradient(135deg, #0a3d62 0%, #34495e 100%);
    min-height: 100vh;
  }
  
  .glass-card {
    /* The core of the glassmorphism effect */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px); /* For Safari */
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }
  
  /* Make the form inputs blend nicely with the glass theme */
  .q-field--filled .q-field__control {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  .q-field--filled .q-field__control:before {
    border-bottom: none;
  }
  </style>