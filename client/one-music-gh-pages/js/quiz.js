var quiz = {}
    quiz.hWrap = document.getElementById("quizWrap");
    
    quiz.hQn = document.createElement("div");
    quiz.hQn.id = "quizQn";
    quiz.hQn.innerHTML = "Press Start Or Select Game To Play";
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
    for(let i = 1; i<5; i++){

        let label = document.createElement("label");
        label.id = `label${i}`
        quiz.hAns.appendChild(label);
        label.onclick = () => {
            selectedAnswer = label.innerHTML
            checkObj = {
                artist: document.querySelector("#quizQn").innerHTML,
                song: label.innerHTML
            }
            
            ajaxCall("POST",currApi + `/Questions/CheckAnswerSongForArtist/${checkObj.artist}/${checkObj.song}`, JSON.stringify(checkObj),checkAnswerSuccessCB,errorCB);
            sessionStorage.setItem("selectedAnswerLabelId",label.id);
        }
    }

    let matchSongsToArtistCounter = 0
    let matchSongsToArtistCorrectAnswers = 0
    function checkAnswerSuccessCB(data){
        console.log(data)
        let labelID = sessionStorage.getItem("selectedAnswerLabelId")
        if(data){
            document.querySelector(`#${labelID}`).style.backgroundColor = "#34c724";
            matchSongsToArtistCorrectAnswers++;
            matchSongsToArtistCounter++;
            setTimeout(() => {
                getArtistQuestion();
            }, 500);
        }
        else{
            document.querySelector(`#${labelID}`).style.backgroundColor = "#f54a45";
            matchSongsToArtistCounter++;
            setTimeout(() => {
                getArtistQuestion();
            }, 500);

        }
    }

    function getArtistQuestion(){
        document.querySelector(".quiz-header").innerHTML = "Guess The Artist!"
        document.querySelector("#getArtistQ-play-again").style.display = "none"
        document.querySelector("#quizAns").style.display = "grid";
        if(matchSongsToArtistCounter == 10){
            document.querySelector("#getArtistQ-play-again").innerHTML = "Play Again";
            document.querySelector("#getArtistQ-play-again").style.display = "block"
            document.querySelector("#quizAns").style.display = "none";
            document.querySelector("#quizQn").innerHTML = `you got ${matchSongsToArtistCorrectAnswers}/10 correct!`;
            matchSongsToArtistCorrectAnswers = 0;
            matchSongsToArtistCounter = 0;
            return;
        }

        ajaxCall("GET",currApi + `/Questions/GetQuestionArtist`,"",artistQuestionSuccessCB,errorCB);
        for(let i = 1; i<5;i++){
            document.querySelector(`#label${i}`).style.backgroundColor = "#fff"
        }

    }

    function artistQuestionSuccessCB(data){
        console.log(data)
            document.querySelector(`#quizQn`).innerHTML = data.contentQ;
            document.querySelector(`#label1`).innerHTML = data.answerA;
            document.querySelector(`#label2`).innerHTML = data.answerB;
            document.querySelector(`#label3`).innerHTML = data.answerC;
            document.querySelector(`#label4`).innerHTML = data.answerD;

    }


    function getSongQuestion(){
        document.querySelector(".quiz-header").innerHTML = "Guess The Song!"
        document.querySelector("#getArtistQ-play-again").style.display = "none"
        document.querySelector("#quizAns").style.display = "grid";
        if(matchSongsToArtistCounter == 10){
            document.querySelector("#getArtistQ-play-again").innerHTML = "Play Again";
            document.querySelector("#getArtistQ-play-again").style.display = "block"
            document.querySelector("#quizAns").style.display = "none";
            document.querySelector("#quizQn").innerHTML = `you got ${matchSongsToArtistCorrectAnswers}/10 correct!`;
            matchSongsToArtistCorrectAnswers = 0;
            matchSongsToArtistCounter = 0;
            return;
        }

        ajaxCall("GET",currApi + `/Questions/GetQuestionSong`,"",artistQuestionSuccessCB,errorCB);
        for(let i = 1; i<5;i++){
            document.querySelector(`#label${i}`).style.backgroundColor = "#fff"
        }

    }