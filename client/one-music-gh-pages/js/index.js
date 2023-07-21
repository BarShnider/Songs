const swaggerAPI = `https://localhost:7052/api`;
let rupAPI;
let currApi = swaggerAPI;
const lastfmKEY = "711cd7242581234c484cb8a564931277"
const deezerSecret = "b5d9a7955fc9a8b367bebcd125339bb6"


//this function mostly deals with the state of the connected user (or if there is no connected user). when the DOM is loaded it checks if there is 
// a connected user (by checking the local storage), and present it to the navbar alongside to signout option. if the connected user is an admin, it
// also present a "Admin Panel" button.
$(document).ready(() => {

    if(localStorage.getItem("userObj")){
        console.log("ONLOAD USER OBJECT:")
        let loggedInUser = JSON.parse(localStorage.getItem("userObj"))
        console.log(loggedInUser);
        console.log(document.querySelector(".login-register-btn"))
        document.querySelector(".login-register-btn").innerHTML = `<div class="login-register-btn logged-user-div mr-50">
        <a href="user-page.html" id="loginBtn">Logged in as ${loggedInUser.username}</a><span class="line"></span><a onclick="signout()" id="loginBtn">&nbsp;&nbsp;Signout</a></div>`
        if(loggedInUser.email == "admin@gmail.com"){
          document.querySelector(".logged-user-div").innerHTML += `<span class="line"></span><a href="admin-page.html" id="">&nbsp;&nbsp;Admin Panel</a>`
        }
      }
    else {
        console.log("no one is logged in")
    }

  // handler for register form. takes the parameters from the form and handles the submittion to registration.
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
    ajaxCall("POST",api,JSON.stringify(user),registerSuccessCB,registerErrorCB);
    return false;
  });

  // check if the password is matching with the validation password, and show a message if not
  function checkPassword() {
    if (this.value != $("#registerPassword").val()) {
      this.validity.valid = false;
      this.setCustomValidity("passwords must be identical!");
    } else {
      this.validity.valid = true;
      this.setCustomValidity("");
    }
  }
  
  // handler for login form. takes the parameters from the form and handles the submittion to login using ajax call.
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

function registerErrorCB(err){
  // console.log(err.resposeText.split("$"))
  console.log(err)
  console.log(err.responseText.split("$"))
  if(err.responseText.split("$")[1] == "Username taken"){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Username is taken, try differnet one.",
    });
  }
   if(err.responseText.split("$")[1] == "email taken"){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Email is taken, try differnet one.",
    });
  }
}


