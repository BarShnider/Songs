const swaggerAPI = `https://localhost:7052/api`;
let rupAPI;
let currApi = swaggerAPI;
const lastfmKEY = "711cd7242581234c484cb8a564931277"
const deezerSecret = "b5d9a7955fc9a8b367bebcd125339bb6"

$(document).ready(() => {

    if(localStorage.getItem("userObj")){
        console.log("ONLOAD USER OBJECT:")
        let loggedInUser = JSON.parse(localStorage.getItem("userObj"))
        console.log(loggedInUser);
        console.log(document.querySelector(".login-register-btn"))
        document.querySelector(".login-register-btn").innerHTML = `<div class="login-register-btn logged-user-div mr-50">
        <a href="login.html" id="loginBtn">Logged in as ${loggedInUser.username}</a><span class="line"></span><a onclick="signout()" id="loginBtn">&nbsp;&nbsp;Signout</a></div>`
        if(loggedInUser.email == "admin@gmail.com"){
          document.querySelector(".logged-user-div").innerHTML += `<span class="line"></span><a href="admin-page.html" id="">&nbsp;&nbsp;Admin Panel</a>`
        }
      }
    else {
        console.log("no one is logged in")
    }

    // TopTenArtists();



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


//this function will be activaeted when entering lyrics page
function renderSongPage(songName){
  let user = JSON.parse(localStorage.getItem("userObj"));
  ajaxCall("GET",currApi + `/Songs/GetSongBySongName/${songName}`,"",songSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Songs/GetIfUserLikedSong/${user.email}/${songName}`,"",ifUserLikedSongSuccessCB,errorCB);
}

function songSuccessCB(data){
  console.log(data)

  document.querySelector("#artistName").innerHTML = data.artistName;
  document.querySelector("#songName").innerHTML = data.title;
  document.querySelector("#lyricsContainer").innerText = data.lyrics
  document.querySelector("#song-likes-count").innerHTML = data.favoriteCount
  

}

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

function renderArtistPage(artistName){
  let user = JSON.parse(localStorage.getItem("userObj"))
  document.querySelector("#artist").innerHTML = artistName;
  ajaxCall("GET",`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${lastfmKEY}&format=json`,"",artistInfoSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Songs/GetSongsByArtist/${artistName}`,"",songByArtistSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Artists/ArtistsLikes/${artistName}`,"",getArtistLikesSuccessCB,errorCB);
  // ajaxCall("GET",currApi + `/Songs/GetSongsByArtist/${artistName}`,"",songByArtistSuccessCB,errorCB);
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
  // songsCont.innerHTML += `<div class="audioplayer audioplayer-mini"><embed id="embed-src" src="" width="0" height="0" volume="100" autostart="false" loop="false"><div class="audioplayer-playpause" title=""><a href="#"></a></div></div>`
//   songsCont.innerHTML += `   <div class="container-audio">
//   <audio controls>
//              <source id="audio-tag" src="" type="audio/mpeg">
//              Your browser dose not Support the audio Tag
//          </audio>
// </div>`
  for(let song of data){
    songsCont.innerHTML += `<a class="visitPage admin-panel-song-links" href="#" onclick="songSelectedFromList('${song.title}')">${song.title}</a><br>`
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
  }
}

function fillArtistListInfo(artistName){
  ajaxCall("GET",`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName.toLowerCase()}&api_key=${lastfmKEY}&format=json`,"",fillSuccessCB,errorCB);
}

function fillSuccessCB(data){
  console.log(data)
  console.log("artist" in data)
  if("artist" in data){
      // document.querySelector(`#${data.artist.name.split(" ") == 1? data.artist.name : data.artist.name.split(" ").join("-")}-list-item-summary`).innerHTML =  data.artist.bio.summary
      document.querySelector(`#${data.artist.name.split(" ").join("-").toLowerCase()}-list-item-summary`).innerHTML =  data.artist.bio.summary

  }
  
  document.querySelector(`#${data.artist.name.split(" ").join("-").toLowerCase()}-list-item-summary`).innerHTML +=  `<a class="visitPage" onclick="artistSelectedFromList(${data.artist.name}) >Visit ${data.artist.name} Page</audio>`
  // else{
    // document.querySelector(`#${data.artist.name.split(" ") == 1? data.artist.name : data.artist.name.split(" ").join("-")}-list-item-summary`).innerHTML += `<a href="index.html">click here for artist page</a>`
  // }
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

// $(".lyricsContainer").ready(() => {
//   let songName = localStorage.getItem('selectedSong');
//   // localStorage.removeItem('selectedSong');
//   if (songName) {
//     renderSongPage(songName);
//   }  
// })
$(".events-area").ready(() => {
  let artistName = localStorage.getItem('selectedArtist');
  localStorage.removeItem('selectedArtist');
  if (artistName) {
    renderArtistPage(artistName);
    // addRemoveLikeSuccessCB() //CHECKKKK
  }
})

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
      document.querySelector("#artist-result").innerHTML += `<a style="display:inline;" class="visitPage" href="#" onclick="artistSelectedFromList('${artist}')">${artist}</a><br>` 
    }
  }

}

function searchSongSuccessCB(data){
  console.log(data)
  if(data.length > 0){
    document.querySelector("#song-title").innerHTML = "Songs:"
    for(let song of data){
      document.querySelector("#song-result").innerHTML += `${song.artistName} - <a style="display:inline;" class="visitPage" href="#" onclick="songSelectedFromList('${song.title}')">${song.title}</a><br>` 
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
  ajaxCall("GET",currApi + `/Artists/GetAllArtistsWithLikes`,"",getAllArtistsSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Songs/GetAllSongs`,"",getAllSongsSuccessCB,errorCB);

}

function getAllSongsSuccessCB(data){
  console.log(data)
  let songsCont = document.querySelector("#songs-list-content");
  for (let song of data){
    songsCont.innerHTML += `${song.artistName} - <a style="display:inline;" class="visitPage" href="#" onclick="songSelectedFromList('${song.title}')">${song.title}</a><br>`
  }
}

function getAllArtistsSuccessCB(data){
  console.log(data);
  let artistCont = document.querySelector("#artist-list-content") 
  console.log(artistCont)
  for(let artist of data){
    artistCont.innerHTML += `<a class="visitPage admin-panel-song-links" href="#" onclick="artistSelectedFromList('${artist.name}')">${artist.name} - ${artist.favoriteCount} Likes</a><br> `
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
    likedSongsCont.innerHTML += `<a class="visitPage admin-panel-song-links" href="#" onclick="artistSelectedFromList('${data[i].artistName}')">${data[i].artistName}</a> - <a class="visitPage admin-panel-song-links" href="#" onclick="songSelectedFromList("${data[i].title}")">${data[i].title}</a><br> `
  }
}

function getUserLikedArtistsSuccessCB(data){
  // console.log(data)
  let likedArtistsCont = document.querySelector(`#${data[0].split("@")[0]}-liked-artists`)
  for(let i = 1; i<data.length; i++){
    likedArtistsCont.innerHTML += `<a class="visitPage admin-panel-song-links" href="#" onclick="artistSelectedFromList('${data[i].name}')">${data[i].name}</a><br> `
  }
}

function getTopArtists(){
  let userObjString=localStorage.getItem('userObj');
  let userObj = JSON.parse(userObjString);
  document.getElementById("userName").innerHTML=userObj.username
  let api = currApi + `/Artists/TopArtistsByUsername/${userObj.email}`;
  ajaxCall("GET",api,"",TopArtistsSuccessCB,errorCB);
}

function TopArtistsSuccessCB(data){
  let elements = document.querySelectorAll('#fav-artist');
  for (let i=0; i<5;i++){
      elements[i].innerHTML=`<a class="ppp" href="#" onclick="artistSelectedFromList('${data[i]}')">${data[i]}</a>`;
  }
}

function getFiveSongsByUser(){
  let userObjString=localStorage.getItem('userObj');
  let userObj = JSON.parse(userObjString);
  let api = currApi + `/Users/GetUserLikedSongs/${userObj.email}`;
  ajaxCall("GET",api,"",TopSongsSuccessCB,errorCB);
}

function TopSongsSuccessCB(data){
  let elements = document.querySelectorAll('#fav-song');
  let numbers=[];
  while(numbers.length<5){
      let number=Math.floor(Math.random()*data.length) + 1
      if (!numbers.includes(number)) {
          numbers.push(number);
      }
  }
  for (let i=0; i<5;i++){
      elements[i].innerHTML= `<a class="visitPage admin-panel-song-links" href="#" onclick="songSelectedFromList('${data[numbers[i]].title}')">${data[numbers[i]].title}</a>`
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
  https://api.deezer.com/search?q=queen
  // ajaxCall("GET",`https://api.deezer.com/search?q=${artistName}`,"",deezerSuccessCB,errorCB);
  ajaxCall("GET",currApi + `/Artists/GetDeezerInfo/${artistName}`,"",deezerSuccessCB,errorCB);

}

function deezerSuccessCB(data){
console.log(data.data[0])
let top1res = data.data[0]
console.log(top1res.artist)
document.querySelector("#artist-image").src =  top1res.artist.picture_medium
// document.querySelector("#artist-preview").src =  top1res.preview
// document.querySelector("#audio-tag").src = top1res.preview
// console.log(document.querySelector(".audioplayer").embed.src)
}