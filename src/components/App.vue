<template>
<Header :currentPage="currentPage" @changePage="currentPage = $event" />
<div class="container">
  <HomePage v-if="currentPage === 'home'" />
  <AboutPage v-else-if="currentPage === 'about'" />
  <NewsPage v-else-if="currentPage === 'news'" />
  <TimetablePage v-else-if="currentPage === 'timetable'" />
  <ContactsPage v-else-if="currentPage === 'contacts'" />
  <AdminPage v-else-if="currentPage === 'admin'" />
</div>
<footer><p>© 2026 Школа №1</p></footer>
</template>

<script>
import Header from './Header.vue';
import HomePage from './HomePage.vue';
import AboutPage from './AboutPage.vue';
import NewsPage from './NewsPage.vue';
import TimetablePage from './TimetablePage.vue';
import ContactsPage from './ContactsPage.vue';
import AdminPage from './AdminPage.vue';

export default {
components: { Header, HomePage, AboutPage, NewsPage, TimetablePage, ContactsPage, AdminPage },
data() {
  return { currentPage: 'home' };
}
};
</script>