// success callback to the regsiter form submission. if there were no errors, it returns with true or false (whice indicates if the user been able to register or not).
// if the user registerd successfully (true) - present a success message and change the page to the home page, else -present an alert indicating that the user already exist, else (false)
function registerSuccessCB(data) {
  console.log(data);
  if (!data) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "User already exist, try different User or Email combination!",
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

// three options for returned data : "0" - email incorrect, "1" - email and password correct and match, "2" - password incorrect.
// the function handles the login form success and present a message according to the data that came from the server and SP.
// if its connected succefully - calls to ajaxCall that will save the user to the localstorage for further use, and change the page to the homepage. 
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
// user to save the registerd/login user to the localstorage for further use in the app.
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
                const api=currAPI+qs;
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


//this function will be activaeted when entering lyrics page (on load). in gets the song object by the song name, and sets the current like status in th page.
//in the second ajaxCall use the userObj in local storage to get the user and check if he liked the song.
function renderSongPage(songName){
  let user = JSON.parse(localStorage.getItem("userObj"));
  ajaxCall("GET",currApi + `/Songs/GetSongBySongName/${songName}`,"",songSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Songs/GetIfUserLikedSong/${user.email}/${songName}`,"",ifUserLikedSongSuccessCB,errorCB);
}

//fill the song page with relevant data, into pre-built containers.
function songSuccessCB(data){
  console.log(data)

  document.querySelector("#artistName").innerHTML = data.artistName;
  document.querySelector("#songName").innerHTML = data.title;
  document.querySelector("#lyricsContainer").innerText = data.lyrics
  document.querySelector("#song-likes-count").innerHTML = data.favoriteCount
  

}

// sets the status of the like button (if the user likes the song - sets the color and background to liked)
function ifUserLikedSongSuccessCB(data){
  console.log(data)
  let likeHeart = document.querySelector("#heart-button")
  if(data){
  likeHeart.style.color = "#FB076D"
  likeHeart.style.backgroundColor = "#fb076d40"

  }
  else{
    likeHeart.style.color = "#000000"
    likeHeart.style.backgroundColor = "#DDDDDD"
  }
}
//renders the artist page.
function renderArtistPage(artistName){
  let user = JSON.parse(localStorage.getItem("userObj"))
  document.querySelector("#artist").innerHTML = artistName;
  ajaxCall("GET",`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${lastfmKEY}&format=json`,"",artistInfoSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Songs/GetSongsByArtist/${artistName}`,"",songByArtistSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Artists/ArtistsLikes/${artistName}`,"",getArtistLikesSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Artists/GetIfUserLikedArtist/${user.email}/${artistName}`,"",ifUserLikedSongSuccessCB,errorCB);
}
function getArtistLikesSuccessCB(data){
console.log(data)
document.querySelector("#artist-likes-count").innerHTML = data
}

function songByArtistSuccessCB(data){
  console.log(data)
  let artistName = document.querySelector("#artist").innerHTML
  // console.log(artistName)
  getDeezerDetails(artistName)
  songsCont = document.querySelector("#songs-content");
  console.log(songsCont)
  for(let song of data){
    songsCont.innerHTML += `<a class="visitPage admin-panel-song-links" href="#" onclick="songSelectedFromList('${song.title.replace(/'/g, "\\'")}')">${song.title}</a><br>`
  }
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
            <p id="${name.split(" ").join("-").toLowerCase().replace(/'/g, "\\'").split(".").join("").split("'").join("")}-list-item-summary"></p>
            <p class="clickHereForInfo"></p>
          </div>
        </div>`;
  }

  let clickHereForInfoElements = document.querySelectorAll(".clickHereForInfo");
for (let i = 0; i < clickHereForInfoElements.length; i++) {
  clickHereForInfoElements[i].innerHTML = `<a class="visitPage" href="#" onclick="artistSelectedFromList('${data[i].replace(/'/g, "\\'")}')">Visit ${data[i]} Page</a>`;
}

  for(let name of data){
    fillArtistListInfo(name)
  }
}

function fillArtistListInfo(artistName){
  ajaxCall("GET",`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName.toLowerCase()}&api_key=${lastfmKEY}&format=json`,"",fillSuccessCB,errorCB);
}

function fillSuccessCB(data){
  console.log(data)
  console.log("artist" in data)
  if("artist" in data){
      document.querySelector(`#${data.artist.name.split(" ").join("-").toLowerCase().replace(/'/g, "\\'").split(".").join("").split("'").join("")}-list-item-summary`).innerHTML =  data.artist.bio.summary
  }  
  document.querySelector(`#${data.artist.name.split(" ").join("-").toLowerCase().replace(/'/g, "\\'").split(".").join("").split("'").join("")}-list-item-summary`).innerHTML +=  `<a class="visitPage" onclick="artistSelectedFromList(${data.artist.name}) >Visit ${data.artist.name} Page</audio>`

}


function artistSelectedFromList(artistName){
  localStorage.setItem('selectedArtist', artistName);
  sessionStorage.setItem("tempArtist", artistName)
window.location.href = 'artist-page.html'
}

function songSelectedFromList(songName){
  localStorage.setItem('selectedSong', songName);
  sessionStorage.setItem("tempSong",songName);
window.location.href = 'song-page.html'
}

function signout(){
  localStorage.removeItem("userObj");
  window.location.href = "login.html"
}

