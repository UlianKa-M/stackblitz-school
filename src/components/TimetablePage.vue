<template>
<table class="timetable-table">
  <thead><tr><th>📅 День</th><th>📚 Уроки</th></tr></thead>
  <tbody>
    <tr v-for="day in timetable" :key="day.day">
      <td><b>{{ day.day }}</b></td>
      <td><ul><li v-for="lesson in day.lessons">{{ lesson }}</li></ul></td>
    </tr>
  </tbody>
</table>
</template>

<script>
export default {
data() {
  return { timetable: [] };
},
async mounted() {
  const res = await fetch('/api/timetable');
  this.timetable = await res.json();
}
};
</script>