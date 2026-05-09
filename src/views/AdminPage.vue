<template>
  <div>
    <div v-if="!isLoggedIn" class="login-required">
      <div class="card">
        <h2>🔐 Требуется авторизация</h2>
        <p>Для доступа к управлению необходимо войти в систему.</p>
        <button @click="$router.push('/')">На главную</button>
      </div>
    </div>

    <div v-else>
      <div class="admin-panel">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
          <h2>📝 Управление новостями</h2>
          <button @click="logout" style="background:#ff6b6b;">🚪 Выйти</button>
        </div>

        <div :class="'message ' + adminMsgType">{{ adminMsgText }}</div>

        <div style="background:#f8f9ff; padding:20px; border-radius:15px; margin:20px 0;">
          <h3>➕ Добавить новую новость</h3>
          <input type="text" v-model="newNews.title" placeholder="Заголовок">
          <textarea v-model="newNews.content" placeholder="Текст новости"></textarea>
          <input type="date" v-model="newNews.date">
          <button @click="addNews">✅ Добавить</button>
        </div>

        <div v-if="showEdit" style="background:#f8f9ff; padding:20px; border-radius:15px; margin:20px 0;">
          <h3>✏️ Редактировать новость</h3>
          <input type="text" v-model="editData.title" placeholder="Заголовок">
          <textarea v-model="editData.content" placeholder="Текст новости"></textarea>
          <input type="date" v-model="editData.date">
          <button @click="updateNews">💾 Сохранить</button>
          <button @click="cancelEdit" style="background:#999;">❌ Отмена</button>
        </div>

        <h3>📋 Список всех новостей</h3>
        <div v-for="item in allNews" :key="item.id" class="news-item-admin">
          <div>
            <strong>{{ item.title }}</strong><br>
            <span style="color:#999;">📅 {{ item.date }}</span>
            <p style="margin-top:8px;">{{ item.content.substring(0, 80) }}...</p>
          </div>
          <div>
            <button @click="startEdit(item)">✏️ Редактировать</button>
            <button @click="deleteNews(item.id)">🗑️ Удалить</button>
          </div>
        </div>
      </div>

      <div v-if="userRole === 'admin'" class="admin-panel" style="margin-top: 30px;">
        <h2>📅 Управление расписанием</h2>
        
        <div :class="'message ' + timetableMsgType">{{ timetableMsgText }}</div>

<div style="background:#f8f9ff; padding:20px; border-radius:15px; margin:20px 0;">
  <h3>➕ Добавить урок</h3>
  <div class="form-grid">
    <div class="form-group">
      <label>Класс</label>
      <input type="text" v-model="newLesson.class" placeholder="5А">
    </div>
    <div class="form-group">
      <label>Кабинет</label>
      <input type="text" v-model="newLesson.room" placeholder="101">
    </div>
    <div class="form-group">
      <label>Преподаватель</label>
      <input type="text" v-model="newLesson.teacher" placeholder="Иванова М.А.">
    </div>
    <div class="form-group">
      <label>Предмет</label>
      <input type="text" v-model="newLesson.subject" placeholder="Математика">
    </div>
    <div class="form-group">
      <label>День недели</label>
      <input type="text" v-model="newLesson.subject" placeholder="Поне">
    </div>
    <div class="form-group">
      <label>Четность недели</label>
      <select v-model="newLesson.weekType">
        <option value="нечетная">Нечетная неделя</option>
        <option value="четная">Четная неделя</option>
      </select>
    </div>
    <div class="form-group">
      <label>Время</label>
      <input type="text" v-model="newLesson.time" placeholder="08:30-09:15">
    </div>
    <div class="form-group">
      <label>Неделя</label>
      <input type="number" v-model="newLesson.week" placeholder="1">
    </div>
    <div class="form-group add-lesson-btn">
      <button @click="addLesson">➕ Добавить урок</button>
    </div>
  </div>
</div>

        <h3>📋 Список уроков</h3>