$(document).ready (() => {
  $("#search-form").submit(() => {
    let toSearch = $("#search").val();
    document.querySelector("#artist-title").innerHTML = ""
    document.querySelector("#artist-result").innerHTML = ""
    document.querySelector("#song-title").innerHTML = ""
    document.querySelector("#song-result").innerHTML = ""

    ajaxCall("GET",currApi + `/Artists/ArtistsByWord/${toSearch}`,"",searchArtistSuccessCB,errorCB);
    ajaxCall("GET",currApi + `/Songs/GetSongByWord/${toSearch}`,"",searchSongSuccessCB,errorCB);
    return false;
  })

})


function searchArtistSuccessCB(data){
  console.log(data)
  if(data.length > 0){
    document.querySelector("#artist-title").innerHTML = "Artists:"
    for(let artist of data){
      // document.querySelector("#artist-result").innerHTML += `${artist}<br>` 
      document.querySelector("#artist-result").innerHTML += `<a style="display:inline;" class="visitPage" href="#" onclick="artistSelectedFromList('${artist.replace(/'/g, "\\'")}')">${artist}</a><br>` 
    }
  }

}

function searchSongSuccessCB(data){
  console.log(data)
  if(data.length > 0){
    document.querySelector("#song-title").innerHTML = "Songs:"
    for(let song of data){
      document.querySelector("#song-result").innerHTML += `${song.artistName} - <a style="display:inline;" class="visitPage" href="#" onclick="songSelectedFromList('${song.title.replace(/'/g, "\\'")}')">${song.title}</a><br>` 
    }
  }
}

function likePressedArtist(){
  let artistName = document.querySelector("#artist").innerHTML
  console.log(artistName)
  let user = JSON.parse(localStorage.getItem("userObj"))
  console.log(user)
  ajaxCall("POST",currApi + `/Artists/AddRemoveLike/${user.email}/${artistName}`,"",artistAddRemoveLikeSuccessCB,errorCB);
  
}
function likePressedSong(){
  let songName = document.querySelector("#songName").innerHTML
  console.log(songName)
  let user = JSON.parse(localStorage.getItem("userObj"))
  console.log(user)
  ajaxCall("POST",currApi + `/Songs/UserLikesSong/${user.email}/${songName}`,"",songAddRemoveLikeSuccessCB,errorCB);
  
}

function artistLikeSuccessCB(data){
  console.log(data)
  document.querySelector("#artist-likes-count").innerHTML = data
  
}

function songAddRemoveLikeSuccessCB(data){
  console.log(data)
  let user  = JSON.parse(localStorage.getItem("userObj"))
  document.querySelector("#song-likes-count").innerHTML = data
  let songName = document.querySelector("#songName").innerHTML
  console.log("Entered ADD REmove")
  ajaxCall("GET",currApi + `/Songs/GetIfUserLikedSong/${user.email}/${songName}`,"",ifUserLikedSongSuccessCB,errorCB);


}

function artistAddRemoveLikeSuccessCB(){
  let user  = JSON.parse(localStorage.getItem("userObj"))
  let artistName = document.querySelector("#artist").innerHTML
  ajaxCall("GET",currApi + `/Artists/ArtistsLikes/${artistName}`,"",artistLikeSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Artists/GetIfUserLikedArtist/${user.email}/${artistName}`,"",ifUserLikedSongSuccessCB,errorCB);

  
}

function renderAdminPage(){
  ajaxCall("GET",currApi + `/Users/GetAllUsers`,"",getAllUsersSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Users/GetStatisticsAdmin`,"",getStatisticSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Artists/GetAllArtistsWithLikes`,"",getAllArtistsSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Songs/GetAllSongs`,"",getAllSongsSuccessCB,errorCB);

}

function getStatisticSuccessCB(data){
  console.log(data)
  console.log(data[0])
  console.log(data[1])
  console.log(data[2])
  console.log(document.querySelectorAll(".counter"))
document.querySelectorAll(".counter")[0].innerHTML = data[0]
document.querySelectorAll(".counter")[1].innerHTML = data[1]
document.querySelectorAll(".counter")[2].innerHTML = data[2]
}

