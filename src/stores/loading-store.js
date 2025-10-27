// src/stores/loading-store.js
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    loadingMessage: 'Loading...',
    loadingSubMessage: 'Please wait while we fetch your data',
    loadingTasks: new Set()
  }),

  getters: {
    hasActiveTasks: (state) => state.loadingTasks.size > 0
  },

  actions: {
    startLoading(taskId = 'default', message = 'Loading...', subMessage = 'Please wait while we fetch your data') {
      this.loadingTasks.add(taskId)
      this.loadingMessage = message
      this.loadingSubMessage = subMessage
      this.isLoading = true
    },

    stopLoading(taskId = 'default') {
      this.loadingTasks.delete(taskId)
      if (this.loadingTasks.size === 0) {
        this.isLoading = false
        this.loadingMessage = 'Loading...'
        this.loadingSubMessage = 'Please wait while we fetch your data'
      }
    },

    setLoadingMessage(message, subMessage = null) {
      this.loadingMessage = message
      if (subMessage !== null) {
        this.loadingSubMessage = subMessage
      }
    },

    clearAllLoading() {
      this.loadingTasks.clear()
      this.isLoading = false
      this.loadingMessage = 'Loading...'
      this.loadingSubMessage = 'Please wait while we fetch your data'
    }
  }
})
