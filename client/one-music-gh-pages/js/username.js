$(document).ready(() => {
    getTopArtists();

        function getTopArtists(){
            let userObjString=localStorage.getItem('userObj');
            var userObj = JSON.parse(userObjString);
            document.getElementById("userName").innerHTML=userObj.username
            let api = swaggerAPI + `/Artists/TopArtistsByUsername/${userObj.email}`;
            ajaxCall("GET",api,"",TopArtistsSuccessCB,errorCB);
        }

        function TopArtistsSuccessCB(data){
            console.log(data);
            let elements = document.querySelectorAll('#fav-artist');
            for (let i=0; i<5;i++){
                elements[i].innerHTML=data[i];
            }
        }

        function errorCB(err) {
            console.log(err);
          }


        
    });