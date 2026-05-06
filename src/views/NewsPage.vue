<template>
<div>
  <div v-for="item in allNews" :key="item.id" class="news-item">
    <div class="news-title">{{ item.title }}</div>
    <div class="news-date">📅 {{ item.date }}</div>
    <div>{{ item.content }}</div>
  </div>
</div>
</template>

<script>
export default {
data() {
  return { allNews: [] };
},
async mounted() {
  const res = await fetch('/api/news');
  this.allNews = await res.json();
}
};
</script>