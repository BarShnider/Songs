const swaggerAPI = `https://localhost:7052/api`;
let rupAPI;
let currApi = swaggerAPI;
const lastfmKEY = "711cd7242581234c484cb8a564931277"

$(document).ready(() => {

    if(localStorage.getItem("userObj")){
        console.log("ONLOAD USER OBJECT:")
        let loggedInUser = JSON.parse(localStorage.getItem("userObj"))
        console.log(loggedInUser);
        console.log(document.querySelector(".login-register-btn"))
        document.querySelector(".login-register-btn").innerHTML = `<div class="login-register-btn mr-50"><a href="login.html" id="loginBtn">Logged in as ${loggedInUser.username}</a><a href="register.html" id="loginBtn">&nbsp;&nbsp;Signout</a></div>`
    }
    else {
        console.log("no one is logged in")
    }

    TopTenArtists();



  $("#register-form").submit(() => { // register form
    let user = {
      name: $("#registerName").val().toLowerCase(),
      email: $("#registerEmail").val().toLowerCase(),
      password: $("#registerPassword").val(),
    };
    if($("#registerName").val() == ""){
        alert("please insert username!")
        return
    }
    let api = currApi + `/Users/Register`;
    ajaxCall("POST",api,JSON.stringify(user),registerSuccessCB,errorCB);
    return false;
  });
  // check if the password is matching with the validation password, and show a messege if not
  function checkPassword() {
    if (this.value != $("#registerPassword").val()) {
      this.validity.valid = false;
      this.setCustomValidity("passwords must be identical!");
    } else {
      this.validity.valid = true;
      this.setCustomValidity("");
    }
  }
  $("#login-form").submit(() => { // Login form
    let user = {
      name: "",
      email: $("#loginEmail").val().toLowerCase(),
      password: $("#loginPassword").val(),
    };
    if($("#loginEmail").val() == ""){
        alert("please insert username!")
        return
    }
    let api = currApi + `/Users/Login`;
    ajaxCall("POST",api,JSON.stringify(user),loginSuccessCB,errorCB);
    return false;
  });

  $("#reEnterRegisterPassword").on("blur", checkPassword); // check for password validation
  
});

function errorCB(err) {
  console.log(err);
}

function registerSuccessCB(data) {
  console.log(data);
  if (!data) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "User already exist!",
    });
    $("#registerEmail").val("")
  } else if (data == true) {
    Swal.fire({
      icon: "success",
      title: "Welcome!",
      text: "New Account Created!",
    });
    userObj = {
        username: $("#registerName").val().toLowerCase(),
        email: $("#registerEmail").val().toLowerCase() 
    }
    localStorage.setItem("userObj", JSON.stringify(userObj))
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  }
}

function loginSuccessCB(data){
    console.log(data)
    switch(data){
        case 0: // email incorrect
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email or Username is incorrect, Please try again.",
          });
            break;
        case 1: //email & password correct
        Swal.fire({
            icon: "success",
            title: "Welcome!",
            text: "Connected Succefully!",
          });
        let email = $("#loginEmail").val()
        ajaxCall("GET",currApi + `/Users/GetUserByEmail/${email}`,"",emailSuccessCB,errorCB);

        setTimeout(() => {
            window.location.href = "index.html";
          }, 3000);
            break;
        case 2: // password incorrect
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Password is incorrect, Please try again.",
          });
            break;
            default:
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "somthing went wrong, Please try again.",
                  });
            break;
    }
}

function emailSuccessCB(data){
    console.log(data);
    userObj = {
        username: data.name,
        email: data.email        
    }
    localStorage.removeItem("email");
    localStorage.setItem("userObj", JSON.stringify(userObj));
}

// this function returns 10 most liked artists
function TopTenArtists(){
  const qs = `/Artists/TopArtists`;
                const api=swaggerAPI+qs;
                ajaxCall("GET",api,"",successCB,errorCB); 
}

function successCB(data) {
  console.log(data);
  console.log(data.length);
  for (let i = 0; i < data.length; i++) {
    let artistId = `artist${i + 1}`;
    document.getElementById(artistId).innerHTML = `${i + 1}. ${data[i]}`;
  }
  let check=document.getElementById("a6");
  let header=document.createElement("h");
  header.innertext=data[5];
  check.appendChild(header);
}
  function errorCB(err){
    // alert("dont Work");
    console.log(err);
  }


//this function will be activaeted when entering lyrics page
function renderSongPage(){
  songName = "Factory"
  ajaxCall("GET",currApi + `/Songs/GetSongBySongName/${songName}`,"",songSuccessCB,errorCB);
}

