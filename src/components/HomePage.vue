<template>
<div>
  <div class="card"><h2>✨ Добро пожаловать</h2><p>Школа №1 — современное образовательное учреждение.</p></div>
  <div class="stats"><div class="stat-item"><div class="stat-number">850+</div><div>Учеников</div></div><div class="stat-item"><div class="stat-number">65</div><div>Учителей</div></div><div class="stat-item"><div class="stat-number">98%</div><div>Поступление</div></div></div>
  <div class="card"><h2>🌟 Наши преимущества</h2><div class="features-list"><div class="feature"><div class="feature-icon">👩‍🏫</div><h3>Профессионалы</h3></div><div class="feature"><div class="feature-icon">💻</div><h3>Технологии</h3></div><div class="feature"><div class="feature-icon">🏀</div><h3>Спорт</h3></div><div class="feature"><div class="feature-icon">📚</div><h3>Профили</h3></div></div></div>
  <div class="card"><h2>📢 Последние новости</h2><div v-for="item in lastNews" :key="item.id" class="news-item"><div class="news-title">{{ item.title }}</div><div class="news-date">📅 {{ item.date }}</div><div>{{ item.content.substring(0,100) }}...</div></div></div>
</div>
</template>

<script>
export default {
data() {
  return { lastNews: [] };
},
async mounted() {
  const res = await fetch('/api/news');
  const news = await res.json();
  this.lastNews = [...news].slice(-2).reverse();
}
};
</script>