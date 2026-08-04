import { createRouter, createWebHistory } from 'vue-router';

// Componentes importados de forma perezosa
const Dashboard = () => import('../views/Dashboard.vue');
const CourseContent = () => import('../views/CourseContent.vue');
const Events = () => import('../views/Events.vue');
const Attendance = () => import('../views/Attendance.vue');

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/course/:id',
    name: 'CourseContent',
    component: CourseContent,
    props: true,
  },
  {
    path: '/events',
    name: 'Events',
    component: Events,
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: Attendance,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