function songSuccessCB(data){
  console.log(data)
  document.querySelector("#artistName").innerHTML = data.artistName;
  document.querySelector("#songName").innerHTML = data.title;
  document.querySelector("#lyricsContainer").innerText = data.lyrics

}

function renderArtistPage(artistName){
  document.querySelector("#artist").innerHTML = artistName;
  ajaxCall("GET",`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${lastfmKEY}&format=json`,"",artistInfoSuccessCB,errorCB);
}

function artistInfoSuccessCB(data) {
  console.log(data)
  document.querySelector("#artist-summary").innerHTML = data.artist.bio.summary;
  document.querySelector("#artist-content").innerText = data.artist.bio.content;
}

function renderAllArtistsList(){
  ajaxCall("GET",currApi + `/Artists/GetAllArtists`,"",artistSuccessCB,errorCB);

}

function artistSuccessCB(data) {
  console.log(data);
  let container = document.querySelector(".list-accordion");
  for (let i = 0; i < data.length; i++) {
    let name = data[i];
    let accordionId = `collapse${i + 1}`; // Generate unique id for each accordion

    container.innerHTML += `
        <div class="panel single-accordion">
          <h6>
            <a role="button" aria-expanded="true" aria-controls="${accordionId}" class="collapsed" data-parent="#accordion" data-toggle="collapse" href="#${accordionId}">
              ${name}
              <span class="accor-open"><i class="fa fa-plus" aria-hidden="true"></i></span>
              <span class="accor-close"><i class="fa fa-minus" aria-hidden="true"></i></span>
            </a>
          </h6>
          <div id="${accordionId}" class="accordion-content collapse">
            <p id="${name.split(" ") == 1? name.toLowerCase() : name.split(" ").join("-").toLowerCase()}-list-item-summary"></p>
            <p class="clickHereForInfo"></p>
          </div>
        </div>`;
  }

  let clickHereForInfoElements = document.querySelectorAll(".clickHereForInfo");
for (let i = 0; i < clickHereForInfoElements.length; i++) {
  clickHereForInfoElements[i].innerHTML = `<a class="visitPage" href="#" onclick="artistSelectedFromList('${data[i]}')">Visit ${data[i]} Page</a>`;
}

  for(let name of data){
    fillArtistListInfo(name)
   
    // document.querySelector("#clickHereForInfo").innerHTML = `<a class="visitPage" href="#" onclick="artistSelectedFromList(${name})>Visit ${name} Page</a>`

  }

  // let infoFill = document.querySelectorAll("#clickHereForInfo")
  // console.log(infoFill)
  // for(let el of infoFill){
  //   console.log(el)
  //   // el.innerHTML = `<a class="visitPage" href="#" onclick="artistSelectedFromList(${name})>Visit ${name} Page</a>`
  // }

}

function fillArtistListInfo(artistName){
  ajaxCall("GET",`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName.toLowerCase()}&api_key=${lastfmKEY}&format=json`,"",fillSuccessCB,errorCB);
  // ajaxCall("GET",`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName.split(" ") == 1 ? artistName : artistName.split(" ").join("-")}&api_key=${lastfmKEY}&format=json`,"",fillSuccessCB,errorCB);

}

function fillSuccessCB(data){
  console.log(data)
  console.log("artist" in data)
  if("artist" in data){
      // document.querySelector(`#${data.artist.name.split(" ") == 1? data.artist.name : data.artist.name.split(" ").join("-")}-list-item-summary`).innerHTML =  data.artist.bio.summary
      document.querySelector(`#${data.artist.name.split(" ").join("-").toLowerCase()}-list-item-summary`).innerHTML =  data.artist.bio.summary

  }
  
  document.querySelector(`#${data.artist.name.split(" ").join("-").toLowerCase()}-list-item-summary`).innerHTML +=  `<a class="visitPage" onclick="artistSelectedFromList(${data.artist.name}) >Visit ${data.artist.name} Page</a>`
  // else{
    // document.querySelector(`#${data.artist.name.split(" ") == 1? data.artist.name : data.artist.name.split(" ").join("-")}-list-item-summary`).innerHTML += `<a href="index.html">click here for artist page</a>`
  // }
}


function artistSelectedFromList(artistName){
  localStorage.setItem('selectedArtist', artistName);
window.location.href = 'artist-page.html'
}

$("#artistListContainer").ready(() => {
  renderAllArtistsList()
})

$(document).ready(() => {
  let artistName = localStorage.getItem('selectedArtist');
  localStorage.removeItem('selectedArtist');
  if (artistName) {
    renderArtistPage(artistName);
  }
})