<template>
  <div class="hero">
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </div>
  <nav>
    <router-link to="/">🏠 Главная</router-link>
    <router-link to="/about">📖 О школе</router-link>
    <router-link to="/news">📰 Новости</router-link>
    <router-link to="/timetable">📅 Расписание</router-link>
    <router-link to="/contacts">📞 Контакты</router-link>
    <router-link to="/teachers">👨‍🏫 Учителя</router-link>
    
    <router-link to="/admin" v-if="isLoggedIn">👨‍💼 Админ панель</router-link>
    
    <a href="#" @click.prevent="showLoginModal = true" v-if="!isLoggedIn">🔐 Войти</a>
    <a href="#" @click.prevent="logout" v-else>🚪 Выйти ({{ userName }})</a>
  </nav>

  <div v-if="showLoginModal" class="modal-overlay" @click="showLoginModal = false">
    <div class="modal-content login-modal" @click.stop>
      <button class="modal-close" @click="showLoginModal = false">✕</button>
      <h2>🔐 Вход в систему</h2>
      <div :class="'message ' + loginMsgType" v-if="loginMsgText">{{ loginMsgText }}</div>
      <input type="text" v-model="loginForm.login" placeholder="Логин">
      <input type="password" v-model="loginForm.password" placeholder="Пароль" @keyup.enter="doLogin">
      <button @click="doLogin">Войти</button>
      <p class="login-hint">Тестовые данные: <strong>teacher / 12345</strong> или <strong>admin / admin123</strong></p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  data() {
    return {
      showLoginModal: false,
      isLoggedIn: false,
      userName: '',
      userRole: '',
      loginForm: { login: '', password: '' },
      loginMsgText: '',
      loginMsgType: ''
    };
  },
  setup() {
    const route = useRoute();
    const titles = {
      '/': '🏫 Школа №1',
      '/about': '📖 О школе',
      '/news': '📰 Новости',
      '/timetable': '📅 Расписание',
      '/contacts': '📞 Контакты',
      '/teachers': '👨‍🏫 Наши учителя',
      '/admin': '👨‍💼 Админ панель'
    };
    const subtitles = {
      '/': 'Лучшее образование для детей',
      '/about': 'Традиции и инновации',
      '/news': 'Будьте в курсе',
      '/timetable': 'Расписание уроков',
      '/contacts': 'Свяжитесь с нами',
      '/teachers': 'Профессиональный педагогический коллектив',
      '/admin': 'Управление контентом'
    };
    const title = computed(() => titles[route.path] || 'Школа №1');
    const subtitle = computed(() => subtitles[route.path] || '');
    return { title, subtitle };
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const user = localStorage.getItem('schoolUser');
      if (user) {
        const userData = JSON.parse(user);
        this.isLoggedIn = true;
        this.userName = userData.name;
        this.userRole = userData.role;
      } else {
        this.isLoggedIn = false;
        this.userName = '';
        this.userRole = '';
      }
    },
    async doLogin() {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginForm)
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('schoolUser', JSON.stringify({ 
            name: data.name, 
            role: data.role || 'teacher' 
          }));
          this.isLoggedIn = true;
          this.userName = data.name;
          this.userRole = data.role || 'teacher';
          this.showLoginModal = false;
          this.loginForm = { login: '', password: '' };
          this.loginMsgText = '';
          
          if (this.$route.path === '/admin') {
            window.location.reload();
          }
        } else {
          this.loginMsgText = data.message;
          this.loginMsgType = 'error';
          setTimeout(() => { this.loginMsgText = ''; }, 3000);
        }
      } catch (error) {
        this.loginMsgText = 'Ошибка сервера';
        this.loginMsgType = 'error';
      }
    },
    logout() {
      localStorage.removeItem('schoolUser');
      this.isLoggedIn = false;
      this.userName = '';
      this.userRole = '';
      if (this.$route.path === '/admin') {
        this.$router.push('/');
      }
    }
  }
};
</script>