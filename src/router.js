import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import AboutPage from './views/AboutPage.vue';
import NewsPage from './views/NewsPage.vue';
import TimetablePage from './views/TimetablePage.vue';
import ContactsPage from './views/ContactsPage.vue';
import TeachersPage from './views/TeachersPage.vue';
import AdminPage from './views/AdminPage.vue';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/about', name: 'about', component: AboutPage },
  { path: '/news', name: 'news', component: NewsPage },
  { path: '/timetable', name: 'timetable', component: TimetablePage },
  { path: '/contacts', name: 'contacts', component: ContactsPage },
  { path: '/teachers', name: 'teachers', component: TeachersPage },
  { 
    path: '/admin', 
    name: 'admin', 
    component: AdminPage,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Защита маршрута /admin
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = localStorage.getItem('schoolUser');
    if (!user) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;