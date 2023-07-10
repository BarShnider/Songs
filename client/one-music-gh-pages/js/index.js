let swaggerAPI;
let rupAPI;
let currApi = swaggerAPI;

$(document).ready(() => {
    $("#register-form").submit(() => {
        let user = {
            name: $("#registerName").val(),
            email: $("#registerEmail").val(),
            password: $("#registerPassword")
        }
    
        let api = currApi + `/Users/Login`
        ajaxCall("POST", api,JSON.stringify(user), registerSuccessCB, registerErrorCB);
        return false;
      })
      // check if the password is matching with the validation password, and show a messege if not
      function checkPassword() {
          if (this.value != $("#registerPassword").val()) {
              this.validity.valid = false;
              this.setCustomValidity('passwords must be identical!');
          }
          else {
              this.validity.valid = true;
              this.setCustomValidity('');
          }
        }
        $("#reEnterRegisterPassword").on("blur", checkPassword);  
      
        }
)

function registerErrorCB(err) {
console.log(err)
}

function registerSuccessCB(data) {
    console.log(data)

}
