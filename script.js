// ===== データ読み込み =====

let customWords =
JSON.parse(localStorage.getItem("customWords")) || [];

let wrongList =
JSON.parse(localStorage.getItem("wrongWords")) || [];

let allWords = [...words, ...customWords];

let questions = [];
let current = 0;
let score = 0;

// ===== 要素取得 =====

const homeScreen = document.getElementById("homeScreen");
const quizScreen = document.getElementById("quizScreen");
const finishScreen = document.getElementById("finishScreen");

const totalWords = document.getElementById("totalWords");
const wrongCount = document.getElementById("wrongCount");
const wrongListBox = document.getElementById("wrongListBox");

const startBtn = document.getElementById("startBtn");
const reviewStartBtn = document.getElementById("reviewStartBtn");
const reviewBtn = document.getElementById("reviewBtn");
const retryBtn = document.getElementById("retryBtn");
const finishHomeBtn = document.getElementById("finishHomeBtn");
const homeBtn = document.getElementById("homeBtn");

const countEl = document.getElementById("count");
const scoreEl = document.getElementById("score");

const wordEl = document.getElementById("word");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");

const addWordBtn = document.getElementById("addWordBtn");
const newWord = document.getElementById("newWord");
const newMeaning = document.getElementById("newMeaning");

// ===== ホーム画面更新 =====

function updateHome(){

    allWords = [...words, ...customWords];

    totalWords.textContent = allWords.length;

    wrongCount.textContent = wrongList.length;

    drawWrongList();

}

updateHome();

// ===== 間違え一覧 =====

function drawWrongList(){

    wrongListBox.innerHTML="";

    if(wrongList.length===0){

        wrongListBox.innerHTML=
        "<p class='empty'>まだありません</p>";

        return;

    }

    wrongList.forEach(item=>{

        const div=document.createElement("div");

        div.className="wrongItem";

        div.innerHTML=
        "<b>"+item.word+"</b><span>"+item.meaning+"</span>";

        wrongListBox.appendChild(div);

    });

}

// ===== ホームボタン =====

homeBtn.onclick=()=>{

    quizScreen.style.display="none";

    finishScreen.style.display="none";

    homeScreen.style.display="block";

    updateHome();

};

// ===== スタート =====

startBtn.onclick=()=>{

    questions=[...allWords];

    shuffle(questions);

    current=0;

    score=0;

    homeScreen.style.display="none";

    finishScreen.style.display="none";

    quizScreen.style.display="block";

    showQuestion();

};

// ===== 復習開始 =====

reviewStartBtn.onclick=()=>{

    if(wrongList.length===0){

        alert("苦手単語はありません");

        return;

    }

    questions=[...wrongList];

    shuffle(questions);

    current=0;

    score=0;

    homeScreen.style.display="none";

    quizScreen.style.display="block";

    showQuestion();

};

reviewBtn.onclick=reviewStartBtn.onclick;// ===== 問題表示 =====

function showQuestion(){

    resultEl.textContent="";

    nextBtn.style.display="none";

    countEl.textContent=
    `${current+1} / ${questions.length}`;

    scoreEl.textContent=
    `正解 ${score}`;

    const q=questions[current];

    wordEl.textContent=q.word;

    let choices=[q.meaning];

    while(choices.length<4){

        const randomMeaning=
        allWords[Math.floor(Math.random()*allWords.length)].meaning;

        if(!choices.includes(randomMeaning)){

            choices.push(randomMeaning);

        }

    }

    shuffle(choices);

    choicesEl.innerHTML="";

    choices.forEach(choice=>{

        const btn=document.createElement("button");

        btn.className="choice";

        btn.textContent=choice;

        btn.onclick=()=>judge(btn,choice,q);

        choicesEl.appendChild(btn);

    });

}

// ===== 判定 =====

function judge(btn,choice,q){

    const buttons=document.querySelectorAll(".choice");

    buttons.forEach(b=>b.disabled=true);

    if(choice===q.meaning){

        btn.classList.add("correct");

        resultEl.textContent="⭕ 正解！";

        score++;

    }else{

        btn.classList.add("wrong");

        buttons.forEach(b=>{

            if(b.textContent===q.meaning){

                b.classList.add("correct");

            }

        });

        resultEl.textContent=
        `❌ 正解：${q.meaning}`;

        // 重複登録しない
        if(!wrongList.some(w=>w.word===q.word)){

            wrongList.push(q);

            localStorage.setItem(
                "wrongWords",
                JSON.stringify(wrongList)
            );

        }

    }

    scoreEl.textContent=
    `正解 ${score}`;

    nextBtn.style.display="block";

}

// ===== 次へ =====

nextBtn.onclick=()=>{

    current++;

    if(current>=questions.length){

        finish();

    }else{

        showQuestion();

    }

};// ===== 終了画面 =====

function finish(){

    quizScreen.style.display = "none";
    finishScreen.style.display = "block";

    const rate = Math.round(score / questions.length * 100);

    document.getElementById("finalScore").innerHTML = `
        正解数：${score} / ${questions.length}<br>
        正答率：${rate}%
    `;

    updateHome();

}

// ===== もう一度 =====

retryBtn.onclick = () => {

    questions = [...allWords];

    shuffle(questions);

    current = 0;

    score = 0;

    finishScreen.style.display = "none";

    quizScreen.style.display = "block";

    showQuestion();

};

// ===== ホームへ =====

finishHomeBtn.onclick = () => {

    finishScreen.style.display = "none";

    homeScreen.style.display = "block";

    updateHome();

};

// ===== 単語追加 =====

addWordBtn.onclick = () => {

    const word = newWord.value.trim();

    const meaning = newMeaning.value.trim();

    if(word==="" || meaning===""){

        alert("英単語と意味を入力してください");

        return;

    }

    if(allWords.some(w=>w.word===word)){

        alert("その単語はすでにあります");

        return;

    }

    const data = {

        word:word,

        meaning:meaning

    };

    customWords.push(data);

    localStorage.setItem(

        "customWords",

        JSON.stringify(customWords)

    );

    allWords=[...words,...customWords];

    newWord.value="";

    newMeaning.value="";

    updateHome();

    alert("追加しました！");

};

// ===== シャッフル =====

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

}

// ===== 初期表示 =====

homeScreen.style.display="block";

quizScreen.style.display="none";

finishScreen.style.display="none";

updateHome();
