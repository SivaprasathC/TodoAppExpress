//need to set expiry time for jwt token and chheck while entering the page

let apiurl="https://appsail-50024778614.development.catalystappsail.in"

function register(){
    fetch(`${apiurl}/register`,
     { 
         method: "POST",  
        headers: {    "Content-type": "application/json"  },  
        body: JSON.stringify({ "name": document.getElementById('name').value,
                               "number": document.getElementById('phone').value,
                               "mail": document.getElementById('mail').value,
                               "password": document.getElementById('password').value,
         })}) 
         .then(response=> response.json())
         .then(res=>{
             const data=res;
             if(data.message=="Success"){
                console.log("Success")
                 window.location.href="index.html"
         }
        else{
            document.getElementById('authstatus-reg').innerHTML=`<h3 style="color: red;">${data.err}</h3>`
        }})
}

function login(){
    fetch(`${apiurl}/login`,
     { 
         method: "POST",  
        headers: {    "Content-type": "application/json"  },  
        body: JSON.stringify({ "mail": document.getElementById('mail').value,
                               "password": document.getElementById('password').value,
         })}) 
         .then(response=> response.json())
         .then(res=>{
             const data=res;
             if(data.message=="Success"){
                 localStorage.setItem("token",data.token);
                 window.location.href="index.html"
             }
             else{
                  document.getElementById('authstatus').innerHTML='<h3 style="color: red;">Invalid Email or Password!</h3>'
             }
        
        })
}