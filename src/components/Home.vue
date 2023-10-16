<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <h1>Welcome to the Financial Goal Tracker</h1>
    <button @click="goToNewGoal" class="btn btn-success">
      Set Up a New Goal
    </button>
    <div v-for="goal in goals" :key="goal.id" class="goal">
      <h3>{{ goal.name }}</h3>
      <div>
        Contributed: €{{ parseFloat(goal.contributed).toFixed(2) || 0 }} / €{{
          parseFloat(goal.amount).toFixed(2)
        }}
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width:
              (parseFloat(goal.contributed) / parseFloat(goal.amount)) * 100 +
              '%',
          }"
        ></div>
      </div>
      <div
        v-if="parseFloat(goal.contributed) >= parseFloat(goal.amount)"
        class="congrats-message"
      >
        Congratulations on reaching the goal!
      </div>
      <div
        v-else-if="
          parseFloat(goal.contributed) >= parseFloat(goal.amount) * 0.5
        "
        class="congrats-message"
      >
        You are halfway there, keep on saving for the goal!
      </div>
      <button @click="editGoal(goal)" class="btn btn-info">Edit</button>
      <button @click="deleteGoal(goal.id)" class="btn btn-info">Delete</button>
      <span class="input-group-text">
        Make Contribution:
        <input
          class="input-group form-control"
          type="number"
          step="0.01"
          min="0.01"
          v-model="contributionAmount[goal.id]"
          @input="validateInput(goal.id)"
        />
      </span>
      <button @click="makeContribution(goal.id)" class="btn btn-primary">
        Contribute
      </button>
      <div v-if="contributionErrors[goal.id]">
        {{ contributionErrors[goal.id] }}
      </div>
    </div>
    <Statistics />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide } from 'vue';
import router from '../router';
import Statistics from './Statistics.vue';

const goals = ref([]);
const contributionAmount = reactive({});
const contributionErrors = reactive({});

provide('goals', goals);

onMounted(() => {
  const storedGoals = JSON.parse(localStorage.getItem('goals') || '[]');
  if (!storedGoals.length) {
    localStorage.setItem('goals', JSON.stringify([]));
  }
  goals.value = storedGoals;
});

const goToNewGoal = () => {
  router.push('/new-goal');
};

const editGoal = goal => {
  router.push({ name: 'edit-goal', params: { id: goal.id } });
};

const deleteGoal = id => {
  const index = goals.value.findIndex(goal => goal.id === id);
  if (index !== -1) {
    goals.value.splice(index, 1);
    localStorage.setItem('goals', JSON.stringify(goals.value));
  }
};

const validateInput = id => {
  const value = contributionAmount[id];
  const valid = /^[0-9]*(\.[0-9]{0,2})?$/.test(value);
  if (!valid) {
    contributionErrors[id] = window.alert(
      'Contribution must be a number with at most 2 digits after the decimal point',
    );
    contributionAmount[id] = parseFloat(value).toFixed(2);
  } else {
    contributionErrors[id] = null;
  }
};

const makeContribution = id => {
  if (contributionAmount[id] < 0.01) {
    contributionErrors[id] = window.alert(
      'Contribution must be at least €0.01',
    );
    return;
  }

  const index = goals.value.findIndex(goal => goal.id === id);
  if (index !== -1) {
    goals.value[index].contributed += parseFloat(contributionAmount[id]);
    localStorage.setItem('goals', JSON.stringify(goals.value));
    contributionAmount[id] = '';
  }
};
</script>

<style>
.progress-bar {
  margin: 10px 0;
  height: 13px;
  background-color: lightgrey;
  border: solid 1px black;
  border-radius: 30px;
}

.progress-fill {
  height: 100%;
  background-color: rgb(54 222 54);
  transition: width 2s ease;
  max-width: 100%;
  border-radius: 30px;
}

.congrats-message {
  margin: 10px 0;
}

.btn {
  margin-right: 5px !important;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 75vh;
}

@media (width <= 767px) {
  .container {
    min-height: 67vh;
  }
}

.goal {
  border: 2px solid black;
  padding: 5px;
  margin: 5px 0;
  border-radius: 10px;
}
</style>
