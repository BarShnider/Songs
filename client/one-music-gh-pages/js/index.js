const swaggerAPI = `https://localhost:7052/api`;
let rupAPI;
let currApi = swaggerAPI;

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

function TopTenArtists(){
  const qs = `/Artists/TopArtists`;
                const api=swaggerAPI+qs;
                ajaxCall("GET",api,"",successCB,errorCB); 
}

function successCB(data) {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    let artistId = `artist${i + 1}`;
    document.getElementById(artistId).textContent = `${i + 1}. ${data[i]}`;
  }
}


  function errorCB(err){
    alert("dont Work");
    console.log(err);
}