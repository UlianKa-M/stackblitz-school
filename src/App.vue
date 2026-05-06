<template>
  <div>
    <Header />
    <div class="container">
      <router-view />
    </div>
    <footer>
      <p>© 2026 Школа №1. Все права защищены.</p>
    </footer>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: { Header }
};
</script>