const swaggerAPI = `https://localhost:7052/api`;
let rupAPI;
let currApi = swaggerAPI;

$(document).ready(() => {
  $("#register-form").submit(() => { // register form
    let user = {
      name: $("#registerName").val(),
      email: $("#registerEmail").val().toLowerCase(),
      password: $("#registerPassword").val(),
    };
    console.log(user);
    if($("#registerName").val() == ""){
        alert("please insert username!")
        return
    }
    let api = currApi + `/Users/Register`;
    ajaxCall("POST",api,JSON.stringify(user),registerSuccessCB,registerErrorCB
    );
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
  $("#reEnterRegisterPassword").on("blur", checkPassword); // check for password validation
  
  $("#register-form").submit(() => { // Login form
    let user = {
      name: $("#registerName").val(),
      email: $("#registerEmail").val().toLowerCase(),
      password: $("#registerPassword").val(),
    };
    console.log(user);
    if($("#registerName").val() == ""){
        alert("please insert username!")
        return
    }
    let api = currApi + `/Users/Login`;
    ajaxCall(
      "POST",
      api,
      JSON.stringify(user),
      registerSuccessCB,
      registerErrorCB
    );
    return false;
  });
});

function registerErrorCB(err) {
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
    setTimeout(() => {
      window.location.href = "index.html";
    console.log("times")
    }, 3000);
  }
}
