const express = require('express'); // 익스프레스 라이브러리 불러오기 (웹서버 만들 때 사용)
const cors = require('cors'); // CORS 문제를 해결하기 위한 라이브러리 불러오기
const app = express(); // 익스프레스 앱(서버) 객체 생성
app.use(cors()); // 모든 도메인에서 서버에 요청할 수 있도록 CORS 설정 허용
app.use(express.json()); // JSON 형식의 요청 바디를 자동으로 파싱해주는 미들웨어 등록

const animals = { // 동물과 그 울음소리를 저장한 객체
  dog: "멍멍",
  cat: "야옹",
  cow: "음메",
  lion: "어흥",
  pig: "꿀꿀",
};

const quizQuestions = [ // 퀴즈 문제 배열 (문제와 정답 포함)
  { question: "강아지가 내는 소리는?", answer: "멍멍" },
  { question: "고양이가 내는 소리는?", answer: "야옹" },
  { question: "소가 내는 소리는?", answer: "음메" },
  { question: "사자가 내는 소리는?", answer: "어흥" },
  { question: "돼지가 내는 소리는?", answer: "꿀꿀" },
];

let rankings = []; // 사용자 이름과 점수를 저장하는 배열, 서버 메모리에 유지됨

// 랜덤 동물 울음 소리 보내주는 API 엔드포인트 (GET 요청)
app.get('/api/animal-sound', (req, res) => {
  const keys = Object.keys(animals); // animals 객체의 키들(동물 이름들)을 배열로 가져옴
  const randomKey = keys[Math.floor(Math.random() * keys.length)]; // 랜덤으로 하나 선택
  res.json({ animal: randomKey, sound: animals[randomKey] }); // JSON 형태로 동물과 울음소리 응답
});

// 점수를 제출받고 랭킹 배열에 저장하거나 업데이트하는 API 엔드포인트 (POST 요청)
app.post('/api/submit-score', (req, res) => {
  const { name, score } = req.body; // 클라이언트에서 보낸 이름과 점수 추출
  const existing = rankings.find(r => r.name === name); // 이미 이름이 있는지 확인
  if (existing) {
    if (score > existing.score) existing.score = score; // 기존 점수보다 높으면 업데이트
  } else {
    rankings.push({ name, score }); // 새 사용자라면 배열에 추가
  }
  rankings.sort((a,b) => b.score - a.score); // 점수 높은 순으로 정렬
  res.json(rankings); // 최신 랭킹 리스트를 JSON으로 응답
});

// 현재 랭킹 리스트를 클라이언트에 반환하는 API 엔드포인트 (GET 요청)
app.get('/api/rankings', (req, res) => {
  console.log('랭킹 리스트 반환:', rankings); // 서버 콘솔에 랭킹 현황 출력 (디버그용)
  res.json(rankings); // 랭킹 배열을 JSON으로 응답
});

const PORT = 3001; // 서버가 사용할 포트 번호 지정
app.listen(PORT, () => console.log(`백엔드 서버 실행 중: http://localhost:${PORT}`)); // 서버 실행 후 메시지 출력
