const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(dataPath, file), 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(dataPath, file), JSON.stringify(data, null, 2));
}

//новости
app.get('/api/news', (req, res) => {
  res.json(readJSON('news.json'));
});

app.post('/api/news', (req, res) => {
  const news = readJSON('news.json');
  const newNews = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    date: req.body.date || new Date().toISOString().split('T')[0]
  };
  news.push(newNews);
  writeJSON('news.json', news);
  res.json(newNews);
});

app.delete('/api/news/:id', (req, res) => {
  let news = readJSON('news.json');
  news = news.filter(n => n.id != req.params.id);
  writeJSON('news.json', news);
  res.json({ success: true });
});

app.put('/api/news/:id', (req, res) => {
  let news = readJSON('news.json');
  const index = news.findIndex(n => n.id == req.params.id);
  if (index !== -1) {
    news[index] = { ...news[index], ...req.body };
    writeJSON('news.json', news);
  }
  res.json({ success: true });
});

//авторизация
app.post('/api/login', (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.login === req.body.login && u.password === req.body.password);
  if (user) {
    res.json({ success: true, name: user.name, role: user.role || 'teacher' });
  } else {
    res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
});

//расписание
app.get('/api/timetable', (req, res) => {
  res.json(readJSON('timetable.json'));
});

app.get('/api/timetable/filter', (req, res) => {
  let timetable = readJSON('timetable.json');
  const { week, class: className, room, teacher, subject, day } = req.query;
  
  if (week) timetable = timetable.filter(item => item.week == week);
  if (className) timetable = timetable.filter(item => item.class === className);
  if (room) timetable = timetable.filter(item => item.room === room);
  if (teacher) timetable = timetable.filter(item => item.teacher === teacher);
  if (subject) timetable = timetable.filter(item => item.subject === subject);
  if (day) timetable = timetable.filter(item => item.day === day);
  
  res.json(timetable);
});

app.get('/api/timetable/options', (req, res) => {
  const timetable = readJSON('timetable.json');
  res.json({
    classes: [...new Set(timetable.map(item => item.class))].sort(),
    rooms: [...new Set(timetable.map(item => item.room))].sort(),
    teachers: [...new Set(timetable.map(item => item.teacher))].sort(),
    subjects: [...new Set(timetable.map(item => item.subject))].sort(),
    days: [...new Set(timetable.map(item => item.day))].sort(),
    weeks: [...new Set(timetable.map(item => item.week))].sort()
  });
});

//добавление нового урока
app.post('/api/timetable', (req, res) => {
  const timetable = readJSON('timetable.json');
  const newLesson = {
    id: Date.now(),
    week: parseInt(req.body.week) || 1,
    day: req.body.day,
    class: req.body.class,
    room: req.body.room,
    teacher: req.body.teacher,
    subject: req.body.subject,
    time: req.body.time
  };
  timetable.push(newLesson);
  writeJSON('timetable.json', timetable);
  res.json(newLesson);
});

//удаление урока
app.delete('/api/timetable/:id', (req, res) => {
  let timetable = readJSON('timetable.json');
  timetable = timetable.filter(item => item.id != req.params.id);
  writeJSON('timetable.json', timetable);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('✅ Сервер на http://localhost:3000');
});