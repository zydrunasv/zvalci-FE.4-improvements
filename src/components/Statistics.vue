<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="statistics">
    <p>Total Financial Goals: {{ Math.ceil(totalGoals) }}</p>
    <p>Total Contributed: €{{ Math.ceil(totalContributed) }}</p>
    <p>Total Remaining: €{{ Math.ceil(totalRemaining) }}</p>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';

const goals = inject('goals');

const totalGoals = computed(() => goals.value.length);

const totalContributed = computed(() => {
  return goals.value.reduce(
    (sum, goal) => sum + parseFloat(goal.contributed),
    0,
  );
});

const totalRemaining = computed(() => {
  return goals.value.reduce((sum, goal) => {
    const remainingForGoal =
      parseFloat(goal.amount) - parseFloat(goal.contributed);
    return sum + (remainingForGoal > 0 ? remainingForGoal : 0);
  }, 0);
});
</script>

<style>
.statistics {
  background: rgb(246 244 244);
  padding: 10px;
  text-align: center;
  border: 2px solid black;
  border-radius: 10px;
  position: sticky;
  margin-top: auto;
  margin-bottom: 10px;
}
</style>
