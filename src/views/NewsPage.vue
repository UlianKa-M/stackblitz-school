<template>
  <div>
    <div v-for="item in allNews" :key="item.id" class="news-item" @click="openModal(item.id)">
      <div class="news-title">{{ item.title }}</div>
      <div class="news-date">📅 {{ item.date }}</div>
      <div class="news-category">🏷️ {{ item.category || 'Новость' }}</div>
      <div class="news-preview">{{ item.shortContent || item.content.substring(0, 120) }}...</div>
    </div>
    <p v-if="allNews.length === 0" style="text-align:center; color:white;">Новостей пока нет</p>

    <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content news-modal" @click.stop>
        <button class="modal-close" @click="closeModal">✕</button>
        
        <div v-if="selectedNews.image" class="news-modal-image">
          <img :src="selectedNews.image" :alt="selectedNews.title">
        </div>
        
        <div class="news-modal-category">🏷️ {{ selectedNews.category || 'Новость' }}</div>
        
        <div class="news-modal-title">{{ selectedNews.title }}</div>
       
        <div class="news-modal-meta">
          <span class="news-modal-date">📅 {{ selectedNews.date }}</span>
          <span class="news-modal-author">✍️ {{ selectedNews.author || 'Пресс-служба' }}</span>
          <span class="news-modal-views">👁️ {{ selectedNews.views || 0 }} просмотров</span>
        </div>
        
        <div v-if="selectedNews.shortContent" class="news-modal-short">
          📌 {{ selectedNews.shortContent }}
        </div>
        
        <div class="news-modal-content">{{ selectedNews.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allNews: [],
      modalVisible: false,
      selectedNews: {
        id: null,
        title: '',
        date: '',
        content: '',
        shortContent: '',
        author: '',
        views: 0,
        image: '',
        category: ''
      }
    };
  },
  async mounted() {
    await this.loadNews();
  },
  methods: {
    async loadNews() {
      try {
        const res = await fetch('/api/news');
        this.allNews = await res.json();
        console.log('Новости загружены:', this.allNews);
      } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
      }
    },
    async openModal(id) {
      try {
        const res = await fetch(`/api/news/${id}`);
        this.selectedNews = await res.json();
        console.log('Открыта новость:', this.selectedNews);
        this.modalVisible = true;
        document.body.style.overflow = 'hidden';
        
        // Увеличиваем просмотры
        this.selectedNews.views = (this.selectedNews.views || 0) + 1;
        await fetch(`/api/news/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.selectedNews)
        });
      } catch (error) {
        console.error('Ошибка загрузки новости:', error);
      }
    },
    closeModal() {
      this.modalVisible = false;
      document.body.style.overflow = '';
    }
  }
};
</script>