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

// 🔍 특정 동물의 힌트를 반환하는 API 엔드포인트 (GET 요청)
// 🔍 특정 동물의 힌트를 반환하는 API 엔드포인트 (GET 요청)
app.get('/api/hint/:animal', (req, res) => {
  const animalName = req.params.animal.toLowerCase();
  
  const hints = {
    dog: "충성스러운 인간의 친구가 내는 소리예요! 🐕",
    cat: "야옹이가 내는 소리는 뭘까요? 🐱",
    cow: "우유를 주는 동물이 내는 소리예요! 🐄",
    lion: "정글의 왕이 내는 무서운 소리예요! 🦁",
    pig: "농장에서 키우는 분홍색 동물 소리예요! 🐷"
  };
  
  const hint = hints[animalName];
  console.log(`힌트 요청: ${animalName}`, hint);
  
  if (hint) {
    res.json({ hint: hint });
  } else {
    res.status(404).json({ error: "힌트를 찾을 수 없습니다." });
  }
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

// 📊 퀴즈 통계 정보를 반환하는 API 엔드포인트 (GET 요청)
app.get('/api/quiz-stats', (req, res) => {
  const totalPlayers = rankings.length; // 총 플레이어 수
  const avgScore = rankings.length > 0 
    ? rankings.reduce((sum, r) => sum + r.score, 0) / rankings.length // 평균 점수 계산
    : 0;
  const highestScore = rankings.length > 0 
    ? Math.max(...rankings.map(r => r.score)) // 최고 점수
    : 0;
  const perfectScores = rankings.filter(r => r.score === 5).length; // 만점자 수
  
  console.log('퀴즈 통계 요청:', { totalPlayers, avgScore, highestScore, perfectScores });
  
  res.json({
    totalPlayers,
    averageScore: Math.round(avgScore * 100) / 100, // 소수점 둘째자리까지 반올림
    highestScore,
    perfectScores,
    totalQuestions: quizQuestions.length
  });
});

// 🐾 특정 동물의 상세 정보를 반환하는 API 엔드포인트 (GET 요청)
app.get('/api/animal-info/:name', (req, res) => {
  const animalName = req.params.name.toLowerCase(); // URL 파라미터에서 동물 이름 추출
  
  const animalInfo = {
    dog: { 
      name: "강아지",
      habitat: "집, 마당", 
      food: "사료, 고기", 
      lifespan: "10-15년",
      emoji: "🐶",
      characteristics: "인간의 가장 친한 친구로 충성스럽고 똑똑합니다."
    },
    cat: { 
      name: "고양이",
      habitat: "집, 야외", 
      food: "생선, 사료", 
      lifespan: "12-18년",
      emoji: "🐱",
      characteristics: "독립적이고 우아한 성격을 가진 애완동물입니다."
    },
    cow: { 
      name: "소",
      habitat: "목장, 농장", 
      food: "풀, 건초", 
      lifespan: "15-20년",
      emoji: "🐄",
      characteristics: "우유와 고기를 제공하는 중요한 가축입니다."
    },
    lion: { 
      name: "사자",
      habitat: "사바나, 초원", 
      food: "고기 (육식동물)", 
      lifespan: "10-14년",
      emoji: "🦁",
      characteristics: "백수의 왕이라 불리는 강력한 맹수입니다."
    },
    pig: { 
      name: "돼지",
      habitat: "농장", 
      food: "잡식 (모든 음식)", 
      lifespan: "15-20년",
      emoji: "🐷",
      characteristics: "매우 똑똑하고 깨끗한 동물로 유명합니다."
    }
  };
  
  const info = animalInfo[animalName];
  console.log(`동물 정보 요청: ${animalName}`, info);
  
  if (info) {
    res.json(info); // 동물 정보가 있으면 반환
  } else {
    res.status(404).json({ error: "동물 정보를 찾을 수 없습니다." }); // 없으면 404 에러
  }
});

// 🎯 모든 동물 목록을 반환하는 API 엔드포인트 (GET 요청)
app.get('/api/animals', (req, res) => {
  const animalList = Object.keys(animals).map(key => ({
    name: key,
    sound: animals[key],
    emoji: {
      dog: "🐶",
      cat: "🐱", 
      cow: "🐄",
      lion: "🦁",
      pig: "🐷"
    }[key]
  }));
  
  console.log('동물 목록 요청:', animalList);
  res.json(animalList);
});

const PORT = 3001; // 서버가 사용할 포트 번호 지정
app.listen(PORT, () => console.log(`백엔드 서버 실행 중: http://localhost:${PORT}`)); // 서버 실행 후 메시지 출력