<div class="timetable-section">
  <div class="timetable-table">
    <table>
      <thead>
        <tr>
          <th>Класс</th>
          <th>Кабинет</th>
          <th>Преподаватель</th>
          <th>Предмет</th>
          <th>День</th>
          <th>Время</th>
          <th>Неделя</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lesson in allLessons" :key="lesson.id">
          <td>{{ lesson.class }}</td>
          <td>{{ lesson.room }}</td>
          <td>{{ lesson.teacher }}</td>
          <td>{{ lesson.subject }}</td>
          <td>{{ lesson.day }}</td>
          <td>{{ lesson.time }}</td>
          <td>{{ lesson.week }}</td>
          <td><button @click="deleteLesson(lesson.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
      </div>
      
      <div v-if="userRole === 'teacher'" class="admin-panel" style="margin-top: 30px; text-align: center;">
        <h2>📅 Управление расписанием</h2>
        <p style="color: #888; padding: 20px;">🔒 Управление расписанием доступно только администратору.</p>
        <p style="color: #999; font-size: 0.9rem;">Вы можете просматривать расписание на странице "Расписание".</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userRole: '',
      // Новости
      allNews: [],
      newNews: { title: '', content: '', date: '' },
      adminMsgText: '',
      adminMsgType: '',
      showEdit: false,
      editData: { id: null, title: '', content: '', date: '' },
      // Расписание (только для админа)
      allLessons: [],
      newLesson: { class: '', room: '', teacher: '', subject: '', day: 'Понедельник', time: '', week: 1, weekType: 'нечетная' },
      timetableMsgText: '',
      timetableMsgType: ''
    };
  },
  mounted() {
    this.checkAuth();
    this.loadNews();
    if (this.userRole === 'admin') {
      this.loadLessons();
    }
  },
  methods: {
    checkAuth() {
      const user = localStorage.getItem('schoolUser');
      if (user) {
        const userData = JSON.parse(user);
        this.isLoggedIn = true;
        this.userRole = userData.role;
      } else {
        this.isLoggedIn = false;
        this.userRole = '';
        this.$router.push('/');
      }
    },
    async loadNews() {
      const res = await fetch('/api/news');
      this.allNews = await res.json();
    },
    async loadLessons() {
      const res = await fetch('/api/timetable');
      this.allLessons = await res.json();
    },
    logout() {
      localStorage.removeItem('schoolUser');
      this.isLoggedIn = false;
      this.userRole = '';
      this.$router.push('/');
    },
    async addNews() {
      if (!this.newNews.title || !this.newNews.content) {
        this.adminMsgText = 'Заполните заголовок и текст';
        this.adminMsgType = 'error';
        return;
      }
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newNews)
      });
      this.newNews = { title: '', content: '', date: '' };
      await this.loadNews();
      this.adminMsgText = '✅ Новость добавлена!';
      this.adminMsgType = 'success';
      setTimeout(() => { this.adminMsgText = ''; }, 3000);
    },
    async deleteNews(id) {
      if (confirm('Удалить новость?')) {
        await fetch('/api/news/' + id, { method: 'DELETE' });
        await this.loadNews();
        this.adminMsgText = '🗑️ Новость удалена';
        this.adminMsgType = 'success';
        setTimeout(() => { this.adminMsgText = ''; }, 3000);
      }
    },
    startEdit(item) {
      this.editData = { ...item };
      this.showEdit = true;
    },
    async updateNews() {
      await fetch('/api/news/' + this.editData.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.editData)
      });
      await this.loadNews();
      this.showEdit = false;
      this.editData = { id: null, title: '', content: '', date: '' };
      this.adminMsgText = '✏️ Новость обновлена';
      this.adminMsgType = 'success';
      setTimeout(() => { this.adminMsgText = ''; }, 3000);
    },
    cancelEdit() {
      this.showEdit = false;
      this.editData = { id: null, title: '', content: '', date: '' };
    },
    async addLesson() {
      if (!this.newLesson.class || !this.newLesson.subject || !this.newLesson.teacher) {
        this.timetableMsgText = 'Заполните обязательные поля';
        this.timetableMsgType = 'error';
        return;
      }
      await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newLesson)
      });
      this.newLesson = { class: '', room: '', teacher: '', subject: '', day: 'Понедельник', time: '', week: 1 };
      await this.loadLessons();
      this.timetableMsgText = '✅ Урок добавлен!';
      this.timetableMsgType = 'success';
      setTimeout(() => { this.timetableMsgText = ''; }, 3000);
    },
    async deleteLesson(id) {
      if (confirm('Удалить урок?')) {
        await fetch('/api/timetable/' + id, { method: 'DELETE' });
        await this.loadLessons();
        this.timetableMsgText = '🗑️ Урок удален';
        this.timetableMsgType = 'success';
        setTimeout(() => { this.timetableMsgText = ''; }, 3000);
      }
    }
  }
};
</script>