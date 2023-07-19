var quiz = {}
    quiz.hWrap = document.getElementById("quizWrap");
    
    quiz.hQn = document.createElement("div");
    quiz.hQn.id = "quizQn";
    quiz.hWrap.appendChild(quiz.hQn);
    
    quiz.hAns = document.createElement("div");
    quiz.hAns.id = "quizAns";
    quiz.hWrap.appendChild(quiz.hAns);
    quiz.hAns.innerHTML = "";
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz";
    radio.id = "quizo";
    quiz.hAns.appendChild(radio);
    let label1 = document.createElement("label");
    let label2 = document.createElement("label");
    let label3 = document.createElement("label");
    let label4 = document.createElement("label");
    quiz.hAns.appendChild(label1);
    quiz.hAns.appendChild(label2);
    quiz.hAns.appendChild(label3);
    quiz.hAns.appendChild(label4);
