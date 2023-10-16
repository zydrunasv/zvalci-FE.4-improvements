<template>
  <Header />
  <router-view />
  <Statistics />
</template>

<script setup>
import Header from './components/Header.vue';
import Statistics from './components/Statistics.vue';
</script>
