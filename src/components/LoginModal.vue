<template>
    <q-dialog v-model="isOpen" persistent>
      <q-card class="login-modal">
        <q-card-section>
          <div class="text-h6 text-primary text-weight-bold">Admin Login</div>
        </q-card-section>
  
        <q-card-section class="q-pt-none">
          <q-form @submit="handleLogin" class="q-gutter-md">
            <q-input
              filled
              v-model="loginForm.username"
              label="Username"
              lazy-rules
              :rules="[val => !!val || 'Username is required']"
            />
            <q-input
              filled
              type="password"
              v-model="loginForm.password"
              label="Password"
              lazy-rules
              :rules="[val => !!val || 'Password is required']"
            />
            <div class="row justify-end q-mt-lg">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn label="Login" type="submit" color="secondary" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
  
  <script>
  import { defineComponent, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth-store';
  import { useQuasar } from 'quasar';
  
  export default defineComponent({
    name: 'LoginModal',
    props: {
      modelValue: Boolean // Required for v-model
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const router = useRouter();
      const authStore = useAuthStore();
      const $q = useQuasar();
  
      const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
      });
  
      const loginForm = reactive({ username: '', password: '' });
  
      const handleLogin = async () => {
        const result = await authStore.login(loginForm);
        if (result.success) {
          $q.notify({ type: 'positive', message: 'Login successful!' });
          isOpen.value = false; // Close modal
          await router.push('/admin/dashboard'); // Navigate to admin dashboard
        } else {
          $q.notify({ type: 'negative', message: result.error });
        }
      };
  
      return { isOpen, loginForm, handleLogin };
    }
  });
  </script>

  <style scoped>
  .login-modal {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    min-width: 320px;
    max-width: 400px;
    width: 100%;
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .login-modal {
      min-width: unset;
      max-width: 95vw;
      width: 100%;
      margin: 16px;
      border-radius: 12px;
    }

    .login-modal .q-card-section {
      padding: 16px;
    }

    .login-modal .text-h6 {
      font-size: 1.125rem !important;
      font-weight: 600 !important;
    }

    .login-modal .q-input {
      font-size: 0.9rem;
    }

    .login-modal .q-btn {
      font-size: 0.9rem;
      padding: 8px 16px;
    }

    .login-modal .row {
      flex-direction: column;
      gap: 8px;
    }

    .login-modal .q-btn.q-ml-sm {
      margin-left: 0 !important;
      margin-top: 8px;
    }
  }

  @media (max-width: 480px) {
    .login-modal {
      margin: 8px;
      max-width: calc(100vw - 16px);
      border-radius: 8px;
    }

    .login-modal .q-card-section {
      padding: 12px;
    }

    .login-modal .text-h6 {
      font-size: 1rem !important;
      font-weight: 600 !important;
    }

    .login-modal .q-input {
      font-size: 0.85rem;
    }

    .login-modal .q-btn {
      font-size: 0.85rem;
      padding: 6px 12px;
    }

    .login-modal .q-gutter-md {
      gap: 12px;
    }
  }

  @media (max-width: 360px) {
    .login-modal {
      margin: 4px;
      max-width: calc(100vw - 8px);
      border-radius: 6px;
    }

    .login-modal .q-card-section {
      padding: 8px;
    }

    .login-modal .text-h6 {
      font-size: 0.9rem !important;
      font-weight: 600 !important;
    }

    .login-modal .q-input {
      font-size: 0.8rem;
    }

    .login-modal .q-btn {
      font-size: 0.8rem;
      padding: 4px 8px;
    }
  }
  </style>