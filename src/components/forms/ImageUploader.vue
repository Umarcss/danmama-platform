<template>
  <div class="image-uploader">
    <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Property Images</div>
    <div class="text-caption text-grey-6 q-mb-md">
      Upload 1-10 images. First image will be set as primary. You can change the primary image by clicking the star icon.
    </div>

    <!-- Drag and Drop Area -->
    <div
      v-if="images.length < 10"
      class="upload-area"
      :class="{ 'drag-over': isDragging }"
      @drop="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @dragenter.prevent
    >
      <q-icon name="cloud_upload" size="3rem" color="primary" />
      <div class="text-h6 q-mt-md">Drag & Drop Images Here</div>
      <div class="text-body2 text-grey-6 q-mt-sm">or</div>
      <q-btn
        color="primary"
        label="Browse Files"
        @click="triggerFileInput"
        class="q-mt-md"
        outline
      />
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        @change="handleFileSelect"
        style="display: none"
      />
    </div>

    <!-- Image Preview Grid -->
    <div v-if="images.length > 0" class="image-grid q-mt-md">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="image-item"
        :class="{ 'primary-image': index === primaryImage }"
      >
        <div class="image-wrapper">
          <img :src="image" :alt="`Property image ${index + 1}`" />
          <div class="image-overlay">
            <q-btn
              flat
              round
              dense
              :icon="index === primaryImage ? 'star' : 'star_border'"
              :color="index === primaryImage ? 'warning' : 'white'"
              size="sm"
              @click="setPrimaryImage(index)"
              class="primary-btn"
            >
              <q-tooltip>{{ index === primaryImage ? 'Primary Image' : 'Set as Primary' }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              size="sm"
              @click="removeImage(index)"
              class="delete-btn"
            >
              <q-tooltip>Remove Image</q-tooltip>
            </q-btn>
          </div>
          <div v-if="index === primaryImage" class="primary-badge">
            <q-icon name="star" size="xs" />
            <span>Primary</span>
          </div>
        </div>
        <div class="image-number">{{ index + 1 }}</div>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="errorMessage" class="text-negative q-mt-sm">
      <q-icon name="error" />
      {{ errorMessage }}
    </div>

    <!-- Upload Progress -->
    <q-linear-progress
      v-if="uploading"
      :value="uploadProgress"
      color="primary"
      class="q-mt-md"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ImageUploader',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    primaryImageIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue', 'update:primaryImageIndex'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const fileInput = ref(null);
    const isDragging = ref(false);
    const images = ref(Array.isArray(props.modelValue) ? [...props.modelValue] : []);
    const primaryImage = ref(props.primaryImageIndex ?? (images.value.length > 0 ? 0 : null));
    const errorMessage = ref('');
    const uploading = ref(false);
    const uploadProgress = ref(0);

    // Watch for external changes to sync internal state
    watch(() => props.modelValue, (newVal) => {
      // Only update if actually different (avoid unnecessary updates)
      const newArray = Array.isArray(newVal) ? newVal : [];
      if (JSON.stringify(images.value) !== JSON.stringify(newArray)) {
        images.value = [...newArray];
      }
    }, { deep: true, immediate: false });

    watch(() => props.primaryImageIndex, (newVal) => {
      if (primaryImage.value !== newVal) {
        primaryImage.value = newVal;
      }
    }, { immediate: false });

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const validateFile = (file) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        return 'Invalid file type. Please upload JPG, PNG, or WebP images only.';
      }

      if (file.size > maxSize) {
        return 'File size exceeds 5MB limit. Please compress the image.';
      }

      return null;
    };

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const handleFiles = async (files) => {
      errorMessage.value = '';
      const fileArray = Array.from(files);
      const remainingSlots = 10 - images.value.length;

      if (fileArray.length > remainingSlots) {
        errorMessage.value = `You can only upload ${remainingSlots} more image(s). Maximum 10 images allowed.`;
        fileArray.splice(remainingSlots);
      }

      uploading.value = true;
      uploadProgress.value = 0;

      try {
        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];
          const validationError = validateFile(file);

          if (validationError) {
            errorMessage.value = validationError;
            continue;
          }

          uploadProgress.value = ((i + 1) / fileArray.length) * 100;
          const base64 = await convertToBase64(file);
          images.value.push(base64);
        }

        // Set first image as primary if no primary is set
        if (primaryImage.value === null && images.value.length > 0) {
          primaryImage.value = 0;
        }

        // Emit updates after adding images
        emit('update:modelValue', [...images.value]);
        if (primaryImage.value !== null) {
          emit('update:primaryImageIndex', primaryImage.value);
        }
      } catch (error) {
        errorMessage.value = 'Error processing images. Please try again.';
        console.error('Image processing error:', error);
      } finally {
        uploading.value = false;
        uploadProgress.value = 0;
      }
    };

    const handleFileSelect = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        handleFiles(files);
      }
      // Reset input
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const handleDrop = (event) => {
      event.preventDefault();
      isDragging.value = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    };

    const setPrimaryImage = (index) => {
      if (index >= 0 && index < images.value.length) {
        primaryImage.value = index;
        emit('update:primaryImageIndex', index);
      }
    };

    const removeImage = (index) => {
      if (images.value.length <= 1) {
        $q.notify({
          type: 'warning',
          message: 'At least one image is required',
          position: 'top'
        });
        return;
      }

      images.value.splice(index, 1);

      // Adjust primary image index if needed
      if (primaryImage.value === index) {
        // Set first image as primary
        primaryImage.value = 0;
      } else if (primaryImage.value > index) {
        // Decrement primary index if removed image was before it
        primaryImage.value--;
      }

      // Emit updates after removing image
      emit('update:modelValue', [...images.value]);
      emit('update:primaryImageIndex', primaryImage.value);
    };

    return {
      fileInput,
      isDragging,
      images,
      primaryImage,
      errorMessage,
      uploading,
      uploadProgress,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      setPrimaryImage,
      removeImage
    };
  }
});
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-area {
  border: 2px dashed #1976d2;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  background: rgba(25, 118, 210, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  background: rgba(25, 118, 210, 0.1);
  border-color: #1565c0;
}

.upload-area.drag-over {
  background: rgba(25, 118, 210, 0.15);
  border-color: #0d47a1;
  transform: scale(1.02);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.image-item.primary-image {
  border-color: #ff9800;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%; /* Square aspect ratio */
  background: #f5f5f5;
  overflow: hidden;
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.primary-btn,
.delete-btn {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.primary-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 152, 0, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 1;
}

.image-number {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .upload-area {
    padding: 30px 20px;
  }

  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }
}
</style>

