<template>
  <div>
    <div class="card">
      <h2>✨ Добро пожаловать в Школу №1</h2>
      <p>Школа №1 — это современное образовательное учреждение, где каждый ученик может раскрыть свой потенциал. Мы гордимся нашими выпускниками, которые поступают в лучшие вузы страны и становятся успешными специалистами.</p>
      <p>Наша миссия — дать качественное образование, воспитать достойных граждан и помочь каждому ребенку найти свой путь в жизни.</p>
    </div>

    <div class="stats">
      <div class="stat-item"><div class="stat-number">850+</div><div>Учеников</div></div>
      <div class="stat-item"><div class="stat-number">15</div><div>Учителей</div></div>
      <div class="stat-item"><div class="stat-number">98%</div><div>Поступление</div></div>
      <div class="stat-item"><div class="stat-number">30+</div><div>Победителей</div></div>
    </div>

    <div class="card">
      <h2>🌟 Наши преимущества</h2>
      <div class="features-list">
        <div class="feature" @click="openModal('teachers')">
          <div class="feature-icon">👩‍🏫</div>
          <h3>Профессионалы</h3>
          <p>Опытные учителя</p>
        </div>
        <div class="feature" @click="openModal('technology')">
          <div class="feature-icon">💻</div>
          <h3>Технологии</h3>
          <p>Современное оборудование</p>
        </div>
        <div class="feature" @click="openModal('sports')">
          <div class="feature-icon">🏀</div>
          <h3>Спорт</h3>
          <p>Секции и кружки</p>
        </div>
        <div class="feature" @click="openModal('profiles')">
          <div class="feature-icon">📚</div>
          <h3>Профили</h3>
          <p>Углубленное изучение</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>📢 Последние новости</h2>
      <div v-for="item in lastNews" :key="item.id" class="news-item">
        <div class="news-title">{{ item.title }}</div>
        <div class="news-date">📅 {{ item.date }}</div>
        <div>{{ item.content.substring(0, 120) }}...</div>
      </div>
    </div>

    <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✕</button>
        <div class="modal-icon">{{ modalData.icon }}</div>
        <h2>{{ modalData.title }}</h2>
        <div class="modal-image">
          <img :src="modalData.image" :alt="modalData.title">
        </div>
        <p>{{ modalData.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastNews: [],
      modalVisible: false,
      modalData: {
        icon: '',
        title: '',
        description: '',
        image: ''
      },
      modals: {
        teachers: {
          icon: '👩‍🏫',
          title: 'Профессиональные педагоги',
          description: 'В нашей школе работают 15 высококвалифицированных учителей, из них 85% имеют высшую категорию. Наши педагоги регулярно проходят курсы повышения квалификации и участвуют в профессиональных конкурсах. Многие из них являются победителями городских и областных конкурсов "Учитель года".',
          image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop'
        },
        technology: {
          icon: '💻',
          title: 'Современные технологии',
          description: '3 компьютерных класса с новейшим оборудованием, интерактивные панели в каждом кабинете, доступ к электронным образовательным платформам (ЯКласс, Учи.ру, Российская электронная школа), высокоскоростной Wi-Fi на всей территории школы, собственный медиацентр.',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop'
        },
        sports: {
          icon: '🏀',
          title: 'Спорт и здоровье',
          description: 'Современный спортивный комплекс с бассейном (25 м), тренажерный зал, универсальная спортплощадка для игровых видов спорта, футбольное поле с искусственным покрытием. Работают секции: баскетбол, волейбол, футбол, плавание, самбо, шахматы.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop'
        },
        profiles: {
          icon: '📚',
          title: 'Профильные классы',
          description: 'С 8 класса открыты профильные направления: физико-математический (углублённая математика и физика), гуманитарный (русский язык, литература, история), информационно-технологический (программирование, IT), химико-биологический (подготовка к медицинским вузам).',
          image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=300&fit=crop'
        }
      }
    };
  },
  async mounted() {
    try {
      const res = await fetch('/api/news');
      const news = await res.json();
      this.lastNews = [...news].slice(-2).reverse();
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  },
  methods: {
    openModal(key) {
      this.modalData = this.modals[key];
      this.modalVisible = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.modalVisible = false;
      document.body.style.overflow = '';
    }
  }
};
</script>