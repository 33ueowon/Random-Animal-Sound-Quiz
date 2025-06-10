const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const animals = {
  dog: "멍멍",
  cat: "야옹",
  cow: "음메",
  lion: "어흥",
  pig: "꿀꿀",
};

const quizQuestions = [
  { question: "강아지가 내는 소리는?", answer: "멍멍" },
  { question: "고양이가 내는 소리는?", answer: "야옹" },
  { question: "소가 내는 소리는?", answer: "음메" },
  { question: "사자가 내는 소리는?", answer: "어흥" },
  { question: "돼지가 내는 소리는?", answer: "꿀꿀" },
];

let rankings = [];

app.get('/api/animal-sound', (req, res) => {
  const keys = Object.keys(animals);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  res.json({ animal: randomKey, sound: animals[randomKey] });
});

app.post('/api/submit-score', (req, res) => {
  const { name, score } = req.body;
  const existing = rankings.find(r => r.name === name);
  if (existing) {
    if (score > existing.score) existing.score = score; // 최고 점수 저장
  } else {
    rankings.push({ name, score });
  }
  rankings.sort((a,b) => b.score - a.score);
  res.json(rankings);
});

app.get('/api/rankings', (req, res) => {
  console.log('랭킹 리스트 반환:', rankings);
  res.json(rankings);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`백엔드 서버 실행 중: http://localhost:${PORT}`));
