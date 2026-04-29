<template>
<div>
  <div class="contact-grid">
    <div class="contact-card"><div class="contact-icon">📍</div><h3>Адрес</h3><p>ул. Школьная, 15</p></div>
    <div class="contact-card"><div class="contact-icon">📞</div><h3>Телефон</h3><p>+7 (495) 123-45-67</p></div>
    <div class="contact-card"><div class="contact-icon">📧</div><h3>Email</h3><p>school1@edu.ru</p></div>
    <div class="contact-card"><div class="contact-icon">🕐</div><h3>Часы</h3><p>Пн-Пт 8:00-18:00</p></div>
  </div>
  <div class="card"><h2>📝 Напишите нам</h2><div :class="'message ' + msgType">{{ msgText }}</div><input v-model="form.name" placeholder="Имя"><input v-model="form.email" placeholder="Email"><textarea v-model="form.message" placeholder="Сообщение"></textarea><button @click="sendMessage">Отправить</button></div>
</div>
</template>

<script>
export default {
data() {
  return { form: { name: '', email: '', message: '' }, msgText: '', msgType: '' };
},
methods: {
  sendMessage() {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.msgText = 'Заполните поля'; this.msgType = 'error';
      return;
    }
    this.msgText = 'Сообщение отправлено!'; this.msgType = 'success';
    this.form = { name: '', email: '', message: '' };
    setTimeout(() => { this.msgText = ''; }, 3000);
  }
}
};
</script>