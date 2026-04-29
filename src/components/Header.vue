<template>
<div class="hero">
  <h1>{{ title }}</h1>
  <p>{{ subtitle }}</p>
</div>
<nav>
  <a @click="$emit('changePage', 'home')" :class="{ active: currentPage === 'home' }">🏠 Главная</a>
  <a @click="$emit('changePage', 'about')" :class="{ active: currentPage === 'about' }">📖 О школе</a>
  <a @click="$emit('changePage', 'news')" :class="{ active: currentPage === 'news' }">📰 Новости</a>
  <a @click="$emit('changePage', 'timetable')" :class="{ active: currentPage === 'timetable' }">📅 Расписание</a>
  <a @click="$emit('changePage', 'contacts')" :class="{ active: currentPage === 'contacts' }">📞 Контакты</a>
  <a @click="$emit('changePage', 'admin')" :class="{ active: currentPage === 'admin' }">👨‍🏫 Учителям</a>
</nav>
</template>

<script>
export default {
props: ['currentPage'],
computed: {
  title() {
    const titles = {
      home: '🏫 Школа №1', about: '📖 О школе', news: '📰 Новости',
      timetable: '📅 Расписание', contacts: '📞 Контакты', admin: '👨‍🏫 Учителям'
    };
    return titles[this.currentPage] || 'Школа №1';
  },
  subtitle() {
    const subtitles = {
      home: 'Лучшее образование для детей', about: 'Традиции и инновации',
      news: 'Будьте в курсе', timetable: 'Расписание уроков',
      contacts: 'Свяжитесь с нами', admin: 'Управление новостями'
    };
    return subtitles[this.currentPage] || '';
  }
}
};
</script>