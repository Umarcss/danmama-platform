<template>
    <q-card class="summary-card">
      <q-card-section class="text-center">
        <q-icon :name="icon" size="3rem" :color="color" />
        <div class="text-h2 text-weight-bold q-my-sm">{{ count }}</div>
        <div class="text-subtitle1">{{ label }}</div>
      </q-card-section>
    </q-card>
  </template>
  
  <script>
  export default {
    name: 'SummaryCard',
    props: {
      icon: String,
      label: String,
      count: Number,
      color: String
    }
  }
  </script>