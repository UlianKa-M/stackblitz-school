<template>
<div>
  <div v-if="!isLoggedIn" class="login-form">
    <h2>🔐 Вход</h2>
    <div :class="'message ' + loginMsgType">{{ loginMsgText }}</div>
    <input v-model="loginForm.login" placeholder="Логин">
    <input v-model="loginForm.password" type="password" placeholder="Пароль">
    <button @click="doLogin">Войти</button>
    <p style="margin-top:15px; text-align:center;">📝 teacher / 12345</p>
  </div>
  <div v-else class="admin-panel">
    <div style="display:flex; justify-content:space-between;"><h2>📝 Управление</h2><button @click="logout" style="background:#ff6b6b;">Выйти</button></div>
    <div :class="'message ' + adminMsgType">{{ adminMsgText }}</div>
    <div style="background:#f8f9ff; padding:15px; border-radius:12px;"><h3>➕ Добавить</h3><input v-model="newNews.title" placeholder="Заголовок"><textarea v-model="newNews.content" placeholder="Текст"></textarea><input type="date" v-model="newNews.date"><button @click="addNews">Добавить</button></div>
    <div v-if="showEdit" style="background:#f8f9ff; padding:15px; border-radius:12px; margin-top:15px;"><h3>✏️ Редактировать</h3><input v-model="editData.title"><textarea v-model="editData.content"></textarea><input type="date" v-model="editData.date"><button @click="updateNews">Сохранить</button><button @click="cancelEdit">Отмена</button></div>
    <h3>📋 Список новостей</h3>
    <div v-for="item in allNews" :key="item.id" class="news-item-admin"><div><b>{{ item.title }}</b><br><span style="color:#999;">{{ item.date }}</span><p>{{ item.content.substring(0,80) }}...</p></div><div><button @click="startEdit(item)">✏️</button><button @click="deleteNews(item.id)">🗑️</button></div></div>
  </div>
</div>
</template>

<script>
export default {
data() {
  return {
    isLoggedIn: false, loginForm: { login: '', password: '' }, loginMsgText: '', loginMsgType: '',
    allNews: [], newNews: { title: '', content: '', date: '' }, adminMsgText: '', adminMsgType: '',
    showEdit: false, editData: { id: null, title: '', content: '', date: '' }
  };
},
methods: {
  async loadNews() { const res = await fetch('/api/news'); this.allNews = await res.json(); },
  async doLogin() {
    const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.loginForm) });
    const data = await res.json();
    if (data.success) { this.isLoggedIn = true; this.loginMsgText = 'Добро пожаловать, ' + data.name; this.loginMsgType = 'success'; this.loadNews(); }
    else { this.loginMsgText = data.message; this.loginMsgType = 'error'; }
    setTimeout(() => { this.loginMsgText = ''; }, 3000);
  },
  logout() { this.isLoggedIn = false; this.loginForm = { login: '', password: '' }; },
  async addNews() {
    if (!this.newNews.title || !this.newNews.content) { this.adminMsgText = 'Заполните поля'; this.adminMsgType = 'error'; return; }
    await fetch('/api/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.newNews) });
    this.newNews = { title: '', content: '', date: '' }; await this.loadNews();
    this.adminMsgText = 'Новость добавлена'; this.adminMsgType = 'success';
    setTimeout(() => { this.adminMsgText = ''; }, 3000);
  },
  async deleteNews(id) { if (confirm('Удалить?')) { await fetch('/api/news/' + id, { method: 'DELETE' }); await this.loadNews(); this.adminMsgText = 'Новость удалена'; this.adminMsgType = 'success'; setTimeout(() => { this.adminMsgText = ''; }, 3000); } },
  startEdit(item) { this.editData = { ...item }; this.showEdit = true; },
  async updateNews() { await fetch('/api/news/' + this.editData.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.editData) }); await this.loadNews(); this.showEdit = false; this.editData = { id: null, title: '', content: '', date: '' }; this.adminMsgText = 'Новость обновлена'; this.adminMsgType = 'success'; setTimeout(() => { this.adminMsgText = ''; }, 3000); },
  cancelEdit() { this.showEdit = false; this.editData = { id: null, title: '', content: '', date: '' }; }
}
};
</script>