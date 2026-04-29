const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dataPath = path.join(__dirname, 'data');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(dataPath, file), 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(dataPath, file), JSON.stringify(data, null, 2));
}

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

app.post('/api/login', (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.login === req.body.login && u.password === req.body.password);
  if (user) {
    res.json({ success: true, name: user.name });
  } else {
    res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
});

app.get('/api/timetable', (req, res) => {
  res.json(readJSON('timetable.json'));
});

app.listen(3000, () => {
  console.log('✅ Сервер на http://localhost:3000');
});