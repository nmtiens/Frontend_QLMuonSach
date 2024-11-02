import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; // Import trang Login
import Admin from '../views/Admin.vue'; // Import trang Admin
import User from '@/views/User.vue';
import Register from '@/views/Register.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
   {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/user',
    name: 'User',
    component: User,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
