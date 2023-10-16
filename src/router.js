import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import ManageGoal from './components/ManageGoal.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/new-goal', component: ManageGoal },
  { path: '/edit-goal/:id', component: ManageGoal, name: 'edit-goal' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
