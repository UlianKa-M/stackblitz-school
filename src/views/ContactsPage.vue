<template>
  <div>
    <div class="contact-grid">
      <div class="contact-card">
        <div class="contact-icon">📍</div>
        <h3>Адрес</h3>
        <p>г. Архангельск, ул. Школьная, 15</p>
        <p>Индекс: 127000</p>
      </div>
      <div class="contact-card">
        <div class="contact-icon">📞</div>
        <h3>Телефоны</h3>
        <p>+7 (495) 123-45-67</p>
        <p>+7 (495) 123-45-68 (приемная)</p>
      </div>
      <div class="contact-card">
        <div class="contact-icon">📧</div>
        <h3>Email</h3>
        <p>school1@edu.ru</p>
        <p>info@school1.ru</p>
        <p>secretar@school1.ru</p>
      </div>
      <div class="contact-card">
        <div class="contact-icon">🕐</div>
        <h3>Режим работы</h3>
        <p>Пн-Пт: 8:00 - 18:00</p>
        <p>Сб: 9:00 - 14:00</p>
        <p>Вс: выходной</p>
      </div>
    </div>

    <div class="card">
      <h2>👨‍💼 Администрация для связи</h2>
      <div class="admin-contacts">
        <div class="admin-contact-item">
          <span class="admin-contact-name">Директор:</span>
          <span>Петров Сергей Владимирович</span>
          <span class="admin-contact-desc">— прием по вторникам 14:00-16:00</span>
        </div>
        <div class="admin-contact-item">
          <span class="admin-contact-name">Завуч по УВР:</span>
          <span>Иванова Мария Александровна</span>
          <span class="admin-contact-desc">— прием по четвергам 15:00-17:00</span>
        </div>
        <div class="admin-contact-item">
          <span class="admin-contact-name">Завуч по ВР:</span>
          <span>Сидорова Елена Павловна</span>
          <span class="admin-contact-desc">— прием по средам 14:00-16:00</span>
        </div>
        <div class="admin-contact-item">
          <span class="admin-contact-name">Секретарь:</span>
          <span>8 (495) 123-45-67 (доб. 101)</span>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>📝 Напишите нам</h2>
      <p>Заполните форму, и мы ответим вам в ближайшее время!</p>
      <div :class="'message ' + msgType">{{ msgText }}</div>
      <div class="form-row">
        <div class="form-half">
          <label>Ваше имя *</label>
          <input v-model="form.name" placeholder="Иванов Иван">
        </div>
        <div class="form-half">
          <label>Email *</label>
          <input v-model="form.email" placeholder="ivanov@example.com">
        </div>
      </div>
      <div class="form-group">
        <label>Телефон (необязательно)</label>
        <input v-model="form.phone" placeholder="+7 (999) 123-45-67">
      </div>
      <div class="form-group">
        <label>Сообщение *</label>
        <textarea v-model="form.message" placeholder="Введите ваш вопрос или предложение..."></textarea>
      </div>
      <div class="form-group">
        <label>Тема обращения</label>
        <select v-model="form.topic">
          <option value="">Выберите тему</option>
          <option value="question">Вопрос по учебе</option>
          <option value="suggestion">Предложение</option>
          <option value="complaint">Обращение</option>
          <option value="other">Другое</option>
        </select>
      </div>
      <button @click="sendMessage">📨 Отправить сообщение</button>
      <p class="form-hint">* — поля, обязательные для заполнения</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: { name: '', email: '', phone: '', message: '', topic: '' },
      msgText: '',
      msgType: ''
    };
  },
  methods: {
    sendMessage() {
      if (!this.form.name || !this.form.email || !this.form.message) {
        this.msgText = 'Пожалуйста, заполните все обязательные поля (имя, email, сообщение)';
        this.msgType = 'error';
        setTimeout(() => { this.msgText = ''; }, 3000);
        return;
      }
      this.msgText = '✅ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.';
      this.msgType = 'success';
      this.form = { name: '', email: '', phone: '', message: '', topic: '' };
      setTimeout(() => { this.msgText = ''; }, 4000);
    }
  }
};
</script>

