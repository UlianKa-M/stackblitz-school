<template>
  <div class="timetable-page">
    <div class="card">
      <h2>📅 Расписание уроков</h2>
      
      <div class="filters">
        <div class="filter-group">
          <label>Класс:</label>
          <select v-model="filters.class">
            <option value="">Все классы</option>
            <option v-for="cls in options.classes" :key="cls" :value="cls">{{ cls }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Кабинет:</label>
          <select v-model="filters.room">
            <option value="">Все кабинеты</option>
            <option v-for="room in options.rooms" :key="room" :value="room">{{ room }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Преподаватель:</label>
          <select v-model="filters.teacher">
            <option value="">Все преподаватели</option>
            <option v-for="teacher in options.teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Предмет:</label>
          <select v-model="filters.subject">
            <option value="">Все предметы</option>
            <option v-for="subject in options.subjects" :key="subject" :value="subject">{{ subject }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>День недели:</label>
          <select v-model="filters.day">
            <option value="">Все дни</option>
            <option v-for="day in options.days" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>
        
        <div v-if="isAdmin" class="filter-group">
          <label>Неделя:</label>
          <select v-model="filters.week">
            <option value="">Все недели</option>
            <option v-for="week in options.weeks" :key="week" :value="week">Неделя {{ week }}</option>
          </select>
        </div>
        
        <button class="reset-btn" @click="resetFilters">Сбросить фильтры</button>
      </div>
      
      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-else-if="filteredTimetable.length === 0" class="no-data">🔍 Нет данных по выбранным фильтрам</div>
      <div v-else class="timetable-results">
        <div class="timetable-header">
          <div>Класс</div>
          <div>Кабинет</div>
          <div>Преподаватель</div>
          <div>Предмет</div>
          <div>День</div>
          <div>Время</div>
          <div v-if="isAdmin">Неделя</div>
        </div>
        <div v-for="item in filteredTimetable" :key="item.id" class="timetable-row">
          <div><strong>{{ item.class }}</strong></div>
          <div>🏢 {{ item.room }}</div>
          <div>👨‍🏫 {{ item.teacher }}</div>
          <div>📖 {{ item.subject }}</div>
          <div>📅 {{ item.day }}</div>
          <div>⏰ {{ item.time }}</div>
          <div v-if="isAdmin">📍 Неделя {{ item.week }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: false,
      loading: false,
      filteredTimetable: [],
      options: { classes: [], rooms: [], teachers: [], subjects: [], days: [], weeks: [] },
      filters: { class: '', room: '', teacher: '', subject: '', day: '', week: '' }
    };
  },
  async mounted() {
    const user = localStorage.getItem('schoolUser');
    if (user) {
      const userData = JSON.parse(user);
      this.isAdmin = userData.role === 'admin' || userData.role === 'teacher';
    }
    await this.loadOptions();
    await this.loadTimetable();
  },
  methods: {
    async loadOptions() {
      try {
        const res = await fetch('/api/timetable/options');
        this.options = await res.json();
      } catch (error) {
        console.error('Ошибка загрузки опций:', error);
      }
    },
    async loadTimetable() {
      this.loading = true;
      try {
        let url = '/api/timetable/filter?';
        const params = [];
        if (this.filters.class) params.push(`class=${encodeURIComponent(this.filters.class)}`);
        if (this.filters.room) params.push(`room=${encodeURIComponent(this.filters.room)}`);
        if (this.filters.teacher) params.push(`teacher=${encodeURIComponent(this.filters.teacher)}`);
        if (this.filters.subject) params.push(`subject=${encodeURIComponent(this.filters.subject)}`);
        if (this.filters.day) params.push(`day=${encodeURIComponent(this.filters.day)}`);
        if (this.isAdmin && this.filters.week) params.push(`week=${this.filters.week}`);
        url += params.join('&');
        const res = await fetch(url);
        this.filteredTimetable = await res.json();
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.filters = { class: '', room: '', teacher: '', subject: '', day: '', week: '' };
      this.loadTimetable();
    }
  },
  watch: { filters: { deep: true, handler() { this.loadTimetable(); } } }
};
</script>