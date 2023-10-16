<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <form @submit="saveGoal">
      <span class="input-group-text">
        Financial Goal Name:
        <input
          class="input-group form-control"
          type="text"
          v-model="newGoal.name"
          required
        />
      </span>
      <span class="input-group-text">
        Amount Needed:
        <input
          class="input-group form-control"
          type="number"
          v-model="newGoal.amount"
          :min="1"
          required
        />
      </span>
      <span class="input-group-text">
        Target Year:
        <input
          class="input-group form-control"
          type="number"
          :min="currentYear"
          v-model="newGoal.targetYear"
          @input="calculateContribution"
        />
      </span>
      <span class="input-group-text">
        Target Month:
        <input
          class="input-group form-control"
          type="number"
          :min="minTargetMonth"
          :max="12"
          v-model="newGoal.targetMonth"
          @input="calculateContribution"
        />
      </span>
      <div v-if="showSuggestedContribution && !newGoal.id">
        Suggested Monthly Contribution: €{{ suggestedContribution }}
      </div>
      <button type="submit" class="btn btn-success">Save</button>
    </form>
    <button @click="$router.push('/')" class="btn btn-primary">
      Back to Main Page
    </button>
    <button v-if="newGoal.id" @click="deleteGoal" class="btn btn-primary">
      Delete Goal
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import router from '../router';
const route = useRoute();

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const newGoal = ref({
  id: null,
  name: '',
  amount: 0,
  contributed: 0,
  targetYear: currentYear,
  targetMonth: currentMonth,
});

const pageTitle = computed(() =>
  newGoal.value.id ? 'Edit the Goal' : 'Set Up a New Goal',
);
const suggestedContribution = ref(0);

const minTargetMonth = computed(() => {
  return newGoal.value.targetYear === currentYear ? currentMonth : 1;
});

const showSuggestedContribution = computed(() => {
  const monthsToTarget =
    (newGoal.value.targetYear - currentYear) * 12 +
    newGoal.value.targetMonth -
    currentMonth;
  return monthsToTarget > 0;
});

onMounted(() => {
  const id = parseInt(route.params.id);

  const storedGoals = JSON.parse(localStorage.getItem('goals'));
  const existingGoal = storedGoals.find(goal => goal.id === id);
  if (existingGoal) {
    newGoal.value = { ...existingGoal };
    calculateContribution();
  }
});

const calculateContribution = () => {
  const monthsToTarget =
    (newGoal.value.targetYear - currentYear) * 12 +
    newGoal.value.targetMonth -
    currentMonth;
  suggestedContribution.value =
    monthsToTarget > 0 ? (newGoal.value.amount / monthsToTarget).toFixed(2) : 0;
};

const saveGoal = () => {
  let storedGoals = JSON.parse(localStorage.getItem('goals'));
  newGoal.value.name = newGoal.value.name.trim();

  if (!newGoal.value.name) {
    alert('Financial goal name cannot be empty.');
    return;
  }

  if (newGoal.value.id === null) {
    newGoal.value.id = Date.now();
    storedGoals.push(newGoal.value);
  } else {
    const index = storedGoals.findIndex(goal => goal.id === newGoal.value.id);
    storedGoals[index] = newGoal.value;
  }

  localStorage.setItem('goals', JSON.stringify(storedGoals));
  router.push('/');
};

const deleteGoal = () => {
  const storedGoals = JSON.parse(localStorage.getItem('goals'));
  const index = storedGoals.findIndex(goal => goal.id === newGoal.value.id);
  if (index !== -1) {
    storedGoals.splice(index, 1);
    localStorage.setItem('goals', JSON.stringify(storedGoals));
  }
  router.push('/');
};
</script>
