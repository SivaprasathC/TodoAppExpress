document.getElementById("aftercode").style.display = "none";
let apiurl="https://appsail-50024778614.development.catalystappsail.in"

function getcode(){

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
        console.log(data.message)
        if(data.message=="Success"){
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: green;">Code Sent Successfully!</h3>`
            document.getElementById("aftercode").style.display = "block";
        }
        else if(data.message=="Error"){
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: red;">Error In Sending Mail</h3>`
        }
        else{
            document.getElementById('authstatus-reset').innerHTML=`<h3 style="color: red;">User Not Found</h3>`
        }
    })


}