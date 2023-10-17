<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="app-header">
    <h1>Welcome to Your Financial Goal App!</h1>
    <div>
      <img
        :style="{ background: clicked ? 'pink' : 'transparent' }"
        src="@/assets/logo.png"
        alt="Click"
        @click="incrementCounter"
      />
      <p class="game">
        How many times can you press on the pig in 10 secs?
        <br />
      </p>
      <p class="timer">Time Left: {{ timeLeft }} seconds</p>
      <p class="count">Click Count: {{ clickCount }}</p>
      <p class="refresh" @click="resetGame">REFRESH THE SCORE</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const clickCount = ref(0);
const timeLeft = ref(10);
const clicked = ref(false);
let timer;

const startTimer = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const incrementCounter = () => {
  clicked.value = true;
  setTimeout(() => (clicked.value = false), 125);

  if (clickCount.value === 0) {
    startTimer();
  }

  if (timeLeft.value > 0) {
    clickCount.value++;
  }
};

const resetGame = () => {
  clearInterval(timer);
  timeLeft.value = 10;
  clickCount.value = 0;
};
</script>

<style scoped>
.game {
  font-size: 12px;
}

.app-header {
  padding: 10px;
  text-align: center;
  min-height: 25vh;
}

img {
  width: 150px;
  cursor: pointer;
  border-radius: 35px;
}

@media (width <= 767px) {
  .app-header {
    padding: 5px;
    min-height: 33vh;
  }

  img {
    width: 100px;
  }
}

.timer {
  color: red;
}

.count {
  color: blue;
}

.refresh {
  cursor: pointer;
  border: 1px solid black;
  width: fit-content;
  margin: auto;
  border-radius: 20px;
  padding: 0 5px;
}

.refresh:hover {
  transform: scale(1.1);
  cursor: pointer;
}
</style>
