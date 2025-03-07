document.getElementById("aftercode").style.display = "none";
let apiurl="https://appsail-50024778614.development.catalystappsail.in"

function getcode(){
     document.getElementById("getcode").disabled= true;
     const mail=document.getElementById('mail').value;
     fetch(`${apiurl}/reset-pass`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "mail": mail })
    })
    .then(response=> response.json())
    .then(res=>{
        const data=res;
        if(data.message=="Success"){
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: green;">Code Sent Successfully!</h3>`
            document.getElementById("aftercode").style.display = "block";
        }
        else if(data.message=="Error"){
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: red;">Error In Sending Mail</h3>`
             location.reload();
        }
        else{
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: red;">User Not Found</h3>`
             location.reload();
        }
    })
}

function resetpass(){
    
    const code=document.getElementById('code').value;
    const password=document.getElementById('password').value;
    fetch(`${apiurl}/reset-pass/${code}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"password":password})
    })
    .then(response=> response.json())
    .then(res=>{
        const data=res;
        console.log(data.message)
        if(data.message=="Invalid or Expired Token"){
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: red;">${data.message}</h3>`
        }
        else if(data.message=="Password Reset Success"){
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: green;">Password Reset Successfully!</h3>`
            setTimeout(() => {
                window.location.href="login.html";
            }, 1200);
        }
        else{
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: red;">Something Went Wrong</h3>`
        }
    })

}