function getAllSongsSuccessCB(data){
  console.log(data)
  let songsCont = document.querySelector("#songs-list-content");
  for (let song of data){
    songsCont.innerHTML += `${song.artistName} - <a style="display:inline;" class="visitPage" href="#" onclick="songSelectedFromList('${song.title.replace(/'/g, "\\'")}')">${song.title}</a><br>`
  }
}

function getAllArtistsSuccessCB(data){
  console.log(data);
  let artistCont = document.querySelector("#artist-list-content") 
  console.log(artistCont)
  for(let artist of data){
    artistCont.innerHTML += `<a class="visitPage admin-panel-song-links" href="#" onclick="artistSelectedFromList('${artist.name.replace(/'/g, "\\'")}.replace(/'/g, "\\'")')">${artist.name}</a> - ${artist.favoriteCount} Likes<br> `
  }
}


function getAllUsersSuccessCB(data) {
  console.log(data);
  let accordionCont = document.querySelector(".users-accordion");
  let collapseCounter = 1;

  for (let user of data) {
    let registerDate = new Date(user.dateRegister)
    const formattedDate = registerDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    accordionCont.innerHTML += `
      <div class="panel single-accordion">
        <h6>
          <a role="button" class="collapsed inner-accordion" aria-expanded="false" aria-controls="collapse${collapseCounter}" data-toggle="collapse" data-parent="#accordion" href="#collapse${collapseCounter}">
            ${user.name}
            <span class="accor-open"><i class="fa fa-plus" aria-hidden="true"></i></span>
            <span class="accor-close"><i class="fa fa-minus" aria-hidden="true"></i></span>
          </a>
        </h6>
        <div id="collapse${collapseCounter}" class="accordion-content collapse">
          <div class="col-12">
            <div class="oneMusic-tabs-content">
              <ul class="nav nav-tabs tabs-container" id="myTab${collapseCounter}" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" id="tab--1-${collapseCounter}" data-toggle="tab" href="#tab1-${collapseCounter}" role="tab" aria-controls="tab1-${collapseCounter}" aria-selected="true">User Details</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id="tab--2-${collapseCounter}" data-toggle="tab" href="#tab2-${collapseCounter}" role="tab" aria-controls="tab2-${collapseCounter}" aria-selected="false">Liked Songs</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link " id="tab--3-${collapseCounter}" data-toggle="tab" href="#tab3-${collapseCounter}" role="tab" aria-controls="tab3-${collapseCounter}" aria-selected="false">Liked Artists</a>
                </li>
              </ul>

              <div class="tab-content mb-100" id="myTabContent${collapseCounter}">
                <div class="tab-pane fade show active" id="tab1-${collapseCounter}" role="tabpanel" aria-labelledby="tab--1-${collapseCounter}">
                  <div class="oneMusic-tab-content">
                    <!-- Tab Text -->
                    <div class="oneMusic-tab-text">
                      <p class="user-details-tab"><span class="user-details-titles">Username:</span> ${user.name}</p>
                      <p class="user-details-tab"><span class="user-details-titles">Email:</span> ${user.email}</p>
                      <p class="user-details-tab"><span class="user-details-titles">Date Created:</span> ${(formattedDate)}</p>
                    </div>
                  </div>
                </div>
                <div class="tab-pane fade" id="tab2-${collapseCounter}" role="tabpanel" aria-labelledby="tab--2-${collapseCounter}">
                  <div class="oneMusic-tab-content">
                    <!-- Tab Text -->
                    <div class="oneMusic-tab-text" id="${user.email.split("@")[0]}-liked-songs">
                    </div>
                  </div>
                </div>
                <div class="tab-pane fade " id="tab3-${collapseCounter}" role="tabpanel" aria-labelledby="tab--3-${collapseCounter}">
                  <div class="oneMusic-tab-content">
                    <!-- Tab Text -->
                    <div class="oneMusic-tab-text liked-artists" id="${user.email.split("@")[0]}-liked-artists">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    collapseCounter++;
    ajaxCall("GET",currApi + `/Users/GetUserLikedSongs/${user.email}`,"",getUserLikedSongSuccessCB,errorCB);
    ajaxCall("GET",currApi + `/Users/GetUserLikedArtists/${user.email}`,"",getUserLikedArtistsSuccessCB,errorCB);
  }
}

function getUserLikedSongSuccessCB(data){
  // console.log(data)
  let likedSongsCont = document.querySelector(`#${data[0].split("@")[0]}-liked-songs`)
  for(let i = 1; i<data.length; i++){
    likedSongsCont.innerHTML += `<a class="visitPage admin-panel-song-links" href="#" onclick="artistSelectedFromList('${data[i].artistName.replace(/'/g, "\\'")}')">${data[i].artistName}</a> - <a class="visitPage admin-panel-song-links" href="#" onclick="songSelectedFromList("${data[i].title.replace(/'/g, "\\'")}")">${data[i].title}</a><br> `
  }
}

function getUserLikedArtistsSuccessCB(data){
  // console.log(data)
  let likedArtistsCont = document.querySelector(`#${data[0].split("@")[0]}-liked-artists`)
  for(let i = 1; i<data.length; i++){
    likedArtistsCont.innerHTML += `<a class="visitPage admin-panel-song-links" href="#" onclick="artistSelectedFromList('${data[i].name.replace(/'/g, "\\'")}')">${data[i].name}</a><br> `
  }
}






function getTopArtists(){
  let userObjString=localStorage.getItem('userObj');
  let userObj = JSON.parse(userObjString);
  console.log(userObj);
  document.getElementById("userName").innerHTML=userObj.username
  let api = currApi + `/Users/GetUserLikedArtists/${userObj.email}`;
  ajaxCall("GET",api,"",TopArtistsSuccessCB,errorCB);
}

function TopArtistsSuccessCB(data){
  console.log(data);
  console.log(data.length);
  if(data.length>=2){
    document.getElementById("noArtistsForUser").remove();
  }
  for (let i=0; i<data.length-1;i++){
    if(i==5){
      break;
    }
    let div=document.createElement("div");
    div.className="single-artist";
    div.innerHTML = `<img class="top-image" id="=${data[i+1].name.replace(/'/g, "\\'").split(" ").join("")}" src="img/bg-img/a4.jpg" alt=""><div class="album-info"><a class="ppp" href="#" onclick="artistSelectedFromList('${data[i+1].name.replace(/'/g, "\\'")}')"><h5 id="fav-artist">${data[i+1].name}</h5></a></div>`;
    document.getElementById("userContainerArtists").appendChild(div);
    ajaxCall("GET",currApi + `/Artists/GetDeezerInfo/${data[i+1].name}`,"",imagesTopSuccessCB,errorCB);
    }
}

function getFiveSongsByUser(){
  let userObjString=localStorage.getItem('userObj');
  let userObj = JSON.parse(userObjString);
  let api = currApi + `/Users/GetUserLikedSongs/${userObj.email}`;
  ajaxCall("GET",api,"",TopSongsSuccessCB,errorCB);
}

function TopSongsSuccessCB(data){
  if(data.length>=2){
    document.getElementById("noSongsForUser").remove();
  }
  let numbers=[];
  while(numbers.length<5){
    if(numbers.length<data.length-1)
    break;
      let number=Math.floor(Math.random() * (data.length - 1 - 1)) + 1;
      if (!numbers.includes(number)) {
          numbers.push(number);
      }
  }
  for (let i=0; i<data.length-1;i++){
    let div=document.createElement("div");
    div.className="single-song";
    div.innerHTML = `<div class="album-info"><a class="ppp" href="#" onclick="songSelectedFromList('${data[i+1].title.replace(/'/g, "\\'")}')">${data[i+1].title}</a></div>`;
    document.getElementById("userContainerSongs").appendChild(div);  
  }
}

function renderUserProfile(){
  getTopArtists();
  getFiveSongsByUser();
}




function renderArtistFromStorage(){
  if(sessionStorage.getItem("tempArtist")){
    let artist = sessionStorage.getItem("tempArtist");
    renderArtistPage(artist);
  }
}
function renderSongFromStorage(){
  if(sessionStorage.getItem("tempSong")){
    let song = sessionStorage.getItem("tempSong");
    renderSongPage(song);
  }
}

function getDeezerDetails(artistName){
  ajaxCall("GET",currApi + `/Artists/GetDeezerInfo/${artistName}`,"",deezerSuccessCB,errorCB);
}

function deezerSuccessCB(data){
console.log(data)
console.log(data.data[0])
let top1res = data.data[0]
console.log(top1res.artist)
for(let i = 0; i<data.data.length;i++){
  let artistName = document.querySelector("#artist").innerHTML
 let searchName = data.data[i].artist.name;
 if(searchName.includes(artistName)){
   document.querySelector("#artist-image").src =  data.data[i].artist.picture_medium
   break
 }
}
}

function renderAllSongsList(){
  ajaxCall("GET",currApi + `/Songs/GetAllSongs`,"",allSongsSuccessCB,errorCB);
}

function allSongsSuccessCB(data){
  console.log(data);
  let container = document.querySelector(".song-list-accordion");
  for (let i = 0; i < data.length; i++) {
    let songName = data[i].title;
    let artistName = data[i].artistName;
    let accordionId = `collapse${i + 1}`; // Generate unique id for each accordion

    container.innerHTML += `
        <div class="panel single-accordion">
          <h6>
            <a role="button" aria-expanded="true" aria-controls="${accordionId}" class="collapsed" data-parent="#accordion" data-toggle="collapse" href="#" onclick="songSelectedFromList('${data[i].title.replace(/'/g, "\\'")}')">
              ${artistName} - ${songName}
            </a>
          </h6>
          <div id="${accordionId}" class="accordion-content collapse">
            <p id="${name.split(" ") == 1? name.toLowerCase() : name.split(" ").join("-").toLowerCase()}-list-item-summary"></p>
            <p class="clickHereForInfo"></p>
          </div>
        </div>`;
  }
}

function renderHomepageTop(){
  ajaxCall("GET",currApi + `/Artists/TopArtists`,"",homepageTopSuccessCB,errorCB);

}


function homepageTopSuccessCB(data){
  console.log(data)
  let i = 0;
  for(let artist of data){
    if(i >5 || artist.favoriteCount == 0){
      return;    
    }
    i++
    document.querySelector(".top-cont").innerHTML+=
     `
     <div class="col-2">
     <div class="single-album">
     <a  onclick="artistSelectedFromList('${artist.name.replace(/'/g, "\\'")}')">
     <img class="top-image" id="${artist.name.replace(/'/g, "\\'").split(" ").join("")}" src="img/bg-img/a9.jpg" alt="">
    <div class="album-info">
            <h5 id="artist${i}" class="homepage-tops">${artist.name}<br><span class="top-likes-count"> ${artist.favoriteCount} Likes </span></h5>
        </a>
        <p >#${i}</p>
    </div>
</div>
</div>
`
ajaxCall("GET",currApi + `/Artists/GetDeezerInfo/${artist.name}`,"",imagesTopSuccessCB,errorCB);
  }
}

function imagesTopSuccessCB(data){
  console.log(data.data)
  let topImgElements = document.querySelectorAll(".top-image")
  console.log(topImgElements)
  for(let elem of topImgElements){
    for(let i = 0; i<data.data.length;i++){
      let dataArtistName = data.data[i].artist.name.replace(/'/g, "\\'").split(" ").join("")
      if(elem.id.includes(dataArtistName)){
        elem.src = data.data[i].artist.picture_medium
        break 
      }
    }
  }
}
