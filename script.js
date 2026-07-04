let questions = [...words];
let current = 0;
let score = 0;
let wrongList = [];

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const finishScreen = document.getElementById("finishScreen");

const wordEl = document.getElementById("word");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");

const countEl = document.getElementById("count");
const scoreEl = document.getElementById("score");

const nextBtn = document.getElementById("nextBtn");

document.getElementById("startBtn").onclick = () => {
    shuffle(questions);
    startScreen.style.display = "none";
    quizScreen.style.display = "block";
    showQuestion();
};

nextBtn.onclick = () => {
    current++;
    if(current >= questions.length){
        finish();
    }else{
        showQuestion();
    }
};

document.getElementById("reviewBtn").onclick = () => {
    if(wrongList.length===0){
        alert("間違えた問題はありません！");
        return;
    }

    questions=[...wrongList];
    shuffle(questions);

    current=0;
    score=0;
    wrongList=[];

    finishScreen.style.display="none";
    quizScreen.style.display="block";

    showQuestion();
};

function showQuestion(){

    resultEl.textContent="";
    nextBtn.style.display="none";

    countEl.textContent=`${current+1} / ${questions.length}`;
    scoreEl.textContent=`正解 ${score}`;

    const q=questions[current];

    wordEl.textContent=q.word;

    let choices=[q.meaning];

    while(choices.length<4){

        const m=words[Math.floor(Math.random()*words.length)].meaning;

        if(!choices.includes(m)){
            choices.push(m);
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

        resultEl.textContent=`❌ 不正解　正解：${q.meaning}`;

        wrongList.push(q);

    }

    scoreEl.textContent=`正解 ${score}`;

    nextBtn.style.display="block";

}

function finish(){

    quizScreen.style.display="none";

    finishScreen.style.display="block";

    const rate=Math.round(score/questions.length*100);

    document.getElementById("finalScore").innerHTML=
    `正解数：${score}/${questions.length}<br>正答率：${rate}%`;

}

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

}
