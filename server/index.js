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

// ========== НОВОСТИ ==========

// GET все новости
app.get('/api/news', (req, res) => {
  res.json(readJSON('news.json'));
});

// GET одну новость по ID (ДОБАВИТЬ ЭТОТ БЛОК!)
app.get('/api/news/:id', (req, res) => {
  const news = readJSON('news.json');
  const item = news.find(n => n.id == req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Новость не найдена' });
  }
});

// POST добавить новость
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

// DELETE удалить новость
app.delete('/api/news/:id', (req, res) => {
  let news = readJSON('news.json');
  news = news.filter(n => n.id != req.params.id);
  writeJSON('news.json', news);
  res.json({ success: true });
});

// PUT обновить новость
app.put('/api/news/:id', (req, res) => {
  let news = readJSON('news.json');
  const index = news.findIndex(n => n.id == req.params.id);
  if (index !== -1) {
    news[index] = { ...news[index], ...req.body };
    writeJSON('news.json', news);
  }
  res.json({ success: true });
});

// ========== АВТОРИЗАЦИЯ ==========

app.post('/api/login', (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.login === req.body.login && u.password === req.body.password);
  if (user) {
    res.json({ success: true, name: user.name, role: user.role || 'teacher' });
  } else {
    res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
});

// ========== РАСПИСАНИЕ ==========

app.get('/api/timetable', (req, res) => {
  res.json(readJSON('timetable.json'));
});

app.get('/api/timetable/filter', (req, res) => {
  let timetable = readJSON('timetable.json');
  const { week, weekType, class: className, room, teacher, subject, day } = req.query;
  
  if (week) {
    timetable = timetable.filter(item => item.week == week);
  }
  if (weekType) {
    timetable = timetable.filter(item => item.weekType === weekType);
  }
  if (className) {
    timetable = timetable.filter(item => item.class === className);
  }
  if (room) {
    timetable = timetable.filter(item => item.room === room);
  }
  if (teacher) {
    timetable = timetable.filter(item => item.teacher === teacher);
  }
  if (subject) {
    timetable = timetable.filter(item => item.subject === subject);
  }
  if (day) {
    timetable = timetable.filter(item => item.day === day);
  }
  
  res.json(timetable);
});

app.get('/api/timetable/options', (req, res) => {
  const timetable = readJSON('timetable.json');
  
  const classes = [...new Set(timetable.map(item => item.class))].sort();
  const rooms = [...new Set(timetable.map(item => item.room))].sort();
  const teachers = [...new Set(timetable.map(item => item.teacher))].sort();
  const subjects = [...new Set(timetable.map(item => item.subject))].sort();
  const days = [...new Set(timetable.map(item => item.day))].sort();
  const weeks = [...new Set(timetable.map(item => item.week))].sort();
  const weekTypes = [...new Set(timetable.map(item => item.weekType))].sort();
  
  res.json({ classes, rooms, teachers, subjects, days, weeks, weekTypes });
});

// Добавление нового урока
app.post('/api/timetable', (req, res) => {
  const timetable = readJSON('timetable.json');
  const newLesson = {
    id: Date.now(),
    week: parseInt(req.body.week) || 1,
    weekType: req.body.weekType || 'нечетная',
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

// Удаление урока
app.delete('/api/timetable/:id', (req, res) => {
  let timetable = readJSON('timetable.json');
  timetable = timetable.filter(item => item.id != req.params.id);
  writeJSON('timetable.json', timetable);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('✅ Сервер на http://localhost:3000');
});